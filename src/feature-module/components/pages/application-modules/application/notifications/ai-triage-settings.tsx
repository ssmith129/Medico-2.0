import React, { useState, useEffect } from 'react';
import { Card, Switch, Slider, Select, Alert, Progress, Badge, Tabs, Modal, Rate, Input, Checkbox } from 'antd';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

interface AITriageSettings {
  general: {
    enabled: boolean;
    autoProcessing: boolean;
    realTimeUpdates: boolean;
    soundAlerts: boolean;
    desktopNotifications: boolean;
  };
  prioritization: {
    algorithm: 'standard' | 'aggressive' | 'conservative' | 'custom';
    confidenceThreshold: number;
    emergencyKeywords: string[];
    customWeights: {
      timeRecency: number;
      senderImportance: number;
      contentUrgency: number;
      userHistory: number;
      departmentPriority: number;
    };
  };
  categorization: {
    categories: {
      critical: { enabled: boolean; threshold: number; keywords: string[] };
      important: { enabled: boolean; threshold: number; keywords: string[] };
      routine: { enabled: boolean; threshold: number; keywords: string[] };
      informational: { enabled: boolean; threshold: number; keywords: string[] };
    };
    autoGrouping: boolean;
    maxGroupSize: number;
  };
  notifications: {
    criticalAlerts: boolean;
    urgentAlerts: boolean;
    routineAlerts: boolean;
    adminAlerts: boolean;
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
    escalationRules: {
      enabled: boolean;
      timeouts: {
        critical: number;
        urgent: number;
        routine: number;
      };
    };
  };
  personalization: {
    learningEnabled: boolean;
    adaptTiming: boolean;
    trackInteractions: boolean;
    customPreferences: {
      preferredSenders: string[];
      priorityDepartments: string[];
      importantKeywords: string[];
    };
  };
  privacy: {
    dataCollection: boolean;
    analyticsSharing: boolean;
    retentionPeriod: number;
    anonymization: boolean;
  };
}

const AITriageSettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState<AITriageSettings>({
    general: {
      enabled: true,
      autoProcessing: true,
      realTimeUpdates: true,
      soundAlerts: true,
      desktopNotifications: false
    },
    prioritization: {
      algorithm: 'standard',
      confidenceThreshold: 0.8,
      emergencyKeywords: ['emergency', 'critical', 'urgent', 'stat', 'code blue'],
      customWeights: {
        timeRecency: 0.3,
        senderImportance: 0.2,
        contentUrgency: 0.3,
        userHistory: 0.1,
        departmentPriority: 0.1
      }
    },
    categorization: {
      categories: {
        critical: { enabled: true, threshold: 0.9, keywords: ['emergency', 'critical', 'stat'] },
        important: { enabled: true, threshold: 0.8, keywords: ['urgent', 'priority', 'asap'] },
        routine: { enabled: true, threshold: 0.6, keywords: ['routine', 'standard', 'normal'] },
        informational: { enabled: true, threshold: 0.4, keywords: ['info', 'announcement', 'update'] }
      },
      autoGrouping: true,
      maxGroupSize: 5
    },
    notifications: {
      criticalAlerts: true,
      urgentAlerts: true,
      routineAlerts: false,
      adminAlerts: false,
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
      },
      escalationRules: {
        enabled: true,
        timeouts: {
          critical: 5,
          urgent: 15,
          routine: 60
        }
      }
    },
    personalization: {
      learningEnabled: true,
      adaptTiming: true,
      trackInteractions: true,
      customPreferences: {
        preferredSenders: [],
        priorityDepartments: [],
        importantKeywords: []
      }
    },
    privacy: {
      dataCollection: true,
      analyticsSharing: false,
      retentionPeriod: 90,
      anonymization: true
    }
  });

  const [activeTab, setActiveTab] = useState('general');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    accuracy: 94,
    processingSpeed: 1.2,
    userSatisfaction: 4.3,
    falsePositives: 2.1
  });

  // Handle settings changes
  const updateSettings = (path: string, value: any) => {
    const keys = path.split('.');
    const newSettings = { ...settings };
    let current: any = newSettings;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    setSettings(newSettings);
    setUnsavedChanges(true);
  };

  // Save settings
  const saveSettings = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setUnsavedChanges(false);
      // Show success message
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  // Reset to defaults
  const resetToDefaults = () => {
    // Would reset to default settings
    setUnsavedChanges(true);
    setShowResetModal(false);
  };

  // Algorithm descriptions
  const algorithmDescriptions = {
    standard: 'Balanced approach suitable for most healthcare environments',
    aggressive: 'More sensitive detection, may result in higher false positives',
    conservative: 'Less sensitive, reduces false positives but may miss some urgent cases',
    custom: 'Use custom weights for different prioritization factors'
  };

  return (
    <div className="ai-triage-settings">
      {/* Header */}
      <div className="settings-header bg-white rounded-3 p-4 mb-4 border">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <div className="settings-icon me-3">
              <i className="ti ti-robot text-primary fs-24"></i>
            </div>
            <div>
              <h4 className="mb-1 fw-bold">AI Triage Settings</h4>
              <p className="mb-0 text-muted">Configure AI behavior and preferences for notification processing</p>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            {unsavedChanges && (
              <Badge count="Unsaved" style={{ backgroundColor: '#ffc107' }} />
            )}
            <button 
              className="btn btn-outline-secondary"
              onClick={() => setShowResetModal(true)}
            >
              Reset to Defaults
            </button>
            <button 
              className="btn btn-primary"
              onClick={saveSettings}
              disabled={saving || !unsavedChanges}
            >
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="performance-metrics bg-white rounded-3 p-4 mb-4 border">
        <h6 className="mb-3 fw-semibold">
          <i className="ti ti-chart-line me-2"></i>
          AI Performance Metrics
        </h6>
        <div className="row g-3">
          <div className="col-md-3">
            <div className="metric-card text-center">
              <Progress
                type="circle"
                percent={performanceMetrics.accuracy}
                size={60}
                strokeColor="#28a745"
              />
              <p className="mt-2 mb-0 fw-medium">Accuracy</p>
              <small className="text-muted">Classification precision</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="metric-card text-center">
              <div className="metric-value text-info fw-bold fs-4">
                {performanceMetrics.processingSpeed}s
              </div>
              <p className="mt-1 mb-0 fw-medium">Processing Speed</p>
              <small className="text-muted">Average response time</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="metric-card text-center">
              <Rate disabled defaultValue={performanceMetrics.userSatisfaction} allowHalf />
              <p className="mt-2 mb-0 fw-medium">User Satisfaction</p>
              <small className="text-muted">Based on feedback</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="metric-card text-center">
              <div className="metric-value text-warning fw-bold fs-4">
                {performanceMetrics.falsePositives}%
              </div>
              <p className="mt-1 mb-0 fw-medium">False Positives</p>
              <small className="text-muted">Incorrect classifications</small>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="settings-content bg-white rounded-3 border">
        <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
          {/* General Settings */}
          <TabPane tab={<><i className="ti ti-settings me-2"></i>General</>} key="general">
            <div className="tab-content p-4">
              <div className="row g-4">
                <div className="col-lg-6">
                  <Card title="Core Features" size="small">
                    <div className="setting-item d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <div className="fw-medium">Enable AI Triage</div>
                        <small className="text-muted">Turn on/off AI-powered notification processing</small>
                      </div>
                      <Switch
                        checked={settings.general.enabled}
                        onChange={(checked) => updateSettings('general.enabled', checked)}
                      />
                    </div>
                    
                    <div className="setting-item d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <div className="fw-medium">Auto Processing</div>
                        <small className="text-muted">Automatically categorize new notifications</small>
                      </div>
                      <Switch
                        checked={settings.general.autoProcessing}
                        onChange={(checked) => updateSettings('general.autoProcessing', checked)}
                        disabled={!settings.general.enabled}
                      />
                    </div>
                    
                    <div className="setting-item d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <div className="fw-medium">Real-time Updates</div>
                        <small className="text-muted">Process notifications as they arrive</small>
                      </div>
                      <Switch
                        checked={settings.general.realTimeUpdates}
                        onChange={(checked) => updateSettings('general.realTimeUpdates', checked)}
                        disabled={!settings.general.enabled}
                      />
                    </div>
                  </Card>
                </div>

                <div className="col-lg-6">
                  <Card title="Alert Preferences" size="small">
                    <div className="setting-item d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <div className="fw-medium">Sound Alerts</div>
                        <small className="text-muted">Play audio notifications for critical alerts</small>
                      </div>
                      <Switch
                        checked={settings.general.soundAlerts}
                        onChange={(checked) => updateSettings('general.soundAlerts', checked)}
                      />
                    </div>
                    
                    <div className="setting-item d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <div className="fw-medium">Desktop Notifications</div>
                        <small className="text-muted">Show browser notifications for urgent messages</small>
                      </div>
                      <Switch
                        checked={settings.general.desktopNotifications}
                        onChange={(checked) => updateSettings('general.desktopNotifications', checked)}
                      />
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </TabPane>

          {/* Prioritization Settings */}
          <TabPane tab={<><i className="ti ti-target me-2"></i>Prioritization</>} key="prioritization">
            <div className="tab-content p-4">
              <div className="row g-4">
                <div className="col-lg-8">
                  <Card title="Algorithm Configuration" size="small">
                    <div className="mb-4">
                      <label className="form-label fw-medium">Prioritization Algorithm</label>
                      <Select
                        style={{ width: '100%' }}
                        value={settings.prioritization.algorithm}
                        onChange={(value) => updateSettings('prioritization.algorithm', value)}
                      >
                        {Object.entries(algorithmDescriptions).map(([key, description]) => (
                          <Option key={key} value={key}>
                            <div>
                              <div className="fw-medium text-capitalize">{key}</div>
                              <small className="text-muted">{description}</small>
                            </div>
                          </Option>
                        ))}
                      </Select>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-medium">
                        Confidence Threshold: {Math.round(settings.prioritization.confidenceThreshold * 100)}%
                      </label>
                      <Slider
                        value={settings.prioritization.confidenceThreshold * 100}
                        onChange={(value) => updateSettings('prioritization.confidenceThreshold', value / 100)}
                        marks={{
                          0: '0%',
                          50: '50%',
                          80: '80%',
                          100: '100%'
                        }}
                        tipFormatter={(value) => `${value}%`}
                      />
                      <small className="text-muted">
                        Minimum confidence level for AI categorization
                      </small>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-medium">Emergency Keywords</label>
                      <TextArea
                        rows={3}
                        value={settings.prioritization.emergencyKeywords.join(', ')}
                        onChange={(e) => {
                          const keywords = e.target.value.split(',').map(k => k.trim()).filter(k => k);
                          updateSettings('prioritization.emergencyKeywords', keywords);
                        }}
                        placeholder="Enter keywords separated by commas"
                      />
                      <small className="text-muted">
                        Keywords that trigger high priority classification
                      </small>
                    </div>
                  </Card>

                  {settings.prioritization.algorithm === 'custom' && (
                    <Card title="Custom Weight Configuration" size="small" className="mt-3">
                      <div className="custom-weights">
                        {Object.entries(settings.prioritization.customWeights).map(([key, value]) => (
                          <div key={key} className="mb-3">
                            <label className="form-label fw-medium text-capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}: {Math.round(value * 100)}%
                            </label>
                            <Slider
                              value={value * 100}
                              onChange={(newValue) => updateSettings(`prioritization.customWeights.${key}`, newValue / 100)}
                              max={100}
                              min={0}
                              tipFormatter={(val) => `${val}%`}
                            />
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>

                <div className="col-lg-4">
                  <Card title="Priority Distribution" size="small">
                    <div className="priority-breakdown">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-danger fw-medium">Critical</span>
                        <span className="badge bg-danger">12%</span>
                      </div>
                      <Progress percent={12} strokeColor="#dc3545" showInfo={false} className="mb-3" />
                      
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-warning fw-medium">Important</span>
                        <span className="badge bg-warning">28%</span>
                      </div>
                      <Progress percent={28} strokeColor="#ffc107" showInfo={false} className="mb-3" />
                      
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-info fw-medium">Routine</span>
                        <span className="badge bg-info">45%</span>
                      </div>
                      <Progress percent={45} strokeColor="#0dcaf0" showInfo={false} className="mb-3" />
                      
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-secondary fw-medium">Admin</span>
                        <span className="badge bg-secondary">15%</span>
                      </div>
                      <Progress percent={15} strokeColor="#6c757d" showInfo={false} />
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </TabPane>

          {/* Categorization Settings */}
          <TabPane tab={<><i className="ti ti-category me-2"></i>Categories</>} key="categorization">
            <div className="tab-content p-4">
              <div className="row g-4">
                {Object.entries(settings.categorization.categories).map(([category, config]) => (
                  <div key={category} className="col-lg-6">
                    <Card 
                      title={
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-capitalize fw-semibold">{category}</span>
                          <Switch
                            checked={config.enabled}
                            onChange={(checked) => updateSettings(`categorization.categories.${category}.enabled`, checked)}
                            size="small"
                          />
                        </div>
                      }
                      size="small"
                    >
                      <div className="mb-3">
                        <label className="form-label fw-medium">
                          Threshold: {Math.round(config.threshold * 100)}%
                        </label>
                        <Slider
                          value={config.threshold * 100}
                          onChange={(value) => updateSettings(`categorization.categories.${category}.threshold`, value / 100)}
                          disabled={!config.enabled}
                          marks={{ 0: '0%', 50: '50%', 100: '100%' }}
                        />
                      </div>
                      
                      <div>
                        <label className="form-label fw-medium">Keywords</label>
                        <TextArea
                          rows={2}
                          value={config.keywords.join(', ')}
                          onChange={(e) => {
                            const keywords = e.target.value.split(',').map(k => k.trim()).filter(k => k);
                            updateSettings(`categorization.categories.${category}.keywords`, keywords);
                          }}
                          disabled={!config.enabled}
                          placeholder="Enter keywords separated by commas"
                        />
                      </div>
                    </Card>
                  </div>
                ))}
              </div>

              <div className="row g-4 mt-3">
                <div className="col-lg-6">
                  <Card title="Grouping Settings" size="small">
                    <div className="setting-item d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <div className="fw-medium">Auto Grouping</div>
                        <small className="text-muted">Group similar notifications together</small>
                      </div>
                      <Switch
                        checked={settings.categorization.autoGrouping}
                        onChange={(checked) => updateSettings('categorization.autoGrouping', checked)}
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-medium">
                        Max Group Size: {settings.categorization.maxGroupSize}
                      </label>
                      <Slider
                        value={settings.categorization.maxGroupSize}
                        onChange={(value) => updateSettings('categorization.maxGroupSize', value)}
                        min={2}
                        max={10}
                        marks={{ 2: '2', 5: '5', 10: '10' }}
                        disabled={!settings.categorization.autoGrouping}
                      />
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </TabPane>

          {/* Notification Settings */}
          <TabPane tab={<><i className="ti ti-bell me-2"></i>Notifications</>} key="notifications">
            <div className="tab-content p-4">
              <div className="row g-4">
                <div className="col-lg-6">
                  <Card title="Alert Types" size="small">
                    <div className="setting-item d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <div className="fw-medium text-danger">Critical Alerts</div>
                        <small className="text-muted">Emergency and life-threatening notifications</small>
                      </div>
                      <Switch
                        checked={settings.notifications.criticalAlerts}
                        onChange={(checked) => updateSettings('notifications.criticalAlerts', checked)}
                      />
                    </div>
                    
                    <div className="setting-item d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <div className="fw-medium text-warning">Urgent Alerts</div>
                        <small className="text-muted">High priority notifications</small>
                      </div>
                      <Switch
                        checked={settings.notifications.urgentAlerts}
                        onChange={(checked) => updateSettings('notifications.urgentAlerts', checked)}
                      />
                    </div>
                    
                    <div className="setting-item d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <div className="fw-medium text-info">Routine Alerts</div>
                        <small className="text-muted">Standard notifications</small>
                      </div>
                      <Switch
                        checked={settings.notifications.routineAlerts}
                        onChange={(checked) => updateSettings('notifications.routineAlerts', checked)}
                      />
                    </div>
                    
                    <div className="setting-item d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-medium text-secondary">Admin Alerts</div>
                        <small className="text-muted">System and administrative notifications</small>
                      </div>
                      <Switch
                        checked={settings.notifications.adminAlerts}
                        onChange={(checked) => updateSettings('notifications.adminAlerts', checked)}
                      />
                    </div>
                  </Card>
                </div>

                <div className="col-lg-6">
                  <Card title="Quiet Hours" size="small">
                    <div className="setting-item d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <div className="fw-medium">Enable Quiet Hours</div>
                        <small className="text-muted">Suppress non-critical notifications during specified hours</small>
                      </div>
                      <Switch
                        checked={settings.notifications.quietHours.enabled}
                        onChange={(checked) => updateSettings('notifications.quietHours.enabled', checked)}
                      />
                    </div>
                    
                    {settings.notifications.quietHours.enabled && (
                      <div className="quiet-hours-config">
                        <div className="mb-3">
                          <label className="form-label fw-medium">Start Time</label>
                          <input
                            type="time"
                            className="form-control"
                            value={settings.notifications.quietHours.start}
                            onChange={(e) => updateSettings('notifications.quietHours.start', e.target.value)}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label fw-medium">End Time</label>
                          <input
                            type="time"
                            className="form-control"
                            value={settings.notifications.quietHours.end}
                            onChange={(e) => updateSettings('notifications.quietHours.end', e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </Card>

                  <Card title="Escalation Rules" size="small" className="mt-3">
                    <div className="setting-item d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <div className="fw-medium">Enable Escalation</div>
                        <small className="text-muted">Escalate unread notifications after timeout</small>
                      </div>
                      <Switch
                        checked={settings.notifications.escalationRules.enabled}
                        onChange={(checked) => updateSettings('notifications.escalationRules.enabled', checked)}
                      />
                    </div>
                    
                    {settings.notifications.escalationRules.enabled && (
                      <div className="escalation-timeouts">
                        <div className="mb-3">
                          <label className="form-label fw-medium">
                            Critical: {settings.notifications.escalationRules.timeouts.critical} minutes
                          </label>
                          <Slider
                            value={settings.notifications.escalationRules.timeouts.critical}
                            onChange={(value) => updateSettings('notifications.escalationRules.timeouts.critical', value)}
                            min={1}
                            max={30}
                            marks={{ 1: '1min', 5: '5min', 15: '15min', 30: '30min' }}
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label fw-medium">
                            Urgent: {settings.notifications.escalationRules.timeouts.urgent} minutes
                          </label>
                          <Slider
                            value={settings.notifications.escalationRules.timeouts.urgent}
                            onChange={(value) => updateSettings('notifications.escalationRules.timeouts.urgent', value)}
                            min={5}
                            max={60}
                            marks={{ 5: '5min', 15: '15min', 30: '30min', 60: '1hr' }}
                          />
                        </div>
                        <div>
                          <label className="form-label fw-medium">
                            Routine: {settings.notifications.escalationRules.timeouts.routine} minutes
                          </label>
                          <Slider
                            value={settings.notifications.escalationRules.timeouts.routine}
                            onChange={(value) => updateSettings('notifications.escalationRules.timeouts.routine', value)}
                            min={30}
                            max={240}
                            marks={{ 30: '30min', 60: '1hr', 120: '2hr', 240: '4hr' }}
                          />
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </div>
          </TabPane>

          {/* Personalization Settings */}
          <TabPane tab={<><i className="ti ti-user-cog me-2"></i>Personalization</>} key="personalization">
            <div className="tab-content p-4">
              <div className="row g-4">
                <div className="col-lg-6">
                  <Card title="Learning & Adaptation" size="small">
                    <div className="setting-item d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <div className="fw-medium">Machine Learning</div>
                        <small className="text-muted">Allow AI to learn from your behavior</small>
                      </div>
                      <Switch
                        checked={settings.personalization.learningEnabled}
                        onChange={(checked) => updateSettings('personalization.learningEnabled', checked)}
                      />
                    </div>
                    
                    <div className="setting-item d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <div className="fw-medium">Adaptive Timing</div>
                        <small className="text-muted">Optimize notification timing based on your schedule</small>
                      </div>
                      <Switch
                        checked={settings.personalization.adaptTiming}
                        onChange={(checked) => updateSettings('personalization.adaptTiming', checked)}
                        disabled={!settings.personalization.learningEnabled}
                      />
                    </div>
                    
                    <div className="setting-item d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-medium">Track Interactions</div>
                        <small className="text-muted">Monitor how you interact with notifications</small>
                      </div>
                      <Switch
                        checked={settings.personalization.trackInteractions}
                        onChange={(checked) => updateSettings('personalization.trackInteractions', checked)}
                        disabled={!settings.personalization.learningEnabled}
                      />
                    </div>
                  </Card>
                </div>

                <div className="col-lg-6">
                  <Card title="Custom Preferences" size="small">
                    <div className="mb-3">
                      <label className="form-label fw-medium">Preferred Senders</label>
                      <TextArea
                        rows={2}
                        value={settings.personalization.customPreferences.preferredSenders.join(', ')}
                        onChange={(e) => {
                          const senders = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                          updateSettings('personalization.customPreferences.preferredSenders', senders);
                        }}
                        placeholder="Enter sender names or email addresses"
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-medium">Priority Departments</label>
                      <TextArea
                        rows={2}
                        value={settings.personalization.customPreferences.priorityDepartments.join(', ')}
                        onChange={(e) => {
                          const depts = e.target.value.split(',').map(d => d.trim()).filter(d => d);
                          updateSettings('personalization.customPreferences.priorityDepartments', depts);
                        }}
                        placeholder="Enter department names"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label fw-medium">Important Keywords</label>
                      <TextArea
                        rows={2}
                        value={settings.personalization.customPreferences.importantKeywords.join(', ')}
                        onChange={(e) => {
                          const keywords = e.target.value.split(',').map(k => k.trim()).filter(k => k);
                          updateSettings('personalization.customPreferences.importantKeywords', keywords);
                        }}
                        placeholder="Enter keywords that are important to you"
                      />
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </TabPane>

          {/* Privacy Settings */}
          <TabPane tab={<><i className="ti ti-shield-lock me-2"></i>Privacy</>} key="privacy">
            <div className="tab-content p-4">
              <div className="row g-4">
                <div className="col-lg-8">
                  <Card title="Data Collection & Privacy" size="small">
                    <Alert
                      message="Privacy Notice"
                      description="We are committed to protecting your privacy. All data processing follows HIPAA guidelines and healthcare privacy regulations."
                      type="info"
                      showIcon
                      className="mb-4"
                    />
                    
                    <div className="setting-item d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <div className="fw-medium">Data Collection</div>
                        <small className="text-muted">Allow collection of interaction data for AI improvement</small>
                      </div>
                      <Switch
                        checked={settings.privacy.dataCollection}
                        onChange={(checked) => updateSettings('privacy.dataCollection', checked)}
                      />
                    </div>
                    
                    <div className="setting-item d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <div className="fw-medium">Analytics Sharing</div>
                        <small className="text-muted">Share anonymized analytics to improve AI models</small>
                      </div>
                      <Switch
                        checked={settings.privacy.analyticsSharing}
                        onChange={(checked) => updateSettings('privacy.analyticsSharing', checked)}
                        disabled={!settings.privacy.dataCollection}
                      />
                    </div>
                    
                    <div className="setting-item d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <div className="fw-medium">Data Anonymization</div>
                        <small className="text-muted">Remove personally identifiable information from collected data</small>
                      </div>
                      <Switch
                        checked={settings.privacy.anonymization}
                        onChange={(checked) => updateSettings('privacy.anonymization', checked)}
                        disabled={!settings.privacy.dataCollection}
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="form-label fw-medium">
                        Data Retention Period: {settings.privacy.retentionPeriod} days
                      </label>
                      <Slider
                        value={settings.privacy.retentionPeriod}
                        onChange={(value) => updateSettings('privacy.retentionPeriod', value)}
                        min={30}
                        max={365}
                        marks={{
                          30: '30 days',
                          90: '90 days',
                          180: '6 months',
                          365: '1 year'
                        }}
                        disabled={!settings.privacy.dataCollection}
                      />
                      <small className="text-muted">
                        How long to retain your interaction data for AI learning
                      </small>
                    </div>
                  </Card>
                </div>

                <div className="col-lg-4">
                  <Card title="Data Export & Deletion" size="small">
                    <p className="text-muted mb-3">
                      You have the right to export or delete your data at any time.
                    </p>
                    
                    <div className="d-grid gap-2">
                      <button className="btn btn-outline-primary btn-sm">
                        <i className="ti ti-download me-1"></i>
                        Export My Data
                      </button>
                      <button className="btn btn-outline-danger btn-sm">
                        <i className="ti ti-trash me-1"></i>
                        Delete My Data
                      </button>
                    </div>
                    
                    <hr className="my-3" />
                    
                    <div className="privacy-summary">
                      <h6 className="fw-semibold mb-2">Current Settings</h6>
                      <ul className="list-unstyled fs-12">
                        <li className="mb-1">
                          <i className={`ti ti-${settings.privacy.dataCollection ? 'check' : 'x'} me-1 ${settings.privacy.dataCollection ? 'text-success' : 'text-danger'}`}></i>
                          Data Collection: {settings.privacy.dataCollection ? 'Enabled' : 'Disabled'}
                        </li>
                        <li className="mb-1">
                          <i className={`ti ti-${settings.privacy.analyticsSharing ? 'check' : 'x'} me-1 ${settings.privacy.analyticsSharing ? 'text-success' : 'text-danger'}`}></i>
                          Analytics: {settings.privacy.analyticsSharing ? 'Shared' : 'Private'}
                        </li>
                        <li className="mb-1">
                          <i className={`ti ti-${settings.privacy.anonymization ? 'check' : 'x'} me-1 ${settings.privacy.anonymization ? 'text-success' : 'text-danger'}`}></i>
                          Anonymization: {settings.privacy.anonymization ? 'Enabled' : 'Disabled'}
                        </li>
                        <li>
                          <i className="ti ti-clock me-1 text-info"></i>
                          Retention: {settings.privacy.retentionPeriod} days
                        </li>
                      </ul>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        title="Reset to Default Settings"
        open={showResetModal}
        onCancel={() => setShowResetModal(false)}
        footer={[
          <button key="cancel" className="btn btn-secondary" onClick={() => setShowResetModal(false)}>
            Cancel
          </button>,
          <button key="reset" className="btn btn-danger" onClick={resetToDefaults}>
            Reset Settings
          </button>
        ]}
      >
        <Alert
          message="Warning"
          description="This will reset all AI triage settings to their default values. This action cannot be undone."
          type="warning"
          showIcon
        />
      </Modal>
    </div>
  );
};

export default AITriageSettingsPanel;
