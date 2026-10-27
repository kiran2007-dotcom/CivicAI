import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  HardHat,
  Camera,
  Upload,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowLeft,
  AlertCircle,
  FileCheck,
  Send,
  Sparkles,
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintsContext';
import { useAuth } from '../context/AuthContext';
import {
  SAMPLE_REPAIR_PROGRESS_SVG,
  SAMPLE_COMPLETED_REPAIR_SVG,
} from '../data/sampleAssets';

export const ComplaintResolutionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getComplaint, updateComplaintStatus } = useComplaints();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const complaint = getComplaint(id || '');

  const [notes, setNotes] = useState('');
  const [evidencePhoto, setEvidencePhoto] = useState<string>(SAMPLE_COMPLETED_REPAIR_SVG);
  const [evidenceType, setEvidenceType] = useState<'sample' | 'upload'>('sample');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!complaint) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Task not found</h2>
        <Link to="/worker/dashboard" className="text-amber-400 text-sm">
          ← Back to Worker Dashboard
        </Link>
      </div>
    );
  }

  // Handle start work
  const handleStartWork = () => {
    updateComplaintStatus(complaint.id, 'In Progress', {
      title: 'Field Work Commenced',
      description: `Technician ${currentUser.name} arrived at site. Equipment active.`,
    });
  };

  // Handle completion file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setEvidencePhoto(uploadEvent.target?.result as string);
      setEvidenceType('upload');
    };
    reader.readAsDataURL(file);
  };

  // Submit completion evidence
  const handleSubmitCompletion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      setError('Please provide detailed technician completion notes for municipal audit.');
      return;
    }
    if (!evidencePhoto) {
      setError('Please attach photographic evidence proving resolution.');
      return;
    }

    setIsSubmitting(true);

    const updated = updateComplaintStatus(complaint.id, 'Awaiting Verification', {
      title: 'Work Completed • Evidence Submitted',
      description: `Technician ${currentUser.name} finished repairs and uploaded photo proof: "${notes.trim()}". Pending officer inspection.`,
      completionEvidence: {
        photoUrl: evidencePhoto,
        notes: notes.trim(),
        completedAt: new Date().toISOString(),
        workerName: currentUser.name,
      },
    });

    setIsSubmitting(false);

    if (updated) {
      navigate('/worker/dashboard');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/worker/dashboard')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Task List
        </button>

        <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-800">
          Work Order: {complaint.id}
        </span>
      </div>

      {/* Task Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              {complaint.department}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
              {complaint.category}: {complaint.description}
            </h1>
          </div>
          <span
            className={`px-3 py-1 rounded-md text-xs font-bold self-start sm:self-auto ${
              complaint.status === 'In Progress'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                : 'bg-amber-950 text-amber-300 border border-amber-800'
            }`}
          >
            Status: {complaint.status}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block mb-1">Citizen Reported Photo:</span>
            <div className="rounded-xl overflow-hidden border border-slate-800 max-h-48 bg-slate-950">
              <img src={complaint.photoUrl} alt="" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="font-bold text-slate-300">Site Location:</span>
              <p className="text-slate-400 mt-1">{complaint.location.address}</p>
              <p className="text-slate-500 font-mono text-[10px] mt-0.5">
                Lat: {complaint.location.lat} • Lng: {complaint.location.lng}
              </p>
            </div>

            {complaint.officerNotes && (
              <div className="pt-2 border-t border-slate-800">
                <span className="font-bold text-indigo-400">Officer Instructions:</span>
                <p className="text-slate-300 italic mt-0.5">"{complaint.officerNotes}"</p>
              </div>
            )}

            {complaint.status === 'Assigned' && (
              <button
                type="button"
                onClick={handleStartWork}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs transition cursor-pointer shadow-md"
              >
                Mark Arrived & Begin Field Repair
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Completion Evidence Submission Form */}
      <form
        onSubmit={handleSubmitCompletion}
        className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6"
      >
        <div className="pb-3 border-b border-slate-800">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-400" />
            <span>Submit Completion Proof & Resolve Order</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Official municipal code requires high-resolution photographic evidence demonstrating rectified civic conditions before ticket closure.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Evidence Photo Choice: Bundled Sample vs Custom Upload */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-white uppercase tracking-wider">
              Rectification Photo Proof <span className="text-rose-400">*Required</span>
            </label>
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setEvidencePhoto(SAMPLE_COMPLETED_REPAIR_SVG);
                  setEvidenceType('sample');
                }}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  evidenceType === 'sample'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                Use Verified Real Photo Proof
              </button>
            </div>
          </div>

          {/* Photo Preview & Upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="rounded-2xl overflow-hidden border border-emerald-500/40 bg-slate-950 max-h-56">
              <img
                src={evidencePhoto}
                alt="Real photo evidence of completed municipal road repair"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="space-y-3">
              <label className="border border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition bg-slate-950/60">
                <Upload className="w-6 h-6 text-emerald-400 mb-2" />
                <span className="text-xs font-bold text-white">Upload Custom After-Photo</span>
                <span className="text-[10px] text-slate-400 mt-0.5">JPEG or PNG file</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  setEvidencePhoto(SAMPLE_REPAIR_PROGRESS_SVG);
                  setEvidenceType('sample');
                }}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer border border-slate-700"
              >
                Use "Work In Progress" Barricade Asset
              </button>
            </div>
          </div>
        </div>

        {/* Technician Notes */}
        <div>
          <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
            Technician Resolution Log <span className="text-rose-400">*Required</span>
          </label>
          <textarea
            required
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Document materials used (e.g. 250kg cold-mix asphalt, compaction roller), duration, and road safety clearance..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/worker/dashboard')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm transition shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>Submit Proof for Officer Verification</span>
          </button>
        </div>
      </form>
    </div>
  );
};
