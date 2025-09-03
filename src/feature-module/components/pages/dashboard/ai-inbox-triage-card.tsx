import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import ImageWithBasePath from "../../../../core/imageWithBasePath";
import { all_routes } from "../../../routes/all_routes";

interface InboxMessage {
  id: string;
  from: string;
  subject: string;
  preview: string;
  avatar: string;
  timestamp: Date;
  isRead: boolean;
  category: 'medical' | 'administrative' | 'appointment' | 'emergency' | 'follow-up';
  aiClassification: {
    confidence: number;
    priority: 'critical' | 'high' | 'medium' | 'low';
    urgency: number; // 1-5 scale
    actionRequired: boolean;
    estimatedResponseTime: string;
  };
  tags: string[];
  attachments?: number;
}

interface AIInboxTriageCardProps {
  maxItems?: number;
  showHeader?: boolean;
  userRole?: 'admin' | 'doctor' | 'nurse';
  department?: string;
}

const AIInboxTriageCard: React.FC<AIInboxTriageCardProps> = ({
  maxItems = 6,
  showHeader = true,
  userRole = 'admin',
  department = 'General'
}) => {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Mock inbox messages with AI classification
  const mockMessages: InboxMessage[] = [
    {
      id: "1",
      from: "Dr. Sarah Chen",
      subject: "Emergency Patient Consultation Required",
      preview: "Need immediate consultation for patient with severe chest pain and irregular ECG readings...",
      avatar: "assets/img/doctors/doctor-02.jpg",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isRead: false,
      category: "emergency",
      aiClassification: {
        confidence: 0.95,
        priority: "critical",
        urgency: 5,
        actionRequired: true,
        estimatedResponseTime: "Within 10 minutes"
      },
      tags: ["urgent", "cardiology", "icu"],
      attachments: 2
    },
    {
      id: "2",
      from: "Lab Department",
      subject: "Critical Lab Results - Patient ID: 12847",
      preview: "Abnormal blood work results requiring immediate physician review and patient contact...",
      avatar: "assets/img/users/user-09.jpg",
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      isRead: false,
      category: "medical",
      aiClassification: {
        confidence: 0.92,
        priority: "critical",
        urgency: 5,
        actionRequired: true,
        estimatedResponseTime: "Within 30 minutes"
      },
      tags: ["lab-results", "critical", "follow-up"],
      attachments: 1
    },
    {
      id: "3",
      from: "Emily Johnson",
      subject: "Appointment Rescheduling Request",
      preview: "Due to a family emergency, I need to reschedule my appointment from tomorrow to next week...",
      avatar: "assets/img/profiles/avatar-14.jpg",
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      isRead: false,
      category: "appointment",
      aiClassification: {
        confidence: 0.88,
        priority: "medium",
        urgency: 3,
        actionRequired: true,
        estimatedResponseTime: "Within 2 hours"
      },
      tags: ["appointment", "reschedule", "patient-request"]
    },
    {
      id: "4",
      from: "Administration",
      subject: "Policy Update: New COVID-19 Protocols",
      preview: "Updated guidelines for patient screening and safety protocols effective immediately...",
      avatar: "assets/img/users/user-12.jpg",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      isRead: true,
      category: "administrative",
      aiClassification: {
        confidence: 0.85,
        priority: "medium",
        urgency: 3,
        actionRequired: false,
        estimatedResponseTime: "Within 1 day"
      },
      tags: ["policy", "covid", "protocols"],
      attachments: 3
    },
    {
      id: "5",
      from: "Dr. Michael Roberts",
      subject: "Post-Surgery Follow-up Report",
      preview: "Patient recovery is proceeding as expected. Vital signs stable, no complications observed...",
      avatar: "assets/img/doctors/doctor-07.jpg",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      isRead: true,
      category: "follow-up",
      aiClassification: {
        confidence: 0.90,
        priority: "low",
        urgency: 2,
        actionRequired: false,
        estimatedResponseTime: "Within 24 hours"
      },
      tags: ["surgery", "follow-up", "recovery"]
    },
    {
      id: "6",
      from: "Insurance Department",
      subject: "Pre-authorization Approval - Patient Martinez",
      preview: "Pre-authorization for MRI scan has been approved. Patient can proceed with scheduling...",
      avatar: "assets/img/users/user-05.jpg",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false,
      category: "administrative",
      aiClassification: {
        confidence: 0.82,
        priority: "medium",
        urgency: 3,
        actionRequired: true,
        estimatedResponseTime: "Within 4 hours"
      },
      tags: ["insurance", "pre-auth", "radiology"]
    }
  ];

  useEffect(() => {
    // Sort by AI urgency and priority
    const sortedMessages = mockMessages
      .filter(msg => categoryFilter === 'all' || msg.category === categoryFilter)
      .sort((a, b) => {
        // First sort by urgency (higher first)
        if (a.aiClassification.urgency !== b.aiClassification.urgency) {
          return b.aiClassification.urgency - a.aiClassification.urgency;
        }
        // Then by timestamp (newer first)
        return b.timestamp.getTime() - a.timestamp.getTime();
      })
      .slice(0, maxItems);
    
    setMessages(sortedMessages);
    setUnreadCount(sortedMessages.filter(m => !m.isRead).length);
  }, [maxItems, categoryFilter]);

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return 'ti ti-alert-triangle-filled';
      case 'high': return 'ti ti-exclamation-circle';
      case 'medium': return 'ti ti-info-circle';
      case 'low': return 'ti ti-check-circle';
      default: return 'ti ti-circle';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medical': return 'ti ti-stethoscope';
      case 'emergency': return 'ti ti-emergency-bed';
      case 'appointment': return 'ti ti-calendar';
      case 'administrative': return 'ti ti-file-text';
      case 'follow-up': return 'ti ti-user-check';
      default: return 'ti ti-mail';
    }
  };

  const markAsRead = (id: string) => {
    setMessages(prev => prev.map(m => 
      m.id === id ? { ...m, isRead: true } : m
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const criticalCount = messages.filter(m => m.aiClassification.priority === 'critical').length;
  const actionRequiredCount = messages.filter(m => m.aiClassification.actionRequired).length;

  return (
    <div className="col-xl-4 col-lg-6 d-flex">
      <div className="card shadow-sm flex-fill w-100">
        {showHeader && (
          <div className="card-header d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <h5 className="fw-bold mb-0 me-2">AI Inbox Triage</h5>
              <span className="badge bg-info-transparent text-info fs-10 d-inline-flex align-items-center">
                <i className="ti ti-brain me-1"></i>
                Smart Sorting
              </span>
            </div>
            <div className="d-flex align-items-center gap-2">
              {unreadCount > 0 && (
                <span className="badge bg-primary rounded-pill">{unreadCount}</span>
              )}
              <div className="dropdown">
                <Link
                  to="#"
                  className="btn btn-sm px-2 border shadow-sm btn-outline-white d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  Filter <i className="ti ti-chevron-down ms-1" />
                </Link>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="#" onClick={() => setCategoryFilter('all')}>All Messages</Link></li>
                  <li><Link className="dropdown-item" to="#" onClick={() => setCategoryFilter('emergency')}>Emergency</Link></li>
                  <li><Link className="dropdown-item" to="#" onClick={() => setCategoryFilter('medical')}>Medical</Link></li>
                  <li><Link className="dropdown-item" to="#" onClick={() => setCategoryFilter('appointment')}>Appointments</Link></li>
                  <li><Link className="dropdown-item" to="#" onClick={() => setCategoryFilter('administrative')}>Administrative</Link></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="card-body">
          {/* AI Triage Summary */}
          <div className="row g-2 mb-3">
            <div className="col-6">
              <div className="p-2 bg-light rounded-2 text-center">
                <h6 className="fw-bold mb-1 text-danger">{criticalCount}</h6>
                <p className="mb-0 fs-12 text-muted">Critical Messages</p>
              </div>
            </div>
            <div className="col-6">
              <div className="p-2 bg-light rounded-2 text-center">
                <h6 className="fw-bold mb-1 text-warning">{actionRequiredCount}</h6>
                <p className="mb-0 fs-12 text-muted">Need Action</p>
              </div>
            </div>
          </div>

          {/* AI Performance Indicator */}
          <div className="d-flex align-items-center justify-content-between mb-3 p-2 bg-success-transparent rounded-2">
            <div className="d-flex align-items-center gap-2">
              <span className="avatar bg-success-transparent text-success rounded-2 fs-14">
                <i className="ti ti-robot"></i>
              </span>
              <div>
                <p className="mb-0 fw-semibold fs-14 text-success">AI Triage Active</p>
                <p className="mb-0 fs-11 text-muted">Auto-categorization enabled</p>
              </div>
            </div>
            <div className="text-end">
              <p className="mb-0 fw-bold text-success fs-14">92%</p>
              <p className="mb-0 fs-11 text-muted">Accuracy</p>
            </div>
          </div>

          {/* Messages List */}
          <div className="inbox-messages">
            {messages.length === 0 ? (
              <div className="text-center py-4">
                <i className="ti ti-inbox fs-24 text-muted mb-2"></i>
                <p className="text-muted mb-0">No messages</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div 
                  key={message.id} 
                  className={`d-flex align-items-start gap-2 p-2 rounded-2 transition-hover ${
                    index < messages.length - 1 ? 'border-bottom' : ''
                  } ${!message.isRead ? 'bg-soft-primary' : ''}`}
                  onClick={() => markAsRead(message.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Avatar with Priority */}
                  <div className="position-relative flex-shrink-0">
                    <div className="avatar avatar-sm">
                      <ImageWithBasePath
                        src={message.avatar}
                        className="rounded-circle"
                        alt="Sender"
                      />
                    </div>
                    {/* Priority Indicator */}
                    <span 
                      className={`position-absolute top-0 start-100 translate-middle d-flex align-items-center justify-content-center rounded-circle bg-${getPriorityColor(message.aiClassification.priority)}`}
                      style={{ width: '12px', height: '12px', fontSize: '8px' }}
                      title={`${message.aiClassification.priority} priority`}
                    >
                      <i className={`${getPriorityIcon(message.aiClassification.priority)} text-white`} style={{ fontSize: '6px' }}></i>
                    </span>
                  </div>

                  {/* Message Content */}
                  <div className="flex-grow-1 min-w-0">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <div className="d-flex align-items-center gap-1">
                        <i className={`${getCategoryIcon(message.category)} text-${getPriorityColor(message.aiClassification.priority)} fs-12`}></i>
                        <h6 className="mb-0 fs-12 fw-semibold text-truncate">{message.from}</h6>
                        {!message.isRead && (
                          <span className="badge bg-primary rounded-pill" style={{ width: '5px', height: '5px', padding: '0' }}></span>
                        )}
                        {message.attachments && (
                          <i className="ti ti-paperclip fs-10 text-muted" title={`${message.attachments} attachments`}></i>
                        )}
                      </div>
                      <small className="text-muted fs-10">{formatTimeAgo(message.timestamp)}</small>
                    </div>
                    
                    <p className="mb-1 fs-12 fw-medium text-truncate">{message.subject}</p>
                    
                    <p className="mb-1 fs-11 text-muted line-clamp-1" style={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {message.preview}
                    </p>
                    
                    {/* AI Classification Info */}
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-1">
                        <span className={`badge bg-${getPriorityColor(message.aiClassification.priority)}-transparent text-${getPriorityColor(message.aiClassification.priority)} fs-10`}>
                          {message.aiClassification.priority}
                        </span>
                        {message.aiClassification.actionRequired && (
                          <span className="badge bg-warning-transparent text-warning fs-10">
                            <i className="ti ti-clock me-1"></i>
                            Action Required
                          </span>
                        )}
                      </div>
                      <div className="text-end">
                        <small className="text-muted fs-10 d-block">
                          AI: {Math.round(message.aiClassification.confidence * 100)}%
                        </small>
                        <small className="text-muted fs-10">
                          {message.aiClassification.estimatedResponseTime}
                        </small>
                      </div>
                    </div>

                    {/* Tags */}
                    {message.tags.length > 0 && (
                      <div className="d-flex gap-1 mt-1 flex-wrap">
                        {message.tags.slice(0, 2).map((tag, tagIndex) => (
                          <span key={tagIndex} className="badge bg-light text-dark fs-10">
                            {tag}
                          </span>
                        ))}
                        {message.tags.length > 2 && (
                          <span className="badge bg-light text-muted fs-10">
                            +{message.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-2 mt-3">
            <Link 
              to="/ai-inbox-triage" 
              className="btn btn-primary flex-fill d-inline-flex align-items-center justify-content-center"
            >
              <i className="ti ti-inbox me-1"></i>
              View Full Inbox
            </Link>
            <Link 
              to="#" 
              className="btn btn-outline-primary d-inline-flex align-items-center justify-content-center"
              style={{ minWidth: '40px' }}
            >
              <i className="ti ti-adjustments"></i>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="mt-3 p-2 bg-light rounded-2">
            <div className="row g-2 text-center">
              <div className="col-4">
                <p className="mb-0 fw-bold fs-14">{messages.length}</p>
                <p className="mb-0 fs-11 text-muted">Total</p>
              </div>
              <div className="col-4">
                <p className="mb-0 fw-bold fs-14 text-primary">{unreadCount}</p>
                <p className="mb-0 fs-11 text-muted">Unread</p>
              </div>
              <div className="col-4">
                <p className="mb-0 fw-bold fs-14 text-success">
                  {Math.round((messages.filter(m => m.isRead).length / messages.length) * 100) || 0}%
                </p>
                <p className="mb-0 fs-11 text-muted">Processed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInboxTriageCard;
