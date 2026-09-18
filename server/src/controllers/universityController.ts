import { Request, Response } from 'express';
import prisma from '../db';

export const getUniversities = async (req: Request, res: Response) => {
  try {
    const { department, search, district } = req.query;

    const universities = await prisma.university.findMany({
      orderBy: { activeProjectsCount: 'desc' }
    });

    let filtered = universities;

    if (search) {
      const s = String(search).toLowerCase();
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(s) || 
        u.shortName.toLowerCase().includes(s) ||
        u.location.toLowerCase().includes(s)
      );
    }

    if (department && department !== 'All') {
      const dept = String(department).toLowerCase();
      filtered = filtered.filter(u => {
        try {
          const depts = JSON.parse(u.departments);
          const tags = JSON.parse(u.expertiseTags);
          return depts.some((d: string) => d.toLowerCase().includes(dept)) ||
                 tags.some((t: string) => t.toLowerCase().includes(dept));
        } catch {
          return true;
        }
      });
    }

    if (district && district !== 'All') {
      filtered = filtered.filter(u => u.district.toLowerCase() === String(district).toLowerCase());
    }

    return res.json(filtered);
  } catch (error: any) {
    console.error('Get universities error:', error);
    return res.status(500).json({ error: 'Failed to fetch universities' });
  }
};

export const getUniversityById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const university = await prisma.university.findUnique({
      where: { id }
    });

    if (!university) {
      return res.status(404).json({ error: 'University not found' });
    }

    return res.json(university);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch university details' });
  }
};
