import { Request, Response } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middleware/auth';
import { AIService } from '../services/aiService';

export const getChallenges = async (req: Request, res: Response) => {
  try {
    const { category, district, priority, severity, status, sort, search, createdById } = req.query;

    const where: any = {};

    if (category && category !== 'All') {
      where.category = String(category);
    }
    if (district && district !== 'All') {
      where.district = { contains: String(district) };
    }
    if (priority && priority !== 'All') {
      where.priority = String(priority).toUpperCase();
    }
    if (severity && severity !== 'All') {
      where.severity = String(severity).toUpperCase();
    }
    if (status && status !== 'All') {
      where.status = String(status).toUpperCase();
    }
    if (createdById) {
      where.createdById = String(createdById);
    }
    if (search) {
      const s = String(search).toLowerCase();
      where.OR = [
        { title: { contains: s } },
        { description: { contains: s } },
        { location: { contains: s } },
        { id: { contains: s } },
        { category: { contains: s } }
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'supporters') {
      orderBy = { supportersCount: 'desc' };
    } else if (sort === 'priority') {
      orderBy = { priority: 'asc' };
    } else if (sort === 'oldest') {
      orderBy = { createdAt: 'asc' };
    }

    const challenges = await prisma.challenge.findMany({
      where,
      orderBy,
      include: {
        createdBy: {
          select: { id: true, name: true, role: true, avatar: true }
        },
        aiClassification: true,
        timeline: {
          orderBy: { timestamp: 'asc' }
        },
        solutions: {
          include: {
            progressEvents: { orderBy: { timestamp: 'asc' } }
          }
        },
        _count: {
          select: { supporters: true, teams: true, solutions: true, comments: true }
        }
      }
    });

    return res.json(challenges);
  } catch (error: any) {
    console.error('Get challenges error:', error);
    return res.status(500).json({ error: 'Failed to fetch challenges', details: error.message });
  }
};

export const getChallengeById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const challenge = await prisma.challenge.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, name: true, role: true, avatar: true, organization: true }
        },
        aiClassification: true,
        teams: {
          include: {
            members: true,
            solutions: true
          }
        },
        solutions: {
          include: {
            team: true,
            engagements: {
              include: { industryPartner: true }
            },
            progressEvents: {
              orderBy: { timestamp: 'asc' }
            }
          }
        },
        timeline: {
          orderBy: { timestamp: 'asc' }
        },
        comments: {
          orderBy: { createdAt: 'desc' }
        },
        supporters: req.user ? {
          where: { userId: req.user.id }
        } : false
      }
    });

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Increment view count asynchronously
    prisma.challenge.update({
      where: { id },
      data: { viewsCount: { increment: 1 } }
    }).catch(e => console.error('Increment views error:', e));

    const isSupportedByCurrentUser = Boolean(challenge.supporters && challenge.supporters.length > 0);

    return res.json({
      ...challenge,
      isSupportedByCurrentUser
    });
  } catch (error: any) {
    console.error('Get challenge by ID error:', error);
    return res.status(500).json({ error: 'Failed to fetch challenge details' });
  }
};

export const createChallenge = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      category: explicitCategory,
      severity: explicitSeverity,
      location,
      district = 'Ranchi',
      lat,
      lng,
      latitude,
      longitude,
      priority = 'HIGH',
      daysLeft = 30,
      assignedDepartment,
      contactInfo
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const finalLat = lat !== undefined && lat !== '' ? parseFloat(lat) : (latitude !== undefined && latitude !== '' ? parseFloat(latitude) : 23.3441);
    const finalLng = lng !== undefined && lng !== '' ? parseFloat(lng) : (longitude !== undefined && longitude !== '' ? parseFloat(longitude) : 85.3096);
    const severity = (explicitSeverity || priority || 'HIGH').toUpperCase();

    // Get fallback user if not authenticated
    let userId = req.user?.id;
    if (!userId) {
      const defaultUser = await prisma.user.findFirst({
        where: { role: 'CITIZEN' }
      });
      if (defaultUser) {
        userId = defaultUser.id;
      } else {
        const newUser = await prisma.user.create({
          data: {
            email: 'citizen.jharkhand@gov.in',
            password: 'default_password_hash',
            name: 'Manoj Soren',
            role: 'CITIZEN',
            location: 'Ranchi, Jharkhand'
          }
        });
        userId = newUser.id;
      }
    }

    // Find existing challenges in the same district to run duplicate detection
    const existingInDistrict = await prisma.challenge.findMany({
      where: { district: { contains: district } },
      select: { id: true, title: true, description: true }
    });

    // Run AI Classification & Duplicate Detection
    const aiService = AIService.getInstance();
    const aiResult = await aiService.classifyChallenge(
      title,
      description,
      district,
      existingInDistrict
    );

    const category = explicitCategory && explicitCategory !== 'Auto-detect' 
      ? explicitCategory 
      : (aiResult.category || 'Roads');

    // Process uploaded media files if any
    const mediaUrls: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file: any) => {
        mediaUrls.push(`/uploads/${file.filename}`);
      });
    }

    // Default image if none uploaded
    if (mediaUrls.length === 0) {
      const defaultImages: Record<string, string> = {
        'Roads': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
        'Electricity': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
        'Water': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
        'Garbage': 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&q=80',
        'Safety': 'https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=800&q=80',
        'Environment': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
        'Healthcare': 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80',
        'Education': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80',
        'Agriculture': 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80',
        'Infrastructure': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80'
      };
      mediaUrls.push(defaultImages[category] || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80');
    }

    // Create challenge and AI Classification in database
    const newChallenge = await prisma.challenge.create({
      data: {
        title,
        description,
        category,
        severity,
        location: location || `${district}, Jharkhand`,
        district,
        lat: finalLat,
        lng: finalLng,
        priority: priority.toUpperCase(),
        status: 'SUBMITTED',
        assignedDepartment: assignedDepartment || 'Municipal Urban Development',
        contactInfo: contactInfo || null,
        daysLeft: parseInt(daysLeft, 10) || 30,
        supportersCount: 1,
        viewsCount: 1,
        affectedPeople: Math.floor(Math.random() * 5000) + 800,
        mediaUrls: JSON.stringify(mediaUrls),
        requiredSkills: JSON.stringify(aiResult.skills || ['Civil Engineering', 'Civic Action']),
        createdById: userId,
        aiClassification: {
          create: {
            detectedCategory: aiResult.category,
            confidence: aiResult.confidence,
            detectedSkills: JSON.stringify(aiResult.skills || ['Civic Action']),
            duplicateOfId: aiResult.duplicateOfId,
            reasoning: aiResult.reasoning
          }
        },
        timeline: {
          create: [
            {
              stage: 'REPORTED',
              title: 'Problem Reported by Citizen',
              description: 'Civic issue successfully recorded into municipal registry with geolocation.',
              actorName: req.user?.name || 'Verified Citizen'
            }
          ]
        }
      },
      include: {
        aiClassification: true,
        createdBy: true,
        timeline: true
      }
    });

    // Auto-create notification for user
    await prisma.notification.create({
      data: {
        userId,
        title: 'Civic Problem Logged Successfully',
        message: `Your report "${title}" has been registered in the municipal database with severity ${severity}.`,
        type: 'CHALLENGE',
        link: `/challenges/${newChallenge.id}`
      }
    });

    return res.status(201).json(newChallenge);
  } catch (error: any) {
    console.error('Create challenge error:', error);
    return res.status(500).json({ error: 'Failed to create challenge', details: error.message });
  }
};

export const updateChallenge = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, severity, assignedDepartment, timelineNote, priority } = req.body;

    const existing = await prisma.challenge.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const updated = await prisma.challenge.update({
      where: { id },
      data: {
        ...(status && { status: status.toUpperCase() }),
        ...(severity && { severity: severity.toUpperCase() }),
        ...(priority && { priority: priority.toUpperCase() }),
        ...(assignedDepartment && { assignedDepartment })
      }
    });

    if (status || timelineNote) {
      await prisma.challengeTimeline.create({
        data: {
          challengeId: id,
          stage: (status || existing.status).toUpperCase(),
          title: `Status Updated to ${(status || existing.status).replace('_', ' ')}`,
          description: timelineNote || `Official status updated by ${req.user?.name || 'Authority'}`,
          actorName: req.user?.name || 'Department Officer'
        }
      });
    }

    const fullChallenge = await prisma.challenge.findUnique({
      where: { id },
      include: {
        timeline: { orderBy: { timestamp: 'asc' } },
        createdBy: { select: { id: true, name: true, role: true, avatar: true } },
        comments: { orderBy: { createdAt: 'desc' } }
      }
    });

    return res.json(fullChallenge);
  } catch (error: any) {
    console.error('Update challenge error:', error);
    return res.status(500).json({ error: 'Failed to update problem', details: error.message });
  }
};

export const getMyReports = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || (await prisma.user.findFirst({ where: { role: 'CITIZEN' } }))?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const reports = await prisma.challenge.findMany({
      where: { createdById: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        timeline: { orderBy: { timestamp: 'asc' } },
        _count: { select: { supporters: true, comments: true } }
      }
    });

    const totalReports = reports.length;
    const activeReports = reports.filter(r => ['SUBMITTED', 'REPORTED', 'UNDER_REVIEW', 'VERIFIED', 'ASSIGNED', 'IN_PROGRESS', 'OPEN'].includes(r.status)).length;
    const resolvedReports = reports.filter(r => r.status === 'RESOLVED').length;
    const communitySupport = reports.reduce((acc, r) => acc + (r.supportersCount || 0), 0);

    const recentActivity = reports.flatMap(r => 
      (r.timeline || []).map(t => ({
        id: t.id,
        challengeId: r.id,
        challengeTitle: r.title,
        type: 'STATUS_CHANGE',
        stage: t.stage,
        title: t.title,
        description: t.description,
        timestamp: t.timestamp
      }))
    ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

    return res.json({
      reports,
      statistics: {
        totalReports,
        activeReports,
        resolvedReports,
        communitySupport
      },
      recentActivity
    });
  } catch (error: any) {
    console.error('Get my reports error:', error);
    return res.status(500).json({ error: 'Failed to fetch user reports' });
  }
};

export const supportChallenge = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    let userId = req.user?.id;

    if (!userId) {
      const defaultUser = await prisma.user.findFirst();
      userId = defaultUser?.id;
    }

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const existingSupport = await prisma.challengeSupporter.findUnique({
      where: {
        challengeId_userId: {
          challengeId: id,
          userId
        }
      }
    });

    if (existingSupport) {
      // Remove support
      await prisma.challengeSupporter.delete({
        where: { id: existingSupport.id }
      });
      const updated = await prisma.challenge.update({
        where: { id },
        data: { supportersCount: { decrement: 1 } }
      });
      return res.json({ supported: false, supportersCount: updated.supportersCount });
    } else {
      // Add support
      await prisma.challengeSupporter.create({
        data: { challengeId: id, userId }
      });
      const updated = await prisma.challenge.update({
        where: { id },
        data: { supportersCount: { increment: 1 } }
      });
      return res.json({ supported: true, supportersCount: updated.supportersCount });
    }
  } catch (error: any) {
    console.error('Support challenge error:', error);
    return res.status(500).json({ error: 'Failed to toggle support' });
  }
};

/**
 * Student "For You" Feed - Challenges ranked by skill match % against student profile
 */
export const getForYouChallenges = async (req: AuthRequest, res: Response) => {
  try {
    let studentSkills: string[] = ['Python', 'IoT', 'React', 'C++', 'GIS', 'Agronomy', 'AI/ML'];

    if (req.user?.id) {
      const user = await prisma.user.findUnique({ where: { id: req.user.id } });
      if (user?.skills) {
        try {
          studentSkills = JSON.parse(user.skills);
        } catch {
          studentSkills = user.skills.split(',').map(s => s.trim());
        }
      }
    }

    const challenges = await prisma.challenge.findMany({
      include: {
        aiClassification: true,
        createdBy: {
          select: { id: true, name: true, role: true, avatar: true }
        },
        _count: {
          select: { supporters: true, teams: true, solutions: true }
        }
      }
    });

    const ranked = challenges.map(ch => {
      let required: string[] = [];
      try {
        if (ch.requiredSkills) {
          required = JSON.parse(ch.requiredSkills);
        } else if (ch.aiClassification?.detectedSkills) {
          required = JSON.parse(ch.aiClassification.detectedSkills);
        }
      } catch {
        required = ['IoT', 'Data Analytics'];
      }

      if (required.length === 0) required = ['IoT', 'Python'];

      const matched = required.filter(r =>
        studentSkills.some(s => s.toLowerCase().includes(r.toLowerCase()) || r.toLowerCase().includes(s.toLowerCase()))
      );

      const matchRatio = matched.length / required.length;
      const matchPercentage = Math.min(98, Math.max(45, Math.round(matchRatio * 75 + 22)));

      return {
        ...ch,
        matchPercentage,
        matchedSkills: matched,
        requiredSkillsList: required,
        matchReason: `Matches ${matched.length} of your core competencies (${matched.join(', ') || 'Domain foundation'}).`
      };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);

    return res.json({
      studentSkills,
      rankedChallenges: ranked
    });
  } catch (error: any) {
    console.error('Get for you challenges error:', error);
    return res.status(500).json({ error: 'Failed to fetch personalized challenges' });
  }
};
