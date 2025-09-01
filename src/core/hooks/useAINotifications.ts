import { useState, useEffect, useCallback, useRef } from 'react';
import {
  aiNotificationService,
  type AINotificationService,
  type NotificationData,
  type AIEnhancedNotification,
  type AINotificationSettings
} from '../services/ai-notification-service';

interface UseAINotificationsOptions {
  settings?: Partial<AINotificationSettings>;
  autoRefresh?: boolean;
  refreshInterval?: number;
  enableRealtime?: boolean;
}

interface UseAINotificationsReturn {
  notifications: AIEnhancedNotification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  settings: AINotificationSettings;
  // Actions
  processNotification: (notification: NotificationData) => Promise<AIEnhancedNotification>;
  processMultipleNotifications: (notifications: NotificationData[]) => Promise<AIEnhancedNotification[]>;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (notificationId: string) => void;
  updateSettings: (newSettings: Partial<AINotificationSettings>) => void;
  recordUserAction: (notificationId: string, action: string) => void;
  refreshNotifications: () => Promise<void>;
  // Filtering and sorting
  getNotificationsByType: (type: AIEnhancedNotification['type']) => AIEnhancedNotification[];
  getNotificationsByCategory: (category: AIEnhancedNotification['aiCategory']) => AIEnhancedNotification[];
  getHighPriorityNotifications: () => AIEnhancedNotification[];
  getNotificationsForRole: (role: string) => AIEnhancedNotification[];
}

const defaultSettings: AINotificationSettings = {
  enabled: true,
  minPriority: 'low'
};

export const useAINotifications = (options: UseAINotificationsOptions = {}): UseAINotificationsReturn => {
  const {
    settings: initialSettings = {},
    autoRefresh = true,
    refreshInterval = 30_000,
    enableRealtime = true
  } = options;

  const [notifications, setNotifications] = useState<AIEnhancedNotification[]>([]);
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<AINotificationSettings>({ ...defaultSettings, ...initialSettings });

  const serviceRef = useRef<AINotificationService>(aiNotificationService);
  const refreshTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const actionStartTimes = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    serviceRef.current.updateSettings(settings);
  }, [settings]);

  const fetchNotifications = useCallback(async (): Promise<NotificationData[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const mock: NotificationData[] = [
      {
        id: '1',
        title: 'Emergency Patient Alert',
        message: 'Patient John Doe shows critical vitals - immediate attention required',
        avatar: undefined,
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        isRead: false,
        type: 'urgent',
        sender: 'Emergency System',
        metadata: { patientId: 'P-001', urgencyKeywords: ['critical', 'immediate'] as unknown as string[] }
      },
      {
        id: '2',
        title: 'Surgery Schedule Updated',
        message: "Dr. Smith updated tomorrow's surgery schedule - 3 operations rescheduled",
        avatar: undefined,
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        isRead: false,
        type: 'medical',
        sender: 'Dr. Smith',
        metadata: { doctorId: 'D-001' }
      },
      {
        id: '3',
        title: 'Lab Results Available',
        message: "Patient Emily's blood work shows abnormal results requiring follow-up",
        avatar: undefined,
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        isRead: false,
        type: 'medical',
        sender: 'Lab Department',
        metadata: { patientId: 'P-002', labResultId: 'L-001' }
      },
      {
        id: '4',
        title: 'Appointment Booking',
        message: '5 new appointments booked for this week',
        avatar: undefined,
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isRead: false,
        type: 'appointment',
        sender: 'Booking System',
        metadata: { appointmentId: 'A-001' }
      },
      {
        id: '5',
        title: 'Medication Reminder',
        message: 'Patient reminder: Take morning medication',
        avatar: undefined,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: false,
        type: 'reminder',
        sender: 'Reminder System'
      }
    ];
    return mock;
  }, []);

  const refreshNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const raw = await fetchNotifications();
      const processed = await serviceRef.current.processMultipleNotifications(raw);
      setNotifications(processed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }, [fetchNotifications]);

  useEffect(() => {
    if (!autoRefresh) return;
    refreshNotifications();
    refreshTimer.current = setInterval(() => {
      refreshNotifications();
    }, refreshInterval);
    return () => {
      if (refreshTimer.current) clearInterval(refreshTimer.current);
    };
  }, [autoRefresh, refreshInterval, refreshNotifications]);

  useEffect(() => {
    if (!enableRealtime) return;
    const onVis = () => { if (!document.hidden) refreshNotifications(); };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [enableRealtime, refreshNotifications]);

  const processNotification = useCallback(async (notification: NotificationData) => {
    return serviceRef.current.processNotification(notification);
  }, []);

  const processMultipleNotifications = useCallback(async (list: NotificationData[]) => {
    return serviceRef.current.processMultipleNotifications(list);
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    setReadNotifications((prev) => new Set([...prev, notificationId]));
    const startTime = actionStartTimes.current.get(notificationId);
    if (typeof startTime === 'number') {
      const responseTime = Date.now() - startTime;
      serviceRef.current.recordUserAction(notificationId, 'mark_read', responseTime);
    }
  }, []);

  const markAllAsRead = useCallback(() => {
    const allIds = notifications.map((n) => n.id);
    setReadNotifications(new Set(allIds));
  }, [notifications]);

  const dismissNotification = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    setReadNotifications((prev) => { const s = new Set(prev); s.delete(notificationId); return s; });
    const startTime = actionStartTimes.current.get(notificationId);
    if (typeof startTime === 'number') {
      const responseTime = Date.now() - startTime;
      serviceRef.current.recordUserAction(notificationId, 'dismiss', responseTime);
    }
    actionStartTimes.current.delete(notificationId);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AINotificationSettings>) => {
    serviceRef.current.updateSettings(newSettings);
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const recordUserAction = useCallback((notificationId: string, action: string) => {
    if (!actionStartTimes.current.has(notificationId)) {
      actionStartTimes.current.set(notificationId, Date.now());
    }
    const start = actionStartTimes.current.get(notificationId) ?? Date.now();
    serviceRef.current.recordUserAction(notificationId, action, Date.now() - start);
  }, []);

  const getNotificationsByType = useCallback((type: AIEnhancedNotification['type']) => {
    return notifications.filter((n) => n.type === type);
  }, [notifications]);

  const getNotificationsByCategory = useCallback((category: AIEnhancedNotification['aiCategory']) => {
    return notifications.filter((n) => n.aiCategory === category);
  }, [notifications]);

  const getHighPriorityNotifications = useCallback(() => {
    return notifications.filter((n) => n.aiPriority >= 4);
  }, [notifications]);

  const getNotificationsForRole = useCallback((role: string) => {
    return notifications.filter((n) => n.suggestedActions?.some(() => true) || role === 'all');
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !readNotifications.has(n.id)).length;

  useEffect(() => {
    return () => {
      if (refreshTimer.current) clearInterval(refreshTimer.current);
    };
  }, []);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    settings,
    processNotification,
    processMultipleNotifications,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    updateSettings,
    recordUserAction,
    refreshNotifications,
    getNotificationsByType,
    getNotificationsByCategory,
    getHighPriorityNotifications,
    getNotificationsForRole
  };
};

export default useAINotifications;
