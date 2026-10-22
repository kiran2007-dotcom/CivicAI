export type UserRole = 'citizen' | 'officer' | 'worker';

export type IssueCategory =
  | 'Pothole'
  | 'Road Damage'
  | 'Garbage'
  | 'Water Leakage'
  | 'Broken Streetlight'
  | 'Drainage'
  | 'Fallen Tree'
  | 'Other';

export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Urgent';

export type ComplaintStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Verified'
  | 'Assigned'
  | 'In Progress'
  | 'Awaiting Verification'
  | 'Resolved'
  | 'Rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  department?: string;
  avatarUrl?: string;
  ward?: string;
}

export interface ComplaintLocation {
  address: string;
  lat: number;
  lng: number;
  landmark?: string;
  zone?: string;
}

export interface AIAnalysisResult {
  issueCategory: IssueCategory;
  description: string;
  severity: SeverityLevel;
  priority: PriorityLevel;
  confidence: number;
  recommendedDepartment: string;
  reasoning: string;
  estimatedResolutionHours: number;
  isDemoMode: boolean;
  analyzedAt: string;
}

export interface ComplaintTimelineEvent {
  id: string;
  status: ComplaintStatus;
  title: string;
  description: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole | 'system';
}

export interface CompletionEvidence {
  photoUrl?: string;
  notes: string;
  completedAt: string;
  workerName: string;
}

export interface CitizenFeedback {
  rating: number; // 1 - 5
  comment: string;
  submittedAt: string;
  citizenName: string;
}

export interface Complaint {
  id: string; // e.g. CIV-2026-0042
  citizenId: string;
  citizenName: string;
  citizenEmail?: string;
  category: IssueCategory;
  description: string;
  photoUrl: string;
  videoEvidenceNote?: string;
  additionalNotes?: string;
  location: ComplaintLocation;
  aiAnalysis?: AIAnalysisResult;
  priority: PriorityLevel;
  department: string;
  status: ComplaintStatus;
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  assignedAt?: string;
  officerNotes?: string;
  rejectionReason?: string;
  completionEvidence?: CompletionEvidence;
  feedback?: CitizenFeedback;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  timeline: ComplaintTimelineEvent[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  userRole: UserRole;
  complaintId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  isRead: boolean;
  createdAt: string;
}

export interface DepartmentInfo {
  id: string;
  name: string;
  headOfficer: string;
  phone: string;
  activeStaffCount: number;
  slaHours: number;
}
