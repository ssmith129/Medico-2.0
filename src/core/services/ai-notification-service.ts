/**
 * AI-Enhanced Notification Service
 * Handles intelligent notification processing, prioritization, and grouping
 */

// Base input for notifications flowing into the service
export interface NotificationData {
  id: string;
  title: string;
  message: string;
  avatar?: string;
  timestamp: Date;
  isRead: boolean;
  type: 'appointment' | 'medical' | 'system' | 'urgent' | 'reminder';
  sender: string;
  metadata?: {
    patientId?: string;
    doctorId?: string;
    priority?: number;
    category?: string;
    relatedTo?: string[];
    [key: string]: unknown;
  };
}

// Public enhanced type used across UI
export interface AIEnhancedNotification extends NotificationData {
  aiPriority: number; // 1-5 scale (5 being highest)
  aiCategory: 'critical' | 'important' | 'routine' | 'informational';
  aiSummary?: string; // Shortened version for long notifications
  suggestedActions?: Array<{
    label: string;
    action: string;
    type: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  }>;
  groupId?: string; // For grouping similar notifications
  groupCount?: number; // How many notifications in this group
  isGrouped?: boolean;
  personalizedTiming?: {
    optimalTime?: Date;
    frequencyScore?: number;
    userEngagement?: number;
  };
  confidence: number; // AI confidence score 0-1
}

// Minimal settings shape for runtime tuning from hooks/components
export type AINotificationSettings = {
  enabled: boolean;
  quietHours?: { start: number; end: number }; // 0-23
  minPriority?: 'high' | 'medium' | 'low';
  roleBasedFiltering?: { enabled: boolean; userRoles: string[]; departmentFilter: string[] };
  categoryWeights?: Record<string, number>;
};

// Action union (handy for future reducers/analytics)
export type AINotificationAction =
  | { type: 'archive'; id: string }
  | { type: 'snooze'; id: string; until: number }
  | { type: 'mark_read'; id: string };

// Public service interface
export interface AINotificationService {
  getNotifications(): Promise<AIEnhancedNotification[]>;
  processNotification(n: NotificationData): Promise<AIEnhancedNotification>;
  processMultipleNotifications(list: NotificationData[]): Promise<AIEnhancedNotification[]>;
  processNotifications(list: NotificationData[]): Promise<AIEnhancedNotification[]>; // backward compatible
  updateSettings(next: Partial<AINotificationSettings>): void;
  recordUserAction(notificationId: string, action: string, meta?: number | Date): void;
  getProcessingStatus(): boolean;
  clearCache(): void;
}

interface UserBehaviorData {
  averageResponseTime: { [key: string]: number };
  preferredCategories: string[];
  activeHours: number[];
  clickThroughRates: { [key: string]: number };
  dismissalPatterns: { [key: string]: number };
}

class AINotificationServiceImpl implements AINotificationService {
  private userBehavior: UserBehaviorData;
  private isProcessing = false;
  private cache: Map<string, AIEnhancedNotification[]> = new Map();
  private settings: AINotificationSettings = { enabled: true, minPriority: 'low' };

  constructor(init?: Partial<AINotificationSettings>) {
    this.settings = { ...this.settings, ...init };
    this.userBehavior = this.loadUserBehaviorData();
  }

  updateSettings(next: Partial<AINotificationSettings>): void {
    this.settings = { ...this.settings, ...next };
  }

  async getNotifications(): Promise<AIEnhancedNotification[]> {
    // In a real app, fetch from API; here return cached or empty
    return this.cache.get('processed') ?? [];
  }

  async processNotification(notification: NotificationData): Promise<AIEnhancedNotification> {
    const enhanced = await this.enhanceNotification(notification);
    return enhanced;
  }

  async processMultipleNotifications(list: NotificationData[]): Promise<AIEnhancedNotification[]> {
    return this.processNotifications(list);
  }

  /**
   * Backward-compatible API used in several components
   */
  async processNotifications(notifications: NotificationData[]): Promise<AIEnhancedNotification[]> {
    this.isProcessing = true;
    try {
      const enhanced = await Promise.all(
        notifications.map((n) => this.enhanceNotification(n))
      );

      const grouped = this.intelligentGrouping(enhanced);
      const prioritized = this.smartPrioritization(grouped);

      this.cache.set('processed', prioritized);
      return prioritized;
    } catch (error) {
      console.error('AI processing failed:', error);
      return this.fallbackProcessing(notifications);
    } finally {
      this.isProcessing = false;
    }
  }

  recordUserAction(notificationId: string, action: string, meta?: number | Date): void {
    // Accept either responseTime (number) or timestamp (Date)
    const detail = meta instanceof Date ? meta.toISOString() : typeof meta === 'number' ? `${meta}ms` : 'n/a';
    // Hook for analytics/ML pipeline
    console.log(`User action: ${action} on ${notificationId} meta=${detail}`);
    this.updateUserBehavior(notificationId, action, new Date());
  }

  getProcessingStatus(): boolean { return this.isProcessing; }
  clearCache(): void { this.cache.clear(); }

  // ===== Private helpers =====
  private async enhanceNotification(notification: NotificationData): Promise<AIEnhancedNotification> {
    const aiPriority = this.calculatePriority(notification);
    const aiCategory = this.categorizeNotification(notification);
    const aiSummary = this.generateSummary(notification.message);
    const suggestedActions = this.generateSuggestedActions(notification);
    const personalizedTiming = this.calculatePersonalizedTiming(notification);
    const confidence = this.calculateConfidence(notification);

    return {
      ...notification,
      aiPriority,
      aiCategory,
      aiSummary,
      suggestedActions,
      personalizedTiming,
      confidence
    };
  }

  private calculatePriority(notification: NotificationData): number {
    let priority = 3;
    const timeSince = Date.now() - notification.timestamp.getTime();
    const hours = timeSince / (1000 * 60 * 60);
    if (hours < 1) priority += 1;
    if (hours > 24) priority -= 1;

    const urgentKeywords = ['urgent', 'emergency', 'critical', 'stat', 'immediate'];
    const msg = notification.message.toLowerCase();
    if (urgentKeywords.some((k) => msg.includes(k))) priority += 2;

    const typePriorities: Record<string, number> = {
      urgent: 5,
      medical: 4,
      appointment: 3,
      system: 2,
      reminder: 1
    };
    priority = Math.max(priority, typePriorities[notification.type] ?? 3);

    const engagement = this.userBehavior.clickThroughRates[notification.type] ?? 0.5;
    priority = Math.round(priority * (0.5 + engagement));

    return Math.max(1, Math.min(5, priority));
  }

  private categorizeNotification(notification: NotificationData): 'critical' | 'important' | 'routine' | 'informational' {
    const message = notification.message.toLowerCase();
    const type = notification.type;
    if (type === 'urgent' || message.includes('emergency') || message.includes('critical') || message.includes('stat')) return 'critical';
    if (type === 'medical' || message.includes('patient') || message.includes('doctor') || message.includes('surgery') || message.includes('appointment')) return 'important';
    if (type === 'appointment' || message.includes('scheduled') || message.includes('booked') || message.includes('completed')) return 'routine';
    return 'informational';
  }

  private generateSummary(message: string): string | undefined {
    if (message.length <= 100) return undefined;
    const sentences = message.split('.').filter((s) => s.trim().length > 0);
    if (sentences.length <= 1) return undefined;
    const keyWords = ['patient', 'doctor', 'appointment', 'surgery', 'emergency', 'completed', 'report'];
    const importantSentences = sentences.filter((s) => keyWords.some((w) => s.toLowerCase().includes(w)));
    return (importantSentences[0] ?? sentences[0]).trim() + '...';
  }

  private generateSuggestedActions(notification: NotificationData) {
    const actions: AIEnhancedNotification['suggestedActions'] = [
      { label: 'Mark as Read', action: 'mark-read', type: 'secondary' }
    ];
    const msg = notification.message.toLowerCase();
    if (notification.type === 'appointment' || msg.includes('appointment')) {
      actions.push({ label: 'View Details', action: 'view-appointment', type: 'primary' });
      if (msg.includes('booked') || msg.includes('scheduled')) actions.push({ label: 'Confirm', action: 'confirm-appointment', type: 'success' });
    }
    if (notification.type === 'medical' || msg.includes('patient')) actions.push({ label: 'View Patient', action: 'view-patient', type: 'primary' });
    if (notification.type === 'urgent' || msg.includes('emergency')) actions.push({ label: 'Respond Now', action: 'emergency-response', type: 'danger' });
    if (msg.includes('completed') || msg.includes('report')) actions.push({ label: 'Review', action: 'review-report', type: 'primary' });
    return actions.slice(0, 3);
  }

  private intelligentGrouping(list: AIEnhancedNotification[]): AIEnhancedNotification[] {
    const groups = new Map<string, AIEnhancedNotification[]>();
    list.forEach((n) => {
      const key = this.groupKey(n);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(n);
    });

    const result: AIEnhancedNotification[] = [];
    groups.forEach((items, key) => {
      if (items.length > 1 && this.shouldGroup(items)) {
        const rep = items[0];
        const grouped: AIEnhancedNotification = {
          ...rep,
          id: `group-${key}`,
          title: this.groupTitle(items),
          message: this.groupMessage(items),
          isGrouped: true,
          groupId: key,
          groupCount: items.length,
          aiPriority: Math.max(...items.map((n) => n.aiPriority)),
          timestamp: new Date(Math.max(...items.map((n) => n.timestamp.getTime())))
        };
        result.push(grouped);
      } else {
        result.push(...items);
      }
    });
    return result;
  }

  private groupKey(n: AIEnhancedNotification): string {
    if (n.type === 'appointment') return `appointments-${n.timestamp.toDateString()}`;
    if (n.type === 'system') return 'system-notifications';
    if (n.message.includes('completed') || n.message.includes('report')) return `reports-${n.sender}`;
    return `individual-${n.id}`;
  }

  private shouldGroup(items: AIEnhancedNotification[]): boolean {
    if (items.some((n) => n.aiCategory === 'critical')) return false;
    return items.length >= 2 && items.every((n) => n.aiCategory === 'routine' || n.aiCategory === 'informational');
  }

  private groupTitle(notifications: AIEnhancedNotification[]): string {
    const type = notifications[0].type;
    const count = notifications.length;
    switch (type) {
      case 'appointment':
        return `${count} Appointment Updates`;
      case 'system':
        return `${count} System Notifications`;
      case 'medical':
        return `${count} Medical Reports`;
      default:
        return `${count} Notifications`;
    }
  }

  private groupMessage(notifications: AIEnhancedNotification[]): string {
    const senders = [...new Set(notifications.map(n => n.sender))];
    const type = notifications[0].type;
    if (senders.length === 1) {
      return `${senders[0]} sent ${notifications.length} ${type} notifications`;
    }
    return `${notifications.length} ${type} notifications from ${senders.length} sources`;
  }

  private smartPrioritization(items: AIEnhancedNotification[]): AIEnhancedNotification[] {
    return items.sort((a, b) => {
      if (a.aiPriority !== b.aiPriority) return b.aiPriority - a.aiPriority;
      const ae = this.userBehavior.clickThroughRates[a.type] ?? 0;
      const be = this.userBehavior.clickThroughRates[b.type] ?? 0;
      if (ae !== be) return be - ae;
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
  }

  private calculatePersonalizedTiming(notification: NotificationData) {
    const now = new Date();
    const currentHour = now.getHours();
    const active = this.userBehavior.activeHours.includes(currentHour);
    const dismissalRate = this.userBehavior.dismissalPatterns[notification.type] ?? 0.5;
    return {
      optimalTime: active ? now : this.nextActiveHour(now),
      frequencyScore: 1 - dismissalRate,
      userEngagement: this.userBehavior.clickThroughRates[notification.type] ?? 0.5
    };
  }

  private calculateConfidence(notification: NotificationData): number {
    let c = 0.8;
    if (notification.metadata?.category) c += 0.1;
    if (notification.type) c += 0.05;
    if (notification.avatar) c += 0.05;
    return Math.min(1, c);
  }

  private fallbackProcessing(list: NotificationData[]): AIEnhancedNotification[] {
    return list.map((n) => ({
      ...n,
      aiPriority: 3,
      aiCategory: 'routine',
      confidence: 0.5,
      suggestedActions: [{ label: 'Mark as Read', action: 'mark-read', type: 'secondary' }]
    }));
  }

  private nextActiveHour(base: Date): Date {
    const currentHour = base.getHours();
    const next = this.userBehavior.activeHours.find((h) => h > currentHour) ?? this.userBehavior.activeHours[0] + 24;
    const d = new Date(base);
    d.setHours(next % 24, 0, 0, 0);
    return d;
  }

  private loadUserBehaviorData(): UserBehaviorData {
    return {
      averageResponseTime: { urgent: 120, medical: 300, appointment: 900, system: 1800, reminder: 3600 },
      preferredCategories: ['medical', 'appointment', 'urgent'],
      activeHours: [8, 9, 10, 11, 14, 15, 16, 17],
      clickThroughRates: { urgent: 0.9, medical: 0.8, appointment: 0.7, system: 0.3, reminder: 0.5 },
      dismissalPatterns: { urgent: 0.1, medical: 0.2, appointment: 0.3, system: 0.7, reminder: 0.5 }
    };
  }

  private updateUserBehavior(_id: string, _action: string, _when: Date) {
    // integrate with analytics/ML here
  }
}

// Singleton + factory
const _service = new AINotificationServiceImpl();
export const aiNotificationService: AINotificationService = _service as AINotificationService;
export function createAINotificationService(init?: Partial<AINotificationSettings>): AINotificationService {
  return new AINotificationServiceImpl(init);
}
