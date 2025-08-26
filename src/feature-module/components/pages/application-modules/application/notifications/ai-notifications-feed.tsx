import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import ImageWithBasePath from "../../../../../../core/imageWithBasePath";
import { Badge } from "antd";

interface NotificationItem {
  id: string;
  type: 'critical' | 'urgent' | 'routine' | 'system';
  category: 'appointment' | 'medical' | 'administrative' | 'emergency' | 'reminder';
  aiPriority: number; // 1-5 scale
  title: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
  isGrouped: boolean;
  groupId?: string;
  groupCount?: number;
  aiInsight?: string;
  actionSuggested?: boolean;
  actionType?: 'accept' | 'review' | 'respond' | 'acknowledge';
  avatar: string;
  sender: string;
  role: string[];
  metadata?: {
    patientId?: string;
    doctorId?: string;
    appointmentId?: string;
    [key: string]: any;
  };
}

const AINotificationsFeed = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('ai-priority');
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [groupSimilar, setGroupSimilar] = useState(true);

  // Mock data with AI-enhanced notifications
  const mockNotifications: NotificationItem[] = [
    {
      id: "1",
      type: "critical",
      category: "emergency",
      aiPriority: 5,
      title: "Emergency Patient Alert",
      description: "Patient John Doe shows critical vitals - immediate attention required",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isRead: false,
      isGrouped: false,
      aiInsight: "Critical: Requires immediate medical intervention within 10 minutes",
      actionSuggested: true,
      actionType: "respond",
      avatar: "assets/img/doctors/doctor-01.jpg",
      sender: "Dr. Emergency System",
      role: ["doctor", "nurse"]
    },
    {
      id: "2", 
      type: "urgent",
      category: "appointment",
      aiPriority: 4,
      title: "Surgery Schedule Updated",
      description: "Dr. Smith updated tomorrow's surgery schedule - 3 operations rescheduled",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      isRead: false,
      isGrouped: false,
      aiInsight: "High impact: Affects multiple patients and surgical team schedules",
      actionSuggested: true,
      actionType: "review",
      avatar: "assets/img/doctors/doctor-01.jpg",
      sender: "Dr. Smith",
      role: ["doctor", "nurse", "admin"]
    },
    {
      id: "3",
      type: "routine",
      category: "appointment",
      aiPriority: 2,
      title: "Appointment Bookings",
      description: "5 new appointments booked for this week",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: false,
      isGrouped: true,
      groupId: "appointments-today",
      groupCount: 5,
      aiInsight: "Routine booking cluster - can be processed in batch",
      avatar: "assets/img/icons/calendar-icon.svg",
      sender: "Booking System",
      role: ["admin", "receptionist"]
    },
    {
      id: "4",
      type: "urgent",
      category: "medical",
      aiPriority: 4,
      title: "Lab Results Critical",
      description: "Patient Emily's blood work shows abnormal results requiring follow-up",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      isRead: false,
      isGrouped: false,
      aiInsight: "Medical attention needed: Contact patient within 2 hours",
      actionSuggested: true,
      actionType: "accept",
      avatar: "assets/img/doctors/doctor-06.jpg",
      sender: "Lab Department",
      role: ["doctor"]
    }
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
  }, []);

  const getPriorityColor = (type: string, priority: number) => {
    switch (type) {
      case 'critical':
        return 'danger';
      case 'urgent':
        return 'warning';
      case 'routine':
        return 'info';
      case 'system':
        return 'secondary';
      default:
        return 'info';
    }
  };

  const getPriorityIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return 'ti ti-alert-triangle-filled';
      case 'urgent':
        return 'ti ti-bell-ringing';
      case 'routine':
        return 'ti ti-bell';
      case 'system':
        return 'ti ti-settings';
      default:
        return 'ti ti-bell';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'appointment':
        return 'ti ti-calendar';
      case 'medical':
        return 'ti ti-stethoscope';
      case 'administrative':
        return 'ti ti-file-text';
      case 'emergency':
        return 'ti ti-emergency-bed';
      case 'reminder':
        return 'ti ti-alarm';
      default:
        return 'ti ti-bell';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filterType === 'all') return true;
    return notification.type === filterType || notification.category === filterType;
  });

  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    if (sortBy === 'ai-priority') {
      return b.aiPriority - a.aiPriority;
    }
    if (sortBy === 'timestamp') {
      return b.timestamp.getTime() - a.timestamp.getTime();
    }
    return 0;
  });

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const dismissNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  return (
    <div className="ai-notifications-feed">
      {/* AI Feed Header */}
      <div className="ai-feed-header bg-white rounded-3 p-4 mb-4 border">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center">
            <div className="ai-indicator me-3">
              <i className="ti ti-robot text-primary fs-20"></i>
              <span className="badge bg-primary-transparent text-primary ms-2">AI Enhanced</span>
            </div>
            <h5 className="mb-0 fw-bold">Smart Notifications</h5>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Link to="#" className="btn btn-outline-primary btn-sm">
              <i className="ti ti-settings me-1"></i>
              AI Settings
            </Link>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="filter-controls d-flex flex-wrap gap-3 align-items-center">
          <div className="filter-group">
            <label className="form-label fs-12 text-muted mb-1">Filter by Type</label>
            <select 
              className="form-select form-select-sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Notifications</option>
              <option value="critical">Critical</option>
              <option value="urgent">Urgent</option>
              <option value="routine">Routine</option>
              <option value="emergency">Emergency</option>
              <option value="appointment">Appointments</option>
              <option value="medical">Medical</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="form-label fs-12 text-muted mb-1">Sort by</label>
            <select 
              className="form-select form-select-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="ai-priority">AI Priority</option>
              <option value="timestamp">Latest First</option>
            </select>
          </div>

          <div className="ai-toggles d-flex align-items-center gap-3">
            <div className="form-check form-switch">
              <input 
                className="form-check-input" 
                type="checkbox" 
                id="aiInsights"
                checked={showAIInsights}
                onChange={(e) => setShowAIInsights(e.target.checked)}
              />
              <label className="form-check-label fs-12" htmlFor="aiInsights">
                AI Insights
              </label>
            </div>
            <div className="form-check form-switch">
              <input 
                className="form-check-input" 
                type="checkbox" 
                id="groupSimilar"
                checked={groupSimilar}
                onChange={(e) => setGroupSimilar(e.target.checked)}
              />
              <label className="form-check-label fs-12" htmlFor="groupSimilar">
                Smart Grouping
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="notifications-list">
        {sortedNotifications.map((notification) => (
          <div 
            key={notification.id}
            className={`notification-card ${notification.isRead ? 'read' : 'unread'} ${notification.type} mb-3`}
          >
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                {/* Priority Header */}
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center">
                    <div className={`priority-indicator bg-${getPriorityColor(notification.type, notification.aiPriority)}-transparent p-2 rounded-circle me-3`}>
                      <i className={`${getPriorityIcon(notification.type)} text-${getPriorityColor(notification.type, notification.aiPriority)} fs-16`}></i>
                    </div>
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <Badge count={notification.aiPriority} color={getPriorityColor(notification.type, notification.aiPriority)} />
                        <span className={`badge bg-${getPriorityColor(notification.type, notification.aiPriority)}-transparent text-${getPriorityColor(notification.type, notification.aiPriority)} text-uppercase fs-10`}>
                          {notification.type}
                        </span>
                        <span className="badge bg-light text-dark fs-10">
                          <i className={`${getCategoryIcon(notification.category)} me-1`}></i>
                          {notification.category}
                        </span>
                        {notification.isGrouped && (
                          <span className="badge bg-info-transparent text-info fs-10">
                            <i className="ti ti-stack me-1"></i>
                            Group of {notification.groupCount}
                          </span>
                        )}
                      </div>
                      <h6 className="mb-0 fw-semibold">{notification.title}</h6>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-muted fs-12">{formatTimeAgo(notification.timestamp)}</span>
                    <div className="dropdown">
                      <button className="btn btn-sm btn-outline-light" data-bs-toggle="dropdown">
                        <i className="ti ti-dots-vertical"></i>
                      </button>
                      <ul className="dropdown-menu">
                        <li><button className="dropdown-item" onClick={() => markAsRead(notification.id)}>Mark as Read</button></li>
                        <li><button className="dropdown-item" onClick={() => dismissNotification(notification.id)}>Dismiss</button></li>
                        <li><button className="dropdown-item">View Details</button></li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Notification Content */}
                <div className="notification-content">
                  <div className="d-flex align-items-start">
                    <div className="avatar-wrapper me-3">
                      <ImageWithBasePath
                        src={notification.avatar}
                        className="avatar-md rounded-circle"
                        alt="Avatar"
                      />
                    </div>
                    <div className="flex-grow-1">
                      <div className="sender-info mb-2">
                        <span className="fw-medium text-dark">{notification.sender}</span>
                        <span className="text-muted ms-2 fs-12">
                          • For: {notification.role.join(', ')}
                        </span>
                      </div>
                      <p className="notification-description mb-3">
                        {notification.description}
                      </p>

                      {/* AI Insight */}
                      {showAIInsights && notification.aiInsight && (
                        <div className="ai-insight bg-primary-transparent p-3 rounded-3 mb-3">
                          <div className="d-flex align-items-start">
                            <i className="ti ti-bulb text-primary me-2 mt-1"></i>
                            <div>
                              <small className="text-primary fw-medium d-block mb-1">AI Insight</small>
                              <p className="mb-0 fs-13">{notification.aiInsight}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {notification.actionSuggested && (
                        <div className="action-buttons d-flex align-items-center gap-2">
                          <span className="fs-12 text-muted me-2">
                            <i className="ti ti-robot me-1"></i>
                            AI Suggested:
                          </span>
                          {notification.actionType === 'accept' && (
                            <>
                              <button className="btn btn-primary btn-sm">Accept & Contact</button>
                              <button className="btn btn-outline-secondary btn-sm">Schedule Later</button>
                            </>
                          )}
                          {notification.actionType === 'review' && (
                            <>
                              <button className="btn btn-warning btn-sm">Review Changes</button>
                              <button className="btn btn-outline-primary btn-sm">Approve All</button>
                            </>
                          )}
                          {notification.actionType === 'respond' && (
                            <>
                              <button className="btn btn-danger btn-sm">Emergency Response</button>
                              <button className="btn btn-outline-danger btn-sm">Alert Team</button>
                            </>
                          )}
                          {notification.actionType === 'acknowledge' && (
                            <button className="btn btn-info btn-sm">Acknowledge</button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-4">
        <button className="btn btn-outline-primary">
          <i className="ti ti-refresh me-1"></i>
          Load More Notifications
        </button>
      </div>
    </div>
  );
};

export default AINotificationsFeed;
