import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Check,
  CheckCheck,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useComplaints } from '../context/ComplaintsContext';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
  } = useComplaints();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = notifications.filter((n) => (filter === 'unread' ? !n.isRead : true));

  const handleNotificationClick = (id: string, complaintId: string) => {
    markNotificationRead(id);
    navigate(`/complaint/${complaintId}`);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      default:
        return <Info className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
              <Bell className="w-7 h-7 text-cyan-400" />
              <span>Civic Notifications</span>
            </h1>
            {unreadNotificationCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-rose-500 text-white">
                {unreadNotificationCount} New
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time status updates and milestone alerts for your municipal complaints
          </p>
        </div>

        {unreadNotificationCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800 max-w-xs">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            filter === 'all'
              ? 'bg-cyan-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            filter === 'unread'
              ? 'bg-cyan-500 text-slate-950 shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Unread ({unreadNotificationCount})
        </button>
      </div>

      {/* Notification Items */}
      {filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No notifications</h3>
          <p className="text-xs text-slate-400">
            {filter === 'unread' ? 'You have read all updates!' : 'No recorded municipal notifications.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item.id, item.complaintId)}
              className={`p-4 sm:p-5 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-4 group ${
                item.isRead
                  ? 'bg-slate-900/60 border-slate-800 text-slate-300'
                  : 'bg-slate-900 border-cyan-500/40 shadow-lg shadow-cyan-950/20 text-white'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 shrink-0">{getIcon(item.type)}</div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                      {item.title}
                    </h3>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    )}
                    <span className="font-mono text-[10px] bg-slate-950 px-2 py-0.5 rounded text-cyan-400 border border-slate-800">
                      #{item.complaintId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.message}</p>
                  <span className="text-[10px] text-slate-500 block pt-1">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 pt-1">
                <span className="text-xs text-cyan-400 font-semibold group-hover:underline hidden sm:inline">
                  View Ticket
                </span>
                <div className="w-7 h-7 rounded-full bg-slate-800 group-hover:bg-cyan-500 group-hover:text-slate-950 text-slate-400 flex items-center justify-center transition">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
