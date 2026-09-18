export type UserRole = 'STUDENT' | 'CITIZEN' | 'UNIVERSITY_ADMIN' | 'INDUSTRY_PARTNER' | 'GOVERNMENT';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization?: string;
  phone?: string;
  location?: string;
  avatar?: string;
  skills?: string; // JSON array or comma separated
  createdAt?: string;
}

export interface AIClassification {
  id: string;
  challengeId: string;
  detectedCategory: string;
  confidence: number;
  detectedSkills: string; // JSON array string
  duplicateOfId?: string | null;
  reasoning?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  district: string;
  lat?: number;
  lng?: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  mediaUrls?: string;
  daysLeft: number;
  supportersCount: number;
  viewsCount: number;
  affectedPeople?: number;
  createdById: string;
  createdBy?: User;
  aiClassification?: AIClassification;
  isSupportedByCurrentUser?: boolean;
  createdAt: string;
  solutions?: Solution[];
  _count?: {
    supporters: number;
    teams: number;
    solutions: number;
    comments: number;
  };
}

export interface Solution {
  id: string;
  title: string;
  description: string;
  category: string;
  challengeId?: string;
  teamId?: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'IN_PROGRESS' | 'TESTING' | 'IN_DEPLOYMENT' | 'DEPLOYED' | string;
  progressPct: number;
  mediaUrls?: string;
  viewsCount: number;
  demoUrl?: string;
  repoUrl?: string;
  impactReach: number;
  createdAt: string;
  reviewerId?: string | null;
  reviewerComment?: string | null;
  reviewedAt?: string | null;
  progressEvents?: any[];
  team?: Team;
  challenge?: Partial<Challenge>;
}

export interface University {
  id: string;
  name: string;
  shortName: string;
  location: string;
  district: string;
  nirfRank?: string;
  logoUrl?: string;
  departments: string; // JSON
  expertiseTags: string; // JSON
  activeProjectsCount: number;
  description?: string;
  website?: string;
  contactEmail?: string;
}

export interface IndustryPartner {
  id: string;
  name: string;
  sector: string;
  engagementTypes: string; // JSON
  logoUrl?: string;
  location: string;
  description?: string;
  website?: string;
  activeProjectsCount: number;
}

export interface TeamMember {
  id: string;
  teamId: string;
  name: string;
  role: string;
  email?: string;
  avatarUrl?: string;
  institution?: string;
}

export interface Team {
  id: string;
  name: string;
  challengeId?: string;
  status: string;
  leadName: string;
  leadEmail?: string;
  memberCount: number;
  skills: string; // JSON
  avatarUrl?: string;
  members?: TeamMember[];
  challenge?: Partial<Challenge>;
  solutions?: Partial<Solution>[];
}

export interface Comment {
  id: string;
  challengeId: string;
  userId: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'TEAM' | 'CHALLENGE' | 'SOLUTION' | 'SYSTEM';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface MatchScoreResult {
  id: string;
  name: string;
  type: 'UNIVERSITY' | 'INDUSTRY' | 'TEAM';
  matchScore: number;
  matchedTags: string[];
  reasoning: string;
  location?: string;
  activeProjects?: number;
  engagementTypes?: string[];
}
