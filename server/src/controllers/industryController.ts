import { Request, Response } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middleware/auth';

export const getIndustryPartners = async (req: Request, res: Response) => {
  try {
    const { sector, search } = req.query;

    const partners = await prisma.industryPartner.findMany({
      orderBy: { activeProjectsCount: 'desc' },
      include: {
        engagements: {
          include: { solution: true }
        }
      }
    });

    let filtered = partners;

    if (search) {
      const s = String(search).toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(s) ||
        p.sector.toLowerCase().includes(s) ||
        p.location.toLowerCase().includes(s)
      );
    }

    if (sector && sector !== 'All') {
      filtered = filtered.filter(p => p.sector.toLowerCase() === String(sector).toLowerCase());
    }

    return res.json(filtered);
  } catch (error: any) {
    console.error('Get industry partners error:', error);
    return res.status(500).json({ error: 'Failed to fetch industry partners' });
  }
};

export const getIndustryPartnerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const partner = await prisma.industryPartner.findUnique({
      where: { id },
      include: {
        engagements: {
          include: { solution: true }
        }
      }
    });

    if (!partner) {
      return res.status(404).json({ error: 'Industry partner not found' });
    }

    return res.json(partner);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch partner details' });
  }
};

export const createEngagement = async (req: AuthRequest, res: Response) => {
  try {
    const { industryPartnerId, solutionId, engagementType, details } = req.body;

    if (!industryPartnerId || !engagementType) {
      return res.status(400).json({ error: 'Industry partner ID and engagement type are required' });
    }

    const engagement = await prisma.industryEngagement.create({
      data: {
        industryPartnerId,
        solutionId: solutionId || null,
        engagementType,
        details: details || 'CSR initiative grant and technical mentorship committed.',
        status: 'ACTIVE'
      },
      include: {
        industryPartner: true,
        solution: true
      }
    });

    // Increment partner active projects
    await prisma.industryPartner.update({
      where: { id: industryPartnerId },
      data: { activeProjectsCount: { increment: 1 } }
    });

    return res.status(201).json(engagement);
  } catch (error: any) {
    console.error('Create engagement error:', error);
    return res.status(500).json({ error: 'Failed to create engagement' });
  }
};
