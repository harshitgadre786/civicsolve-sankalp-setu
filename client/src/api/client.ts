import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('civicsolve_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API Endpoints helpers
export const api = {
  // Auth
  login: (credentials: any) => apiClient.post('/auth/login', credentials),
  register: (userData: any) => apiClient.post('/auth/register', userData),
  getMe: () => apiClient.get('/auth/me'),
  updateProfile: (profileData: any) => apiClient.put('/auth/profile', profileData),

  // Challenges
  getChallenges: (params?: any) => apiClient.get('/challenges', { params }),
  getChallengeById: (id: string) => apiClient.get(`/challenges/${id}`),
  createChallenge: (formData: FormData) => apiClient.post('/challenges', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  supportChallenge: (id: string) => apiClient.post(`/challenges/${id}/support`),

  // Solutions
  getSolutions: (params?: any) => apiClient.get('/solutions', { params }),
  getSolutionById: (id: string) => apiClient.get(`/solutions/${id}`),
  createSolution: (data: any) => apiClient.post('/solutions', data),

  // Universities
  getUniversities: (params?: any) => apiClient.get('/universities', { params }),
  getUniversityById: (id: string) => apiClient.get(`/universities/${id}`),

  // Industry Partners
  getIndustryPartners: (params?: any) => apiClient.get('/industry', { params }),
  getIndustryPartnerById: (id: string) => apiClient.get(`/industry/${id}`),
  createEngagement: (data: any) => apiClient.post('/industry/engage', data),

  // Teams
  getTeams: (params?: any) => apiClient.get('/teams', { params }),
  getTeamById: (id: string) => apiClient.get(`/teams/${id}`),
  createTeam: (data: any) => apiClient.post('/teams', data),

  // AI Matching
  getAIMatches: (data: { problemStatement?: string; challengeId?: string }) =>
    apiClient.post('/ai/match', data),

  // Analytics
  getDashboardStats: () => apiClient.get('/analytics/dashboard'),
  getImpactAnalytics: () => apiClient.get('/analytics/impact'),

  // Comments
  getComments: (challengeId: string) => apiClient.get(`/comments/${challengeId}`),
  createComment: (challengeId: string, content: string) =>
    apiClient.post(`/comments/${challengeId}`, { content }),

  // Saved
  getSaved: () => apiClient.get('/saved'),
  toggleSave: (data: any) => apiClient.post('/saved/toggle', data)
};
