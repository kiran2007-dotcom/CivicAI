import {
  Complaint,
  ComplaintStatus,
  ComplaintTimelineEvent,
  IssueCategory,
  NotificationItem,
  PriorityLevel,
  User,
  CitizenFeedback,
  CompletionEvidence,
} from '../types';
import {
  SAMPLE_POTHOLE_SVG,
  SAMPLE_GARBAGE_SVG,
  SAMPLE_WATER_LEAK_SVG,
  SAMPLE_STREETLIGHT_SVG,
  SAMPLE_REPAIR_PROGRESS_SVG,
  SAMPLE_COMPLETED_REPAIR_SVG,
} from '../data/sampleAssets';
import { CivicApiClient } from './api';

const COMPLAINTS_KEY = 'civicai_complaints_v1';
const NOTIFICATIONS_KEY = 'civicai_notifications_v1';
const USERS_KEY = 'civicai_users_v1';
const CURRENT_USER_KEY = 'civicai_current_user_v1';
const DEMO_MODE_KEY = 'civicai_demo_mode_enabled_v1';

// Pre-defined demo users
export const DEMO_USERS: User[] = [
  {
    id: 'user-citizen-01',
    name: 'Kiran Manjunath',
    email: 'citizen@civicai.demo',
    role: 'citizen',
    phone: '+91 98450 12345',
    ward: 'Ward 112 - Domlur / MG Road',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-officer-01',
    name: 'Inspector Rajesh Verma',
    email: 'officer@civicai.demo',
    role: 'officer',
    department: 'Municipal Operations Bureau',
    phone: '+91 94480 67890',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user-worker-01',
    name: 'Ramesh Gowda',
    email: 'worker@civicai.demo',
    role: 'worker',
    department: 'Road Maintenance',
    phone: '+91 99001 54321',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
];

// Additional workers for assignment
export const REGISTERED_WORKERS: User[] = [
  DEMO_USERS[2], // Ramesh Gowda (Road Maintenance)
  {
    id: 'user-worker-02',
    name: 'Anand Kumar',
    email: 'anand.worker@civicai.demo',
    role: 'worker',
    department: 'Sanitation Department',
    phone: '+91 98451 99887',
  },
  {
    id: 'user-worker-03',
    name: 'Suresh Patil',
    email: 'suresh.worker@civicai.demo',
    role: 'worker',
    department: 'Water Supply Department',
    phone: '+91 98860 33445',
  },
  {
    id: 'user-worker-04',
    name: 'Praveen Rao',
    email: 'praveen.worker@civicai.demo',
    role: 'worker',
    department: 'Electrical Department',
    phone: '+91 97401 22119',
  },
];

export const DEPARTMENTS = [
  'Road Maintenance',
  'Sanitation Department',
  'Water Supply Department',
  'Electrical Department',
  'Drainage Department',
  'Parks and Emergency Services',
  'General Civic Services',
];

// Configurable Category to Department routing rules
export const CATEGORY_DEPARTMENT_MAP: Record<IssueCategory, string> = {
  Pothole: 'Road Maintenance',
  'Road Damage': 'Road Maintenance',
  Garbage: 'Sanitation Department',
  'Water Leakage': 'Water Supply Department',
  'Broken Streetlight': 'Electrical Department',
  Drainage: 'Drainage Department',
  'Fallen Tree': 'Parks and Emergency Services',
  Other: 'General Civic Services',
};

// Generate collision-resistant complaint ID
export const generateComplaintId = (): string => {
  const year = new Date().getFullYear();
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  const serial = Math.floor(1000 + Math.random() * 9000);
  return `CIV-${year}-${randomPart}${serial.toString().substring(0, 2)}`;
};

// Initial seeded complaints to demonstrate immediate live status across all 3 roles
const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'CIV-2026-RD4812',
    citizenId: 'user-citizen-01',
    citizenName: 'Kiran Manjunath',
    citizenEmail: 'citizen@civicai.demo',
    category: 'Pothole',
    description: 'Dangerous pothole on middle lane of MG Road near Trinity Circle causing traffic slowdowns and bike falls.',
    photoUrl: SAMPLE_POTHOLE_SVG,
    location: {
      address: 'MG Road, Near Trinity Circle, Ward 112, Bengaluru',
      lat: 12.9738,
      lng: 77.6186,
      landmark: 'Near Trinity Metro Station Pillar 188',
      zone: 'East Zone',
    },
    aiAnalysis: {
      issueCategory: 'Pothole',
      description: 'Severe deep road crater posing significant vehicular hazard.',
      severity: 'High',
      priority: 'High',
      confidence: 94,
      recommendedDepartment: 'Road Maintenance',
      reasoning: 'Surface asphalt breakdown exceeds 15cm depth on heavy traffic arterial road.',
      estimatedResolutionHours: 24,
      isDemoMode: true,
      analyzedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    },
    priority: 'High',
    department: 'Road Maintenance',
    status: 'In Progress',
    assignedWorkerId: 'user-worker-01',
    assignedWorkerName: 'Ramesh Gowda',
    assignedAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    officerNotes: 'High priority arterial road. Field team deployed with cold mix asphalt.',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    timeline: [
      {
        id: 'evt-1',
        status: 'Submitted',
        title: 'Complaint Registered',
        description: 'Issue reported by citizen with photo evidence.',
        timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
        actorName: 'Kiran Manjunath',
        actorRole: 'citizen',
      },
      {
        id: 'evt-2',
        status: 'Under Review',
        title: 'AI Triage & Officer Inspection',
        description: 'AI model classified as High Severity Pothole. Officer verified coordinates.',
        timestamp: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
        actorName: 'Inspector Rajesh Verma',
        actorRole: 'officer',
      },
      {
        id: 'evt-3',
        status: 'Assigned',
        title: 'Assigned to Field Worker',
        description: 'Dispatched to Road Maintenance Crew (Ramesh Gowda).',
        timestamp: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
        actorName: 'Inspector Rajesh Verma',
        actorRole: 'officer',
      },
      {
        id: 'evt-4',
        status: 'In Progress',
        title: 'Repairs Commenced',
        description: 'Worker accepted task and placed warning barricades on site.',
        timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
        actorName: 'Ramesh Gowda',
        actorRole: 'worker',
      },
    ],
  },
  {
    id: 'CIV-2026-SN1904',
    citizenId: 'user-citizen-01',
    citizenName: 'Kiran Manjunath',
    citizenEmail: 'citizen@civicai.demo',
    category: 'Garbage',
    description: 'Excessive garbage pileup around community bin overflowing onto pedestrian footpath for 3 days.',
    photoUrl: SAMPLE_GARBAGE_SVG,
    location: {
      address: '100 Feet Road, 12th Main Junction, Indiranagar, Bengaluru',
      lat: 12.9716,
      lng: 77.6412,
      landmark: 'Near 12th Main Junction',
      zone: 'East Zone',
    },
    aiAnalysis: {
      issueCategory: 'Garbage',
      description: 'Solid waste buildup blocking pedestrian walkway with foul odor and health risks.',
      severity: 'Medium',
      priority: 'Medium',
      confidence: 91,
      recommendedDepartment: 'Sanitation Department',
      reasoning: 'Secondary collection container overflow. Requires tipper truck dispatch.',
      estimatedResolutionHours: 12,
      isDemoMode: true,
      analyzedAt: new Date(Date.now() - 52 * 3600 * 1000).toISOString(),
    },
    priority: 'Medium',
    department: 'Sanitation Department',
    status: 'Resolved',
    assignedWorkerId: 'user-worker-02',
    assignedWorkerName: 'Anand Kumar',
    assignedAt: new Date(Date.now() - 40 * 3600 * 1000).toISOString(),
    completionEvidence: {
      photoUrl: SAMPLE_COMPLETED_REPAIR_SVG,
      notes: 'Cleared 1.8 tons of accumulated waste, disinfected the pavement with bleaching powder.',
      completedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
      workerName: 'Anand Kumar',
    },
    resolvedAt: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
    feedback: {
      rating: 5,
      comment: 'Very impressed with how fast the sanitation team cleared the whole walkway! Thank you CivicAI.',
      submittedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
      citizenName: 'Kiran Manjunath',
    },
    createdAt: new Date(Date.now() - 52 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
    timeline: [
      {
        id: 'sn-evt-1',
        status: 'Submitted',
        title: 'Complaint Registered',
        description: 'Reported with photo evidence.',
        timestamp: new Date(Date.now() - 52 * 3600 * 1000).toISOString(),
        actorName: 'Kiran Manjunath',
        actorRole: 'citizen',
      },
      {
        id: 'sn-evt-2',
        status: 'Assigned',
        title: 'Assigned to Sanitation Worker',
        description: 'Assigned to Anand Kumar.',
        timestamp: new Date(Date.now() - 40 * 3600 * 1000).toISOString(),
        actorName: 'Inspector Rajesh Verma',
        actorRole: 'officer',
      },
      {
        id: 'sn-evt-3',
        status: 'In Progress',
        title: 'Waste Collection Started',
        description: 'Compactor vehicle arrived on site.',
        timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        actorName: 'Anand Kumar',
        actorRole: 'worker',
      },
      {
        id: 'sn-evt-4',
        status: 'Awaiting Verification',
        title: 'Completion Evidence Submitted',
        description: 'Worker submitted clean site photo proof.',
        timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
        actorName: 'Anand Kumar',
        actorRole: 'worker',
      },
      {
        id: 'sn-evt-5',
        status: 'Resolved',
        title: 'Resolution Verified & Closed',
        description: 'Officer audited photo proof and closed ticket.',
        timestamp: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
        actorName: 'Inspector Rajesh Verma',
        actorRole: 'officer',
      },
    ],
  },
  {
    id: 'CIV-2026-WL8821',
    citizenId: 'user-citizen-02',
    citizenName: 'Aarav Sharma',
    citizenEmail: 'aarav@citizen.test',
    category: 'Water Leakage',
    description: 'Drinking water distribution line leaking heavily near BDA complex, thousands of liters lost.',
    photoUrl: SAMPLE_WATER_LEAK_SVG,
    location: {
      address: '80 Feet Road, 4th Block, Koramangala, Bengaluru',
      lat: 12.9344,
      lng: 77.6271,
      landmark: 'Near Koramangala Post Office',
      zone: 'South Zone',
    },
    aiAnalysis: {
      issueCategory: 'Water Leakage',
      description: 'Pressurized distribution main puncture causing rapid potable water wastage.',
      severity: 'Critical',
      priority: 'Urgent',
      confidence: 96,
      recommendedDepartment: 'Water Supply Department',
      reasoning: 'Critical water infrastructure breach affecting residential supply and road sub-base.',
      estimatedResolutionHours: 8,
      isDemoMode: true,
      analyzedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    },
    priority: 'Urgent',
    department: 'Water Supply Department',
    status: 'Submitted',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    timeline: [
      {
        id: 'wl-evt-1',
        status: 'Submitted',
        title: 'Urgent Report Logged',
        description: 'Flagged by AI as Critical priority due to potable water loss.',
        timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        actorName: 'Aarav Sharma',
        actorRole: 'citizen',
      },
    ],
  },
  {
    id: 'CIV-2026-EL3055',
    citizenId: 'user-citizen-01',
    citizenName: 'Kiran Manjunath',
    citizenEmail: 'citizen@civicai.demo',
    category: 'Broken Streetlight',
    description: 'Streetlight pole out of order near blind road turn, entire crossing completely pitch dark.',
    photoUrl: SAMPLE_STREETLIGHT_SVG,
    location: {
      address: 'Whitefield Main Road, Hope Farm Junction, Bengaluru',
      lat: 12.9698,
      lng: 77.7499,
      landmark: 'Hope Farm Junction Circle',
      zone: 'Mahadevapura Zone',
    },
    aiAnalysis: {
      issueCategory: 'Broken Streetlight',
      description: 'Luminaire failure with exposed terminal box wiring.',
      severity: 'High',
      priority: 'High',
      confidence: 89,
      recommendedDepartment: 'Electrical Department',
      reasoning: 'Safety risk for evening commuters at pedestrian crossing.',
      estimatedResolutionHours: 24,
      isDemoMode: true,
      analyzedAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    },
    priority: 'High',
    department: 'Electrical Department',
    status: 'Under Review',
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    timeline: [
      {
        id: 'el-evt-1',
        status: 'Submitted',
        title: 'Complaint Registered',
        description: 'Logged with photo evidence.',
        timestamp: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
        actorName: 'Kiran Manjunath',
        actorRole: 'citizen',
      },
      {
        id: 'el-evt-2',
        status: 'Under Review',
        title: 'Officer Queue Review',
        description: 'Inspector verified streetlight pole number SL-942.',
        timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
        actorName: 'Inspector Rajesh Verma',
        actorRole: 'officer',
      },
    ],
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'user-citizen-01',
    userRole: 'citizen',
    complaintId: 'CIV-2026-SN1904',
    title: 'Complaint Resolved — Please Rate Us!',
    message: 'Your complaint regarding Garbage Spill on Indiranagar 100ft Road has been resolved by field crew.',
    type: 'success',
    isRead: false,
    createdAt: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
  },
  {
    id: 'notif-2',
    userId: 'user-citizen-01',
    userRole: 'citizen',
    complaintId: 'CIV-2026-RD4812',
    title: 'Work In Progress: MG Road Pothole',
    message: 'Field technician Ramesh Gowda has arrived on site and commenced repairs.',
    type: 'info',
    isRead: false,
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
  },
  {
    id: 'notif-3',
    userId: 'user-officer-01',
    userRole: 'officer',
    complaintId: 'CIV-2026-WL8821',
    title: 'Urgent Issue Alert: Koramangala Water Leak',
    message: 'New Critical priority water distribution leak requires immediate officer verification & dispatch.',
    type: 'alert',
    isRead: false,
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
  },
  {
    id: 'notif-4',
    userId: 'user-worker-01',
    userRole: 'worker',
    complaintId: 'CIV-2026-RD4812',
    title: 'New Work Order Assigned',
    message: 'You have been assigned to repair high-priority pothole on MG Road near Trinity Circle.',
    type: 'info',
    isRead: true,
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
  },
];

// Memory/Storage Service Implementation with Server Backend Sync
export class StorageService {
  private static isInitialized = false;

  // Broadcast change event so all components re-render immediately
  private static emitChange(event: string) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(event));
    }
  }

  // Synchronize client cache with server REST API
  static async syncWithServer() {
    if (typeof window === 'undefined') return;
    try {
      const serverComplaints = await CivicApiClient.getComplaints();
      if (serverComplaints && serverComplaints.length > 0) {
        localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(serverComplaints));
        this.emitChange('civicai_complaints_updated');
      }

      const notifs = await CivicApiClient.getNotifications();
      if (notifs && notifs.length > 0) {
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
        this.emitChange('civicai_notifications_updated');
      }
    } catch (e) {
      console.warn('Could not sync with server, using local cache:', e);
    }
  }

  // Initialize SSE listener once
  static initRealtime() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    // Trigger initial sync
    this.syncWithServer();

    // Subscribe to SSE backend broadcasts
    CivicApiClient.subscribeToEvents((eventType, payload) => {
      if (eventType === 'complaint_created' || eventType === 'complaint_updated') {
        this.syncWithServer();
      }
      if (eventType === 'notification_created') {
        const notifs = this.getNotifications();
        notifs.unshift(payload);
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
        this.emitChange('civicai_notifications_updated');
      }
    });
  }

  // Initialize or fetch complaints
  static getComplaints(): Complaint[] {
    this.initRealtime();
    if (typeof window === 'undefined') return INITIAL_COMPLAINTS;
    try {
      const data = localStorage.getItem(COMPLAINTS_KEY);
      if (!data) {
        localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(INITIAL_COMPLAINTS));
        return INITIAL_COMPLAINTS;
      }
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading complaints from localStorage:', err);
      return INITIAL_COMPLAINTS;
    }
  }

  static saveComplaints(complaints: Complaint[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
      this.emitChange('civicai_complaints_updated');
    } catch (err) {
      console.error('Failed to save complaints to localStorage:', err);
    }
  }

  static getComplaintById(id: string): Complaint | undefined {
    const complaints = this.getComplaints();
    return complaints.find((c) => c.id.toUpperCase() === id.trim().toUpperCase());
  }

  // Create new complaint (persists to backend & updates local cache)
  static createComplaint(
    complaintData: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>
  ): Complaint {
    const complaints = this.getComplaints();
    const id = generateComplaintId();
    const now = new Date().toISOString();

    const initialEvent: ComplaintTimelineEvent = {
      id: `evt-${Date.now()}-1`,
      status: 'Submitted',
      title: 'Complaint Registered',
      description: `Issue registered into CivicAI with ID ${id}. Priority calculated: ${complaintData.priority}.`,
      timestamp: now,
      actorName: complaintData.citizenName,
      actorRole: 'citizen',
    };

    const newComplaint: Complaint = {
      ...complaintData,
      id,
      createdAt: now,
      updatedAt: now,
      timeline: [initialEvent],
    };

    complaints.unshift(newComplaint);
    this.saveComplaints(complaints);

    // Persist to Server Backend in background
    CivicApiClient.createComplaint(complaintData).catch((err) => {
      console.warn('Backend complaint sync fallback to local store:', err);
    });

    // Create notification for Citizen
    this.createNotification({
      userId: newComplaint.citizenId,
      userRole: 'citizen',
      complaintId: id,
      title: 'Complaint Submitted Successfully',
      message: `Your complaint #${id} for "${newComplaint.category}" has been received and routed to ${newComplaint.department}.`,
      type: 'success',
    });

    // Create notification for Officer
    this.createNotification({
      userId: 'user-officer-01',
      userRole: 'officer',
      complaintId: id,
      title: `New Civic Complaint: #${id}`,
      message: `New ${newComplaint.priority} priority issue reported in ${newComplaint.location.zone || 'the city'}. Needs review.`,
      type: newComplaint.priority === 'Urgent' ? 'alert' : 'info',
    });

    return newComplaint;
  }

  // Update complaint status & record timeline event
  static updateComplaintStatus(
    complaintId: string,
    newStatus: ComplaintStatus,
    actor: { name: string; role: 'citizen' | 'officer' | 'worker' },
    details?: {
      title?: string;
      description?: string;
      assignedWorkerId?: string;
      assignedWorkerName?: string;
      officerNotes?: string;
      rejectionReason?: string;
      completionEvidence?: CompletionEvidence;
      department?: string;
      priority?: PriorityLevel;
      category?: IssueCategory;
    }
  ): Complaint | null {
    const complaints = this.getComplaints();
    const idx = complaints.findIndex((c) => c.id === complaintId);
    if (idx === -1) return null;

    const current = complaints[idx];
    const now = new Date().toISOString();

    const title = details?.title || `Status updated to ${newStatus}`;
    const description =
      details?.description ||
      `Updated by ${actor.name} (${actor.role.toUpperCase()}).`;

    const timelineEvent: ComplaintTimelineEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      status: newStatus,
      title,
      description,
      timestamp: now,
      actorName: actor.name,
      actorRole: actor.role,
    };

    const updated: Complaint = {
      ...current,
      status: newStatus,
      updatedAt: now,
      timeline: [...current.timeline, timelineEvent],
      ...(details?.assignedWorkerId && {
        assignedWorkerId: details.assignedWorkerId,
        assignedWorkerName: details.assignedWorkerName,
        assignedAt: now,
      }),
      ...(details?.officerNotes !== undefined && { officerNotes: details.officerNotes }),
      ...(details?.rejectionReason !== undefined && { rejectionReason: details.rejectionReason }),
      ...(details?.completionEvidence && { completionEvidence: details.completionEvidence }),
      ...(details?.department && { department: details.department }),
      ...(details?.priority && { priority: details.priority }),
      ...(details?.category && { category: details.category }),
      ...(newStatus === 'Resolved' && { resolvedAt: now }),
    };

    complaints[idx] = updated;
    this.saveComplaints(complaints);

    // Dispatch update to Backend API
    CivicApiClient.updateComplaintStatus(complaintId, newStatus, actor, details).catch((err) => {
      console.warn('Backend status update sync error:', err);
    });

    // Notify citizen of the milestone
    let notifMessage = `Your complaint #${updated.id} is now ${newStatus}.`;
    if (newStatus === 'Assigned') {
      notifMessage = `Worker ${updated.assignedWorkerName} has been assigned to address complaint #${updated.id}.`;
    } else if (newStatus === 'In Progress') {
      notifMessage = `Field repair has commenced for complaint #${updated.id}.`;
    } else if (newStatus === 'Awaiting Verification') {
      notifMessage = `Worker has completed repair work for #${updated.id}. Officer is reviewing completion evidence.`;
    } else if (newStatus === 'Resolved') {
      notifMessage = `Complaint #${updated.id} has been verified and marked Resolved. Please share your feedback!`;
    } else if (newStatus === 'Rejected') {
      notifMessage = `Complaint #${updated.id} was rejected: ${updated.rejectionReason || 'Does not qualify for municipal work'}.`;
    }

    this.createNotification({
      userId: updated.citizenId,
      userRole: 'citizen',
      complaintId: updated.id,
      title: `Complaint #${updated.id} Update: ${newStatus}`,
      message: notifMessage,
      type: newStatus === 'Resolved' ? 'success' : newStatus === 'Rejected' ? 'warning' : 'info',
    });

    if (newStatus === 'Assigned' && updated.assignedWorkerId) {
      this.createNotification({
        userId: updated.assignedWorkerId,
        userRole: 'worker',
        complaintId: updated.id,
        title: `Work Order Assigned: #${updated.id}`,
        message: `You have been assigned to repair "${updated.category}" at ${updated.location.address}.`,
        type: updated.priority === 'Urgent' ? 'alert' : 'info',
      });
    }

    return updated;
  }

  // Submit citizen feedback for resolved complaints
  static submitFeedback(complaintId: string, feedback: CitizenFeedback): boolean {
    const complaints = this.getComplaints();
    const idx = complaints.findIndex((c) => c.id === complaintId);
    if (idx === -1) return false;

    const current = complaints[idx];
    if (current.status !== 'Resolved') return false;

    current.feedback = feedback;
    current.updatedAt = new Date().toISOString();
    current.timeline.push({
      id: `evt-${Date.now()}-fb`,
      status: 'Resolved',
      title: 'Citizen Feedback Provided',
      description: `Citizen rated this resolution ${feedback.rating} / 5 stars. Comment: "${feedback.comment}".`,
      timestamp: new Date().toISOString(),
      actorName: feedback.citizenName,
      actorRole: 'citizen',
    });

    complaints[idx] = current;
    this.saveComplaints(complaints);

    // Sync to backend
    CivicApiClient.submitFeedback(
      complaintId,
      feedback.rating,
      feedback.comment,
      feedback.citizenName,
      current.citizenId
    ).catch(() => {});

    // Notify officer of feedback received
    this.createNotification({
      userId: 'user-officer-01',
      userRole: 'officer',
      complaintId,
      title: `Citizen Feedback: ${feedback.rating}★ on #${complaintId}`,
      message: `Citizen ${feedback.citizenName} rated resolution: "${feedback.comment}"`,
      type: 'info',
    });

    return true;
  }

  // Notifications
  static getNotifications(userId?: string): NotificationItem[] {
    if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS;
    try {
      const data = localStorage.getItem(NOTIFICATIONS_KEY);
      let list: NotificationItem[] = data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
      if (!data) {
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      }
      if (userId) {
        return list.filter((n) => n.userId === userId || n.userRole === 'officer');
      }
      return list;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  }

  static createNotification(
    notif: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>
  ): NotificationItem {
    const list = this.getNotifications();
    const newItem: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    list.unshift(newItem);
    if (typeof window !== 'undefined') {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list));
      this.emitChange('civicai_notifications_updated');
    }
    return newItem;
  }

  static markNotificationRead(id: string) {
    const list = this.getNotifications();
    const item = list.find((n) => n.id === id);
    if (item) {
      item.isRead = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list));
        this.emitChange('civicai_notifications_updated');
      }
    }
  }

  static markAllNotificationsRead(userId?: string) {
    const list = this.getNotifications();
    list.forEach((n) => {
      if (!userId || n.userId === userId || n.userRole === 'officer') {
        n.isRead = true;
      }
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list));
      this.emitChange('civicai_notifications_updated');
    }
  }

  // Users & Auth Session
  static getCurrentUser(): User {
    if (typeof window === 'undefined') return DEMO_USERS[0];
    try {
      const data = localStorage.getItem(CURRENT_USER_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    return DEMO_USERS[0];
  }

  static setCurrentUser(user: User) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    this.emitChange('civicai_auth_changed');
  }

  // Hackathon Demo Scenario Loader
  static loadDemoScenario(): Complaint {
    const newId = generateComplaintId();
    const now = new Date();

    const scenarioComplaint: Complaint = {
      id: newId,
      citizenId: 'user-citizen-01',
      citizenName: 'Kiran Manjunath',
      citizenEmail: 'citizen@civicai.demo',
      category: 'Pothole',
      description: 'Major hazardous pothole on MG Road near Metro Pillar 142. Deep crater damaging vehicles and creating immediate collision risks.',
      photoUrl: SAMPLE_POTHOLE_SVG,
      location: {
        address: 'Near Metro Pillar 142, MG Road, Bengaluru, Karnataka 560001',
        lat: 12.9756,
        lng: 77.6092,
        landmark: 'Opposite Central Mall / Pillar 142',
        zone: 'East Zone - Ward 112',
      },
      aiAnalysis: {
        issueCategory: 'Pothole',
        description: 'Severe deep road crater posing significant vehicular hazard and potential two-wheeler accidents.',
        severity: 'High',
        priority: 'High',
        confidence: 95,
        recommendedDepartment: 'Road Maintenance',
        reasoning: 'Surface asphalt breakdown exceeds 15cm depth on heavy traffic arterial road. Immediate cold-mix asphalt resurfacing required.',
        estimatedResolutionHours: 24,
        isDemoMode: true,
        analyzedAt: now.toISOString(),
      },
      priority: 'High',
      department: 'Road Maintenance',
      status: 'Submitted',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      timeline: [
        {
          id: `evt-demo-${Date.now()}`,
          status: 'Submitted',
          title: 'Demo Scenario Complaint Created',
          description: `Deterministic Hackathon Pothole complaint instantiated with ID ${newId}. Ready for Officer review and Field Worker workflow.`,
          timestamp: now.toISOString(),
          actorName: 'Kiran Manjunath (Citizen)',
          actorRole: 'citizen',
        },
      ],
    };

    const complaints = this.getComplaints();
    complaints.unshift(scenarioComplaint);
    this.saveComplaints(complaints);

    this.createNotification({
      userId: 'user-citizen-01',
      userRole: 'citizen',
      complaintId: newId,
      title: 'Demo Pothole Complaint Created',
      message: `Scenario active: Complaint #${newId} is now visible to Officers and Workers. Switch roles in the top bar to test the complete workflow!`,
      type: 'success',
    });

    this.createNotification({
      userId: 'user-officer-01',
      userRole: 'officer',
      complaintId: newId,
      title: `Officer Action Needed: #${newId}`,
      message: `High Priority Pothole on MG Road awaiting verification and worker assignment.`,
      type: 'alert',
    });

    return scenarioComplaint;
  }

  // Reset all data to factory demo state
  static resetDemoData() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(INITIAL_COMPLAINTS));
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(DEMO_USERS[0]));
    this.emitChange('civicai_complaints_updated');
    this.emitChange('civicai_notifications_updated');
    this.emitChange('civicai_auth_changed');
  }
}
