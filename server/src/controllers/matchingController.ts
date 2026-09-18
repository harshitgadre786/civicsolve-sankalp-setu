import { Request, Response } from 'express';
import prisma from '../db';
import { AIService } from '../services/aiService';

export const getAIMatches = async (req: Request, res: Response) => {
  try {
    const { problemStatement, challengeId } = req.body;

    let targetStatement = problemStatement;

    if (!targetStatement && challengeId) {
      const challenge = await prisma.challenge.findUnique({
        where: { id: challengeId }
      });
      if (challenge) {
        targetStatement = `${challenge.title}: ${challenge.description}`;
      }
    }

    if (!targetStatement) {
      targetStatement = 'Farmers in our area are facing crop disease in paddy fields and lack timely advisory for soil fertilizer management.';
    }

    // Fetch candidate entities from DB
    const [universities, industryPartners, teams] = await Promise.all([
      prisma.university.findMany(),
      prisma.industryPartner.findMany(),
      prisma.team.findMany()
    ]);

    const aiService = AIService.getInstance();
    const matches = aiService.computeMatches(targetStatement, universities, industryPartners, teams);

    return res.json({
      problemStatement: targetStatement,
      matches
    });
  } catch (error: any) {
    console.error('AI Matching error:', error);
    return res.status(500).json({ error: 'AI matching failed', details: error.message });
  }
};
