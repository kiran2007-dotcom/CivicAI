import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  Upload,
  MapPin,
  Sparkles,
  Cpu,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  X,
  RefreshCw,
  FileText,
  Sliders,
  HelpCircle,
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintsContext';
import { useAuth } from '../context/AuthContext';
import { AIService } from '../services/ai';
import { IssueCategory, PriorityLevel, SeverityLevel, AIAnalysisResult } from '../types';
import {
  SAMPLE_SCENARIOS,
  SAMPLE_POTHOLE_SVG,
  SAMPLE_GARBAGE_SVG,
  SAMPLE_WATER_LEAK_SVG,
  SAMPLE_STREETLIGHT_SVG,
} from '../data/sampleAssets';

const DRAFT_KEY = 'civicai_report_draft_v1';

const CATEGORIES: IssueCategory[] = [
  'Pothole',
  'Road Damage',
  'Garbage',
  'Water Leakage',
  'Broken Streetlight',
  'Drainage',
  'Fallen Tree',
  'Other',
];

export const ReportIssuePage: React.FC = () => {
  const { createComplaint, isDemoModeActive } = useComplaints();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory>('Pothole');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [photoMime, setPhotoMime] = useState<string>('image/jpeg');
  const [address, setAddress] = useState('MG Road, Near Metro Pillar 142, Bengaluru');
  const [lat, setLat] = useState<number>(12.9756);
  const [lng, setLng] = useState<number>(77.6092);
  const [landmark, setLandmark] = useState('Opposite Central Mall');
  const [zone, setZone] = useState('East Zone - Ward 112');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [videoEvidenceNote, setVideoEvidenceNote] = useState('');

  // AI Analysis State
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState('');
  const [analysisPercent, setAnalysisPercent] = useState(0);
  const [aiError, setAiError] = useState<string | null>(null);

  // UX State
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoNotice, setGeoNotice] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Restore draft if saved
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        const d = JSON.parse(savedDraft);
        if (d.description) setDescription(d.description);
        if (d.category) setCategory(d.category);
        if (d.address) setAddress(d.address);
        if (d.photoUrl) setPhotoUrl(d.photoUrl);
      }
    } catch {}
  }, []);

  // Auto-save draft to prevent accidental loss
  useEffect(() => {
    try {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          description,
          category,
          address,
          photoUrl: photoUrl.length < 500000 ? photoUrl : '', // avoid huge base64 in draft storage
        })
      );
    } catch {}
  }, [description, category, address, photoUrl]);

  // Handle image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFormError('Image size exceeds 10MB limit. Please upload a smaller photo.');
      return;
    }

    setFormError(null);
    setPhotoMime(file.type);

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target?.result as string;
      setPhotoUrl(base64);
      setAiResult(null); // Reset previous analysis
    };
    reader.readAsDataURL(file);
  };

  // Browser Geolocation
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoNotice('Geolocation is not supported by your browser. Please enter location manually.');
      return;
    }

    setGeoLoading(true);
    setGeoNotice(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const currentLat = Number(pos.coords.latitude.toFixed(4));
        const currentLng = Number(pos.coords.longitude.toFixed(4));
        setLat(currentLat);
        setLng(currentLng);
        setAddress(`GPS Location: ${currentLat}° N, ${currentLng}° E, Bengaluru`);
        setZone('Central Zone - GPS Pinpoint');
        setGeoLoading(false);
        setGeoNotice('GPS coordinates captured successfully!');
        setTimeout(() => setGeoNotice(null), 3500);
      },
      (err) => {
        setGeoLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoNotice('Location permission was denied. You can manually type your street address below.');
        } else {
          setGeoNotice('GPS signal unavailable. Please specify your address manually.');
        }
      },
      { timeout: 8000 }
    );
  };

  // Load deterministic sample scenario
  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_SCENARIOS.find((s) => s.id === sampleId);
    if (!sample) return;

    setPhotoUrl(sample.imageUrl);
    setCategory(sample.category);
    setDescription(sample.description);
    setAddress(sample.address);
    setLat(sample.lat);
    setLng(sample.lng);
    setLandmark(sample.landmark);
    setZone(sample.zone);
    setFormError(null);

    // Populate deterministic AI Result immediately
    setAiResult({
      ...sample.aiResult,
      isDemoMode: true,
      analyzedAt: new Date().toISOString(),
    });
  };

  // Trigger AI Analysis
  const handleAnalyzeWithAI = async () => {
    if (!photoUrl && !description.trim()) {
      setFormError('Please upload a photo or write an issue description before running AI analysis.');
      return;
    }

    setIsAnalyzing(true);
    setAiError(null);
    setAnalysisPercent(10);
    setAnalysisStage('Initiating visual diagnostics...');

    try {
      const result = await AIService.analyzeComplaint(
        {
          imageBase64: photoUrl,
          mimeType: photoMime,
          description,
          category,
          location: address,
          forceDemoMode: false,
        },
        (stage, pct) => {
          setAnalysisStage(stage);
          setAnalysisPercent(pct);
        }
      );

      setAiResult(result);
      // Auto-align category to AI suggestion if user hasn't explicitly locked it
      if (result.issueCategory) {
        setCategory(result.issueCategory);
      }
    } catch (err: any) {
      setAiError('AI Analysis timed out or encountered an error. You can still submit your complaint directly.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle final submission
  const handleConfirmSubmit = () => {
    if (!description.trim()) {
      setFormError('Issue description is required.');
      setShowConfirmModal(false);
      return;
    }
    if (!photoUrl) {
      setFormError('Photo evidence is required to report a civic defect.');
      setShowConfirmModal(false);
      return;
    }

    setIsSubmitting(true);

    const priority: PriorityLevel = aiResult?.priority || (category === 'Pothole' ? 'High' : 'Medium');
    const department: string =
      aiResult?.recommendedDepartment ||
      (category === 'Pothole' || category === 'Road Damage'
        ? 'Road Maintenance'
        : category === 'Garbage'
        ? 'Sanitation Department'
        : category === 'Water Leakage'
        ? 'Water Supply Department'
        : category === 'Broken Streetlight'
        ? 'Electrical Department'
        : 'General Civic Services');

    const newComplaint = createComplaint({
      citizenId: currentUser.id,
      citizenName: currentUser.name,
      citizenEmail: currentUser.email,
      category,
      description: description.trim(),
      photoUrl,
      additionalNotes: additionalNotes.trim() || undefined,
      videoEvidenceNote: videoEvidenceNote.trim() || undefined,
      location: {
        address: address.trim(),
        lat,
        lng,
        landmark: landmark.trim(),
        zone,
      },
      aiAnalysis: aiResult || undefined,
      priority,
      department,
      status: 'Submitted',
    });

    // Clear saved draft
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {}

    setIsSubmitting(false);
    setShowConfirmModal(false);

    // Navigate to complaint details tracking view
    navigate(`/complaint/${newComplaint.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" /> Official Municipal Grievance Redressal
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Report a Civic Issue
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Submit photo evidence. Our AI triage system analyzes defect severity, predicts SLA timeframes, and routes tickets directly to authorized departments.
        </p>
      </div>

      {/* Honest Demo Mode Sample Selector */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <p className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wide">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Honest Demo AI Mode: Load Pre-Bundled Test Scenarios</span>
          </p>
          <span className="text-[11px] text-slate-400">
            Click any button below to test immediate AI detection:
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => handleLoadSample('pothole')}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-700 hover:border-cyan-400 text-left transition cursor-pointer group"
          >
            <span className="text-xs font-bold text-cyan-300 block group-hover:text-cyan-200">
              Try Pothole Sample
            </span>
            <span className="text-[10px] text-slate-400">MG Road Bengaluru</span>
          </button>

          <button
            type="button"
            onClick={() => handleLoadSample('garbage')}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-700 hover:border-cyan-400 text-left transition cursor-pointer group"
          >
            <span className="text-xs font-bold text-emerald-300 block group-hover:text-emerald-200">
              Try Garbage Sample
            </span>
            <span className="text-[10px] text-slate-400">Indiranagar 100ft Rd</span>
          </button>

          <button
            type="button"
            onClick={() => handleLoadSample('water_leak')}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-700 hover:border-cyan-400 text-left transition cursor-pointer group"
          >
            <span className="text-xs font-bold text-blue-300 block group-hover:text-blue-200">
              Try Water Leak Sample
            </span>
            <span className="text-[10px] text-slate-400">Koramangala 4th Blk</span>
          </button>

          <button
            type="button"
            onClick={() => handleLoadSample('streetlight')}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-700 hover:border-cyan-400 text-left transition cursor-pointer group"
          >
            <span className="text-xs font-bold text-amber-300 block group-hover:text-amber-200">
              Try Light Sample
            </span>
            <span className="text-[10px] text-slate-400">Whitefield Hope Farm</span>
          </button>
        </div>
      </div>

      {formError && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Main Report Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setShowConfirmModal(true);
        }}
        className="space-y-6"
      >
        {/* Section 1: Photographic Evidence */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-cyan-400" />
              <span>1. Photographic Evidence</span>
              <span className="text-xs font-normal text-rose-400">*Required</span>
            </h2>
            {photoUrl && (
              <button
                type="button"
                onClick={() => {
                  setPhotoUrl('');
                  setAiResult(null);
                }}
                className="text-xs text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Remove Photo
              </button>
            )}
          </div>

          {!photoUrl ? (
            <label className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition bg-slate-950/40 group">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 group-hover:bg-cyan-500/10 group-hover:text-cyan-400 text-slate-400 flex items-center justify-center transition">
                <Upload className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Click to upload photo evidence</p>
                <p className="text-xs text-slate-400 mt-1">JPEG, PNG, or WebP up to 10MB</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950">
                <img
                  src={photoUrl}
                  alt="Evidence preview"
                  className="w-full max-h-80 object-contain bg-slate-950"
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-semibold text-white border border-slate-700">
                  Visual Evidence Loaded
                </div>
              </div>

              {/* AI Analysis Trigger Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Gemini 3.8 Flash Vision Triage</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Diagnose category, compute safety impact, and determine department routing
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAnalyzeWithAI}
                  disabled={isAnalyzing}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs sm:text-sm transition shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analyzing Photo...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      <span>Analyze with AI</span>
                    </>
                  )}
                </button>
              </div>

              {/* Progress Indicator */}
              {isAnalyzing && (
                <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/60 space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-cyan-300">
                    <span>{analysisStage}</span>
                    <span>{analysisPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                      style={{ width: `${analysisPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {aiError && (
                <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-300 text-xs">
                  {aiError}
                </div>
              )}

              {/* AI Diagnostic Results Card */}
              {aiResult && (
                <div className="bg-slate-950 border border-cyan-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      <span>AI Triage Diagnosis Result</span>
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        aiResult.isDemoMode
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                          : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                      }`}
                    >
                      {aiResult.isDemoMode ? 'Demo Mode (Simulated)' : 'Live Gemini Vision'} •{' '}
                      {aiResult.confidence}% Confidence
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Detected Category
                      </span>
                      <span className="font-bold text-white mt-1 block">
                        {aiResult.issueCategory}
                      </span>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Severity Level
                      </span>
                      <span
                        className={`font-bold mt-1 block ${
                          aiResult.severity === 'Critical'
                            ? 'text-rose-400'
                            : aiResult.severity === 'High'
                            ? 'text-orange-400'
                            : 'text-yellow-400'
                        }`}
                      >
                        {aiResult.severity}
                      </span>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Recommended Dept
                      </span>
                      <span className="font-bold text-cyan-300 mt-1 block truncate">
                        {aiResult.recommendedDepartment}
                      </span>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Estimated SLA
                      </span>
                      <span className="font-bold text-slate-200 mt-1 block">
                        {aiResult.estimatedResolutionHours} Hours
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                    <strong className="text-cyan-400">AI Reasoning:</strong> {aiResult.reasoning}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section 2: Defect Details & Category */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <span>2. Issue Classification & Description</span>
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Issue Category <span className="text-slate-500 font-normal">(Review or override AI recommendation)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition text-left cursor-pointer ${
                    category === cat
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Issue Description <span className="text-rose-400">*Required</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue, defect dimensions, hazards to motorists, pedestrians, or water loss..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Additional Notes / Landmark Details <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="e.g. Near electric transformer, opposite bus shelter #4..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Section 3: Location Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" />
              <span>3. Incident Location & Geotag</span>
              <span className="text-xs font-normal text-rose-400">*Required</span>
            </h2>

            <button
              type="button"
              onClick={handleUseMyLocation}
              disabled={geoLoading}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{geoLoading ? 'Detecting GPS...' : 'Use My Location'}</span>
            </button>
          </div>

          {geoNotice && (
            <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-800 text-cyan-300 text-xs">
              {geoNotice}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Street Address</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 100 Feet Road, Indiranagar, Bengaluru..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Landmark</label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Metro Pillar 142"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Civic Zone / Ward</label>
              <input
                type="text"
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                placeholder="e.g. East Zone - Ward 112"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <button
            type="button"
            onClick={() => navigate('/citizen/dashboard')}
            className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-sm font-semibold transition cursor-pointer"
          >
            Cancel & Keep Draft
          </button>
          <button
            type="submit"
            className="px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm sm:text-base transition shadow-xl shadow-cyan-500/25 flex items-center gap-2 cursor-pointer"
          >
            <span>Review & Submit Complaint</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                <span>Confirm Civic Complaint Submission</span>
              </h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Category:</span>
                <span className="font-bold text-white">{category}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Location:</span>
                <span className="font-semibold text-white truncate max-w-[240px]">{address}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Target Department:</span>
                <span className="font-bold text-cyan-400">
                  {aiResult?.recommendedDepartment || 'Road Maintenance'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Calculated Priority:</span>
                <span className="font-bold text-orange-400">
                  {aiResult?.priority || 'High'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Estimated Resolution:</span>
                <span className="font-semibold text-slate-200">
                  ~{aiResult?.estimatedResolutionHours || 24} Hours
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
              A collision-resistant tracking ID will be generated and saved persistently. You can follow repair milestones in real time.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs cursor-pointer"
              >
                Go Back & Edit
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmSubmit}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs sm:text-sm transition shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Registering Ticket...' : 'Confirm & Generate ID'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
