import { AIAnalysisResult, IssueCategory, PriorityLevel, SeverityLevel } from '../types';
import { SAMPLE_SCENARIOS } from '../data/sampleAssets';

export interface AnalysisProgressCallback {
  (stage: string, percent: number): void;
}

export class AIService {
  // Check backend Gemini status
  static async checkSystemStatus(): Promise<{ hasGeminiKey: boolean; mode: string }> {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        return {
          hasGeminiKey: Boolean(data.hasGeminiKey),
          mode: data.mode || 'honest_demo_ai',
        };
      }
    } catch (e) {
      console.warn('Backend status check unreachable, defaulting to honest demo mode');
    }
    return { hasGeminiKey: false, mode: 'honest_demo_ai' };
  }

  // Analyze complaint with genuine Gemini 3.8 Flash API or Honest Demo Mode
  static async analyzeComplaint(
    params: {
      imageBase64?: string;
      mimeType?: string;
      description?: string;
      category?: string;
      location?: string;
      forceDemoMode?: boolean;
    },
    onProgress?: AnalysisProgressCallback
  ): Promise<AIAnalysisResult> {
    const { imageBase64, mimeType, description, category, location, forceDemoMode } = params;

    onProgress?.('Preparing image & location telemetry for AI triage...', 15);
    await new Promise((r) => setTimeout(r, 400));

    // If explicit demo mode requested or no server response
    if (forceDemoMode) {
      return this.simulateHonestDemoAnalysis(category, description, onProgress);
    }

    try {
      onProgress?.('Sending visual feed to Gemini 3.8 Flash Vision model...', 45);

      const response = await fetch('/api/gemini/analyze-complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          mimeType,
          description,
          category,
          location,
        }),
      });

      onProgress?.('Synthesizing severity score & municipal routing matrix...', 80);
      await new Promise((r) => setTimeout(r, 300));

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const result = await response.json();

      if (result.isDemoMode || !result.data) {
        // Fall back gracefully to honest demo analysis with explicit notice
        return this.simulateHonestDemoAnalysis(category, description, onProgress);
      }

      const d = result.data;

      // Validate schema
      const validated: AIAnalysisResult = {
        issueCategory: (d.issueCategory as IssueCategory) || 'Other',
        description: d.description || 'Civic infrastructure defect detected.',
        severity: (d.severity as SeverityLevel) || 'Medium',
        priority: (d.priority as PriorityLevel) || 'Medium',
        confidence: typeof d.confidence === 'number' ? Math.min(99, Math.max(50, d.confidence)) : 90,
        recommendedDepartment: d.recommendedDepartment || 'General Civic Services',
        reasoning: d.reasoning || 'Automated classification based on visual attributes.',
        estimatedResolutionHours: d.estimatedResolutionHours || 24,
        isDemoMode: false,
        analyzedAt: new Date().toISOString(),
      };

      onProgress?.('Analysis complete!', 100);
      return validated;
    } catch (err) {
      console.warn('Real AI vision analysis unavailable, falling back to Honest Demo AI Mode:', err);
      return this.simulateHonestDemoAnalysis(category, description, onProgress);
    }
  }

  // Honest Demo AI simulation: clearly labelled as simulated
  private static async simulateHonestDemoAnalysis(
    selectedCategory?: string,
    description?: string,
    onProgress?: AnalysisProgressCallback
  ): Promise<AIAnalysisResult> {
    onProgress?.('Running local municipal rule-based triage heuristic...', 60);
    await new Promise((r) => setTimeout(r, 600));

    onProgress?.('Applying city safety grading & SLA calculation...', 90);
    await new Promise((r) => setTimeout(r, 400));

    // Match with one of the sample scenarios if possible
    const match = SAMPLE_SCENARIOS.find(
      (s) => s.category.toLowerCase() === (selectedCategory || '').toLowerCase()
    );

    if (match) {
      const res = match.aiResult;
      onProgress?.('Demo AI Analysis ready!', 100);
      return {
        ...res,
        isDemoMode: true,
        analyzedAt: new Date().toISOString(),
      };
    }

    // Generic fallback for custom input in demo mode
    onProgress?.('Demo AI Analysis ready!', 100);
    return {
      issueCategory: (selectedCategory as IssueCategory) || 'Pothole',
      description: description || 'Visual civic defect detected on public property.',
      severity: 'High',
      priority: 'High',
      confidence: 88,
      recommendedDepartment: 'Road Maintenance',
      reasoning: 'Demonstration analysis: Defect requires municipal crew inspection to ensure civic safety.',
      estimatedResolutionHours: 24,
      isDemoMode: true,
      analyzedAt: new Date().toISOString(),
    };
  }

  // Chat with CivicAI Assistant
  static async sendChatMessage(
    message: string,
    complaintContext: any[],
    chatHistory: { role: 'user' | 'assistant'; content: string }[]
  ): Promise<{ reply: string; isDemoMode: boolean }> {
    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          complaintContext,
          chatHistory,
        }),
      });

      if (!response.ok) {
        throw new Error('Chat API returned non-OK status');
      }

      const data = await response.json();
      return {
        reply: data.reply || 'I am CivicAI Assistant. How may I assist you with civic services today?',
        isDemoMode: Boolean(data.isDemoMode),
      };
    } catch (err) {
      console.warn('Server chat error, using offline assistant:', err);
      return {
        reply: `Hello! I am CivicAI Assistant. You can report civic problems, track complaints by ID (e.g. CIV-2026-RD4812), or view municipal department assignments directly from your dashboard.`,
        isDemoMode: true,
      };
    }
  }
}
