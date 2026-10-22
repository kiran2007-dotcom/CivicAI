import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  Building2,
  HardHat,
  Star,
  Sparkles,
  ArrowLeft,
  Calendar,
  Share2,
  CheckCircle,
  FileText,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintsContext';
import { useAuth } from '../context/AuthContext';

export const ComplaintDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getComplaint, submitFeedback } = useComplaints();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const complaint = getComplaint(id || '');

  // Feedback Form State
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  if (!complaint) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Complaint Not Found</h2>
        <p className="text-sm text-slate-400">
          The requested complaint identifier <strong className="text-white">"{id}"</strong> does not exist in the municipal registry.
        </p>
        <Link
          to="/citizen/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setFeedbackError('Please share a short comment about the resolution.');
      return;
    }
    const success = submitFeedback(complaint.id, rating, comment.trim());
    if (success) {
      setFeedbackSubmitted(true);
      setFeedbackError(null);
    } else {
      setFeedbackError('Failed to submit feedback.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-900/60 text-blue-300 border-blue-700/60';
      case 'Under Review':
      case 'Verified':
        return 'bg-indigo-900/60 text-indigo-300 border-indigo-700/60';
      case 'Assigned':
      case 'In Progress':
        return 'bg-amber-900/60 text-amber-300 border-amber-700/60';
      case 'Awaiting Verification':
        return 'bg-purple-900/60 text-purple-300 border-purple-700/60';
      case 'Resolved':
        return 'bg-emerald-900/60 text-emerald-300 border-emerald-700/60';
      case 'Rejected':
        return 'bg-rose-900/60 text-rose-300 border-rose-700/60';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-rose-950 text-rose-300 border-rose-800/80 font-bold';
      case 'High':
        return 'bg-orange-950 text-orange-300 border-orange-800/80 font-semibold';
      case 'Medium':
        return 'bg-yellow-950 text-yellow-300 border-yellow-800/80';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex items-center gap-2">
          {currentUser.role === 'officer' && (
            <Link
              to="/officer/management"
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5" /> Manage Ticket
            </Link>
          )}

          {currentUser.role === 'worker' && complaint.assignedWorkerId === currentUser.id && (
            <Link
              to={`/worker/resolve/${complaint.id}`}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5"
            >
              <HardHat className="w-3.5 h-3.5" /> Work on Task
            </Link>
          )}
        </div>
      </div>

      {/* Main Ticket Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-sm sm:text-base font-extrabold text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-lg border border-cyan-800/60">
                {complaint.id}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                  complaint.status
                )}`}
              >
                {complaint.status}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs border ${getPriorityBadge(
                  complaint.priority
                )}`}
              >
                {complaint.priority} Priority
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              {complaint.category}: {complaint.description}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-500" /> {complaint.location.address}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-500" />
                Logged on {new Date(complaint.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 min-w-[220px] text-xs space-y-2 shrink-0">
            <div className="flex justify-between">
              <span className="text-slate-400">Department:</span>
              <span className="font-bold text-cyan-300">{complaint.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Reported By:</span>
              <span className="font-medium text-white">{complaint.citizenName}</span>
            </div>
            {complaint.assignedWorkerName && (
              <div className="flex justify-between pt-1 border-t border-slate-800">
                <span className="text-slate-400">Assigned Tech:</span>
                <span className="font-bold text-amber-300">{complaint.assignedWorkerName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content Columns: Left (Evidence & Details) - Right (Timeline & Feedback) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
          {/* Left Column: Visual Evidence & AI Breakdown */}
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-cyan-400" />
              <span>Photographic Evidence</span>
            </h2>

            {/* Before / Initial Evidence */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 block">
                Initial Citizen Photo Evidence
              </span>
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 max-h-72">
                <img
                  src={complaint.photoUrl}
                  alt={complaint.category}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* After / Completion Evidence if available */}
            {complaint.completionEvidence && (
              <div className="space-y-2 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> Field Work Completion Evidence
                  </span>
                  <span className="text-[10px] text-slate-400">
                    By {complaint.completionEvidence.workerName}
                  </span>
                </div>
                {complaint.completionEvidence.photoUrl && (
                  <div className="rounded-xl overflow-hidden border border-emerald-800/60 max-h-60 mt-2">
                    <img
                      src={complaint.completionEvidence.photoUrl}
                      alt="Completion Proof"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <p className="text-xs text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-emerald-800/40 mt-2">
                  <strong className="text-emerald-400">Technician Note:</strong>{' '}
                  {complaint.completionEvidence.notes}
                </p>
              </div>
            )}

            {/* AI Diagnosis Card */}
            {complaint.aiAnalysis && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>AI Vision Triage Record</span>
                  </span>
                  <span className="text-[10px] text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800/60">
                    {complaint.aiAnalysis.confidence}% Diagnostic Confidence
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500">Evaluated Severity:</span>
                    <p className="font-bold text-slate-200 mt-0.5">{complaint.aiAnalysis.severity}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Target Resolution:</span>
                    <p className="font-bold text-slate-200 mt-0.5">
                      ~{complaint.aiAnalysis.estimatedResolutionHours} Hours
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <strong className="text-cyan-400">Analysis Rationale:</strong>{' '}
                  {complaint.aiAnalysis.reasoning}
                </p>
              </div>
            )}

            {/* Geographic Coordinates Pinpoint */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs space-y-1.5">
              <span className="font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-cyan-400" /> Municipal Geotag Information
              </span>
              <p className="text-slate-400">{complaint.location.address}</p>
              <p className="text-slate-500 font-mono text-[11px]">
                Latitude: {complaint.location.lat} • Longitude: {complaint.location.lng}
              </p>
            </div>
          </div>

          {/* Right Column: Resolution Timeline & Feedback */}
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              <span>Resolution Progress Timeline</span>
            </h2>

            {/* Timeline Events */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {complaint.timeline.map((evt, idx) => (
                <div key={evt.id || idx} className="relative group">
                  <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-cyan-500 ring-4 ring-slate-900 shrink-0" />
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-1 hover:border-slate-700 transition">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-white">{evt.title}</span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{evt.description}</p>
                    <div className="pt-1 flex items-center gap-2 text-[10px] text-slate-500">
                      <span>By: {evt.actorName}</span>
                      <span>•</span>
                      <span className="uppercase text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                        {evt.actorRole}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Citizen Feedback Section */}
            {complaint.status === 'Resolved' && (
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Citizen Satisfaction Verification</span>
                </h3>

                {complaint.feedback ? (
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= complaint.feedback!.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-700'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-xs font-bold text-white">
                        {complaint.feedback.rating} / 5 Stars
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 italic">
                      "{complaint.feedback.comment}"
                    </p>
                    <span className="text-[10px] text-slate-500 block">
                      Submitted by {complaint.feedback.citizenName} on{' '}
                      {new Date(complaint.feedback.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                    <p className="text-xs text-slate-300">
                      Work has been marked complete. How would you rate the responsiveness and quality of the municipal repair?
                    </p>

                    {feedbackError && (
                      <p className="text-xs text-rose-400">{feedbackError}</p>
                    )}

                    {/* Star Selector */}
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 cursor-pointer focus:outline-none transition hover:scale-110"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-700 hover:text-slate-500'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-amber-400 ml-2">
                        {rating} Star{rating > 1 ? 's' : ''}
                      </span>
                    </div>

                    <textarea
                      required
                      rows={2}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts on the repair quality and timing..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-md shadow-amber-500/20"
                    >
                      Submit Official Feedback
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
