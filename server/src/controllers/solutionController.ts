import { Request, Response } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middleware/auth';

export const getSolutions = async (req: Request, res: Response) => {
  try {
    const { status, category, search, sort } = req.query;

    const where: any = {};
    if (status && status !== 'All') {
      where.status = String(status).toUpperCase().replace(/ /g, '_');
    }
    if (category && category !== 'All') {
      where.category = String(category);
    }
    if (search) {
      const s = String(search).toLowerCase();
      where.OR = [
        { title: { contains: s } },
        { description: { contains: s } }
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'progress') {
      orderBy = { progressPct: 'desc' };
    } else if (sort === 'views') {
      orderBy = { viewsCount: 'desc' };
    }

    const solutions = await prisma.solution.findMany({
      where,
      orderBy,
      include: {
        team: {
          include: { members: true }
        },
        challenge: {
          select: { id: true, title: true, location: true, district: true }
        },
        engagements: {
          include: { industryPartner: true }
        },
        progressEvents: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    return res.json(solutions);
  } catch (error: any) {
    console.error('Get solutions error:', error);
    return res.status(500).json({ error: 'Failed to fetch solutions' });
  }
};

export const getSolutionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const solution = await prisma.solution.findUnique({
      where: { id },
      include: {
        team: {
          include: { members: true }
        },
        challenge: true,
        engagements: {
          include: { industryPartner: true }
        },
        progressEvents: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    if (!solution) {
      return res.status(404).json({ error: 'Solution not found' });
    }

    // increment view count
    prisma.solution.update({
      where: { id },
      data: { viewsCount: { increment: 1 } }
    }).catch(e => console.error(e));

    return res.json(solution);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch solution details' });
  }
};

export const createSolution = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      category = 'Environment',
      challengeId,
      teamId,
      demoUrl,
      repoUrl
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    let assignedTeamId = teamId;
    if (assignedTeamId) {
      const existing = await prisma.team.findUnique({ where: { id: assignedTeamId } });
      if (!existing) assignedTeamId = null;
    }
    if (!assignedTeamId) {
      const existingTeam = await prisma.team.findFirst();
      if (existingTeam) {
        assignedTeamId = existingTeam.id;
      } else {
        const newTeam = await prisma.team.create({
          data: {
            name: 'Green Innovators',
            leadName: req.user?.name || 'Harshit Gadre',
            memberCount: 4,
            skills: JSON.stringify(['React', 'Node.js', 'AI/ML']),
            status: 'ACTIVE'
          }
        });
        assignedTeamId = newTeam.id;
      }
    }

    const defaultImages: Record<string, string> = {
      'Environment': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
      'Healthcare': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
      'Agriculture': 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&q=80',
      'Water & Sanitation': 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&q=80'
    };

    const solution = await prisma.solution.create({
      data: {
        title,
        description,
        category,
        challengeId: challengeId || null,
        teamId: assignedTeamId,
        status: 'PENDING_REVIEW', // Initial state per specification
        progressPct: 15,
        demoUrl: demoUrl || null,
        repoUrl: repoUrl || null,
        viewsCount: 1,
        impactReach: 200,
        mediaUrls: JSON.stringify([defaultImages[category] || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80']),
        progressEvents: {
          create: [
            {
              stage: 'SUBMITTED',
              title: 'Solution Submitted',
              description: 'Solution registered and queued for governmental review',
              actorName: req.user?.name || 'Student Innovator',
              timestamp: new Date()
            },
            {
              stage: 'UNDER_REVIEW',
              title: 'Under Government Review',
              description: 'Awaiting review and evaluation in Government Panel',
              actorName: 'CivicSolve Dispatch',
              timestamp: new Date()
            }
          ]
        }
      },
      include: {
        team: { include: { members: true } },
        challenge: true,
        progressEvents: true
      }
    });

    return res.status(201).json(solution);
  } catch (error: any) {
    console.error('Create solution error:', error);
    return res.status(500).json({ error: 'Failed to submit solution' });
  }
};

/**
 * Government Review Queue - Returns solutions pending review
 */
export const getGovernmentQueue = async (_req: Request, res: Response) => {
  try {
    const queue = await prisma.solution.findMany({
      where: {
        status: 'PENDING_REVIEW'
      },
      orderBy: { createdAt: 'asc' },
      include: {
        team: {
          include: { members: true }
        },
        challenge: true,
        progressEvents: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    return res.json(queue);
  } catch (error: any) {
    console.error('Get government queue error:', error);
    return res.status(500).json({ error: 'Failed to fetch government queue' });
  }
};

/**
 * Review Solution (Government Action: Approve or Reject)
 */
export const reviewSolution = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { decision, comment } = req.body; // decision: 'APPROVE' | 'REJECT'

    if (!decision || (decision !== 'APPROVE' && decision !== 'REJECT')) {
      return res.status(400).json({ error: 'Valid decision (APPROVE or REJECT) is required' });
    }

    const solution = await prisma.solution.findUnique({
      where: { id },
      include: { team: true, challenge: true }
    });

    if (!solution) {
      return res.status(404).json({ error: 'Solution not found' });
    }

    const reviewerName = req.user?.name || 'Dr. Amit Verma, IAS (Reviewer)';
    const reviewerId = req.user?.id || 'gov_reviewer';
    const isApproved = decision === 'APPROVE';
    const newStatus = isApproved ? 'APPROVED' : 'REJECTED';
    const progressPct = isApproved ? 50 : solution.progressPct;

    // 1. Update solution record
    const updatedSolution = await prisma.solution.update({
      where: { id },
      data: {
        status: newStatus,
        reviewerId,
        reviewerComment: comment || (isApproved ? 'Approved for pilot deployment' : 'Requires revision of technical feasibility'),
        reviewedAt: new Date(),
        progressPct,
        progressEvents: {
          create: {
            stage: newStatus,
            title: isApproved ? 'Approved by Government' : 'Rejected by Government Reviewer',
            description: comment || (isApproved ? 'Solution cleared for pilot deployment' : 'Returned with feedback for revision'),
            actorName: reviewerName,
            timestamp: new Date()
          }
        }
      },
      include: {
        team: true,
        challenge: true,
        progressEvents: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    // 2. Dispatch in-app notification to the team lead/student
    if (solution.team?.leadEmail) {
      const studentUser = await prisma.user.findFirst({
        where: { email: solution.team.leadEmail }
      });

      if (studentUser) {
        await prisma.notification.create({
          data: {
            userId: studentUser.id,
            title: isApproved ? 'Solution Approved by Government' : 'Solution Review Update',
            message: isApproved
              ? `Your solution "${solution.title}" was APPROVED by ${reviewerName}. Stage updated to Approved.`
              : `Your solution "${solution.title}" was reviewed with feedback: "${comment || 'Revisions required'}"`,
            type: 'SOLUTION',
            link: '/solutions'
          }
        });
      }
    }

    return res.json(updatedSolution);
  } catch (error: any) {
    console.error('Review solution error:', error);
    return res.status(500).json({ error: 'Failed to process solution review' });
  }
};
