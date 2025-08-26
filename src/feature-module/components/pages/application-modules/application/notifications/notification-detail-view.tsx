import React, { useState } from "react";
import { Link } from "react-router";
import { Modal, Timeline, Steps, Tabs } from "antd";
import ImageWithBasePath from "../../../../../../core/imageWithBasePath";

interface NotificationDetailProps {
  notification: {
    id: string;
    type: 'critical' | 'urgent' | 'routine' | 'system';
    category: 'appointment' | 'medical' | 'administrative' | 'emergency' | 'reminder';
    title: string;
    description: string;
    fullContent?: string;
    timestamp: Date;
    sender: string;
    avatar: string;
    aiPriority: number;
    aiInsight?: string;
    actionHistory?: Array<{
      action: string;
      user: string;
      timestamp: Date;
      note?: string;
    }>;
    relatedNotifications?: Array<{
      id: string;
      title: string;
      timestamp: Date;
    }>;
    metadata?: {
      patientId?: string;
      patientName?: string;
      doctorId?: string;
      doctorName?: string;
      appointmentId?: string;
      appointmentDate?: Date;
      labResultId?: string;
      medicalRecordId?: string;
      urgencyLevel?: string;
      [key: string]: any;
    };
  };
  isVisible: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
}

const NotificationDetailView: React.FC<NotificationDetailProps> = ({
  notification,
  isVisible,
  onClose,
  onAction,
}) => {
  const [activeTab, setActiveTab] = useState("1");

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getPriorityColor = (type: string) => {
    switch (type) {
      case 'critical': return 'danger';
      case 'urgent': return 'warning';
      case 'routine': return 'info';
      case 'system': return 'secondary';
      default: return 'info';
    }
  };

  const getPriorityIcon = (type: string) => {
    switch (type) {
      case 'critical': return 'ti ti-alert-triangle-filled';
      case 'urgent': return 'ti ti-bell-ringing';
      case 'routine': return 'ti ti-bell';
      case 'system': return 'ti ti-settings';
      default: return 'ti ti-bell';
    }
  };

  const renderCriticalEmergencyView = () => (
    <div className="emergency-detail-view">
      <div className="emergency-header bg-danger-transparent p-4 rounded-3 mb-4">
        <div className="d-flex align-items-center">
          <div className="emergency-pulse-icon me-3">
            <i className="ti ti-emergency-bed text-danger fs-24"></i>
          </div>
          <div>
            <h5 className="text-danger mb-1 fw-bold">EMERGENCY ALERT</h5>
            <p className="mb-0 text-danger-emphasis">Immediate medical intervention required</p>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-8">
          <div className="card border-danger">
            <div className="card-header bg-danger text-white">
              <h6 className="mb-0 fw-semibold">
                <i className="ti ti-stethoscope me-2"></i>
                Patient Information
              </h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-6">
                  <div className="info-item mb-3">
                    <label className="fw-semibold text-muted fs-12">Patient Name</label>
                    <p className="mb-0 fw-medium">{notification.metadata?.patientName || 'John Doe'}</p>
                  </div>
                  <div className="info-item mb-3">
                    <label className="fw-semibold text-muted fs-12">Patient ID</label>
                    <p className="mb-0 font-monospace">{notification.metadata?.patientId || 'P-2024-001'}</p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="info-item mb-3">
                    <label className="fw-semibold text-muted fs-12">Urgency Level</label>
                    <span className="badge bg-danger-transparent text-danger">
                      {notification.metadata?.urgencyLevel || 'CRITICAL'}
                    </span>
                  </div>
                  <div className="info-item mb-3">
                    <label className="fw-semibold text-muted fs-12">Location</label>
                    <p className="mb-0">Emergency Room - Bed 3</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-warning">
            <div className="card-header bg-warning text-white">
              <h6 className="mb-0 fw-semibold">
                <i className="ti ti-clock-alert me-2"></i>
                Response Timer
              </h6>
            </div>
            <div className="card-body text-center">
              <div className="response-timer">
                <div className="timer-display fs-24 fw-bold text-danger mb-2">04:32</div>
                <p className="mb-0 fs-12 text-muted">Elapsed since alert</p>
              </div>
              <div className="response-actions mt-3">
                <button 
                  className="btn btn-danger btn-sm w-100 mb-2"
                  onClick={() => onAction('emergency-response')}
                >
                  <i className="ti ti-emergency-bed me-1"></i>
                  Emergency Response
                </button>
                <button 
                  className="btn btn-outline-danger btn-sm w-100"
                  onClick={() => onAction('alert-team')}
                >
                  <i className="ti ti-users me-1"></i>
                  Alert Medical Team
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppointmentDetailView = () => (
    <div className="appointment-detail-view">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h6 className="mb-0 fw-semibold">
            <i className="ti ti-calendar me-2"></i>
            Appointment Details
          </h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="info-item mb-3">
                <label className="fw-semibold text-muted fs-12">Patient</label>
                <div className="d-flex align-items-center">
                  <ImageWithBasePath
                    src="assets/img/users/user-01.jpg"
                    className="avatar-sm rounded-circle me-2"
                    alt="Patient"
                  />
                  <div>
                    <p className="mb-0 fw-medium">{notification.metadata?.patientName || 'Emily Johnson'}</p>
                    <small className="text-muted">ID: {notification.metadata?.patientId || 'P-2024-002'}</small>
                  </div>
                </div>
              </div>
              <div className="info-item mb-3">
                <label className="fw-semibold text-muted fs-12">Appointment Type</label>
                <p className="mb-0">Follow-up Consultation</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="info-item mb-3">
                <label className="fw-semibold text-muted fs-12">Doctor</label>
                <div className="d-flex align-items-center">
                  <ImageWithBasePath
                    src="assets/img/doctors/doctor-01.jpg"
                    className="avatar-sm rounded-circle me-2"
                    alt="Doctor"
                  />
                  <div>
                    <p className="mb-0 fw-medium">{notification.metadata?.doctorName || 'Dr. Smith'}</p>
                    <small className="text-muted">Cardiologist</small>
                  </div>
                </div>
              </div>
              <div className="info-item mb-3">
                <label className="fw-semibold text-muted fs-12">Scheduled Time</label>
                <p className="mb-0 fw-medium text-primary">
                  {notification.metadata?.appointmentDate ? 
                    formatDateTime(notification.metadata.appointmentDate) : 
                    'April 15, 2024 at 2:00 PM'
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div className="appointment-actions mt-4 p-3 bg-light rounded-3">
            <h6 className="fw-semibold mb-3">Available Actions</h6>
            <div className="d-flex flex-wrap gap-2">
              <button className="btn btn-primary btn-sm" onClick={() => onAction('confirm-appointment')}>
                <i className="ti ti-check me-1"></i>
                Confirm Appointment
              </button>
              <button className="btn btn-outline-warning btn-sm" onClick={() => onAction('reschedule')}>
                <i className="ti ti-calendar-event me-1"></i>
                Reschedule
              </button>
              <button className="btn btn-outline-danger btn-sm" onClick={() => onAction('cancel')}>
                <i className="ti ti-x me-1"></i>
                Cancel
              </button>
              <button className="btn btn-outline-info btn-sm" onClick={() => onAction('view-patient')}>
                <i className="ti ti-user me-1"></i>
                View Patient Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMedicalDetailView = () => (
    <div className="medical-detail-view">
      <div className="card">
        <div className="card-header bg-success text-white">
          <h6 className="mb-0 fw-semibold">
            <i className="ti ti-report-medical me-2"></i>
            Medical Report Details
          </h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-8">
              <div className="medical-summary mb-4">
                <h6 className="fw-semibold mb-3">Lab Results Summary</h6>
                <div className="results-grid">
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <div className="result-item p-3 border rounded-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="result-name">Blood Pressure</span>
                          <span className="result-value text-warning fw-bold">145/90</span>
                        </div>
                        <small className="text-muted">Normal: 120/80</small>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="result-item p-3 border rounded-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="result-name">Heart Rate</span>
                          <span className="result-value text-danger fw-bold">102 bpm</span>
                        </div>
                        <small className="text-muted">Normal: 60-100 bpm</small>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="result-item p-3 border rounded-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="result-name">Cholesterol</span>
                          <span className="result-value text-success fw-bold">180 mg/dL</span>
                        </div>
                        <small className="text-muted">Normal: &lt;200 mg/dL</small>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="result-item p-3 border rounded-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="result-name">Blood Sugar</span>
                          <span className="result-value text-warning fw-bold">130 mg/dL</span>
                        </div>
                        <small className="text-muted">Normal: 70-100 mg/dL</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="medical-notes">
                <h6 className="fw-semibold mb-3">Doctor's Notes</h6>
                <div className="p-3 bg-light rounded-3">
                  <p className="mb-2">
                    Patient shows elevated blood pressure and slightly elevated heart rate. 
                    Recommend follow-up within 48 hours to monitor condition.
                  </p>
                  <p className="mb-0 text-muted fs-12">
                    - Dr. Patel, Internal Medicine
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="medical-actions">
                <h6 className="fw-semibold mb-3">Recommended Actions</h6>
                <div className="action-list">
                  <div className="action-item p-3 border-start border-warning border-3 bg-warning-transparent mb-3">
                    <div className="d-flex align-items-start">
                      <i className="ti ti-phone text-warning me-2 mt-1"></i>
                      <div>
                        <p className="mb-1 fw-medium">Contact Patient</p>
                        <small className="text-muted">Inform about results within 2 hours</small>
                      </div>
                    </div>
                  </div>
                  
                  <div className="action-item p-3 border-start border-info border-3 bg-info-transparent mb-3">
                    <div className="d-flex align-items-start">
                      <i className="ti ti-calendar-plus text-info me-2 mt-1"></i>
                      <div>
                        <p className="mb-1 fw-medium">Schedule Follow-up</p>
                        <small className="text-muted">Book appointment within 48 hours</small>
                      </div>
                    </div>
                  </div>
                  
                  <div className="action-item p-3 border-start border-success border-3 bg-success-transparent">
                    <div className="d-flex align-items-start">
                      <i className="ti ti-file-text text-success me-2 mt-1"></i>
                      <div>
                        <p className="mb-1 fw-medium">Update Records</p>
                        <small className="text-muted">Add results to patient file</small>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="action-buttons mt-4">
                  <button className="btn btn-warning btn-sm w-100 mb-2" onClick={() => onAction('contact-patient')}>
                    <i className="ti ti-phone me-1"></i>
                    Contact Patient Now
                  </button>
                  <button className="btn btn-outline-info btn-sm w-100 mb-2" onClick={() => onAction('schedule-followup')}>
                    <i className="ti ti-calendar-plus me-1"></i>
                    Schedule Follow-up
                  </button>
                  <button className="btn btn-outline-success btn-sm w-100" onClick={() => onAction('update-records')}>
                    <i className="ti ti-file-text me-1"></i>
                    Update Medical Records
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActionHistory = () => (
    <div className="action-history">
      <Timeline>
        {notification.actionHistory?.map((action, index) => (
          <Timeline.Item
            key={`${notification.id}-action-${index}-${action.timestamp.getTime()}`}
            color={index === 0 ? 'green' : 'blue'}
            dot={index === 0 ? <i className="ti ti-check-circle text-success"></i> : undefined}
          >
            <div className="timeline-content">
              <div className="d-flex justify-content-between align-items-start mb-1">
                <span className="fw-medium">{action.action}</span>
                <small className="text-muted">{formatDateTime(action.timestamp)}</small>
              </div>
              <p className="mb-1 text-muted fs-13">by {action.user}</p>
              {action.note && (
                <p className="mb-0 fs-12 text-muted fst-italic">"{action.note}"</p>
              )}
            </div>
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );

  const renderRelatedNotifications = () => (
    <div className="related-notifications">
      <div className="list-group">
        {notification.relatedNotifications?.map((related, index) => (
          <div key={`${notification.id}-related-${related.id}-${index}`} className="list-group-item border-0 px-0">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1 fs-14">{related.title}</h6>
                <small className="text-muted">{formatDateTime(related.timestamp)}</small>
              </div>
              <Link to="#" className="btn btn-outline-primary btn-sm">
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const tabItems = [
    {
      key: "1",
      label: "Details",
      children: (
        <>
          {notification.type === 'critical' && notification.category === 'emergency' && renderCriticalEmergencyView()}
          {notification.category === 'appointment' && renderAppointmentDetailView()}
          {notification.category === 'medical' && renderMedicalDetailView()}
          {notification.category === 'administrative' && (
            <div className="administrative-view p-4">
              <h6>Administrative Notification</h6>
              <p>{notification.description}</p>
              <div className="mt-3">
                <button className="btn btn-primary btn-sm me-2" onClick={() => onAction('acknowledge')}>
                  Acknowledge
                </button>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => onAction('forward')}>
                  Forward
                </button>
              </div>
            </div>
          )}
        </>
      ),
    },
    {
      key: "2",
      label: `Action History (${notification.actionHistory?.length || 0})`,
      children: renderActionHistory(),
    },
    {
      key: "3",
      label: `Related (${notification.relatedNotifications?.length || 0})`,
      children: renderRelatedNotifications(),
    },
  ];

  return (
    <Modal
      title={
        <div className="notification-detail-header">
          <div className="d-flex align-items-center">
            <div className={`priority-badge bg-${getPriorityColor(notification.type)}-transparent p-2 rounded-circle me-3`}>
              <i className={`${getPriorityIcon(notification.type)} text-${getPriorityColor(notification.type)}`}></i>
            </div>
            <div>
              <h5 className="mb-1 fw-bold">{notification.title}</h5>
              <div className="d-flex align-items-center gap-2">
                <span className={`badge bg-${getPriorityColor(notification.type)}-transparent text-${getPriorityColor(notification.type)} text-uppercase`}>
                  {notification.type}
                </span>
                <span className="badge bg-light text-dark">{notification.category}</span>
                <span className="text-muted fs-12">
                  <i className="ti ti-clock me-1"></i>
                  {formatDateTime(notification.timestamp)}
                </span>
              </div>
            </div>
          </div>
        </div>
      }
      open={isVisible}
      onCancel={onClose}
      width={1000}
      footer={
        <div className="d-flex justify-content-between align-items-center">
          <div className="notification-meta">
            <span className="text-muted fs-12">
              From: <span className="fw-medium">{notification.sender}</span>
            </span>
          </div>
          <div className="modal-actions">
            <button className="btn btn-outline-secondary me-2" onClick={onClose}>
              Close
            </button>
            <button className="btn btn-primary" onClick={() => onAction('mark-read')}>
              Mark as Read
            </button>
          </div>
        </div>
      }
      className="notification-detail-modal"
    >
      <div className="notification-detail-content">
        {notification.aiInsight && (
          <div className="ai-insight-section bg-primary-transparent p-3 rounded-3 mb-4">
            <div className="d-flex align-items-start">
              <i className="ti ti-robot text-primary me-2 mt-1"></i>
              <div>
                <h6 className="text-primary mb-1 fw-semibold">AI Analysis</h6>
                <p className="mb-0">{notification.aiInsight}</p>
              </div>
            </div>
          </div>
        )}

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className="notification-detail-tabs"
        />
      </div>
    </Modal>
  );
};

export default NotificationDetailView;
