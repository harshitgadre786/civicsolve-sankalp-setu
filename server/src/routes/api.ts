import { Router } from 'express';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { upload } from '../services/uploadService';
import { register, login, getMe, updateProfile } from '../controllers/authController';
import { getChallenges, getChallengeById, createChallenge, supportChallenge, getForYouChallenges } from '../controllers/challengeController';
import { getSolutions, getSolutionById, createSolution, getGovernmentQueue, reviewSolution } from '../controllers/solutionController';
import { getUniversities, getUniversityById } from '../controllers/universityController';
import { getIndustryPartners, getIndustryPartnerById, createEngagement } from '../controllers/industryController';
import { getTeams, getTeamById, createTeam } from '../controllers/teamController';
import { getAIMatches } from '../controllers/matchingController';
import { getDashboardStats, getImpactAnalytics, getLandingStats } from '../controllers/analyticsController';
import { getComments, createComment, getSavedItems, toggleSaveItem } from '../controllers/commentController';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    service: 'CivicSolve / Sankalp Setu API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    aiEngine: process.env.GEMINI_API_KEY ? 'GEMINI_LLM_API' : 'DETERMINISTIC_EMBEDDING_KEYWORD_FALLBACK'
  });
});

// Public Landing Stats
router.get('/stats/landing', getLandingStats);

// Auth
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', authenticateToken, getMe);
router.put('/auth/profile', authenticateToken, updateProfile);

// Challenges
router.get('/challenges/for-you', optionalAuth, getForYouChallenges);
router.get('/challenges', getChallenges);
router.get('/challenges/:id', optionalAuth, getChallengeById);
router.post('/challenges', optionalAuth, upload.array('media', 5), createChallenge);
router.post('/challenges/:id/support', optionalAuth, supportChallenge);

// Solutions
router.get('/solutions/government-queue', optionalAuth, getGovernmentQueue);
router.get('/solutions', getSolutions);
router.get('/solutions/:id', getSolutionById);
router.post('/solutions', optionalAuth, createSolution);
router.post('/solutions/:id/review', optionalAuth, reviewSolution);

// Universities
router.get('/universities', getUniversities);
router.get('/universities/:id', getUniversityById);

// Industry Partners
router.get('/industry', getIndustryPartners);
router.get('/industry/:id', getIndustryPartnerById);
router.post('/industry/engage', optionalAuth, createEngagement);

// Teams
router.get('/teams', getTeams);
router.get('/teams/:id', getTeamById);
router.post('/teams', optionalAuth, createTeam);

// AI Matching
router.post('/ai/match', getAIMatches);

// Analytics
router.get('/analytics/dashboard', getDashboardStats);
router.get('/analytics/impact', getImpactAnalytics);

// Comments
router.get('/comments/:challengeId', getComments);
router.post('/comments/:challengeId', optionalAuth, createComment);

// Saved Items
router.get('/saved', optionalAuth, getSavedItems);
router.post('/saved/toggle', optionalAuth, toggleSaveItem);

export default router;
