import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../../core/imageWithBasePath";
import { all_routes } from "../../../routes/all_routes";

interface NotificationItem {
  id: string;
  type: 'critical' | 'urgent' | 'routine' | 'admin';
  title: string;
  message: string;
  sender: string;
  avatar: string;
  timestamp: Date;
  isRead: boolean;
  aiPriority: number;
  department?: string;
}

interface AINotificationsFeedCardProps {
  maxItems?: number;
  showHeader?: boolean;
  compact?: boolean;
  userRole?: 'admin' | 'doctor' | 'nurse';
}

const AINotificationsFeedCard: React.FC<AINotificationsFeedCardProps> = ({
  maxItems = 5,
  showHeader = true,
  compact = false,
  userRole = 'admin'
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock notifications data with AI prioritization
  const mockNotifications: NotificationItem[] = [
    {
      id: "1",
      type: "critical",
      title: "Emergency Alert",
      message: "Code Blue activated in ICU Room 302 - Patient requires immediate attention",
      sender: "Emergency System",
      avatar: "assets/img/icons/emergency.svg",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      isRead: false,
      aiPriority: 5,
      department: "ICU"
    },
    {
      id: "2", 
      type: "urgent",
      title: "Surgery Schedule Update",
      message: "Dr. Smith's 2 PM surgery has been rescheduled to 3:30 PM due to equipment delay",
      sender: "Dr. Smith",
      avatar: "assets/img/doctors/doctor-01.jpg",
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      isRead: false,
      aiPriority: 4,
      department: "Surgery"
    },
    {
      id: "3",
      type: "urgent", 
      title: "Lab Results - Critical",
      message: "Patient Emily Johnson's blood work shows abnormal values requiring immediate follow-up",
      sender: "Lab Department",
      avatar: "assets/img/doctors/doctor-06.jpg",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      isRead: false,
      aiPriority: 4,
      department: "Laboratory"
    },
    {
      id: "4",
      type: "routine",
      title: "Appointment Reminder",
      message: "3 patients have upcoming appointments in the next hour",
      sender: "Reception",
      avatar: "assets/img/users/user-02.jpg", 
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      isRead: true,
      aiPriority: 2,
      department: "Reception"
    },
    {
      id: "5",
      type: "admin",
      title: "Staff Meeting",
      message: "Weekly staff meeting scheduled for tomorrow at 9 AM in Conference Room A",
      sender: "Administration",
      avatar: "assets/img/users/user-12.jpg",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: true,
      aiPriority: 1,
      department: "Admin"
    },
    {
      id: "6",
      type: "routine",
      title: "Equipment Maintenance",
      message: "MRI Machine 2 scheduled for routine maintenance this Saturday",
      sender: "Maintenance Team",
      avatar: "assets/img/icons/maintenance.svg",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      isRead: false,
      aiPriority: 2,
      department: "Maintenance"
    }
  ];

  useEffect(() => {
    // Sort by AI priority (highest first) and timestamp
    const sortedNotifications = mockNotifications
      .sort((a, b) => {
        if (a.aiPriority !== b.aiPriority) {
          return b.aiPriority - a.aiPriority;
        }
        return b.timestamp.getTime() - a.timestamp.getTime();
      })
      .slice(0, maxItems);
    
    setNotifications(sortedNotifications);
    setUnreadCount(sortedNotifications.filter(n => !n.isRead).length);
  }, [maxItems]);

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getPriorityBadge = (type: string, priority: number) => {
    switch (type) {
      case 'critical':
        return 'badge-soft-danger border-danger text-danger';
      case 'urgent':
        return 'badge-soft-warning border-warning text-warning';
      case 'routine':
        return 'badge-soft-info border-info text-info';
      case 'admin':
        return 'badge-soft-secondary border-secondary text-secondary';
      default:
        return 'badge-soft-secondary border-secondary text-secondary';
    }
  };

  const getPriorityIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return 'ti ti-alert-triangle-filled text-danger';
      case 'urgent':
        return 'ti ti-exclamation-circle text-warning';
      case 'routine':
        return 'ti ti-info-circle text-info';
      case 'admin':
        return 'ti ti-file-text text-secondary';
      default:
        return 'ti ti-bell text-secondary';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="col-xl-4 col-lg-6 d-flex">
      <div className="card shadow-sm flex-fill w-100">
        {showHeader && (
          <div className="card-header d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <h5 className="fw-bold mb-0 me-2">AI Notifications Feed</h5>
              <span className="badge bg-primary-transparent text-primary fs-10 d-inline-flex align-items-center">
                <i className="ti ti-robot me-1"></i>
                AI Powered
              </span>
            </div>
            <div className="d-flex align-items-center gap-2">
              {unreadCount > 0 && (
                <span className="badge bg-danger rounded-pill">{unreadCount}</span>
              )}
              <div className="dropdown">
                <Link
                  to="#"
                  className="btn btn-sm px-2 border shadow-sm btn-outline-white d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  Priority <i className="ti ti-chevron-down ms-1" />
                </Link>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="#">All Priorities</Link></li>
                  <li><Link className="dropdown-item" to="#">Critical Only</Link></li>
                  <li><Link className="dropdown-item" to="#">Urgent Only</Link></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="card-body">
          {/* AI Triage Summary */}
          <div className="d-flex align-items-center justify-content-between mb-3 p-2 bg-light rounded-2">
            <div className="d-flex align-items-center gap-2">
              <span className="avatar bg-primary-transparent text-primary rounded-2 fs-16">
                <i className="ti ti-brain"></i>
              </span>
              <div>
                <p className="mb-0 fw-semibold fs-14">AI Triage Active</p>
                <p className="mb-0 fs-12 text-muted">Smart prioritization enabled</p>
              </div>
            </div>
            <div className="text-end">
              <p className="mb-0 fw-bold text-success fs-14">95%</p>
              <p className="mb-0 fs-12 text-muted">Accuracy</p>
            </div>
          </div>

          {/* Priority Indicators */}
          <div className="row g-2 mb-3">
            <div className="col-3">
              <div className="text-center p-1">
                <div className="d-flex align-items-center justify-content-center mb-1">
                  <i className="ti ti-alert-triangle-filled text-danger fs-12"></i>
                  <span className="badge bg-danger ms-1 fs-10">{notifications.filter(n => n.type === 'critical').length}</span>
                </div>
                <p className="mb-0 fs-11 text-muted">Critical</p>
              </div>
            </div>
            <div className="col-3">
              <div className="text-center p-1">
                <div className="d-flex align-items-center justify-content-center mb-1">
                  <i className="ti ti-exclamation-circle text-warning fs-12"></i>
                  <span className="badge bg-warning ms-1 fs-10">{notifications.filter(n => n.type === 'urgent').length}</span>
                </div>
                <p className="mb-0 fs-11 text-muted">Urgent</p>
              </div>
            </div>
            <div className="col-3">
              <div className="text-center p-1">
                <div className="d-flex align-items-center justify-content-center mb-1">
                  <i className="ti ti-info-circle text-info fs-12"></i>
                  <span className="badge bg-info ms-1 fs-10">{notifications.filter(n => n.type === 'routine').length}</span>
                </div>
                <p className="mb-0 fs-11 text-muted">Routine</p>
              </div>
            </div>
            <div className="col-3">
              <div className="text-center p-1">
                <div className="d-flex align-items-center justify-content-center mb-1">
                  <i className="ti ti-file-text text-secondary fs-12"></i>
                  <span className="badge bg-secondary ms-1 fs-10">{notifications.filter(n => n.type === 'admin').length}</span>
                </div>
                <p className="mb-0 fs-11 text-muted">Admin</p>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="text-center py-4">
                <i className="ti ti-bell-off fs-24 text-muted mb-2"></i>
                <p className="text-muted mb-0">No notifications</p>
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div 
                  key={notification.id} 
                  className={`d-flex align-items-start gap-3 p-2 rounded-2 transition-hover ${
                    index < notifications.length - 1 ? 'border-bottom' : ''
                  } ${!notification.isRead ? 'bg-soft-primary' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Avatar with Priority Indicator */}
                  <div className="position-relative flex-shrink-0">
                    <div className="avatar avatar-sm">
                      <ImageWithBasePath
                        src={notification.avatar}
                        className="rounded-circle"
                        alt="Notification"
                      />
                    </div>
                    {/* AI Priority Badge */}
                    <span 
                      className={`position-absolute top-0 start-100 translate-middle badge rounded-pill ${getPriorityBadge(notification.type, notification.aiPriority)} fs-10`}
                      title={`AI Priority: ${notification.aiPriority}/5`}
                    >
                      {notification.aiPriority}
                    </span>
                  </div>

                  {/* Notification Content */}
                  <div className="flex-grow-1 min-w-0">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <div className="d-flex align-items-center gap-1">
                        <i className={`${getPriorityIcon(notification.type)} fs-12`}></i>
                        <h6 className="mb-0 fs-13 fw-semibold text-truncate">{notification.title}</h6>
                        {!notification.isRead && (
                          <span className="badge bg-primary rounded-pill" style={{ width: '6px', height: '6px', padding: '0' }}></span>
                        )}
                      </div>
                      <small className="text-muted fs-11">{formatTimeAgo(notification.timestamp)}</small>
                    </div>
                    
                    <p className="mb-1 fs-12 text-muted line-clamp-2" style={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {notification.message}
                    </p>
                    
                    <div className="d-flex align-items-center justify-content-between">
                      <small className="text-muted fs-11">
                        <i className="ti ti-user fs-10 me-1"></i>
                        {notification.sender}
                      </small>
                      {notification.department && (
                        <span className="badge bg-light text-dark fs-10">{notification.department}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-2 mt-3">
            <Link 
              to={all_routes.notifications} 
              className="btn btn-primary flex-fill d-inline-flex align-items-center justify-content-center"
            >
              <i className="ti ti-bell me-1"></i>
              View All Notifications
            </Link>
            <Link 
              to="#" 
              className="btn btn-outline-primary d-inline-flex align-items-center justify-content-center"
              style={{ minWidth: '40px' }}
            >
              <i className="ti ti-settings"></i>
            </Link>
          </div>

          {/* AI Insights Footer */}
          <div className="mt-3 p-2 bg-success-transparent rounded-2">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <i className="ti ti-check-circle text-success fs-14"></i>
                <small className="fw-medium text-success">AI Processing Complete</small>
              </div>
              <small className="text-muted fs-11">Last updated: just now</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AINotificationsFeedCard;
