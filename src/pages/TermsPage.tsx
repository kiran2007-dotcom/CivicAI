import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, AlertTriangle, ShieldCheck, CheckCircle } from 'lucide-react';

export const TermsPage: React.FC = () => {
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
          <FileText className="w-4 h-4" /> Terms of Service
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Terms and Conditions
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          Effective Date: October 26, 2026 • Version 2.0
        </p>
      </div>

      {/* Legal Notice Box */}
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div>
          <p className="font-bold">Important Notice on Emergency Services</p>
          <p className="mt-0.5 leading-relaxed text-amber-800 dark:text-amber-300/90">
            CivicAI is designated for non-emergency municipal maintenance and infrastructure complaints only. For immediate life-safety emergencies, active crimes, medical emergencies, or structural fire hazards, dial your local emergency telephone number (e.g. 911 / 112) immediately.
          </p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Agreement to Terms</h2>
          <p>
            By accessing or registering with CivicAI ("the Platform"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, do not access or use the Platform. The Platform is operated on behalf of [INSERT MUNICIPAL AUTHORITY NAME] ("the Authority").
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Permitted Civic Grievance Reporting</h2>
          <p>Users may submit reports regarding local public infrastructure and services, including but not limited to:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Road surface damage, potholes, and damaged sidewalks;</li>
            <li>Solid waste accumulation and overflowing public receptacles;</li>
            <li>Public water supply pipeline ruptures and street flooding;</li>
            <li>Defective municipal street lighting and broken luminaires;</li>
            <li>Stormwater drainage obstructions and fallen tree limbs on public rights-of-way.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. User Conduct & Prohibited Content</h2>
          <p>You agree not to use the Platform to:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Submit fraudulent, fabricated, duplicate, or vexatious complaints;</li>
            <li>Upload photographs containing explicit, harassing, defamatory, or unlawful material;</li>
            <li>Attempt to bypass access controls, escalate user privileges, or tamper with another citizen's records;</li>
            <li>Upload files containing malicious code, automated bots, or denial-of-service scripts;</li>
            <li>Harass, intimidate, or unlawfully photograph municipal workers or private individuals without consent.</li>
          </ul>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Submitting knowingly false reports to municipal authorities may constitute an offense under applicable municipal governance statutes [INSERT LOCAL CIVIC CODE CITATION].
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. User Account Integrity & Access Roles</h2>
          <p>
            Accounts are provisioned based on verified civic roles. Citizens must maintain the confidentiality of their login credentials. Staff accounts (Municipal Officers and Field Operations Personnel) are provisioned through verified administrative protocols. Any unauthorized attempt by a user to alter database user role designations will result in immediate account termination.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Service Level Agreement (SLA) Targets & Limitations</h2>
          <p>
            Estimated resolution hours and target response times displayed in CivicAI (e.g., 24 hours for potholes, 12 hours for waste collection) are administrative operational benchmarks established by municipal departments. While the Authority strives to meet target SLAs, CivicAI does not warrant guaranteed completion times for any specific complaint. Actual turnaround is subject to weather events, material availability, field worker capacity, and emergency prioritization.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">6. Intellectual Property & Evidence License</h2>
          <p>
            By uploading photographs or descriptions of public infrastructure, you grant the Authority a non-exclusive, royalty-free, perpetual license to use, display, reproduce, and transmit such evidence solely for the purposes of investigating, repairing, auditing, and documenting municipal works.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">7. Governing Law and Dispute Resolution</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of [INSERT JURISDICTION, e.g., State of Karnataka, India / State of California, United States]. Any legal proceeding arising from the use of CivicAI shall be subject to the exclusive jurisdiction of the competent courts of [INSERT MUNICIPAL COURT VENUE].
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">8. Contact Information</h2>
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
            <p><strong>Civic Operations Center:</strong> [INSERT GRIEVANCE REDRESSAL CELL NAME]</p>
            <p><strong>Support Email:</strong> [INSERT MUNICIPAL SUPPORT EMAIL, e.g., support@civicai.gov.demo]</p>
            <p><strong>Helpline:</strong> [INSERT MUNICIPAL CITIZEN HELPLINE NUMBER, e.g., 1912 / 311]</p>
          </div>
        </section>
      </div>
    </div>
  );
};
