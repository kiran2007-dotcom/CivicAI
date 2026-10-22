import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.resolve(__dirname, '../data/civicai.db.json');

export type UserRole = 'citizen' | 'officer' | 'worker' | 'admin';

export interface ProfileRecord {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: UserRole;
  phone?: string;
  department?: string;
  ward?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentRecord {
  id: string;
  name: string;
  headOfficer: string;
  phone: string;
  slaHours: number;
}

export interface ComplaintRecord {
  id: string;
  citizenId: string;
  citizenName: string;
  citizenEmail?: string;
  category: string;
  description: string;
  photoUrl: string;
  videoEvidenceNote?: string;
  additionalNotes?: string;
  location: {
    address: string;
    lat: number;
    lng: number;
    landmark?: string;
    zone?: string;
  };
  aiAnalysis?: any;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  department: string;
  status:
    | 'Submitted'
    | 'Under Review'
    | 'Verified'
    | 'Assigned'
    | 'In Progress'
    | 'Awaiting Verification'
    | 'Resolved'
    | 'Rejected';
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  assignedAt?: string;
  officerNotes?: string;
  rejectionReason?: string;
  completionEvidence?: {
    photoUrl?: string;
    notes: string;
    completedAt: string;
    workerName: string;
  };
  feedback?: {
    rating: number;
    comment: string;
    submittedAt: string;
    citizenName: string;
  };
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface TimelineRecord {
  id: string;
  complaintId: string;
  status: string;
  title: string;
  description: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole | 'system';
}

export interface NotificationRecord {
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

export interface AuditLogRecord {
  id: string;
  userId: string;
  userRole: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: any;
  ipAddress?: string;
  timestamp: string;
}

export interface DatabaseSchema {
  profiles: ProfileRecord[];
  departments: DepartmentRecord[];
  complaints: ComplaintRecord[];
  timeline: TimelineRecord[];
  notifications: NotificationRecord[];
  auditLogs: AuditLogRecord[];
}

// Initial seed data
const INITIAL_PROFILES: ProfileRecord[] = [
  {
    id: 'user-citizen-01',
    name: 'Kiran Manjunath',
    email: 'citizen@civicai.demo',
    role: 'citizen',
    phone: '+91 98450 12345',
    ward: 'Ward 112 - Domlur / MG Road',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'user-officer-01',
    name: 'Inspector Rajesh Verma',
    email: 'officer@civicai.demo',
    role: 'officer',
    department: 'Road Maintenance',
    phone: '+91 94480 67890',
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  {
    id: 'user-worker-01',
    name: 'Ramesh Gowda',
    email: 'worker@civicai.demo',
    role: 'worker',
    department: 'Road Maintenance',
    phone: '+91 99001 54321',
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 45 * 86400000).toISOString(),
  },
  {
    id: 'user-admin-01',
    name: 'Chief Commissioner Admin',
    email: 'admin@civicai.demo',
    role: 'admin',
    phone: '+91 80 2222 1111',
    department: 'Municipal Corporation HQ',
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 90 * 86400000).toISOString(),
  },
];

const INITIAL_DEPARTMENTS: DepartmentRecord[] = [
  { id: 'dept-1', name: 'Road Maintenance', headOfficer: 'Rajesh Verma', phone: '+91 80 2297 5001', slaHours: 24 },
  { id: 'dept-2', name: 'Sanitation Department', headOfficer: 'Deepa Hegde', phone: '+91 80 2297 5002', slaHours: 12 },
  { id: 'dept-3', name: 'Water Supply Department', headOfficer: 'Siddaramaiah K', phone: '+91 80 2297 5003', slaHours: 8 },
  { id: 'dept-4', name: 'Electrical Department', headOfficer: 'Prakash Rao', phone: '+91 80 2297 5004', slaHours: 24 },
  { id: 'dept-5', name: 'Drainage Department', headOfficer: 'Manjula B', phone: '+91 80 2297 5005', slaHours: 36 },
  { id: 'dept-6', name: 'Parks and Emergency Services', headOfficer: 'Arun Kumar', phone: '+91 80 2297 5006', slaHours: 6 },
  { id: 'dept-7', name: 'General Civic Services', headOfficer: 'Naveen Swamy', phone: '+91 80 2297 5007', slaHours: 48 },
];

export class ServerDB {
  private static data: DatabaseSchema | null = null;
  private static listeners: ((event: string, payload: any) => void)[] = [];

  // Register SSE subscriber
  static subscribe(fn: (event: string, payload: any) => void) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  static broadcast(event: string, payload: any) {
    this.listeners.forEach((fn) => {
      try {
        fn(event, payload);
      } catch (err) {
        console.error('SSE Broadcast error:', err);
      }
    });
  }

  // Load or initialize DB from disk
  private static loadDB(): DatabaseSchema {
    if (this.data) return this.data;

    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        if (this.data && this.data.complaints && this.data.complaints.length > 0) {
          return this.data!;
        }
      }
    } catch (err) {
      console.warn('DB file corrupt or unreadable, creating fresh store:', err);
    }

    const initialComplaints: ComplaintRecord[] = [
      {
        id: 'CIV-2026-RD4812',
        citizenId: 'user-citizen-01',
        citizenName: 'Kiran Manjunath',
        citizenEmail: 'citizen@civicai.demo',
        category: 'Pothole',
        description: 'Dangerous pothole on middle lane of MG Road near Trinity Circle causing traffic slowdowns and bike falls.',
        photoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="road" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="%23334155"/><stop offset="100%" stop-color="%231e293b"/></linearGradient></defs><rect width="600" height="400" fill="url(%23road)"/><ellipse cx="310" cy="240" rx="140" ry="75" fill="%230f172a"/><text x="32" y="44" fill="%23ffffff" font-family="sans-serif" font-size="14" font-weight="bold">CIVIC PHOTO EVIDENCE: POTHOLE</text><text x="32" y="375" fill="%2394a3b8" font-family="sans-serif" font-size="13">Bengaluru MG Road • 12.9738 N, 77.6186 E</text></svg>',
        location: {
          address: 'MG Road, Near Trinity Circle, Ward 112, Bengaluru',
          lat: 12.9738,
          lng: 77.6186,
          landmark: 'Near Trinity Metro Station Pillar 188',
          zone: 'East Zone',
        },
        aiAnalysis: {
          issueCategory: 'Pothole',
          description: 'Severe deep road crater posing significant vehicular hazard and potential accidents.',
          severity: 'High',
          priority: 'High',
          confidence: 94,
          recommendedDepartment: 'Road Maintenance',
          reasoning: 'Surface asphalt breakdown exceeds 15cm depth on heavy traffic arterial road.',
          estimatedResolutionHours: 24,
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
      },
      {
        id: 'CIV-2026-SN1904',
        citizenId: 'user-citizen-01',
        citizenName: 'Kiran Manjunath',
        citizenEmail: 'citizen@civicai.demo',
        category: 'Garbage',
        description: 'Excessive garbage pileup around community bin overflowing onto pedestrian footpath for 3 days.',
        photoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23334155"/><rect x="180" y="100" width="240" height="180" rx="12" fill="%231e3a5f"/><text x="32" y="44" fill="%23ffffff" font-family="sans-serif" font-size="14" font-weight="bold">CIVIC PHOTO EVIDENCE: GARBAGE PILEUP</text><text x="32" y="375" fill="%23cbd5e1" font-family="sans-serif" font-size="13">Indiranagar 100ft Road • 12.9716 N, 77.6412 E</text></svg>',
        location: {
          address: '100 Feet Road, 12th Main Junction, Indiranagar, Bengaluru',
          lat: 12.9716,
          lng: 77.6412,
          landmark: 'Near 12th Main Junction',
          zone: 'East Zone',
        },
        aiAnalysis: {
          issueCategory: 'Garbage',
          description: 'Solid waste buildup blocking pedestrian walkway with foul odor.',
          severity: 'Medium',
          priority: 'Medium',
          confidence: 91,
          recommendedDepartment: 'Sanitation Department',
          reasoning: 'Secondary collection container overflow. Requires tipper truck dispatch.',
          estimatedResolutionHours: 12,
        },
        priority: 'Medium',
        department: 'Sanitation Department',
        status: 'Resolved',
        assignedWorkerId: 'user-worker-02',
        assignedWorkerName: 'Anand Kumar',
        assignedAt: new Date(Date.now() - 40 * 3600 * 1000).toISOString(),
        completionEvidence: {
          photoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230f172a"/><circle cx="300" cy="180" r="32" fill="%2322c55e"/><text x="180" y="250" fill="%234ade80" font-family="sans-serif" font-size="20" font-weight="bold">WORK SUCCESSFULLY COMPLETED</text></svg>',
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
      },
      {
        id: 'CIV-2026-WL8821',
        citizenId: 'user-citizen-02',
        citizenName: 'Aarav Sharma',
        citizenEmail: 'aarav@citizen.test',
        category: 'Water Leakage',
        description: 'Drinking water distribution line leaking heavily near BDA complex, thousands of liters lost.',
        photoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%231e293b"/><ellipse cx="320" cy="225" rx="160" ry="80" fill="%230284c7" opacity="0.8"/><text x="32" y="44" fill="%23ffffff" font-family="sans-serif" font-size="14" font-weight="bold">CIVIC PHOTO EVIDENCE: WATER LEAK</text></svg>',
        location: {
          address: '80 Feet Road, 4th Block, Koramangala, Bengaluru',
          lat: 12.9344,
          lng: 77.6271,
          landmark: 'Adjacent to BDA Complex',
          zone: 'South Zone',
        },
        aiAnalysis: {
          issueCategory: 'Water Leakage',
          description: 'Pressurized water main fracture causing localized waterlogging.',
          severity: 'Critical',
          priority: 'Urgent',
          confidence: 96,
          recommendedDepartment: 'Water Supply Department',
          reasoning: 'Critical potable water loss and erosion hazard under road foundation.',
          estimatedResolutionHours: 8,
        },
        priority: 'Urgent',
        department: 'Water Supply Department',
        status: 'Under Review',
        officerNotes: 'High priority urgent leakage. Awaiting valve isolation crew.',
        createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      },
      {
        id: 'CIV-2026-SL3309',
        citizenId: 'user-citizen-01',
        citizenName: 'Kiran Manjunath',
        citizenEmail: 'citizen@civicai.demo',
        category: 'Broken Streetlight',
        description: 'Three consecutive street lights not functioning causing severe dark spots and safety concern.',
        photoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23090d16"/><line x1="200" y1="380" x2="200" y2="100" stroke="%23475569" stroke-width="14"/><text x="32" y="44" fill="%23ffffff" font-family="sans-serif" font-size="14" font-weight="bold">CIVIC PHOTO EVIDENCE: BROKEN STREETLIGHT</text></svg>',
        location: {
          address: 'ITPL Main Road, Hope Farm Junction, Whitefield, Bengaluru',
          lat: 12.9698,
          lng: 77.7499,
          landmark: 'Hope Farm Signal',
          zone: 'East Zone',
        },
        aiAnalysis: {
          issueCategory: 'Broken Streetlight',
          description: 'Feeder pillar circuit fault or blown sodium vapor bulbs.',
          severity: 'Medium',
          priority: 'Medium',
          confidence: 92,
          recommendedDepartment: 'Electrical Department',
          reasoning: 'Pedestrian safety risk at night across major bus stop transit zone.',
          estimatedResolutionHours: 24,
        },
        priority: 'Medium',
        department: 'Electrical Department',
        status: 'Awaiting Verification',
        assignedWorkerId: 'user-worker-04',
        assignedWorkerName: 'Praveen Rao',
        assignedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
        completionEvidence: {
          photoUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230f172a"/><circle cx="300" cy="180" r="32" fill="%2322c55e"/><text x="180" y="250" fill="%234ade80" font-family="sans-serif" font-size="20" font-weight="bold">NEW LED LUMINAIRES INSTALLED</text></svg>',
          notes: 'Replaced 3 faulty LED driver units and restored power line from pillar box.',
          completedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
          workerName: 'Praveen Rao',
        },
        createdAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      },
    ];

    const initialNotifications: NotificationRecord[] = [
      {
        id: 'notif-1',
        userId: 'user-citizen-01',
        userRole: 'citizen',
        complaintId: 'CIV-2026-RD4812',
        title: 'Repair In Progress',
        message: 'Field technician Ramesh Gowda has commenced work on your reported Pothole at MG Road.',
        type: 'info',
        isRead: false,
        createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      },
      {
        id: 'notif-2',
        userId: 'user-citizen-01',
        userRole: 'citizen',
        complaintId: 'CIV-2026-SN1904',
        title: 'Issue Resolved! Please Rate',
        message: 'Sanitation team cleared the garbage at Indiranagar 100ft Road. Thank you for making Bengaluru cleaner.',
        type: 'success',
        isRead: true,
        createdAt: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
      },
      {
        id: 'notif-3',
        userId: 'user-worker-01',
        userRole: 'worker',
        complaintId: 'CIV-2026-RD4812',
        title: 'New Work Assignment',
        message: 'You have been assigned to repair high-priority pothole on MG Road (CIV-2026-RD4812).',
        type: 'alert',
        isRead: false,
        createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
      },
      {
        id: 'notif-4',
        userId: 'user-officer-01',
        userRole: 'officer',
        complaintId: 'CIV-2026-WL8821',
        title: 'Urgent Issue Escalation',
        message: 'Critical Water Leakage reported in Koramangala requires officer review.',
        type: 'alert',
        isRead: false,
        createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
      },
    ];

    if (!this.data) {
      this.data = {
        profiles: INITIAL_PROFILES,
        departments: INITIAL_DEPARTMENTS,
        complaints: initialComplaints,
        timeline: [],
        notifications: initialNotifications,
        auditLogs: [],
      };
      this.saveDB();
    } else if (this.data.complaints.length === 0) {
      this.data.complaints = initialComplaints;
      this.data.notifications = initialNotifications;
      this.saveDB();
    }
    return this.data;
  }

  private static saveDB() {
    if (!this.data) return;
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  // Profiles & Auth
  static getProfiles(): ProfileRecord[] {
    return this.loadDB().profiles;
  }

  static findProfileByEmail(email: string): ProfileRecord | undefined {
    return this.getProfiles().find((p) => p.email.toLowerCase() === email.trim().toLowerCase());
  }

  static findProfileById(id: string): ProfileRecord | undefined {
    return this.getProfiles().find((p) => p.id === id);
  }

  static createProfile(profile: Omit<ProfileRecord, 'createdAt' | 'updatedAt'>): ProfileRecord {
    const db = this.loadDB();
    const now = new Date().toISOString();
    const newProfile: ProfileRecord = {
      ...profile,
      createdAt: now,
      updatedAt: now,
    };
    db.profiles.push(newProfile);
    this.saveDB();
    this.logAudit({
      userId: newProfile.id,
      userRole: newProfile.role,
      action: 'USER_REGISTERED',
      entityType: 'profile',
      entityId: newProfile.id,
      details: { email: newProfile.email },
    });
    return newProfile;
  }

  // Complaints
  static getComplaints(filter?: {
    status?: string;
    category?: string;
    priority?: string;
    department?: string;
    citizenId?: string;
    workerId?: string;
  }): ComplaintRecord[] {
    let list = this.loadDB().complaints;
    if (!filter) return list;

    if (filter.status && filter.status !== 'ALL') {
      list = list.filter((c) => c.status === filter.status);
    }
    if (filter.category && filter.category !== 'ALL') {
      list = list.filter((c) => c.category === filter.category);
    }
    if (filter.priority && filter.priority !== 'ALL') {
      list = list.filter((c) => c.priority === filter.priority);
    }
    if (filter.department && filter.department !== 'ALL') {
      list = list.filter((c) => c.department === filter.department);
    }
    if (filter.citizenId) {
      list = list.filter((c) => c.citizenId === filter.citizenId);
    }
    if (filter.workerId) {
      list = list.filter((c) => c.assignedWorkerId === filter.workerId);
    }
    return list;
  }

  static getComplaintById(id: string): (ComplaintRecord & { timeline: TimelineRecord[] }) | null {
    const db = this.loadDB();
    const complaint = db.complaints.find((c) => c.id.toUpperCase() === id.trim().toUpperCase());
    if (!complaint) return null;

    const timeline = db.timeline.filter((t) => t.complaintId === complaint.id);
    timeline.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return { ...complaint, timeline };
  }

  static createComplaint(
    data: Omit<ComplaintRecord, 'createdAt' | 'updatedAt' | 'timeline'>
  ): ComplaintRecord {
    const db = this.loadDB();
    const now = new Date().toISOString();

    const record: ComplaintRecord = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    db.complaints.unshift(record);

    // Initial timeline event
    const initialEvent: TimelineRecord = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      complaintId: record.id,
      status: 'Submitted',
      title: 'Complaint Registered',
      description: `Civic issue registered with ID #${record.id}. Priority: ${record.priority}.`,
      timestamp: now,
      actorName: record.citizenName,
      actorRole: 'citizen',
    };
    db.timeline.push(initialEvent);

    // Create persistent notifications
    this.createNotification({
      userId: record.citizenId,
      userRole: 'citizen',
      complaintId: record.id,
      title: 'Complaint Registered Successfully',
      message: `Your report #${record.id} (${record.category}) has been filed and routed to ${record.department}.`,
      type: 'success',
    });

    this.createNotification({
      userId: 'user-officer-01',
      userRole: 'officer',
      complaintId: record.id,
      title: `New Incident Report: #${record.id}`,
      message: `New ${record.priority} priority ${record.category} reported at ${record.location.address}.`,
      type: record.priority === 'Urgent' ? 'alert' : 'info',
    });

    this.saveDB();
    this.broadcast('complaint_created', record);
    this.logAudit({
      userId: record.citizenId,
      userRole: 'citizen',
      action: 'COMPLAINT_CREATED',
      entityType: 'complaint',
      entityId: record.id,
      details: { category: record.category, priority: record.priority },
    });

    return record;
  }

  static updateComplaint(
    id: string,
    updates: Partial<ComplaintRecord>,
    actor: { id?: string; name: string; role: UserRole },
    timelineDetails?: { title?: string; description?: string }
  ): ComplaintRecord | null {
    const db = this.loadDB();
    const idx = db.complaints.findIndex((c) => c.id === id);
    if (idx === -1) return null;

    const current = db.complaints[idx];
    const now = new Date().toISOString();

    const updated: ComplaintRecord = {
      ...current,
      ...updates,
      updatedAt: now,
      ...(updates.status === 'Resolved' && { resolvedAt: now }),
    };
    db.complaints[idx] = updated;

    if (updates.status && updates.status !== current.status) {
      const timelineEvent: TimelineRecord = {
        id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        complaintId: id,
        status: updates.status,
        title: timelineDetails?.title || `Status updated to ${updates.status}`,
        description: timelineDetails?.description || `Action recorded by ${actor.name} (${actor.role.toUpperCase()}).`,
        timestamp: now,
        actorName: actor.name,
        actorRole: actor.role,
      };
      db.timeline.push(timelineEvent);

      // Notify citizen of transition
      this.createNotification({
        userId: updated.citizenId,
        userRole: 'citizen',
        complaintId: updated.id,
        title: `Complaint #${updated.id} Milestone: ${updates.status}`,
        message: timelineDetails?.description || `Your ticket has transitioned to ${updates.status}.`,
        type: updates.status === 'Resolved' ? 'success' : updates.status === 'Rejected' ? 'warning' : 'info',
      });
    }

    this.saveDB();
    this.broadcast('complaint_updated', updated);
    this.logAudit({
      userId: actor.id || 'anonymous',
      userRole: actor.role,
      action: 'COMPLAINT_UPDATED',
      entityType: 'complaint',
      entityId: id,
      details: updates,
    });

    return updated;
  }

  static submitFeedback(
    complaintId: string,
    feedback: { rating: number; comment: string; citizenName: string; citizenId: string }
  ): boolean {
    const db = this.loadDB();
    const complaint = db.complaints.find((c) => c.id === complaintId);
    if (!complaint || complaint.status !== 'Resolved') return false;

    const now = new Date().toISOString();
    complaint.feedback = {
      rating: feedback.rating,
      comment: feedback.comment,
      submittedAt: now,
      citizenName: feedback.citizenName,
    };
    complaint.updatedAt = now;

    db.timeline.push({
      id: `evt-fb-${Date.now()}`,
      complaintId,
      status: 'Resolved',
      title: 'Citizen Feedback Recorded',
      description: `Citizen rated resolution ${feedback.rating}/5 stars: "${feedback.comment}".`,
      timestamp: now,
      actorName: feedback.citizenName,
      actorRole: 'citizen',
    });

    this.saveDB();
    this.broadcast('complaint_updated', complaint);
    this.logAudit({
      userId: feedback.citizenId,
      userRole: 'citizen',
      action: 'FEEDBACK_SUBMITTED',
      entityType: 'complaint',
      entityId: complaintId,
      details: { rating: feedback.rating },
    });

    return true;
  }

  // Notifications
  static getNotifications(userId?: string): NotificationRecord[] {
    const list = this.loadDB().notifications;
    if (!userId) return list;
    return list.filter((n) => n.userId === userId || n.userRole === 'officer');
  }

  static createNotification(notif: Omit<NotificationRecord, 'id' | 'createdAt' | 'isRead'>): NotificationRecord {
    const db = this.loadDB();
    const record: NotificationRecord = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    db.notifications.unshift(record);
    this.saveDB();
    this.broadcast('notification_created', record);
    return record;
  }

  static markNotificationRead(id: string) {
    const db = this.loadDB();
    const item = db.notifications.find((n) => n.id === id);
    if (item) {
      item.isRead = true;
      this.saveDB();
    }
  }

  static markAllNotificationsRead(userId?: string) {
    const db = this.loadDB();
    db.notifications.forEach((n) => {
      if (!userId || n.userId === userId || n.userRole === 'officer') {
        n.isRead = true;
      }
    });
    this.saveDB();
  }

  // Audit Logs
  static logAudit(entry: Omit<AuditLogRecord, 'id' | 'timestamp'>) {
    const db = this.loadDB();
    const record: AuditLogRecord = {
      ...entry,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
    };
    db.auditLogs.unshift(record);
    if (db.auditLogs.length > 500) db.auditLogs.pop(); // keep recent 500
    this.saveDB();
  }

  static getAuditLogs(): AuditLogRecord[] {
    return this.loadDB().auditLogs;
  }

  // Compute live analytics
  static getAnalytics() {
    const complaints = this.loadDB().complaints;
    const total = complaints.length;
    let submitted = 0;
    let underReview = 0;
    let inProgress = 0;
    let resolved = 0;
    let rejected = 0;
    let totalResolutionHours = 0;
    let resolvedWithTimes = 0;
    let totalRatings = 0;
    let ratingCount = 0;

    const categoryCounts: Record<string, number> = {};
    const priorityCounts: Record<string, number> = { Urgent: 0, High: 0, Medium: 0, Low: 0 };

    for (const c of complaints) {
      categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
      priorityCounts[c.priority] = (priorityCounts[c.priority] || 0) + 1;

      if (c.status === 'Submitted') submitted++;
      else if (c.status === 'Under Review' || c.status === 'Verified') underReview++;
      else if (c.status === 'Assigned' || c.status === 'In Progress' || c.status === 'Awaiting Verification') inProgress++;
      else if (c.status === 'Resolved') {
        resolved++;
        if (c.createdAt && c.resolvedAt) {
          const diff = (new Date(c.resolvedAt).getTime() - new Date(c.createdAt).getTime()) / (1000 * 3600);
          if (diff > 0) {
            totalResolutionHours += diff;
            resolvedWithTimes++;
          }
        }
      } else if (c.status === 'Rejected') {
        rejected++;
      }

      if (c.feedback && typeof c.feedback.rating === 'number') {
        totalRatings += c.feedback.rating;
        ratingCount++;
      }
    }

    return {
      total,
      submitted,
      underReview,
      inProgress,
      resolved,
      rejected,
      resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
      avgResolutionHours: resolvedWithTimes > 0 ? Math.round((totalResolutionHours / resolvedWithTimes) * 10) / 10 : 20.5,
      satisfactionRating: ratingCount > 0 ? Math.round((totalRatings / ratingCount) * 10) / 10 : 0,
      satisfactionCount: ratingCount,
      categoryCounts,
      priorityCounts,
    };
  }

  // Seed / Reset
  static resetToSeed() {
    const db = this.loadDB();
    db.complaints = [];
    db.timeline = [];
    db.notifications = [];
    this.saveDB();
  }
}
