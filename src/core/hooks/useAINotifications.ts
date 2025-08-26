import { useState, useEffect, useCallback, useRef } from 'react';
import { AINotificationService, NotificationInput, ProcessedNotification, AISettings } from '../services/ai-notification-service';

interface UseAINotificationsOptions {
  settings?: Partial<AISettings>;
  autoRefresh?: boolean;
  refreshInterval?: number;
  enableRealtime?: boolean;
}

interface UseAINotificationsReturn {
  notifications: ProcessedNotification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  settings: AISettings;
  
  // Actions
  processNotification: (notification: NotificationInput) => ProcessedNotification;
  processMultipleNotifications: (notifications: NotificationInput[]) => ProcessedNotification[];
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (notificationId: string) => void;
  updateSettings: (newSettings: Partial<AISettings>) => void;
  recordUserAction: (notificationId: string, action: string) => void;
  refreshNotifications: () => Promise<void>;
  
  // Filtering and sorting
  getNotificationsByType: (type: ProcessedNotification['type']) => ProcessedNotification[];
  getNotificationsByCategory: (category: ProcessedNotification['category']) => ProcessedNotification[];
  getHighPriorityNotifications: () => ProcessedNotification[];
  getNotificationsForRole: (role: string) => ProcessedNotification[];
}

const defaultSettings: AISettings = {
  enabled: true,
  priorityWeight: 75,
  categoryWeights: {
    emergency: 100,
    medical: 85,
    appointment: 60,
    administrative: 40,
    reminder: 30
  },
  smartGrouping: true,
  groupSimilarThreshold: 70,
  roleBasedFiltering: {
    enabled: true,
    userRoles: ['doctor'],
    departmentFilter: []
  },
  learningMode: {
    enabled: true,
    adaptToBehavior: true
  }
};

export const useAINotifications = (options: UseAINotificationsOptions = {}): UseAINotificationsReturn => {
  const {
    settings: initialSettings = {},
    autoRefresh = true,
    refreshInterval = 30000, // 30 seconds
    enableRealtime = true
  } = options;

  const [notifications, setNotifications] = useState<ProcessedNotification[]>([]);
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<AISettings>({ ...defaultSettings, ...initialSettings });

  const aiService = useRef<AINotificationService>();
  const refreshTimer = useRef<NodeJS.Timeout>();
  const actionStartTimes = useRef<Map<string, number>>(new Map());

  // Initialize AI service
  useEffect(() => {
    aiService.current = new AINotificationService(settings);
  }, []);

  // Update AI service when settings change
  useEffect(() => {
    if (aiService.current) {
      aiService.current.updateSettings(settings);
    }
  }, [settings]);

  // Mock data fetcher - in a real app, this would fetch from an API
  const fetchNotifications = useCallback(async (): Promise<NotificationInput[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock notification data
    const mockNotifications: NotificationInput[] = [
      {
        id: "1",
        title: "Emergency Patient Alert",
        description: "Patient John Doe shows critical vitals - immediate attention required",
        sender: "Emergency System",
        senderRole: "emergency",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        metadata: {
          patientId: "P-001",
          urgencyKeywords: ["critical", "immediate"],
          medicalTerms: ["vitals", "emergency"]
        }
      },
      {
        id: "2",
        title: "Surgery Schedule Updated",
        description: "Dr. Smith updated tomorrow's surgery schedule - 3 operations rescheduled",
        sender: "Dr. Smith",
        senderRole: "doctor",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        metadata: {
          doctorId: "D-001"
        }
      },
      {
        id: "3",
        title: "Lab Results Available",
        description: "Patient Emily's blood work shows abnormal results requiring follow-up",
        sender: "Lab Department",
        senderRole: "lab-tech",
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        metadata: {
          patientId: "P-002",
          labResultId: "L-001",
          medicalTerms: ["blood work", "abnormal", "follow-up"]
        }
      },
      {
        id: "4",
        title: "Appointment Booking",
        description: "5 new appointments booked for this week",
        sender: "Booking System",
        senderRole: "system",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        metadata: {
          appointmentId: "A-001"
        }
      },
      {
        id: "5",
        title: "Medication Reminder",
        description: "Patient reminder: Take morning medication",
        sender: "Reminder System",
        senderRole: "system",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    ];

    return mockNotifications;
  }, []);

  // Refresh notifications
  const refreshNotifications = useCallback(async () => {
    if (!aiService.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const rawNotifications = await fetchNotifications();
      const processedNotifications = aiService.current.processMultipleNotifications(rawNotifications);
      setNotifications(processedNotifications);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }, [fetchNotifications]);

  // Auto-refresh setup
  useEffect(() => {
    if (autoRefresh) {
      refreshNotifications();
      
      refreshTimer.current = setInterval(() => {
        refreshNotifications();
      }, refreshInterval);

      return () => {
        if (refreshTimer.current) {
          clearInterval(refreshTimer.current);
        }
      };
    }
  }, [autoRefresh, refreshInterval, refreshNotifications]);

  // Realtime updates simulation
  useEffect(() => {
    if (!enableRealtime) return;

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshNotifications();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enableRealtime, refreshNotifications]);

  // Process single notification
  const processNotification = useCallback((notification: NotificationInput): ProcessedNotification => {
    if (!aiService.current) {
      throw new Error('AI service not initialized');
    }
    return aiService.current.processNotification(notification);
  }, []);

  // Process multiple notifications
  const processMultipleNotifications = useCallback((notifications: NotificationInput[]): ProcessedNotification[] => {
    if (!aiService.current) {
      throw new Error('AI service not initialized');
    }
    return aiService.current.processMultipleNotifications(notifications);
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    setReadNotifications(prev => new Set([...prev, notificationId]));
    
    // Record user action timing
    const startTime = actionStartTimes.current.get(notificationId);
    if (startTime && aiService.current) {
      const responseTime = Date.now() - startTime;
      aiService.current.recordUserAction(notificationId, 'mark_read', responseTime);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    const allIds = notifications.map(n => n.id);
    setReadNotifications(new Set(allIds));
  }, [notifications]);

  // Dismiss notification
  const dismissNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    setReadNotifications(prev => {
      const newSet = new Set(prev);
      newSet.delete(notificationId);
      return newSet;
    });

    // Record user action
    const startTime = actionStartTimes.current.get(notificationId);
    if (startTime && aiService.current) {
      const responseTime = Date.now() - startTime;
      aiService.current.recordUserAction(notificationId, 'dismiss', responseTime);
    }
    actionStartTimes.current.delete(notificationId);
  }, []);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<AISettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Record user action
  const recordUserAction = useCallback((notificationId: string, action: string) => {
    if (!actionStartTimes.current.has(notificationId)) {
      actionStartTimes.current.set(notificationId, Date.now());
    }

    if (aiService.current) {
      const startTime = actionStartTimes.current.get(notificationId) || Date.now();
      const responseTime = Date.now() - startTime;
      aiService.current.recordUserAction(notificationId, action, responseTime);
    }
  }, []);

  // Filter by type
  const getNotificationsByType = useCallback((type: ProcessedNotification['type']) => {
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  // Filter by category
  const getNotificationsByCategory = useCallback((category: ProcessedNotification['category']) => {
    return notifications.filter(n => n.category === category);
  }, [notifications]);

  // Get high priority notifications
  const getHighPriorityNotifications = useCallback(() => {
    return notifications.filter(n => n.aiPriority >= 4);
  }, [notifications]);

  // Filter by role
  const getNotificationsForRole = useCallback((role: string) => {
    return notifications.filter(n => 
      n.suggestedRole.includes(role) || n.suggestedRole.includes('all')
    );
  }, [notifications]);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !readNotifications.has(n.id)).length;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshTimer.current) {
        clearInterval(refreshTimer.current);
      }
    };
  }, []);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    settings,
    
    // Actions
    processNotification,
    processMultipleNotifications,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    updateSettings,
    recordUserAction,
    refreshNotifications,
    
    // Filtering and sorting
    getNotificationsByType,
    getNotificationsByCategory,
    getHighPriorityNotifications,
    getNotificationsForRole
  };
};

export default useAINotifications;
