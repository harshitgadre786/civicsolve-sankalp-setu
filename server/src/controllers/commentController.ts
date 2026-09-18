import { Request, Response } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middleware/auth';

export const getComments = async (req: Request, res: Response) => {
  try {
    const { challengeId } = req.params;
    const comments = await prisma.comment.findMany({
      where: { challengeId },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(comments);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const { challengeId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    let userId = req.user?.id;
    let authorName = req.user?.name || 'Harshit Gadre';
    let authorRole = req.user?.role || 'Citizen';

    if (!userId) {
      const defaultUser = await prisma.user.findFirst();
      userId = defaultUser?.id || 'demo-user';
      authorName = defaultUser?.name || 'Harshit Gadre';
      authorRole = defaultUser?.role || 'Citizen';
    }

    const comment = await prisma.comment.create({
      data: {
        challengeId,
        userId,
        authorName,
        authorRole,
        authorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(authorName)}`,
        content: content.trim()
      }
    });

    return res.status(201).json(comment);
  } catch (error: any) {
    console.error('Create comment error:', error);
    return res.status(500).json({ error: 'Failed to post comment' });
  }
};

export const getSavedItems = async (req: AuthRequest, res: Response) => {
  try {
    let userId = req.user?.id;
    if (!userId) {
      const u = await prisma.user.findFirst();
      userId = u?.id;
    }

    if (!userId) {
      return res.json([]);
    }

    const saved = await prisma.savedItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return res.json(saved);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch saved items' });
  }
};

export const toggleSaveItem = async (req: AuthRequest, res: Response) => {
  try {
    const { itemId, itemType, title, category, location } = req.body;

    let userId = req.user?.id;
    if (!userId) {
      const u = await prisma.user.findFirst();
      userId = u?.id;
    }

    if (!userId) {
      return res.status(401).json({ error: 'User must be authenticated' });
    }

    const existing = await prisma.savedItem.findUnique({
      where: {
        userId_itemType_itemId: {
          userId,
          itemType,
          itemId
        }
      }
    });

    if (existing) {
      await prisma.savedItem.delete({
        where: { id: existing.id }
      });
      return res.json({ saved: false });
    } else {
      await prisma.savedItem.create({
        data: {
          userId,
          itemType,
          itemId,
          title: title || 'Saved Item',
          category,
          location
        }
      });
      return res.json({ saved: true });
    }
  } catch (error: any) {
    console.error('Toggle save error:', error);
    return res.status(500).json({ error: 'Failed to toggle save' });
  }
};
