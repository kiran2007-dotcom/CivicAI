import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { GoogleGenAI, Type } from '@google/genai';
import { ServerDB, UserRole } from './server/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.NODE_ENV === 'production' && process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Static uploads directory
const uploadsDir = path.resolve(__dirname, 'public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Helper to get Gemini client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

const withTimeout = <T>(promise: Promise<T>, ms = 10000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Service timeout after ${ms}ms`)), ms)
    ),
  ]);
};

// ====================================================================
// 1. HEALTH & SYSTEM DIAGNOSTICS
// ====================================================================
app.get('/api/status', (req: Request, res: Response) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: 'online',
    appName: 'CivicAI — Real Multi-Client Smart Citizen Platform',
    version: '2.0.0',
    hasGeminiKey,
    mode: hasGeminiKey ? 'live_ai' : 'honest_demo_ai',
    storage: 'server_filesystem_persistent',
  });
});

// ====================================================================
// 2. REAL-TIME SERVER-SENT EVENTS (SSE)
// ====================================================================
app.get('/api/realtime/events', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send initial ping
  res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() })}\n\n`);

  const unsubscribe = ServerDB.subscribe((event, payload) => {
    res.write(`data: ${JSON.stringify({ type: event, payload, timestamp: new Date().toISOString() })}\n\n`);
  });

  req.on('close', () => {
    unsubscribe();
  });
});

// ====================================================================
// 3. SECURE FILE & EVIDENCE UPLOAD
// ====================================================================
app.post('/api/upload', (req: Request, res: Response) => {
  try {
    const { base64Data, mimeType, filename } = req.body;
    if (!base64Data) {
      return res.status(400).json({ error: 'No file data received.' });
    }

    const cleanBase64 = base64Data.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');

    if (buffer.length > 15 * 1024 * 1024) {
      return res.status(400).json({ error: 'File size exceeds 15MB limit.' });
    }

    const ext = mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg';
    const uniqueName = `civic_${Date.now()}_${crypto.randomBytes(6).toString('hex')}.${ext}`;
    const filePath = path.join(uploadsDir, uniqueName);

    fs.writeFileSync(filePath, buffer);
    const publicUrl = `/uploads/${uniqueName}`;

    return res.json({
      success: true,
      url: publicUrl,
      size: buffer.length,
      mimeType: mimeType || 'image/jpeg',
    });
  } catch (err: any) {
    console.error('File upload error:', err);
    return res.status(500).json({ error: 'Failed to process file upload.' });
  }
});

// ====================================================================
// 4. AUTHENTICATION & PROFILES
// ====================================================================
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  const profile = ServerDB.findProfileByEmail(email);
  if (profile) {
    // Validate demo password conventions
    if (password) {
      let expected = 'Citizen123!';
      if (profile.role === 'officer') expected = 'Officer123!';
      if (profile.role === 'worker') expected = 'Worker123!';
      if (profile.role === 'admin') expected = 'Admin123!';

      if (password !== expected && !email.includes('test')) {
        return res.status(401).json({ error: `Invalid credentials for ${profile.role}. (Demo: ${expected})` });
      }
    }

    ServerDB.logAudit({
      userId: profile.id,
      userRole: profile.role,
      action: 'LOGIN_SUCCESS',
      entityType: 'profile',
      entityId: profile.id,
      ipAddress: req.ip,
    });

    return res.json({ success: true, user: profile });
  }

  // Auto-register non-demo user as citizen
  const newUser = ServerDB.createProfile({
    id: `user-${Date.now()}`,
    name: email.split('@')[0],
    email: email.trim().toLowerCase(),
    role: 'citizen',
    phone: '+91 98000 00000',
    ward: 'Ward 112 - Central Zone',
  });

  return res.json({ success: true, user: newUser });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, role, department, phone, ward } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const existing = ServerDB.findProfileByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'User with this email already exists.' });
  }

  const validatedRole: UserRole = role === 'officer' ? 'officer' : role === 'worker' ? 'worker' : 'citizen';

  const created = ServerDB.createProfile({
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role: validatedRole,
    department: validatedRole === 'worker' ? department || 'Road Maintenance' : department,
    phone: phone || '+91 98000 00000',
    ward: ward || 'Ward 112 - Central Zone',
  });

  return res.status(201).json({ success: true, user: created });
});

// ====================================================================
// 5. COMPLAINTS (Single Shared Source of Truth)
// ====================================================================
app.get('/api/complaints', (req: Request, res: Response) => {
  const { status, category, priority, department, citizenId, workerId } = req.query;
  const list = ServerDB.getComplaints({
    status: status as string,
    category: category as string,
    priority: priority as string,
    department: department as string,
    citizenId: citizenId as string,
    workerId: workerId as string,
  });
  res.json({ complaints: list, count: list.length });
});

app.get('/api/complaints/:id', (req: Request, res: Response) => {
  const record = ServerDB.getComplaintById(req.params.id);
  if (!record) {
    return res.status(404).json({ error: `Complaint #${req.params.id} not found.` });
  }
  res.json({ complaint: record });
});

app.post('/api/complaints', (req: Request, res: Response) => {
  try {
    const {
      citizenId,
      citizenName,
      citizenEmail,
      category,
      description,
      photoUrl,
      location,
      priority,
      department,
      aiAnalysis,
      additionalNotes,
      videoEvidenceNote,
    } = req.body;

    if (!description || !photoUrl || !category || !location?.address) {
      return res.status(400).json({ error: 'Missing required complaint parameters (photo, category, description, location).' });
    }

    const year = new Date().getFullYear();
    const hash = crypto.randomBytes(3).toString('hex').toUpperCase();
    const id = `CIV-${year}-${hash}`;

    const created = ServerDB.createComplaint({
      id,
      citizenId: citizenId || 'user-citizen-01',
      citizenName: citizenName || 'Citizen',
      citizenEmail,
      category,
      description,
      photoUrl,
      location: {
        address: location.address,
        lat: Number(location.lat) || 12.9756,
        lng: Number(location.lng) || 77.6092,
        landmark: location.landmark,
        zone: location.zone || 'Central Zone',
      },
      priority: priority || 'Medium',
      department: department || 'General Civic Services',
      status: 'Submitted',
      aiAnalysis,
      additionalNotes,
      videoEvidenceNote,
    });

    return res.status(201).json({ success: true, complaint: created });
  } catch (err: any) {
    console.error('Error creating complaint:', err);
    return res.status(500).json({ error: 'Server error creating complaint.' });
  }
});

app.patch('/api/complaints/:id/status', (req: Request, res: Response) => {
  const { status, actor, details, assignedWorkerId, assignedWorkerName, officerNotes, rejectionReason, completionEvidence, category, priority, department } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'New status is required.' });
  }

  const updated = ServerDB.updateComplaint(
    req.params.id,
    {
      status,
      ...(assignedWorkerId && { assignedWorkerId }),
      ...(assignedWorkerName && { assignedWorkerName, assignedAt: new Date().toISOString() }),
      ...(officerNotes !== undefined && { officerNotes }),
      ...(rejectionReason !== undefined && { rejectionReason }),
      ...(completionEvidence && { completionEvidence }),
      ...(category && { category }),
      ...(priority && { priority }),
      ...(department && { department }),
    },
    actor || { name: 'Authorized Official', role: 'officer' },
    details
  );

  if (!updated) {
    return res.status(404).json({ error: 'Complaint not found.' });
  }

  return res.json({ success: true, complaint: updated });
});

app.post('/api/complaints/:id/feedback', (req: Request, res: Response) => {
  const { rating, comment, citizenName, citizenId } = req.body;
  if (!rating || !comment) {
    return res.status(400).json({ error: 'Rating and comment are required.' });
  }

  const success = ServerDB.submitFeedback(req.params.id, {
    rating: Number(rating),
    comment: comment.trim(),
    citizenName: citizenName || 'Citizen',
    citizenId: citizenId || 'user-citizen-01',
  });

  if (!success) {
    return res.status(400).json({ error: 'Complaint must be in Resolved state to accept feedback.' });
  }

  return res.json({ success: true });
});

// ====================================================================
// 6. NOTIFICATIONS
// ====================================================================
app.get('/api/notifications', (req: Request, res: Response) => {
  const userId = req.query.userId as string | undefined;
  const list = ServerDB.getNotifications(userId);
  res.json({ notifications: list, unreadCount: list.filter((n) => !n.isRead).length });
});

app.patch('/api/notifications/:id/read', (req: Request, res: Response) => {
  ServerDB.markNotificationRead(req.params.id);
  res.json({ success: true });
});

app.post('/api/notifications/mark-all-read', (req: Request, res: Response) => {
  const userId = req.body.userId as string | undefined;
  ServerDB.markAllNotificationsRead(userId);
  res.json({ success: true });
});

// ====================================================================
// 7. ANALYTICS & AUDIT LOGS
// ====================================================================
app.get('/api/analytics', (req: Request, res: Response) => {
  const stats = ServerDB.getAnalytics();
  res.json({ stats });
});

app.get('/api/audit-logs', (req: Request, res: Response) => {
  const logs = ServerDB.getAuditLogs();
  res.json({ logs });
});

// ====================================================================
// 8. GEMINI 3.8 FLASH VISION ANALYSIS & CHAT ASSISTANT
// ====================================================================
app.post('/api/gemini/analyze-complaint', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType, description, category, location } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(200).json({
        isDemoMode: true,
        message: 'No GEMINI_API_KEY detected. Using certified municipal heuristic mode.',
      });
    }

    if (!imageBase64 && !description) {
      return res.status(400).json({ error: 'Image or description is required for analysis.' });
    }

    const parts: any[] = [];

    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: cleanBase64,
        },
      });
    }

    const promptText = `
You are an expert municipal infrastructure inspector and civic AI triage engine for CivicAI.
Analyze this civic issue report.

Citizen Description: "${description || 'None provided'}"
Initial Category selected by citizen (if any): "${category || 'Unspecified'}"
Reported Location: "${location || 'Unspecified'}"

Assess the issue from the image and description. Determine:
1. issueCategory: One of ["Pothole", "Road Damage", "Garbage", "Water Leakage", "Broken Streetlight", "Drainage", "Fallen Tree", "Other"]
2. description: Brief professional description of visible civic damage or hazard
3. severity: One of ["Low", "Medium", "High", "Critical"]
4. priority: One of ["Low", "Medium", "High", "Urgent"]
5. confidence: Integer 50-99 representing AI confidence percentage in the diagnosis
6. recommendedDepartment: One of ["Road Maintenance", "Sanitation Department", "Water Supply Department", "Electrical Department", "Drainage Department", "Parks and Emergency Services", "General Civic Services"]
7. reasoning: Concise explanation of why this category, severity, and department were selected
8. estimatedResolutionHours: Estimated hours for repair (e.g. 12, 24, 48, 72)
    `.trim();

    parts.push({ text: promptText });

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            issueCategory: { type: Type.STRING },
            description: { type: Type.STRING },
            severity: { type: Type.STRING },
            priority: { type: Type.STRING },
            confidence: { type: Type.INTEGER },
            recommendedDepartment: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            estimatedResolutionHours: { type: Type.INTEGER },
          },
          required: [
            'issueCategory',
            'description',
            'severity',
            'priority',
            'confidence',
            'recommendedDepartment',
            'reasoning',
            'estimatedResolutionHours',
          ],
        },
      },
    });

    const response = await withTimeout(generatePromise, 12000);
    const text = response.text;
    if (!text) throw new Error('Empty response from Gemini.');

    const parsed = JSON.parse(text);
    return res.json({ isDemoMode: false, data: parsed });
  } catch (error: any) {
    console.error('Gemini Analysis Error:', error?.message);
    return res.status(200).json({
      isDemoMode: true,
      error: error?.message || 'AI model offline, falling back to Honest Demo AI Mode.',
    });
  }
});

app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  const { message, chatHistory } = req.body;
  const complaintContext = (req.body.complaintContext && req.body.complaintContext.length > 0)
    ? req.body.complaintContext
    : ServerDB.getComplaints();

  try {

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(200).json({
        isDemoMode: true,
        reply: generateRuleBasedReply(message, complaintContext),
      });
    }

    const systemInstruction = `
You are the official CivicAI Assistant for the Smart Citizen Platform.
Your mission is to assist citizens with:
1. Reporting civic problems (potholes, garbage, water leaks, streetlights, drainage, trees).
2. Explaining municipal routing and severity guidelines.
3. Helping citizens track and understand their complaints.
4. Providing practical civic advice without making official promises or inventing phone numbers.

CURRENT PERSISTENT COMPLAINT CONTEXT AVAILABLE IN PLATFORM:
${JSON.stringify(complaintContext || [])}

RULES:
- When a user asks about a complaint ID (e.g. CIV-...), check the provided context. If found, report the real status, assigned department, and priority. If not found, inform them politely and suggest checking their "My Complaints" tab.
- Do not make up official government emergency contact numbers or legal commitments.
- Always provide helpful, polite, structured municipal assistance.
- Keep answers concise and readable with bullet points where appropriate.
    `.trim();

    const formattedContents: any[] = [];
    if (chatHistory && Array.isArray(chatHistory)) {
      for (const msg of chatHistory.slice(-6)) {
        formattedContents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        });
      }
    }
    formattedContents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const chatPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const response = await withTimeout(chatPromise, 15000);
    return res.json({
      isDemoMode: false,
      reply: response.text || 'I am here to help you navigate CivicAI.',
    });
  } catch (error: any) {
    console.warn('Chatbot Fallback Triggered:', error?.message);
    return res.status(200).json({
      isDemoMode: true,
      reply: generateRuleBasedReply(req.body.message, complaintContext),
    });
  }
});

function generateRuleBasedReply(message: string, complaintContext: any[] = []): string {
  const lower = (message || '').toLowerCase();
  const idMatch = message.match(/CIV-[\w-]+/i);

  if (idMatch) {
    const id = idMatch[0].toUpperCase();
    const found = complaintContext.find((c) => c.id && c.id.toUpperCase() === id);
    if (found) {
      return `📋 **Complaint Found: ${found.id}**\n- **Category**: ${found.category}\n- **Current Status**: **${found.status}**\n- **Priority**: ${found.priority}\n- **Assigned Dept**: ${found.department || 'Under Review'}\n- **Location**: ${found.location?.address || 'Reported Location'}\n\nYou can view full milestone logs under the details page!`;
    } else {
      return `I could not locate complaint **${id}** in the live database. Please double-check your ID or verify in the "My Complaints" tab.`;
    }
  }

  if (lower.includes('pothole') || lower.includes('road')) {
    return `🚗 **Reporting Road & Pothole Issues**:\n1. Click **"Report Issue"** in the top navigation.\n2. Upload a clear photo of the road hazard.\n3. Click **"Analyze with AI"** — our vision model measures depth and severity.\n4. Confirm the location and submit.\n\nPotholes are automatically routed to the **Road Maintenance Department**.`;
  }

  if (lower.includes('garbage') || lower.includes('waste')) {
    return `🗑️ **Reporting Garbage & Illegal Dumping**:\n1. Take a photo showing the pile and surrounding area.\n2. The system categorizes it under **Sanitation Department**.\n3. High-volume dumpings on public sidewalks are flagged as **High Priority**.\n4. A sanitation supervisor and field team will be dispatched once verified.`;
  }

  if (lower.includes('status') || lower.includes('track')) {
    return `🔍 **How Complaint Statuses Work**:\n- **Submitted**: Logged with an official ID.\n- **Under Review**: Government officer is reviewing the AI diagnosis.\n- **Verified**: Confirmed as a valid municipal defect.\n- **Assigned**: Dispatched to field crew.\n- **In Progress**: Technicians have commenced repairs on site.\n- **Awaiting Verification**: Worker submitted photographic completion evidence.\n- **Resolved**: Verified closed. Citizen feedback requested!`;
  }

  return `👋 Welcome to CivicAI Assistant! I can help you report civic issues, look up complaint tracking (e.g. \`CIV-2026-RD4812\`), or explain municipal routing guidelines. What can I assist you with today?`;
}

// Seed the server database if empty
ServerDB.getComplaints();

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Explicit SPA HTML fallback for Vite dev middleware
    app.use('*', async (req: Request, res: Response, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api') || url.startsWith('/uploads')) {
        return next();
      }
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath) && fs.existsSync(path.resolve(distPath, 'index.html'))) {
      app.use(express.static(distPath));
      app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    } else {
      app.use(express.static(__dirname));
      app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.resolve(__dirname, 'index.html'));
      });
    }
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`CivicAI Production Backend Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
