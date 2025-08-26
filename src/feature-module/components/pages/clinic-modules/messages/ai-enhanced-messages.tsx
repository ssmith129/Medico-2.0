import { Link } from "react-router";
import { useState, useEffect, useMemo } from "react";
import { all_routes } from "../../../../routes/all_routes";
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

const AIEnhancedMessages = () => {
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

  // Mock AI-enhanced conversation data
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
          keywords: ["trauma", "mva", "ambulance", "surgery", "blood-bank"],
          department: "emergency",
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
          actionRequired: false, // Already being handled
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
        isOnline: true,
        complianceLevel: 'standard'
      },
      messages: []
    }
  ];

  useEffect(() => {
    setConversations(mockConversations);
    if (mockConversations.length > 0) {
      setSelectedConversation(mockConversations[0]);
    }
    
    // Calculate AI insights
    const totalUnread = mockConversations.reduce((sum, conv) => sum + conv.totalUnread, 0);
    const emergencyCount = mockConversations.filter(conv => 
      conv.lastMessage.priority === 'critical' && 
      (conv.lastMessage.category === 'emergency' || conv.lastMessage.aiClassification.codeStatus)
    ).length;
    
    setAiInsights({
      totalConversations: mockConversations.length,
      emergencyAlerts: emergencyCount,
      avgResponseTime: '8m',
      activeCodeStatus: mockConversations.find(conv => 
        conv.lastMessage.aiClassification.codeStatus && 
        conv.lastMessage.aiClassification.codeStatus !== 'all-clear'
      )?.lastMessage.aiClassification.codeStatus || null,
      priorityDistribution: {
        critical: mockConversations.filter(conv => conv.lastMessage.priority === 'critical').length,
        high: mockConversations.filter(conv => conv.lastMessage.priority === 'high').length,
        medium: mockConversations.filter(conv => conv.lastMessage.priority === 'medium').length,
        low: mockConversations.filter(conv => conv.lastMessage.priority === 'low').length
      }
    });
  }, []);

  // Filter conversations based on AI criteria
  const filteredConversations = useMemo(() => {
    return conversations.filter(conversation => {
      const message = conversation.lastMessage;
      
      if (filters.priority !== 'all' && message.priority !== filters.priority) return false;
      if (filters.category !== 'all' && message.category !== filters.category) return false;
      if (filters.sentiment !== 'all' && message.aiClassification.sentiment !== filters.sentiment) return false;
      if (filters.onlineOnly && !message.isOnline) return false;
      if (filters.actionRequired && !message.aiClassification.actionRequired) return false;
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        if (!conversation.participant.toLowerCase().includes(searchLower) &&
            !message.content.toLowerCase().includes(searchLower) &&
            !message.aiClassification.keywords.some(keyword => keyword.includes(searchLower))) {
          return false;
        }
      }
      
      return true;
    }).sort((a, b) => {
      // Sort by urgency first, then by timestamp
      if (a.lastMessage.aiClassification.urgency !== b.lastMessage.aiClassification.urgency) {
        return b.lastMessage.aiClassification.urgency - a.lastMessage.aiClassification.urgency;
      }
      return b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime();
    });
  }, [conversations, filters, searchTerm]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
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
      {/* Page Content */}
      <div className="page-wrapper">
        <div className="content content-two">
          <div className="chat-wrapper">
            {/* Enhanced Chat Sidebar */}
            <div className="sidebar-group">
              <div id="chats" className="sidebar-content active slimscroll">
                <div className="slimscroll">
                  {/* AI Triage Header */}
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
                      
                      {/* Emergency Alert */}
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
                            <h6 className="mb-0 fw-bold text-warning">
                              {conversations.reduce((sum, conv) => sum + conv.totalUnread, 0)}
                            </h6>
                            <small className="text-muted">Unread</small>
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="ai-metric">
                            <h6 className="mb-0 fw-bold text-info">{aiInsights.avgResponseTime}</h6>
                            <small className="text-muted">Avg Response</small>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Search */}
                    <div className="search-wrap mb-3">
                      <form>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="AI Smart Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          <span className="input-group-text">
                            <i className="isax isax-search-normal-1" />
                          </span>
                        </div>
                      </form>
                    </div>

                    {/* AI Filter Controls */}
                    <div className="ai-filters mb-3">
                      <div className="row g-2">
                        <div className="col-6">
                          <select 
                            className="form-select form-select-sm"
                            value={filters.priority}
                            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value as any }))}
                          >
                            <option value="all">All Priorities</option>
                            <option value="critical">Critical</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                          </select>
                        </div>
                        <div className="col-6">
                          <select 
                            className="form-select form-select-sm"
                            value={filters.category}
                            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as any }))}
                          >
                            <option value="all">All Categories</option>
                            <option value="emergency">Emergency</option>
                            <option value="patient-care">Patient Care</option>
                            <option value="coordination">Coordination</option>
                            <option value="administrative">Administrative</option>
                            <option value="consultation">Consultation</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="row g-2 mt-1">
                        <div className="col-12">
                          <div className="d-flex gap-2">
                            <div className="form-check form-check-sm">
                              <input 
                                className="form-check-input" 
                                type="checkbox"
                                checked={filters.onlineOnly}
                                onChange={(e) => setFilters(prev => ({ ...prev, onlineOnly: e.target.checked }))}
                              />
                              <label className="form-check-label fs-12">Online Only</label>
                            </div>
                            <div className="form-check form-check-sm">
                              <input 
                                className="form-check-input" 
                                type="checkbox"
                                checked={filters.actionRequired}
                                onChange={(e) => setFilters(prev => ({ ...prev, actionRequired: e.target.checked }))}
                              />
                              <label className="form-check-label fs-12">Action Required</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chat List */}
                  <div className="sidebar-body chat-body" id="chatsidebar">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="chat-title mb-0">AI-Sorted Chats ({filteredConversations.length})</h6>
                      <div className="dropdown">
                        <button className="btn btn-sm btn-outline-primary" data-bs-toggle="dropdown">
                          <i className="ti ti-adjustments"></i>
                        </button>
                        <div className="dropdown-menu dropdown-menu-end p-3">
                          <h6 className="mb-2">Quick Actions</h6>
                          <button className="dropdown-item btn-sm">Mark All Read</button>
                          <button className="dropdown-item btn-sm">Clear Filters</button>
                          <hr className="my-2" />
                          <button className="dropdown-item btn-sm">Export Conversations</button>
                          <button className="dropdown-item btn-sm">AI Settings</button>
                        </div>
                      </div>
                    </div>

                    <div className="chat-users-wrap">
                      {filteredConversations.map((conversation) => (
                        <div key={conversation.id} className="chat-list position-relative">
                          <Link 
                            to={all_routes.chat} 
                            className={`chat-user-list ${selectedConversation?.id === conversation.id ? 'active' : ''}`}
                            onClick={() => setSelectedConversation(conversation)}
                          >
                            <div className="avatar avatar-lg me-2 position-relative">
                              <ImageWithBasePath
                                src={conversation.lastMessage.avatar}
                                className="rounded-circle"
                                alt="image"
                              />
                              
                              {/* Online Status */}
                              <span className={`position-absolute bottom-0 end-0 badge rounded-pill ${conversation.lastMessage.isOnline ? 'bg-success' : 'bg-secondary'}`} style={{ width: '12px', height: '12px' }}></span>
                              
                              {/* Priority Indicator */}
                              <span 
                                className={`position-absolute top-0 start-0 badge bg-${getPriorityColor(conversation.lastMessage.priority)} rounded-pill`}
                                style={{ fontSize: '8px', padding: '2px 4px' }}
                              >
                                {conversation.lastMessage.aiClassification.urgency}
                              </span>
                            </div>
                            
                            <div className="chat-user-info">
                              <div className="chat-user-msg">
                                <div className="d-flex align-items-center justify-content-between mb-1">
                                  <h6 className="mb-0 d-flex align-items-center">
                                    {conversation.participant}
                                    {conversation.isPinned && (
                                      <i className="ti ti-pin text-warning ms-1 fs-12"></i>
                                    )}
                                    {conversation.isFavorite && (
                                      <i className="ti ti-heart-filled text-danger ms-1 fs-12"></i>
                                    )}
                                  </h6>
                                </div>
                                
                                {/* AI Classification Badges */}
                                <div className="d-flex align-items-center gap-1 mb-1">
                                  <span className={`badge bg-${getPriorityColor(conversation.lastMessage.priority)}-transparent text-${getPriorityColor(conversation.lastMessage.priority)} fs-10`}>
                                    {conversation.lastMessage.priority}
                                  </span>
                                  
                                  <span className="badge bg-light text-dark fs-10">
                                    <i className={`${getCategoryIcon(conversation.lastMessage.category)} me-1`}></i>
                                    {conversation.lastMessage.category.replace('-', ' ')}
                                  </span>
                                  
                                  {conversation.lastMessage.aiClassification.actionRequired && (
                                    <span className="badge bg-warning-transparent text-warning fs-10">
                                      <i className="ti ti-clock me-1"></i>
                                      Action
                                    </span>
                                  )}
                                  
                                  {conversation.lastMessage.aiClassification.codeStatus && (
                                    <span className="badge bg-danger-transparent text-danger fs-10">
                                      <i className="ti ti-emergency-bed me-1"></i>
                                      {conversation.lastMessage.aiClassification.codeStatus.toUpperCase()}
                                    </span>
                                  )}
                                </div>
                                
                                <p className="mb-0 fs-12 text-truncate">
                                  <i className={`${getMessageTypeIcon(conversation.lastMessage.messageType)} me-1`}></i>
                                  {conversation.lastMessage.content}
                                </p>
                                
                                {/* AI Insights */}
                                <div className="d-flex align-items-center justify-content-between mt-1">
                                  <div className="d-flex align-items-center gap-1">
                                    <span className={`text-${getPriorityColor(conversation.lastMessage.aiClassification.sentiment)} fs-10`}>
                                      <i className={getSentimentIcon(conversation.lastMessage.aiClassification.sentiment)}></i>
                                    </span>
                                    <small className="text-muted fs-10">
                                      AI: {Math.round(conversation.lastMessage.aiClassification.confidence * 100)}%
                                    </small>
                                  </div>
                                  
                                  {conversation.lastMessage.complianceLevel && (
                                    <span className={`badge bg-${conversation.lastMessage.complianceLevel === 'hipaa' ? 'success' : 'secondary'}-transparent text-${conversation.lastMessage.complianceLevel === 'hipaa' ? 'success' : 'secondary'} fs-10`}>
                                      {conversation.lastMessage.complianceLevel.toUpperCase()}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="chat-user-time">
                                <span className="time fs-11">{formatTimeAgo(conversation.lastMessage.timestamp)}</span>
                                <div className="chat-pin">
                                  {conversation.totalUnread > 0 && (
                                    <span className="count-message fs-12 fw-semibold bg-primary text-white rounded-pill px-2">
                                      {conversation.totalUnread}
                                    </span>
                                  )}
                                  <small className="d-block text-muted fs-10 mt-1">
                                    {conversation.lastMessage.aiClassification.estimatedResponseTime}
                                  </small>
                                </div>
                              </div>
                            </div>
                          </Link>
                          
                          {/* Chat Dropdown */}
                          <div className="chat-dropdown">
                            <Link className="#" to="#" data-bs-toggle="dropdown">
                              <i className="ti ti-dots-vertical" />
                            </Link>
                            <ul className="dropdown-menu dropdown-menu-end p-3">
                              <li><Link className="dropdown-item" to="#">Mark as Read</Link></li>
                              <li><Link className="dropdown-item" to="#">Pin Chat</Link></li>
                              <li><Link className="dropdown-item" to="#">Add to Favorites</Link></li>
                              <li><hr className="dropdown-divider" /></li>
                              <li><Link className="dropdown-item" to="#">Override AI Priority</Link></li>
                              <li><Link className="dropdown-item" to="#">Add AI Training</Link></li>
                              <li><hr className="dropdown-divider" /></li>
                              <li><Link className="dropdown-item" to="#">Archive Chat</Link></li>
                              <li><Link className="dropdown-item text-danger" to="#">Delete</Link></li>
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Chat View */}
            <div className="chat chat-messages show" id="middle">
              {selectedConversation ? (
                <div>
                  {/* Enhanced Chat Header */}
                  <div className="chat-header bg-white border-bottom p-3">
                    <div className="user-details">
                      <div className="d-xl-none">
                        <Link className="text-muted chat-close me-2" to="#">
                          <i className="fas fa-arrow-left" />
                        </Link>
                      </div>
                      <div className="avatar avatar-lg me-3 position-relative">
                        <ImageWithBasePath
                          src={selectedConversation.lastMessage.avatar}
                          className="rounded-circle"
                          alt="image"
                        />
                        <span className={`position-absolute bottom-0 end-0 badge rounded-pill ${selectedConversation.lastMessage.isOnline ? 'bg-success' : 'bg-secondary'}`} style={{ width: '12px', height: '12px' }}></span>
                      </div>
                      <div className="ms-2 overflow-hidden">
                        <h6 className="mb-1 d-flex align-items-center">
                          {selectedConversation.participant}
                          <span className={`badge bg-${getPriorityColor(selectedConversation.lastMessage.priority)} ms-2 fs-10`}>
                            {selectedConversation.lastMessage.priority}
                          </span>
                        </h6>
                        <div className="d-flex align-items-center gap-2">
                          <span className={`last-seen ${selectedConversation.lastMessage.isOnline ? 'text-success' : 'text-muted'}`}>
                            {selectedConversation.lastMessage.isOnline ? 'Online' : 'Offline'}
                          </span>
                          {selectedConversation.lastMessage.aiClassification.codeStatus && (
                            <span className="badge bg-danger-transparent text-danger fs-10">
                              {selectedConversation.lastMessage.aiClassification.codeStatus.toUpperCase()}
                            </span>
                          )}
                          {selectedConversation.lastMessage.complianceLevel === 'hipaa' && (
                            <span className="badge bg-success-transparent text-success fs-10">
                              <i className="ti ti-shield-check me-1"></i>
                              HIPAA
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="chat-options">
                      <ul className="list-unstyled">
                        {/* AI Insights Panel */}
                        <li>
                          <Link
                            to="#"
                            className="btn chat-search-btn"
                            data-bs-toggle="tooltip"
                            data-bs-placement="bottom"
                            title="AI Insights"
                          >
                            <i className="ti ti-robot text-primary" />
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="#"
                            className="btn chat-search-btn"
                            data-bs-toggle="tooltip"
                            data-bs-placement="bottom"
                            title="Search"
                          >
                            <i className="isax isax-search-normal-1" />
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="btn no-bg"
                            to="#"
                            data-bs-toggle="dropdown"
                          >
                            <i className="ti ti-dots-vertical" />
                          </Link>
                          <ul className="dropdown-menu dropdown-menu-end p-3">
                            <li><Link to="#" className="dropdown-item">Call</Link></li>
                            <li><Link to="#" className="dropdown-item">Video Call</Link></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><Link to="#" className="dropdown-item">View AI Analysis</Link></li>
                            <li><Link to="#" className="dropdown-item">Override Priority</Link></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><Link to="#" className="dropdown-item">Mute Notifications</Link></li>
                            <li><Link to="#" className="dropdown-item">Clear Messages</Link></li>
                            <li><Link to="#" className="dropdown-item text-danger">Block Contact</Link></li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* AI Insight Bar */}
                  <div className="ai-insights-bar bg-light border-bottom p-2">
                    <div className="row g-2 text-center">
                      <div className="col-3">
                        <small className="text-muted d-block">Urgency</small>
                        <span className={`fw-bold text-${getPriorityColor(selectedConversation.lastMessage.priority)}`}>
                          {selectedConversation.lastMessage.aiClassification.urgency}/5
                        </span>
                      </div>
                      <div className="col-3">
                        <small className="text-muted d-block">Sentiment</small>
                        <span className={`fw-bold text-${getPriorityColor(selectedConversation.lastMessage.aiClassification.sentiment)}`}>
                          <i className={getSentimentIcon(selectedConversation.lastMessage.aiClassification.sentiment)}></i>
                        </span>
                      </div>
                      <div className="col-3">
                        <small className="text-muted d-block">Confidence</small>
                        <span className="fw-bold text-primary">
                          {Math.round(selectedConversation.lastMessage.aiClassification.confidence * 100)}%
                        </span>
                      </div>
                      <div className="col-3">
                        <small className="text-muted d-block">Response</small>
                        <span className="fw-bold text-info fs-12">
                          {selectedConversation.lastMessage.aiClassification.estimatedResponseTime.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Chat Body */}
                  <div className="chat-body chat-page-group slimscroll">
                    <div className="messages">
                      {/* Display the selected conversation's last message */}
                      <div className="chats">
                        <div className="chat-avatar">
                          <ImageWithBasePath
                            src={selectedConversation.lastMessage.avatar}
                            className="rounded-circle"
                            alt="image"
                          />
                        </div>
                        <div className="chat-content">
                          <div className="chat-info">
                            <div className="message-content bg-light rounded p-3">
                              {selectedConversation.lastMessage.content}
                              
                              {/* AI Keywords */}
                              {selectedConversation.lastMessage.aiClassification.keywords.length > 0 && (
                                <div className="ai-keywords mt-2">
                                  <small className="text-muted d-block mb-1">AI Detected Keywords:</small>
                                  <div className="d-flex gap-1 flex-wrap">
                                    {selectedConversation.lastMessage.aiClassification.keywords.slice(0, 4).map((keyword, index) => (
                                      <span key={`${selectedConversation.id}-keyword-${keyword}-${index}`} className="badge bg-primary-transparent text-primary fs-10">
                                        {keyword}
                                      </span>
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

                  {/* Enhanced Message Input */}
                  <div className="chat-footer border-top p-3">
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Type your message..."
                          />
                          <button className="btn btn-outline-secondary" type="button">
                            <i className="ti ti-microphone"></i>
                          </button>
                          <button className="btn btn-outline-secondary" type="button">
                            <i className="ti ti-paperclip"></i>
                          </button>
                          <button className="btn btn-primary" type="button">
                            <i className="ti ti-send"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* AI Suggestions */}
                    {selectedConversation.lastMessage.aiClassification.actionRequired && (
                      <div className="ai-suggestions mt-2">
                        <small className="text-muted">AI Suggested Responses:</small>
                        <div className="d-flex gap-2 mt-1">
                          <button className="btn btn-outline-primary btn-sm">
                            "Acknowledged, responding immediately"
                          </button>
                          <button className="btn btn-outline-secondary btn-sm">
                            "Please provide more details"
                          </button>
                          <button className="btn btn-outline-success btn-sm">
                            "Will handle this now"
                          </button>
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

export default AIEnhancedMessages;
