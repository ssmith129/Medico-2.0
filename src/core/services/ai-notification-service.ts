interface NotificationInput {
  id: string;
  title: string;
  description: string;
  sender: string;
  senderRole: string;
  timestamp: Date;
  metadata?: {
    patientId?: string;
    doctorId?: string;
    appointmentId?: string;
    labResultId?: string;
    urgencyKeywords?: string[];
    medicalTerms?: string[];
    [key: string]: any;
  };
  rawContent?: string;
}

interface ProcessedNotification extends NotificationInput {
  type: 'critical' | 'urgent' | 'routine' | 'system';
  category: 'appointment' | 'medical' | 'administrative' | 'emergency' | 'reminder';
  aiPriority: number; // 1-5 scale
  aiConfidence: number; // 0-1 scale
  aiInsight?: string;
  actionSuggested?: boolean;
  actionType?: 'accept' | 'review' | 'respond' | 'acknowledge';
  groupId?: string;
  isGroupable: boolean;
  suggestedRole: string[];
  urgencyScore: number;
  medicalRelevanceScore: number;
  timeRelevanceScore: number;
}

interface AISettings {
  enabled: boolean;
  priorityWeight: number;
  categoryWeights: {
    emergency: number;
    medical: number;
    appointment: number;
    administrative: number;
    reminder: number;
  };
  smartGrouping: boolean;
  groupSimilarThreshold: number;
  roleBasedFiltering: {
    enabled: boolean;
    userRoles: string[];
    departmentFilter: string[];
  };
  learningMode: {
    enabled: boolean;
    adaptToBehavior: boolean;
  };
}

class AINotificationService {
  private settings: AISettings;
  private medicalKeywords: { [key: string]: number };
  private urgencyKeywords: { [key: string]: number };
  private actionKeywords: { [key: string]: string };
  private userBehaviorData: { [key: string]: any };

  constructor(settings: AISettings) {
    this.settings = settings;
    this.initializeKeywords();
    this.userBehaviorData = this.loadUserBehaviorData();
  }

  private initializeKeywords() {
    // Medical urgency keywords with weight scores
    this.medicalKeywords = {
      'emergency': 10,
      'critical': 10,
      'urgent': 9,
      'stat': 9,
      'immediate': 9,
      'cardiac': 8,
      'stroke': 8,
      'bleeding': 8,
      'unconscious': 8,
      'respiratory': 7,
      'pain': 6,
      'abnormal': 6,
      'elevated': 5,
      'concern': 4,
      'follow-up': 3,
      'routine': 2,
      'scheduled': 2,
      'reminder': 1
    };

    // General urgency indicators
    this.urgencyKeywords = {
      'asap': 9,
      'immediately': 9,
      'now': 8,
      'urgent': 8,
      'priority': 7,
      'important': 6,
      'attention': 5,
      'please': 4,
      'when possible': 2,
      'convenient': 1
    };

    // Action suggestion keywords
    this.actionKeywords = {
      'book': 'accept',
      'schedule': 'accept',
      'confirm': 'accept',
      'approve': 'accept',
      'review': 'review',
      'check': 'review',
      'examine': 'review',
      'contact': 'respond',
      'call': 'respond',
      'notify': 'respond',
      'acknowledge': 'acknowledge',
      'received': 'acknowledge'
    };
  }

  private loadUserBehaviorData(): { [key: string]: any } {
    // In a real implementation, this would load from user behavior analytics
    return {
      avgResponseTimeByCategory: {
        emergency: 2, // minutes
        medical: 15,
        appointment: 60,
        administrative: 240,
        reminder: 1440
      },
      preferredNotificationTimes: [8, 9, 10, 11, 14, 15, 16], // hours
      interactionPatterns: {
        quickDismiss: ['reminder', 'routine administrative'],
        immediateAction: ['emergency', 'critical medical'],
        scheduledReview: ['appointment', 'medical reports']
      },
      categoryEngagement: {
        emergency: 0.95,
        medical: 0.85,
        appointment: 0.75,
        administrative: 0.45,
        reminder: 0.30
      }
    };
  }

  public processNotification(notification: NotificationInput): ProcessedNotification {
    if (!this.settings.enabled) {
      return this.createBasicProcessedNotification(notification);
    }

    const urgencyScore = this.calculateUrgencyScore(notification);
    const medicalRelevanceScore = this.calculateMedicalRelevance(notification);
    const timeRelevanceScore = this.calculateTimeRelevance(notification);
    
    const category = this.categorizeNotification(notification, urgencyScore, medicalRelevanceScore);
    const type = this.determineNotificationType(urgencyScore, medicalRelevanceScore, category);
    const aiPriority = this.calculateAIPriority(urgencyScore, medicalRelevanceScore, timeRelevanceScore, category);
    
    const aiInsight = this.generateAIInsight(notification, category, type, urgencyScore);
    const actionSuggestion = this.suggestAction(notification, category, type);
    const suggestedRoles = this.determineSuggestedRoles(notification, category);
    
    const processed: ProcessedNotification = {
      ...notification,
      type,
      category,
      aiPriority,
      aiConfidence: this.calculateConfidence(urgencyScore, medicalRelevanceScore),
      aiInsight,
      actionSuggested: actionSuggestion.suggested,
      actionType: actionSuggestion.type,
      isGroupable: this.isGroupable(notification, category),
      suggestedRole: suggestedRoles,
      urgencyScore,
      medicalRelevanceScore,
      timeRelevanceScore
    };

    if (this.settings.smartGrouping && processed.isGroupable) {
      processed.groupId = this.generateGroupId(processed);
    }

    return processed;
  }

  private calculateUrgencyScore(notification: NotificationInput): number {
    let score = 0;
    const content = `${notification.title} ${notification.description}`.toLowerCase();

    // Check for urgency keywords
    Object.entries(this.urgencyKeywords).forEach(([keyword, weight]) => {
      if (content.includes(keyword)) {
        score += weight;
      }
    });

    // Check for medical urgency
    Object.entries(this.medicalKeywords).forEach(([keyword, weight]) => {
      if (content.includes(keyword)) {
        score += weight;
      }
    });

    // Time-based urgency
    const now = new Date();
    const notificationTime = new Date(notification.timestamp);
    const timeDiff = now.getTime() - notificationTime.getTime();
    const hoursOld = timeDiff / (1000 * 60 * 60);

    if (hoursOld < 0.5) score += 3; // Very recent
    else if (hoursOld < 2) score += 2; // Recent
    else if (hoursOld > 24) score -= 2; // Old notification

    // Sender role weight
    const senderRole = notification.senderRole?.toLowerCase();
    if (senderRole === 'doctor' || senderRole === 'physician') score += 3;
    else if (senderRole === 'nurse') score += 2;
    else if (senderRole === 'emergency') score += 5;

    // Metadata indicators
    if (notification.metadata?.urgencyKeywords?.length) {
      score += notification.metadata.urgencyKeywords.length * 2;
    }

    return Math.min(Math.max(score, 0), 50); // Normalize to 0-50
  }

  private calculateMedicalRelevance(notification: NotificationInput): number {
    let score = 0;
    const content = `${notification.title} ${notification.description}`.toLowerCase();

    // Medical terms detection
    const medicalTerms = [
      'patient', 'diagnosis', 'treatment', 'medication', 'prescription',
      'lab', 'test', 'result', 'vital', 'surgery', 'procedure',
      'consultation', 'examination', 'symptom', 'condition',
      'blood', 'pressure', 'heart', 'lung', 'brain', 'kidney'
    ];

    medicalTerms.forEach(term => {
      if (content.includes(term)) score += 2;
    });

    // Medical metadata
    if (notification.metadata?.patientId) score += 5;
    if (notification.metadata?.doctorId) score += 3;
    if (notification.metadata?.labResultId) score += 4;
    if (notification.metadata?.medicalTerms?.length) {
      score += notification.metadata.medicalTerms.length * 1.5;
    }

    // Medical department indicators
    const medicalDepts = ['cardiology', 'emergency', 'icu', 'surgery', 'pediatrics'];
    medicalDepts.forEach(dept => {
      if (content.includes(dept)) score += 3;
    });

    return Math.min(Math.max(score, 0), 30); // Normalize to 0-30
  }

  private calculateTimeRelevance(notification: NotificationInput): number {
    const now = new Date();
    const notificationTime = new Date(notification.timestamp);
    const hour = now.getHours();
    
    let score = 10; // Base score

    // Time of day relevance
    if (this.userBehaviorData.preferredNotificationTimes.includes(hour)) {
      score += 5;
    }

    // Night hours penalty (except for emergencies)
    if (hour < 6 || hour > 22) {
      const content = `${notification.title} ${notification.description}`.toLowerCase();
      if (!content.includes('emergency') && !content.includes('critical')) {
        score -= 8;
      }
    }

    // Recency bonus
    const timeDiff = now.getTime() - notificationTime.getTime();
    const minutesOld = timeDiff / (1000 * 60);
    
    if (minutesOld < 5) score += 5;
    else if (minutesOld < 30) score += 3;
    else if (minutesOld < 120) score += 1;
    else if (minutesOld > 1440) score -= 5; // Older than a day

    return Math.min(Math.max(score, 0), 20); // Normalize to 0-20
  }

  private categorizeNotification(
    notification: NotificationInput, 
    urgencyScore: number, 
    medicalRelevanceScore: number
  ): ProcessedNotification['category'] {
    const content = `${notification.title} ${notification.description}`.toLowerCase();

    // Emergency indicators
    if (urgencyScore > 25 || content.includes('emergency') || content.includes('critical')) {
      return 'emergency';
    }

    // Medical category
    if (medicalRelevanceScore > 15 || 
        notification.metadata?.patientId || 
        notification.metadata?.labResultId ||
        content.includes('patient') || 
        content.includes('medical')) {
      return 'medical';
    }

    // Appointment category
    if (content.includes('appointment') || 
        content.includes('schedule') || 
        content.includes('booking') ||
        notification.metadata?.appointmentId) {
      return 'appointment';
    }

    // Reminder category
    if (content.includes('reminder') || 
        content.includes('due') || 
        content.includes('upcoming')) {
      return 'reminder';
    }

    // Default to administrative
    return 'administrative';
  }

  private determineNotificationType(
    urgencyScore: number, 
    medicalRelevanceScore: number, 
    category: ProcessedNotification['category']
  ): ProcessedNotification['type'] {
    // Critical conditions
    if (category === 'emergency' || urgencyScore > 30) {
      return 'critical';
    }

    // Urgent conditions
    if (urgencyScore > 20 || medicalRelevanceScore > 20 || 
        (category === 'medical' && urgencyScore > 15)) {
      return 'urgent';
    }

    // System notifications
    if (category === 'administrative' && urgencyScore < 5) {
      return 'system';
    }

    // Default to routine
    return 'routine';
  }

  private calculateAIPriority(
    urgencyScore: number, 
    medicalRelevanceScore: number, 
    timeRelevanceScore: number, 
    category: ProcessedNotification['category']
  ): number {
    let priority = 0;

    // Base score calculation
    priority += urgencyScore * 0.5;
    priority += medicalRelevanceScore * 0.3;
    priority += timeRelevanceScore * 0.2;

    // Category weight application
    const categoryWeight = this.settings.categoryWeights[category] / 100;
    priority *= categoryWeight;

    // User behavior adjustment
    if (this.settings.learningMode.enabled && this.settings.learningMode.adaptToBehavior) {
      const engagementScore = this.userBehaviorData.categoryEngagement[category] || 0.5;
      priority *= (0.7 + engagementScore * 0.3); // Adjust by engagement
    }

    // Priority weight application
    const aiWeight = this.settings.priorityWeight / 100;
    priority = priority * aiWeight + (1 - aiWeight) * 2.5; // Blend with neutral score

    // Normalize to 1-5 scale
    return Math.min(Math.max(Math.round(priority / 10), 1), 5);
  }

  private calculateConfidence(urgencyScore: number, medicalRelevanceScore: number): number {
    // Higher scores generally mean higher confidence
    const totalScore = urgencyScore + medicalRelevanceScore;
    let confidence = 0.5; // Base confidence

    if (totalScore > 40) confidence = 0.95;
    else if (totalScore > 30) confidence = 0.85;
    else if (totalScore > 20) confidence = 0.75;
    else if (totalScore > 10) confidence = 0.65;

    return confidence;
  }

  private generateAIInsight(
    notification: NotificationInput, 
    category: ProcessedNotification['category'], 
    type: ProcessedNotification['type'], 
    urgencyScore: number
  ): string {
    const insights = [];

    if (type === 'critical') {
      insights.push('Critical: Requires immediate medical intervention');
      if (urgencyScore > 35) {
        insights.push('within 10 minutes');
      } else {
        insights.push('within 30 minutes');
      }
    } else if (type === 'urgent') {
      if (category === 'medical') {
        insights.push('Medical attention needed: Contact patient within 2 hours');
      } else if (category === 'appointment') {
        insights.push('High impact: Affects multiple patients and schedules');
      }
    } else if (type === 'routine') {
      if (category === 'appointment') {
        insights.push('Routine booking cluster - can be processed in batch');
      } else {
        insights.push('Standard priority - process when convenient');
      }
    }

    // Add behavior-based insights
    if (this.settings.learningMode.enabled) {
      const avgResponseTime = this.userBehaviorData.avgResponseTimeByCategory[category];
      if (avgResponseTime < 30) {
        insights.push('You typically respond to these quickly');
      }
    }

    return insights.join('. ');
  }

  private suggestAction(
    notification: NotificationInput, 
    category: ProcessedNotification['category'], 
    type: ProcessedNotification['type']
  ): { suggested: boolean; type?: ProcessedNotification['actionType'] } {
    const content = `${notification.title} ${notification.description}`.toLowerCase();

    // Check for action keywords
    for (const [keyword, actionType] of Object.entries(this.actionKeywords)) {
      if (content.includes(keyword)) {
        return { suggested: true, type: actionType as ProcessedNotification['actionType'] };
      }
    }

    // Category-based suggestions
    if (type === 'critical') {
      return { suggested: true, type: 'respond' };
    } else if (category === 'appointment') {
      return { suggested: true, type: 'accept' };
    } else if (category === 'medical' && type === 'urgent') {
      return { suggested: true, type: 'review' };
    }

    return { suggested: false };
  }

  private determineSuggestedRoles(
    notification: NotificationInput, 
    category: ProcessedNotification['category']
  ): string[] {
    const roles = [];

    switch (category) {
      case 'emergency':
        roles.push('doctor', 'nurse', 'emergency-staff');
        break;
      case 'medical':
        roles.push('doctor', 'nurse');
        break;
      case 'appointment':
        roles.push('admin', 'receptionist', 'doctor');
        break;
      case 'administrative':
        roles.push('admin', 'manager');
        break;
      case 'reminder':
        roles.push('all');
        break;
    }

    // Filter based on user's role settings
    if (this.settings.roleBasedFiltering.enabled) {
      return roles.filter(role => 
        this.settings.roleBasedFiltering.userRoles.includes(role) || role === 'all'
      );
    }

    return roles;
  }

  private isGroupable(
    notification: NotificationInput, 
    category: ProcessedNotification['category']
  ): boolean {
    if (!this.settings.smartGrouping) return false;

    // Emergency notifications are never grouped
    if (category === 'emergency') return false;

    // Routine appointments and reminders are groupable
    return category === 'appointment' || category === 'reminder' || category === 'administrative';
  }

  private generateGroupId(notification: ProcessedNotification): string {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return `${notification.category}-${date}`;
  }

  private createBasicProcessedNotification(notification: NotificationInput): ProcessedNotification {
    return {
      ...notification,
      type: 'routine',
      category: 'administrative',
      aiPriority: 3,
      aiConfidence: 0.5,
      isGroupable: false,
      suggestedRole: ['all'],
      urgencyScore: 0,
      medicalRelevanceScore: 0,
      timeRelevanceScore: 10
    };
  }

  public processMultipleNotifications(notifications: NotificationInput[]): ProcessedNotification[] {
    const processed = notifications.map(notification => this.processNotification(notification));
    
    if (this.settings.smartGrouping) {
      return this.applySmartGrouping(processed);
    }
    
    return processed.sort((a, b) => b.aiPriority - a.aiPriority);
  }

  private applySmartGrouping(notifications: ProcessedNotification[]): ProcessedNotification[] {
    const groups: { [key: string]: ProcessedNotification[] } = {};
    const ungrouped: ProcessedNotification[] = [];

    notifications.forEach(notification => {
      if (notification.isGroupable && notification.groupId) {
        if (!groups[notification.groupId]) {
          groups[notification.groupId] = [];
        }
        groups[notification.groupId].push(notification);
      } else {
        ungrouped.push(notification);
      }
    });

    const result: ProcessedNotification[] = [...ungrouped];

    Object.entries(groups).forEach(([groupId, groupNotifications]) => {
      if (groupNotifications.length >= 2) {
        // Create a representative notification for the group
        const representative = { ...groupNotifications[0] };
        representative.title = `${groupNotifications.length} ${representative.category} notifications`;
        representative.description = `Multiple ${representative.category} items: ${groupNotifications.map(n => n.title).slice(0, 2).join(', ')}${groupNotifications.length > 2 ? '...' : ''}`;
        representative.isGrouped = true;
        representative.groupCount = groupNotifications.length;
        
        result.push(representative);
      } else {
        result.push(...groupNotifications);
      }
    });

    return result.sort((a, b) => b.aiPriority - a.aiPriority);
  }

  public updateSettings(newSettings: Partial<AISettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  public recordUserAction(notificationId: string, action: string, responseTime: number): void {
    if (this.settings.learningMode.enabled) {
      // In a real implementation, this would update user behavior analytics
      console.log(`Recording user action: ${action} on ${notificationId} after ${responseTime}ms`);
    }
  }
}

export { AINotificationService, type NotificationInput, type ProcessedNotification, type AISettings };
