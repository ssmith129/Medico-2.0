import { Link } from "react-router";
import { useState, useEffect, useMemo } from "react";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";

interface ChatMessage {
  id: string;
  from: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  avatar: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'emergency' | 'patient-care' | 'coordination' | 'administrative' | 'consultation';
  aiClassification: {
    confidence: number;
    urgency: number; // 1-5 scale
    sentiment: 'urgent' | 'concerned' | 'neutral' | 'positive';
    actionRequired: boolean;
    estimatedResponseTime: string;
    keywords: string[];
    department?: string;
    patientRelated?: boolean;
    codeStatus?: 'code-blue' | 'code-red' | 'all-clear' | null;
  };
  messageType: 'text' | 'voice' | 'image' | 'document' | 'video-call' | 'emergency-alert';
  isOnline: boolean;
  unreadCount?: number;
  complianceLevel?: 'hipaa' | 'standard' | 'confidential';
}

interface Conversation {
  id: string;
  participant: string;
  lastMessage: ChatMessage;
  messages: ChatMessage[];
  isPinned: boolean;
  isFavorite: boolean;
  totalUnread: number;
}

interface AIMessageFilters {
  priority: 'all' | 'critical' | 'high' | 'medium' | 'low';
  category: 'all' | 'emergency' | 'patient-care' | 'coordination' | 'administrative' | 'consultation';
  sentiment: 'all' | 'urgent' | 'concerned' | 'neutral' | 'positive';
  department: 'all' | 'emergency' | 'surgery' | 'icu' | 'cardiology' | 'administration';
  timeRange: 'today' | 'week' | 'month';
  onlineOnly: boolean;
  actionRequired: boolean;
}

const Messages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [filters, setFilters] = useState<AIMessageFilters>({
    priority: 'all',
    category: 'all',
    sentiment: 'all',
    department: 'all',
    timeRange: 'today',
    onlineOnly: false,
    actionRequired: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [aiInsights, setAiInsights] = useState({
    totalConversations: 0,
    emergencyAlerts: 0,
    avgResponseTime: '8m',
    activeCodeStatus: null as string | null,
    priorityDistribution: { critical: 0, high: 0, medium: 0, low: 0 }
  });

  const mockConversations: Conversation[] = [
    {
      id: "conv-1",
      participant: "Dr. Sarah Chen - ICU",
      isPinned: true,
      isFavorite: false,
      totalUnread: 3,
      lastMessage: {
        id: "msg-1",
        from: "Dr. Sarah Chen",
        content: "Code Blue Room 302! Patient experiencing cardiac arrest. Need anesthesia and crash cart team immediately. ETA 2 minutes critical.",
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        isRead: false,
        avatar: "assets/img/doctors/doctor-02.jpg",
        priority: 'critical',
        category: 'emergency',
        aiClassification: {
          confidence: 0.98,
          urgency: 5,
          sentiment: 'urgent',
          actionRequired: true,
          estimatedResponseTime: "Immediate (< 2 minutes)",
          keywords: ["code-blue", "cardiac-arrest", "crash-cart", "anesthesia", "critical"],
          department: "icu",
          patientRelated: true,
          codeStatus: 'code-blue'
        },
        messageType: 'emergency-alert',
        isOnline: true,
        complianceLevel: 'hipaa'
      },
      messages: []
    },
    {
      id: "conv-2",
      participant: "Nurse Station - ER",
      isPinned: false,
      isFavorite: true,
      totalUnread: 2,
      lastMessage: {
        id: "msg-2",
        from: "Lisa Martinez, RN",
        content: "Multiple trauma incoming via ambulance. 3 victims from MVA. ETA 8 minutes. Need OR prep and blood bank alert. Requesting additional surgical staff.",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        isRead: false,
        avatar: "assets/img/profiles/avatar-10.jpg",
        priority: 'critical',
        category: 'emergency',
        aiClassification: {
          confidence: 0.96,
          urgency: 5,
          sentiment: 'urgent',
          actionRequired: true,
          estimatedResponseTime: "Within 5 minutes",
          keywords: ["mass-casualty", "trauma", "or-prep", "blood-bank", "ambulance"],
          department: "emergency",
          patientRelated: true,
          codeStatus: 'code-red'
        },
        messageType: 'text',
        isOnline: true,
        complianceLevel: 'hipaa'
      },
      messages: []
    },
    {
      id: "conv-3",
      participant: "Dr. Michael Roberts",
      isPinned: false,
      isFavorite: false,
      totalUnread: 1,
      lastMessage: {
        id: "msg-3",
        from: "Dr. Michael Roberts",
        content: "Post-op patient in room 205 showing excellent recovery. Vitals stable, no complications. Family requesting update - should I proceed with discharge planning?",
        timestamp: new Date(Date.now() - 12 * 60 * 1000),
        isRead: false,
        avatar: "assets/img/doctors/doctor-07.jpg",
        priority: 'medium',
        category: 'patient-care',
        aiClassification: {
          confidence: 0.91,
          urgency: 3,
          sentiment: 'positive',
          actionRequired: true,
          estimatedResponseTime: "Within 2 hours",
          keywords: ["post-op", "recovery", "discharge", "family", "vitals"],
          department: "surgery",
          patientRelated: true,
          codeStatus: null
        },
        messageType: 'text',
        isOnline: true,
        complianceLevel: 'hipaa'
      },
      messages: []
    },
    {
      id: "conv-4",
      participant: "Lab Department",
      isPinned: false,
      isFavorite: false,
      totalUnread: 0,
      lastMessage: {
        id: "msg-4",
        from: "Lab Tech - Jennifer",
        content: "Critical lab results ready for patient Martinez. Hemoglobin dropped to 4.2 g/dL. Notifying attending physician and blood bank for potential transfusion.",
        timestamp: new Date(Date.now() - 18 * 60 * 1000),
        isRead: true,
        avatar: "assets/img/users/user-09.jpg",
        priority: 'high',
        category: 'patient-care',
        aiClassification: {
          confidence: 0.94,
          urgency: 4,
          sentiment: 'concerned',
          actionRequired: false,
          estimatedResponseTime: "Within 30 minutes",
          keywords: ["lab-results", "hemoglobin", "transfusion", "blood-bank", "critical"],
          department: "laboratory",
          patientRelated: true,
          codeStatus: null
        },
        messageType: 'text',
        isOnline: false,
        complianceLevel: 'hipaa'
      },
      messages: []
    },
    {
      id: "conv-5",
      participant: "Pharmacy Team",
      isPinned: false,
      isFavorite: false,
      totalUnread: 1,
      lastMessage: {
        id: "msg-5",
        from: "Pharmacist - David",
        content: "Medication shortage alert: Running low on Epinephrine (3 units left) and Morphine (7 units). Emergency restock initiated. Backup suppliers contacted.",
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        isRead: false,
        avatar: "assets/img/users/user-12.jpg",
        priority: 'high',
        category: 'administrative',
        aiClassification: {
          confidence: 0.89,
          urgency: 4,
          sentiment: 'concerned',
          actionRequired: true,
          estimatedResponseTime: "Within 1 hour",
          keywords: ["medication", "shortage", "epinephrine", "morphine", "restock"],
          department: "pharmacy",
          patientRelated: false,
          codeStatus: null
        },
        messageType: 'text',
        isOnline: true,
        complianceLevel: 'standard'
      },
      messages: []
    },
    {
      id: "conv-6",
      participant: "Security - Front Desk",
      isPinned: false,
      isFavorite: false,
      totalUnread: 0,
      lastMessage: {
        id: "msg-6",
        from: "Security Team",
        content: "All clear on lockdown protocol. Visitor access restored to all wings. No security incidents reported. Thank you for cooperation during the emergency.",
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        isRead: true,
        avatar: "assets/img/icons/security-icon.svg",
        priority: 'low',
        category: 'administrative',
        aiClassification: {
          confidence: 0.85,
          urgency: 2,
          sentiment: 'neutral',
          actionRequired: false,
          estimatedResponseTime: "No response needed",
          keywords: ["security", "lockdown", "all-clear", "visitor-access", "emergency"],
          department: "security",
          patientRelated: false,
          codeStatus: 'all-clear'
        },
        messageType: 'text',
        isOnline: false,
        complianceLevel: 'standard'
      },
      messages: []
    }
  ];

  useEffect(() => {
    setConversations(mockConversations);
    setAiInsights({
      totalConversations: mockConversations.length,
      emergencyAlerts: mockConversations.filter(c => c.lastMessage.priority === 'critical').length,
      avgResponseTime: '8m',
      activeCodeStatus: mockConversations.find(c => c.lastMessage.aiClassification.codeStatus)?.lastMessage.aiClassification.codeStatus || null,
      priorityDistribution: mockConversations.reduce((acc: any, c) => { acc[c.lastMessage.priority] = (acc[c.lastMessage.priority] || 0) + 1; return acc; }, { critical: 0, high: 0, medium: 0, low: 0 })
    });
  }, []);

  const filteredConversations = useMemo(() => {
    return conversations.filter(c => {
      const m = c.lastMessage;
      if (filters.priority !== 'all' && m.priority !== filters.priority) return false;
      if (filters.category !== 'all' && m.category !== filters.category) return false;
      if (filters.sentiment !== 'all' && m.aiClassification.sentiment !== filters.sentiment) return false;
      if (filters.department !== 'all' && m.aiClassification.department !== filters.department) return false;
      if (filters.onlineOnly && !m.isOnline) return false;
      if (filters.actionRequired && !m.aiClassification.actionRequired) return false;
      if (searchTerm && !(`${c.participant} ${m.content}`.toLowerCase().includes(searchTerm.toLowerCase()))) return false;
      return true;
    });
  }, [conversations, filters, searchTerm]);

  const getPriorityBadge = (priority: ChatMessage['priority']) => {
    switch (priority) {
      case 'critical': return 'badge bg-danger';
      case 'high': return 'badge bg-warning';
      case 'medium': return 'badge bg-info';
      case 'low': return 'badge bg-success';
      default: return 'badge bg-secondary';
    }
  };

  const getSentimentIcon = (sentiment: ChatMessage['aiClassification']['sentiment']) => {
    switch (sentiment) {
      case 'urgent': return 'ti ti-alert-triangle-filled';
      case 'concerned': return 'ti ti-mood-sad';
      case 'neutral': return 'ti ti-mood-neutral';
      case 'positive': return 'ti ti-mood-smile';
      default: return 'ti ti-mood-neutral';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'emergency': return 'ti ti-emergency-bed';
      case 'patient-care': return 'ti ti-stethoscope';
      case 'coordination': return 'ti ti-users';
      case 'administrative': return 'ti ti-file-text';
      case 'consultation': return 'ti ti-user-check';
      default: return 'ti ti-message-circle';
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

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'voice': return 'ti ti-microphone';
      case 'image': return 'ti ti-photo';
      case 'document': return 'ti ti-file';
      case 'video-call': return 'ti ti-video';
      case 'emergency-alert': return 'ti ti-emergency-bed';
      default: return 'ti ti-message';
    }
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content content-two">
          <div className="chat-wrapper">
            <div className="sidebar-group">
              <div id="chats" className="sidebar-content active slimscroll">
                <div className="slimscroll">
                  <div className="chat-search-header">
                    <div className="ai-triage-header bg-primary-transparent rounded p-3 mb-3">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center">
                          <i className="ti ti-robot text-primary fs-20 me-2"></i>
                          <h6 className="mb-0 fw-bold text-primary">AI Message Triage</h6>
                        </div>
                        <span className="badge bg-success rounded-pill fs-10">
                          {aiInsights.activeCodeStatus ? 'CODE ACTIVE' : 'Active'}
                        </span>
                      </div>
                      {aiInsights.activeCodeStatus && (
                        <div className="alert alert-danger py-2 mb-2">
                          <div className="d-flex align-items-center">
                            <i className="ti ti-emergency-bed text-danger me-2"></i>
                            <strong>ACTIVE: {aiInsights.activeCodeStatus.toUpperCase().replace('-', ' ')}</strong>
                          </div>
                        </div>
                      )}
                      <div className="row g-2 text-center">
                        <div className="col-4">
                          <div className="ai-metric">
                            <h6 className="mb-0 fw-bold text-danger">{aiInsights.emergencyAlerts}</h6>
                            <small className="text-muted">Emergencies</small>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="ai-metric">
                            <h6 className="mb-0 fw-bold">{aiInsights.totalConversations}</h6>
                            <small className="text-muted">Conversations</small>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="ai-metric">
                            <h6 className="mb-0 fw-bold text-primary">{aiInsights.avgResponseTime}</h6>
                            <small className="text-muted">Avg Response</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="search-wrap">
                      <form>
                        <div className="input-group">
                          <input type="text" className="form-control" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                          <span className="input-group-text"><i className="isax isax-search-normal-1" /></span>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="sidebar-body chat-body" id="chatsidebar">
                    <div className="d-flex gap-2 flex-wrap mb-3">
                      <div className="dropdown me-2">
                        <Link to="#" className="bg-white border rounded btn btn-md text-dark fs-12 py-1 align-items-center d-flex fw-normal" data-bs-toggle="dropdown">
                          <i className="ti ti-filter text-gray-5 me-1" /> Filters
                        </Link>
                        <div className="dropdown-menu dropdown-lg p-3">
                          <div className="row g-2">
                            <div className="col-6">
                              <label className="form-label">Priority</label>
                              <select className="form-select" value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value as any })}>
                                <option value="all">All</option>
                                <option value="critical">Critical</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                              </select>
                            </div>
                            <div className="col-6">
                              <label className="form-label">Category</label>
                              <select className="form-select" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value as any })}>
                                <option value="all">All</option>
                                <option value="emergency">Emergency</option>
                                <option value="patient-care">Patient Care</option>
                                <option value="coordination">Coordination</option>
                                <option value="administrative">Administrative</option>
                                <option value="consultation">Consultation</option>
                              </select>
                            </div>
                            <div className="col-6">
                              <label className="form-label">Sentiment</label>
                              <select className="form-select" value={filters.sentiment} onChange={(e) => setFilters({ ...filters, sentiment: e.target.value as any })}>
                                <option value="all">All</option>
                                <option value="urgent">Urgent</option>
                                <option value="concerned">Concerned</option>
                                <option value="neutral">Neutral</option>
                                <option value="positive">Positive</option>
                              </select>
                            </div>
                            <div className="col-6">
                              <label className="form-label">Department</label>
                              <select className="form-select" value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value as any })}>
                                <option value="all">All</option>
                                <option value="emergency">Emergency</option>
                                <option value="surgery">Surgery</option>
                                <option value="icu">ICU</option>
                                <option value="cardiology">Cardiology</option>
                                <option value="administration">Administration</option>
                              </select>
                            </div>
                            <div className="col-6">
                              <div className="form-check mt-4">
                                <input className="form-check-input" type="checkbox" id="onlineOnly" checked={filters.onlineOnly} onChange={(e) => setFilters({ ...filters, onlineOnly: e.target.checked })} />
                                <label className="form-check-label" htmlFor="onlineOnly">Online Only</label>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="form-check mt-4">
                                <input className="form-check-input" type="checkbox" id="actionRequired" checked={filters.actionRequired} onChange={(e) => setFilters({ ...filters, actionRequired: e.target.checked })} />
                                <label className="form-check-label" htmlFor="actionRequired">Action Required</label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="chat-users-wrap">
                      <div className="chat-list">
                        {filteredConversations.map((conversation) => (
                          <div key={conversation.id} className="chat-user-list" onClick={() => setSelectedConversation(conversation)}>
                            <div className={`avatar avatar-lg me-2 ${conversation.lastMessage.isOnline ? 'online' : ''}`}>
                              <ImageWithBasePath src={conversation.lastMessage.avatar} className="rounded-circle" alt="image" />
                            </div>
                            <div className="chat-user-info">
                              <div className="chat-user-msg">
                                <h6 className="d-flex align-items-center">
                                  {conversation.participant}
                                  {conversation.isPinned && <i className="ti ti-pin me-1 ms-2" />}
                                  {conversation.isFavorite && <i className="ti ti-star text-warning ms-1" />}
                                </h6>
                                <p className="text-truncate-2">
                                  <i className={`${getMessageTypeIcon(conversation.lastMessage.messageType)} me-1`}></i>
                                  {conversation.lastMessage.content}
                                </p>
                                <div className="d-flex gap-1 mt-1 flex-wrap">
                                  {conversation.lastMessage.aiClassification.keywords.slice(0, 3).map((k, idx) => (
                                    <span key={`${conversation.id}-kw-${k}-${idx}`} className="badge bg-light text-muted fs-10">{k}</span>
                                  ))}
                                </div>
                              </div>
                              <div className="chat-user-time text-end">
                                <span className="time fs-11">{formatTimeAgo(conversation.lastMessage.timestamp)}</span>
                                <div className="d-flex align-items-center justify-content-end gap-1 mt-1">
                                  <span className={`${getPriorityBadge(conversation.lastMessage.priority)} fs-10`}>{conversation.lastMessage.priority}</span>
                                  {conversation.totalUnread > 0 && (
                                    <span className="badge bg-primary rounded-pill ms-1 fs-10">{conversation.totalUnread}</span>
                                  )}
                                </div>
                                <div className="d-flex align-items-center justify-content-end gap-1 mt-1">
                                  <i className={`${getCategoryIcon(conversation.lastMessage.category)} text-muted fs-14`} />
                                  <i className={`${getSentimentIcon(conversation.lastMessage.aiClassification.sentiment)} text-muted fs-14`} />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="chat chat-messages" id="middle">
              {selectedConversation ? (
                <div className="chats">
                  <div className="chat-header d-flex align-items-center justify-content-between p-3 border-bottom">
                    <div className="d-flex align-items-center">
                      <div className="avatar avatar-md me-2">
                        <ImageWithBasePath src={selectedConversation.lastMessage.avatar} className="rounded-circle" alt="image" />
                      </div>
                      <div>
                        <h6 className="mb-0">{selectedConversation.participant}</h6>
                        <small className="text-muted">{selectedConversation.lastMessage.isOnline ? 'Online' : 'Offline'}</small>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className={`${getPriorityBadge(selectedConversation.lastMessage.priority)} fs-10 text-uppercase`}>{selectedConversation.lastMessage.priority}</span>
                      {selectedConversation.lastMessage.aiClassification.actionRequired && (
                        <span className="badge bg-warning fs-10">Action Required</span>
                      )}
                      <span className="badge bg-light text-muted fs-10 d-flex align-items-center"><i className={`${getCategoryIcon(selectedConversation.lastMessage.category)} me-1`}></i>{selectedConversation.lastMessage.category}</span>
                      <span className="badge bg-light text-muted fs-10 d-flex align-items-center"><i className={`${getSentimentIcon(selectedConversation.lastMessage.aiClassification.sentiment)} me-1`}></i>{selectedConversation.lastMessage.aiClassification.sentiment}</span>
                      <div className="d-flex align-items-center">
                        <small className="text-muted me-1">ETA:</small>
                        <span className="badge bg-primary-transparent text-primary fs-12 py-2">{selectedConversation.lastMessage.aiClassification.estimatedResponseTime.split(' ')[0]}</span>
                      </div>
                    </div>
                  </div>
                  <div className="chat-body chat-page-group slimscroll">
                    <div className="messages">
                      <div className="chats">
                        <div className="chat-avatar">
                          <ImageWithBasePath src={selectedConversation.lastMessage.avatar} className="rounded-circle" alt="image" />
                        </div>
                        <div className="chat-content">
                          <div className="chat-info">
                            <div className="message-content bg-light rounded p-3">
                              {selectedConversation.lastMessage.content}
                              {selectedConversation.lastMessage.aiClassification.keywords.length > 0 && (
                                <div className="ai-keywords mt-2">
                                  <small className="text-muted d-block mb-1">AI Detected Keywords:</small>
                                  <div className="d-flex gap-1 flex-wrap">
                                    {selectedConversation.lastMessage.aiClassification.keywords.slice(0, 4).map((keyword, index) => (
                                      <span key={`${selectedConversation.id}-keyword-${keyword}-${index}`} className="badge bg-primary-transparent text-primary fs-10">{keyword}</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="chat-profile-name">
                            <h6>
                              {selectedConversation.lastMessage.from}
                              <i className="ti ti-circle-filled fs-7 mx-2" />
                              <span className="chat-time">{formatTimeAgo(selectedConversation.lastMessage.timestamp)}</span>
                              {selectedConversation.lastMessage.aiClassification.actionRequired && (
                                <span className="badge bg-warning ms-2 fs-10">Action Required</span>
                              )}
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="chat-footer border-top p-3">
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1">
                        <div className="input-group">
                          <input type="text" className="form-control" placeholder="Type your message..." />
                          <button className="btn btn-outline-secondary" type="button"><i className="ti ti-microphone"></i></button>
                          <button className="btn btn-outline-secondary" type="button"><i className="ti ti-paperclip"></i></button>
                          <button className="btn btn-primary" type="button"><i className="ti ti-send"></i></button>
                        </div>
                      </div>
                    </div>
                    {selectedConversation.lastMessage.aiClassification.actionRequired && (
                      <div className="ai-suggestions mt-2">
                        <small className="text-muted">AI Suggested Responses:</small>
                        <div className="d-flex gap-2 mt-1">
                          <button className="btn btn-outline-primary btn-sm">"Acknowledged, responding immediately"</button>
                          <button className="btn btn-outline-secondary btn-sm">"Please provide more details"</button>
                          <button className="btn btn-outline-success btn-sm">"Will handle this now"</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="d-flex align-items-center justify-content-center h-100">
                  <div className="text-center">
                    <i className="ti ti-message-circle fs-48 text-muted mb-3"></i>
                    <h5 className="text-muted">Select a conversation to start messaging</h5>
                    <p className="text-muted">AI will help prioritize and categorize your messages</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Messages;
