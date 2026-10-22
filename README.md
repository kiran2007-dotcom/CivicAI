# CivicAI — AI-Powered Smart Citizen Platform
> **Tagline**: *Smarter Cities. Better Lives.*  
> **Hackathon Track**: Smart Cities & Civic Tech / Open Innovation

CivicAI is a full-stack, multimodal complaint management platform that connects **Citizens**, **Government Officers**, and **Field Technicians** to automate civic issue diagnosis, departmental dispatch, and proof-verified resolution.

---

## 🏛️ System Architecture

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, React Router 7, Lucide Icons
- **Backend / API**: Express 4 running on Node.js via `server.ts` with `vite.middlewares` mounted in development
- **AI Triage Engine**: Multimodal Gemini 3.8 Flash (`@google/genai` TypeScript SDK) with structured JSON schemas
- **Fallback Simulation Engine**: Honest Demo AI Mode featuring pre-bundled municipal defect assets (Pothole, Garbage, Water Leak, Broken Streetlight)
- **Data Persistence**: Single-source-of-truth persistent storage with live cross-dashboard synchronization, collision-resistant ID generator (`CIV-2026-XXXX`), and factory reset capabilities.

---

## 👥 Demo Personas & Credentials

| Role | Email | Password | Persona & Responsibilities |
| :--- | :--- | :--- | :--- |
| **Citizen** | `citizen@civicai.demo` | `Citizen123!` | Kiran Manjunath • Report issues, track status, rate resolutions |
| **Officer** | `officer@civicai.demo` | `Officer123!` | Inspector Rajesh Verma • Triage queue, override departments, dispatch crew |
| **Field Worker** | `worker@civicai.demo` | `Worker123!` | Ramesh Gowda • Arrive on-site, upload photographic proof, submit logs |

*Note: For instant evaluation, a quick-switcher bar is available in the top navigation.*

---

## 🔄 End-to-End Core Workflow

1. **Citizen reports issue**: Photo uploaded with GPS/manual address in Bengaluru.
2. **AI analyzes photo & description**: Multimodal vision determines defect category (e.g., Pothole), severity (High), priority (High), and estimated resolution hours (24h).
3. **Department is recommended**: Automatically routed to *Road Maintenance Bureau*.
4. **Complaint ID generated**: Collision-resistant identifier (e.g., `CIV-2026-RD4812`) created and persisted.
5. **Officer reviews complaint**: Government officer verifies AI recommendation, adds crew instructions, and assigns field technician.
6. **Worker executes task**: Worker accepts task, marks work commenced, and uploads photographic completion proof with materials log.
7. **Complaint resolved**: Officer audits proof and marks ticket Resolved.
8. **Citizen feedback**: Citizen receives milestone notification and submits 1 to 5 star rating with feedback.

---

## 🚀 How to Run & Deploy

### Local Development
```bash
# Install dependencies
npm install

# Start full-stack dev server (Express + Vite on port 3000)
npm run dev
```

### Production Build
```bash
# Build frontend assets
npm run build

# Start production server
npm run start
```

### Environment Variables (`.env`)
```env
# Optional: Injected automatically by Google AI Studio
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
PORT=3000
```
*If `GEMINI_API_KEY` is not present, CivicAI automatically operates in **Honest Demo AI Mode** with deterministic sample scenarios.*

---

## 🧪 Verification & Acceptance Criteria Results

- [x] **Test 1: Citizen Login** — Verified using `citizen@civicai.demo` / `Citizen123!`.
- [x] **Test 2: Sample Image Upload & AI Analysis** — Verified with live Gemini 3.8 Flash API and Honest Demo Mode.
- [x] **Test 3: Complaint Submission & Unique ID** — Verified collision-resistant ID generation (`CIV-2026-XXXX`).
- [x] **Test 4: Data Persistence** — Verified persistence across browser reloads via `StorageService`.
- [x] **Test 5: Officer Queue Visibility** — Verified that officer dashboard reflects the exact complaint.
- [x] **Test 6: Worker Assignment** — Verified dispatch workflow with workload indicators.
- [x] **Test 7: Worker Task Dashboard** — Verified that workers only see their assigned work orders.
- [x] **Test 8: Completion Evidence Upload** — Verified before-and-after photographic proof submission.
- [x] **Test 9: Citizen Timeline & Notifications** — Verified stage-by-stage timeline audit trail.
- [x] **Test 10: Citizen Feedback Submission** — Verified 1-5 star rating and comment persistence.
- [x] **Test 11: Real-Time Dynamic Analytics** — Verified KPI cards and category charts update from live records.
- [x] **Test 12: Role-Based Protection** — Verified role guards prevent unauthorized access.
- [x] **Test 13: Failure & Draft Preservation** — Form safely preserves inputs in draft storage.
- [x] **Test 14: Geospatial Map** — Verified plotting of Bengaluru civic coordinates.
- [x] **Test 15: Clean Compilation** — `tsc --noEmit` and `vite build` completed with 0 errors.
