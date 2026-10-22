import { Complaint, ComplaintStatus, IssueCategory, NotificationItem, PriorityLevel, User } from '../types';

export class CivicApiClient {
  private static baseUrl = '';

  static setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  // Complaints
  static async getComplaints(filter?: {
    status?: string;
    category?: string;
    priority?: string;
    department?: string;
    citizenId?: string;
    workerId?: string;
  }): Promise<Complaint[]> {
    try {
      const params = new URLSearchParams();
      if (filter?.status && filter.status !== 'ALL') params.set('status', filter.status);
      if (filter?.category && filter.category !== 'ALL') params.set('category', filter.category);
      if (filter?.priority && filter.priority !== 'ALL') params.set('priority', filter.priority);
      if (filter?.department && filter.department !== 'ALL') params.set('department', filter.department);
      if (filter?.citizenId) params.set('citizenId', filter.citizenId);
      if (filter?.workerId) params.set('workerId', filter.workerId);

      const res = await fetch(`${this.baseUrl}/api/complaints?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.complaints || [];
    } catch (err) {
      console.warn('API getComplaints failed, falling back to local cache:', err);
      return [];
    }
  }

  static async getComplaintById(id: string): Promise<Complaint | null> {
    try {
      const res = await fetch(`${this.baseUrl}/api/complaints/${encodeURIComponent(id)}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.complaint || null;
    } catch (err) {
      console.warn('API getComplaintById failed:', err);
      return null;
    }
  }

  static async createComplaint(
    payload: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>
  ): Promise<Complaint | null> {
    try {
      const res = await fetch(`${this.baseUrl}/api/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.complaint;
    } catch (err) {
      console.error('API createComplaint error:', err);
      return null;
    }
  }

  static async updateComplaintStatus(
    id: string,
    status: ComplaintStatus,
    actor: { name: string; role: any },
    details?: any
  ): Promise<Complaint | null> {
    try {
      const res = await fetch(`${this.baseUrl}/api/complaints/${encodeURIComponent(id)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          actor,
          details,
          ...details,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.complaint;
    } catch (err) {
      console.error('API updateComplaintStatus error:', err);
      return null;
    }
  }

  static async submitFeedback(
    complaintId: string,
    rating: number,
    comment: string,
    citizenName: string,
    citizenId: string
  ): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/api/complaints/${encodeURIComponent(complaintId)}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment, citizenName, citizenId }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  // Upload file to server-side static storage
  static async uploadEvidence(base64Data: string, mimeType: string): Promise<string | null> {
    try {
      const res = await fetch(`${this.baseUrl}/api/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Data, mimeType }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.url;
    } catch (err) {
      console.warn('API uploadEvidence failed:', err);
      return null;
    }
  }

  // Notifications
  static async getNotifications(userId?: string): Promise<NotificationItem[]> {
    try {
      const params = userId ? `?userId=${encodeURIComponent(userId)}` : '';
      const res = await fetch(`${this.baseUrl}/api/notifications${params}`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.notifications || [];
    } catch {
      return [];
    }
  }

  static async markNotificationRead(id: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/api/notifications/${encodeURIComponent(id)}/read`, {
        method: 'PATCH',
      });
    } catch {}
  }

  static async markAllNotificationsRead(userId?: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/api/notifications/mark-all-read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
    } catch {}
  }

  // Auth
  static async login(email: string, password?: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const res = await fetch(`${this.baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Authentication failed' };
      }
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  }

  static async register(user: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const res = await fetch(`${this.baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  }

  // SSE Real-Time Event Subscription
  static subscribeToEvents(onEvent: (event: string, data: any) => void): () => void {
    if (typeof window === 'undefined' || !window.EventSource) {
      return () => {};
    }

    try {
      const es = new EventSource(`${this.baseUrl}/api/realtime/events`);
      es.onmessage = (e) => {
        try {
          const parsed = JSON.parse(e.data);
          onEvent(parsed.type, parsed.payload);
        } catch {}
      };
      es.onerror = () => {
        // EventSource will automatically reconnect
      };
      return () => {
        es.close();
      };
    } catch {
      return () => {};
    }
  }
}
