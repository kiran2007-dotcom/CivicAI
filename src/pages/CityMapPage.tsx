import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Filter,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintsContext';
import { Complaint, IssueCategory, PriorityLevel } from '../types';

export const CityMapPage: React.FC = () => {
  const { complaints } = useComplaints();
  const navigate = useNavigate();

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedPin, setSelectedPin] = useState<Complaint | null>(complaints[0] || null);

  const filtered = complaints.filter((c) => {
    const matchesCat = categoryFilter === 'ALL' || c.category === categoryFilter;
    const matchesStat = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesCat && matchesStat;
  });

  // Bengaluru Map Bounding Box for scaling pins on our interactive SVG canvas
  // Lat: 12.92 to 12.99
  // Lng: 77.58 to 77.76
  const minLat = 12.92;
  const maxLat = 12.99;
  const minLng = 77.58;
  const maxLng = 77.76;

  const getPinCoordinates = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 80 + 10; // 10% to 90%
    const y = ((maxLat - lat) / (maxLat - minLat)) * 80 + 10; // inverted Y
    return {
      x: Math.max(8, Math.min(92, x)),
      y: Math.max(8, Math.min(92, y)),
    };
  };

  const getPriorityColor = (priority: PriorityLevel) => {
    switch (priority) {
      case 'Urgent':
        return '#ef4444';
      case 'High':
        return '#f97316';
      case 'Medium':
        return '#eab308';
      default:
        return '#38bdf8';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <MapPin className="w-7 h-7 text-cyan-400" />
            <span>Smart City Geospatial Complaint Map</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time geospatial plotting across Bengaluru municipal zones (MG Road, Indiranagar, Koramangala, Whitefield)
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="ALL">All Categories</option>
            <option value="Pothole">Potholes</option>
            <option value="Garbage">Garbage</option>
            <option value="Water Leakage">Water Leakage</option>
            <option value="Broken Streetlight">Broken Streetlight</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Map Layout: Left (Interactive Map Canvas) - Right (Pin Details Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Interactive Smart City Map Canvas (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
          {/* Map Top Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span className="font-bold">Bengaluru Metro Civic Grid</span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Urgent
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> High
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span> Medium
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Resolved
              </span>
            </div>
          </div>

          {/* SVG Map Container */}
          <div className="relative w-full h-[420px] sm:h-[500px] mt-4 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner select-none">
            {/* Stylized Metro Grid & Roads Graphic */}
            <svg
              className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Arterial Highway Network */}
              <path
                d="M 50 200 Q 250 180 500 220 T 900 240"
                stroke="#334155"
                strokeWidth="6"
                fill="none"
              />
              <path
                d="M 200 50 Q 240 260 280 480"
                stroke="#334155"
                strokeWidth="5"
                fill="none"
              />
              <path
                d="M 600 50 Q 560 240 520 480"
                stroke="#1e3a5f"
                strokeWidth="4"
                fill="none"
              />
              {/* Metro Purple Line */}
              <path
                d="M 120 220 L 780 210"
                stroke="#7c3aed"
                strokeWidth="3"
                strokeDasharray="6,4"
                fill="none"
              />
              <text x="140" y="240" fill="#64748b" fontSize="11" fontFamily="sans-serif">
                MG ROAD CORRIDOR
              </text>
              <text x="360" y="195" fill="#64748b" fontSize="11" fontFamily="sans-serif">
                INDIRANAGAR
              </text>
              <text x="380" y="380" fill="#64748b" fontSize="11" fontFamily="sans-serif">
                KORAMANGALA
              </text>
              <text x="680" y="190" fill="#64748b" fontSize="11" fontFamily="sans-serif">
                WHITEFIELD
              </text>
            </svg>

            {/* Clickable Geotagged Complaint Pins */}
            {filtered.map((c) => {
              const coords = getPinCoordinates(c.location.lat, c.location.lng);
              const isSelected = selectedPin?.id === c.id;
              const color =
                c.status === 'Resolved' ? '#10b981' : getPriorityColor(c.priority);

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedPin(c)}
                  style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                >
                  <div className="relative flex items-center justify-center">
                    {/* Radar Pulse for Active Urgent Tickets */}
                    {(c.priority === 'Urgent' || c.priority === 'High') &&
                      c.status !== 'Resolved' && (
                        <span
                          className="absolute w-7 h-7 rounded-full animate-ping opacity-75"
                          style={{ backgroundColor: color }}
                        />
                      )}

                    {/* Marker Icon */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform ${
                        isSelected ? 'scale-125 ring-4 ring-white' : 'group-hover:scale-115'
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      <MapPin className="w-4 h-4 text-slate-950 font-bold" />
                    </div>

                    {/* Mini Tooltip on Hover */}
                    <div className="absolute bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/95 border border-slate-700 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none">
                      {c.category} • #{c.id}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Showing {filtered.length} geotagged civic pins</span>
            <span className="italic">Click any pin on the map to view ticket diagnostic</span>
          </div>
        </div>

        {/* Selected Pin Inspector (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedPin ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-800">
                  {selectedPin.id}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                    selectedPin.status === 'Resolved'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}
                >
                  {selectedPin.status}
                </span>
              </div>

              {/* Photo */}
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 max-h-48">
                <img
                  src={selectedPin.photoUrl}
                  alt={selectedPin.category}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="text-base font-bold text-white">
                  {selectedPin.category}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {selectedPin.description}
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-bold text-cyan-400">{selectedPin.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Priority:</span>
                  <span className="font-bold text-white">{selectedPin.priority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Reported By:</span>
                  <span className="font-medium text-slate-300">{selectedPin.citizenName}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 text-slate-400">
                  <p className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{selectedPin.location.address}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/complaint/${selectedPin.id}`)}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs transition shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Open Full Tracking Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-xs text-slate-400">
              Select any map pin to inspect complaint status.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
