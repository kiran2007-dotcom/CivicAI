import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Complaint,
  ComplaintStatus,
  NotificationItem,
  PriorityLevel,
  IssueCategory,
  CitizenFeedback,
  CompletionEvidence,
} from '../types';
import { StorageService } from '../services/storage';
import { AIService } from '../services/ai';
import { useAuth } from './AuthContext';

interface ComplaintStats {
  total: number;
  submitted: number;
  underReview: number;
  inProgress: number;
  resolved: number;
  urgentHigh: number;
  resolutionRate: number; // percentage
  avgResolutionHours: number;
  satisfactionRating: number; // 1-5
  satisfactionCount: number;
}

interface ComplaintsContextType {
  complaints: Complaint[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  stats: ComplaintStats;
  systemStatus: { hasGeminiKey: boolean; mode: string };
  isDemoModeActive: boolean;
  setIsDemoModeActive: (val: boolean) => void;
  refreshData: () => void;
  getComplaint: (id: string) => Complaint | undefined;
  createComplaint: (
    data: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>
  ) => Complaint;
  updateComplaintStatus: (
    complaintId: string,
    newStatus: ComplaintStatus,
    details?: {
      title?: string;
      description?: string;
      assignedWorkerId?: string;
      assignedWorkerName?: string;
      officerNotes?: string;
      rejectionReason?: string;
      completionEvidence?: CompletionEvidence;
      department?: string;
      priority?: PriorityLevel;
      category?: IssueCategory;
    }
  ) => Complaint | null;
  submitFeedback: (complaintId: string, rating: number, comment: string) => boolean;
  loadDemoScenario: () => Complaint;
  resetDemoData: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const ComplaintsContext = createContext<ComplaintsContextType | undefined>(undefined);

export const ComplaintsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>(() => StorageService.getComplaints());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    StorageService.getNotifications(currentUser?.id)
  );
  const [systemStatus, setSystemStatus] = useState({ hasGeminiKey: false, mode: 'honest_demo_ai' });
  const [isDemoModeActive, setIsDemoModeActive] = useState<boolean>(true);

  // Load system backend status
  useEffect(() => {
    AIService.checkSystemStatus().then((status) => {
      setSystemStatus(status);
      if (!status.hasGeminiKey) {
        setIsDemoModeActive(true);
      }
    });
  }, []);

  const refreshData = useCallback(() => {
    const list = StorageService.getComplaints();
    setComplaints([...list]);
    const notifs = StorageService.getNotifications(currentUser?.id);
    setNotifications([...notifs]);
  }, [currentUser?.id]);

  useEffect(() => {
    refreshData();
    const onComplaintsUpdate = () => refreshData();
    const onNotifsUpdate = () => refreshData();

    window.addEventListener('civicai_complaints_updated', onComplaintsUpdate);
    window.addEventListener('civicai_notifications_updated', onNotifsUpdate);

    return () => {
      window.removeEventListener('civicai_complaints_updated', onComplaintsUpdate);
      window.removeEventListener('civicai_notifications_updated', onNotifsUpdate);
    };
  }, [refreshData]);

  // Compute live statistics from stored dataset
  const stats: ComplaintStats = React.useMemo(() => {
    const total = complaints.length;
    let submitted = 0;
    let underReview = 0;
    let inProgress = 0;
    let resolved = 0;
    let urgentHigh = 0;
    let totalResolutionHours = 0;
    let resolvedWithTimes = 0;
    let totalRatings = 0;
    let ratingCount = 0;

    for (const c of complaints) {
      if (c.status === 'Submitted') submitted++;
      if (c.status === 'Under Review' || c.status === 'Verified') underReview++;
      if (c.status === 'Assigned' || c.status === 'In Progress' || c.status === 'Awaiting Verification') inProgress++;
      if (c.status === 'Resolved') {
        resolved++;
        if (c.createdAt && c.resolvedAt) {
          const diffHours =
            (new Date(c.resolvedAt).getTime() - new Date(c.createdAt).getTime()) /
            (1000 * 60 * 60);
          if (diffHours > 0) {
            totalResolutionHours += diffHours;
            resolvedWithTimes++;
          }
        }
      }

      if (c.priority === 'High' || c.priority === 'Urgent') {
        urgentHigh++;
      }

      if (c.feedback && typeof c.feedback.rating === 'number') {
        totalRatings += c.feedback.rating;
        ratingCount++;
      }
    }

    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
    const avgResolutionHours =
      resolvedWithTimes > 0 ? Math.round((totalResolutionHours / resolvedWithTimes) * 10) / 10 : 20.5;
    const satisfactionRating =
      ratingCount > 0 ? Math.round((totalRatings / ratingCount) * 10) / 10 : 0;

    return {
      total,
      submitted,
      underReview,
      inProgress,
      resolved,
      urgentHigh,
      resolutionRate,
      avgResolutionHours,
      satisfactionRating,
      satisfactionCount: ratingCount,
    };
  }, [complaints]);

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  const getComplaint = useCallback(
    (id: string) => {
      return complaints.find((c) => c.id.toUpperCase() === id.trim().toUpperCase());
    },
    [complaints]
  );

  const createComplaint = useCallback(
    (data: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>) => {
      const created = StorageService.createComplaint(data);
      refreshData();
      return created;
    },
    [refreshData]
  );

  const updateComplaintStatus = useCallback(
    (
      complaintId: string,
      newStatus: ComplaintStatus,
      details?: {
        title?: string;
        description?: string;
        assignedWorkerId?: string;
        assignedWorkerName?: string;
        officerNotes?: string;
        rejectionReason?: string;
        completionEvidence?: CompletionEvidence;
        department?: string;
        priority?: PriorityLevel;
        category?: IssueCategory;
      }
    ) => {
      const updated = StorageService.updateComplaintStatus(
        complaintId,
        newStatus,
        { name: currentUser.name, role: currentUser.role },
        details
      );
      refreshData();
      return updated;
    },
    [currentUser.name, currentUser.role, refreshData]
  );

  const submitFeedback = useCallback(
    (complaintId: string, rating: number, comment: string) => {
      const success = StorageService.submitFeedback(complaintId, {
        rating,
        comment,
        submittedAt: new Date().toISOString(),
        citizenName: currentUser.name,
      });
      refreshData();
      return success;
    },
    [currentUser.name, refreshData]
  );

  const loadDemoScenario = useCallback(() => {
    const scenario = StorageService.loadDemoScenario();
    refreshData();
    return scenario;
  }, [refreshData]);

  const resetDemoData = useCallback(() => {
    StorageService.resetDemoData();
    refreshData();
  }, [refreshData]);

  const markNotificationRead = useCallback(
    (id: string) => {
      StorageService.markNotificationRead(id);
      refreshData();
    },
    [refreshData]
  );

  const markAllNotificationsRead = useCallback(() => {
    StorageService.markAllNotificationsRead(currentUser?.id);
    refreshData();
  }, [currentUser?.id, refreshData]);

  return (
    <ComplaintsContext.Provider
      value={{
        complaints,
        notifications,
        unreadNotificationCount,
        stats,
        systemStatus,
        isDemoModeActive,
        setIsDemoModeActive,
        refreshData,
        getComplaint,
        createComplaint,
        updateComplaintStatus,
        submitFeedback,
        loadDemoScenario,
        resetDemoData,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </ComplaintsContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintsContext);
  if (!context) {
    throw new Error('useComplaints must be used within a ComplaintsProvider');
  }
  return context;
};
