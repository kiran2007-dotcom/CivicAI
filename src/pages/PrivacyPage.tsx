import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, FileText, ArrowLeft, Mail, AlertTriangle } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-cyan-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-cyan-400">
          <Shield className="w-4 h-4" /> Legal & Governance
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          Effective Date: October 26, 2026 • Last Reviewed: October 2026
        </p>
      </div>

      {/* Legal Disclaimer Box */}
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div>
          <p className="font-bold">Notice to Deploying Authority</p>
          <p className="mt-0.5 leading-relaxed text-amber-800 dark:text-amber-300/90">
            This Privacy Policy describes the technical data collection and processing architecture of CivicAI. Prior to formal public launch, deploying municipalities or civic authorities must replace bracketed placeholders with official jurisdiction information and conduct a legal review with qualified counsel.
          </p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Scope and Application</h2>
          <p>
            CivicAI is an intelligent municipal grievance intake, automated triage, and field operations platform. This policy governs the processing of personal data provided by residents, municipal officers, administrative supervisors, and field maintenance personnel when accessing the CivicAI web application, mobile applications, or associated application programming interfaces (APIs).
          </p>
          <p>
            <strong>Operating Entity:</strong> [INSERT MUNICIPAL CORPORATION OR DEPLOYING ENTITY NAME, e.g., Greater Bengaluru Municipal Corporation / City Department of Information Technology].
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Categories of Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Account & Profile Information:</strong> When registering, we collect your name, email address, optional contact telephone number, user role (citizen, officer, or field worker), and assigned administrative ward or jurisdiction.
            </li>
            <li>
              <strong>Complaint & Evidence Data:</strong> When submitting an infrastructure grievance, we collect defect descriptions, issue categorization, uploaded photographic evidence, completion proof images, and timestamps.
            </li>
            <li>
              <strong>Geographic & Location Data:</strong> Precise latitude and longitude coordinates obtained via your device's browser GPS with explicit permission, or street addresses and civic landmarks manually entered by you.
            </li>
            <li>
              <strong>Feedback & Quality Records:</strong> 1 to 5 star ratings and qualitative resolution feedback provided following ticket completion.
            </li>
            <li>
              <strong>Technical & Operational Logs:</strong> IP address, browser user-agent, session identifiers, and immutable audit logs of status transitions for administrative accountability.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Purposes of Processing</h2>
          <p>We process your data exclusively for lawful civic administration and operational maintenance purposes:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Directing reports to the appropriate department (Roads, Sanitation, Water Supply, Electrical).</li>
            <li>Assisting municipal officers in auditing complaint validity and dispatching field crews.</li>
            <li>Enabling field workers to locate reported defects and record photographic proof of rectification.</li>
            <li>Delivering real-time status updates and notifications to citizens regarding ticket progress.</li>
            <li>Compiling aggregated, non-personally identifiable operational performance metrics and SLA statistics.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Artificial Intelligence & Vision Processing</h2>
          <p>
            CivicAI integrates server-side multimodal vision models (e.g., Google Gemini API) to evaluate photographic defect evidence for category confirmation, severity estimation, and automated department routing recommendations.
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Image payloads submitted for diagnosis are transmitted securely via encrypted server-side proxy routes.</li>
            <li>API keys and authentication credentials remain strictly on the backend server and are never exposed in client bundles.</li>
            <li>Photographs are evaluated for structural defect characteristics (e.g., asphalt crater depth, pipe puncture); images should not include identifiable human faces or personal documents.</li>
            <li>AI recommendations serve as assistive triage tools and do not substitute human supervisory oversight by authorized officers.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Access Control & Row Level Security (RLS)</h2>
          <p>
            CivicAI implements rigorous database access segregation using PostgreSQL Row Level Security (RLS):
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Citizens:</strong> Can only view and edit their own private account data and complaints they have authored.</li>
            <li><strong>Field Workers:</strong> Can only access operational tasks assigned directly to their technician profile or department.</li>
            <li><strong>Municipal Officers:</strong> Can view grievances within their authorized municipal zone or department.</li>
            <li>Privileged actions (such as status updates and technician reassignment) are validated server-side.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">6. Data Retention & Deletion</h2>
          <p>
            Grievance records are maintained in municipal archives in accordance with statutory public records retention policies [e.g., 36 months following closure]. Users may submit requests to inspect, correct, or request deletion of personal identifiers by writing to our designated privacy contact.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">7. Privacy Office & Inquiries</h2>
          <p>For questions regarding this policy or data processing practices, please contact:</p>
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
            <p><strong>Municipal Data Protection Officer:</strong> [INSERT DPO NAME / OFFICE]</p>
            <p><strong>Department:</strong> [INSERT DEPARTMENT OF CIVIC TECH & E-GOVERNANCE]</p>
            <p><strong>Official Contact Email:</strong> [INSERT PRIVACY CONTACT EMAIL, e.g. privacy@civicai.gov.demo]</p>
            <p><strong>Physical Address:</strong> [INSERT MUNICIPAL HEADQUARTERS ADDRESS]</p>
          </div>
        </section>
      </div>
    </div>
  );
};
