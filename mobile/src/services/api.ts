// CivicAI Shared Backend Client for Mobile (React Native / Expo)
// Connects to the same Express backend and database

export interface MobileComplaint {
  id: string;
  category: string;
  description: string;
  photoUrl: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  priority: string;
  department: string;
  status: string;
  assignedWorkerName?: string;
  createdAt: string;
}

export class MobileCivicApi {
  // Configurable base URL: can point to local IP (e.g. http://192.168.1.100:3000) or Cloud URL
  private static baseUrl = 'http://localhost:3000';

  static setServerUrl(url: string) {
    this.baseUrl = url.replace(/\/$/, '');
  }

  static getServerUrl() {
    return this.baseUrl;
  }

  static async getComplaints(): Promise<MobileComplaint[]> {
    try {
      const res = await fetch(`${this.baseUrl}/api/complaints`);
      const data = await res.json();
      return data.complaints || [];
    } catch (err) {
      console.warn('Mobile API fetch error:', err);
      return [];
    }
  }

  static async createComplaint(payload: any): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  }

  static async updateStatus(id: string, status: string, actor: any, details?: any): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/complaints/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, actor, details, ...details }),
    });
    return res.json();
  }

  static async analyzeWithAI(imageBase64: string, description: string, category: string): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/gemini/analyze-complaint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, description, category }),
    });
    return res.json();
  }

  static async submitFeedback(id: string, rating: number, comment: string, citizenName: string): Promise<any> {
    const res = await fetch(`${this.baseUrl}/api/complaints/${id}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, comment, citizenName }),
    });
    return res.json();
  }
}
