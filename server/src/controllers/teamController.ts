import { Request, Response } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middleware/auth';

export const getTeams = async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;

    const teams = await prisma.team.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        members: true,
        challenge: {
          select: { id: true, title: true, location: true }
        },
        solutions: {
          select: { id: true, title: true, status: true, progressPct: true }
        }
      }
    });

    let filtered = teams;

    if (search) {
      const s = String(search).toLowerCase();
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(s) ||
        t.leadName.toLowerCase().includes(s)
      );
    }

    if (status && status !== 'All') {
      filtered = filtered.filter(t => t.status.toUpperCase() === String(status).toUpperCase());
    }

    return res.json(filtered);
  } catch (error: any) {
    console.error('Get teams error:', error);
    return res.status(500).json({ error: 'Failed to fetch teams' });
  }
};

export const getTeamById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        members: true,
        challenge: true,
        solutions: {
          include: {
            engagements: {
              include: { industryPartner: true }
            }
          }
        }
      }
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    return res.json(team);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch team details' });
  }
};

export const createTeam = async (req: AuthRequest, res: Response) => {
  try {
    const { name, challengeId, skills, members } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Team name is required' });
    }

    const leadName = req.user?.name || 'Harshit Gadre';
    const leadEmail = req.user?.email || 'harshitgadre706@gmail.com';

    const parsedSkills = Array.isArray(skills) ? skills : ['Python', 'IoT', 'React'];

    const newTeam = await prisma.team.create({
      data: {
        name,
        challengeId: challengeId || null,
        leadName,
        leadEmail,
        skills: JSON.stringify(parsedSkills),
        status: 'IN_PROGRESS',
        memberCount: Array.isArray(members) ? members.length + 1 : 1,
        members: {
          create: [
            {
              name: leadName,
              role: 'Team Lead',
              email: leadEmail,
              institution: 'BIT Sindri / Ranchi University'
            },
            ...(Array.isArray(members) ? members.map((m: any) => ({
              name: m.name,
              role: m.role || 'Contributor',
              email: m.email || null,
              institution: m.institution || 'BIT Sindri'
            })) : [])
          ]
        }
      },
      include: {
        members: true,
        challenge: true
      }
    });

    return res.status(201).json(newTeam);
  } catch (error: any) {
    console.error('Create team error:', error);
    return res.status(500).json({ error: 'Failed to create team' });
  }
};
