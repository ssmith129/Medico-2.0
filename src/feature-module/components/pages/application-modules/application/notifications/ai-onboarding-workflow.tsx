import React, { useState, useEffect } from 'react';
import { Steps, Card, Button, Progress, Alert, Tour, Switch, Slider, Checkbox, Rate } from 'antd';
import type { TourProps } from 'antd';
import ImageWithBasePath from '@core/imageWithBasePath';

const { Step } = Steps;

interface OnboardingStep {
  title: string;
  description: string;
  content: React.ReactNode;
  optional?: boolean;
  estimated_time?: string;
}

interface WorkflowState {
  currentStep: number;
  completedSteps: Set<number>;
  userPreferences: {
    enableAI: boolean;
    confidenceThreshold: number;
    priorityCategories: string[];
    notifications: string[];
    learningMode: boolean;
  };
  tourOpen: boolean;
  skipOnboarding: boolean;
}

const AIOnboardingWorkflow: React.FC = () => {
  const [state, setState] = useState<WorkflowState>({
    currentStep: 0,
    completedSteps: new Set(),
    userPreferences: {
      enableAI: true,
      confidenceThreshold: 0.8,
      priorityCategories: ['critical', 'important'],
      notifications: ['critical', 'urgent'],
      learningMode: true
    },
    tourOpen: false,
    skipOnboarding: false
  });

  // Onboarding steps
  const onboardingSteps: OnboardingStep[] = [
    {
      title: "Welcome to AI Inbox Triage",
      description: "Let's set up your intelligent notification system",
      estimated_time: "2 minutes",
      content: (
        <div className="welcome-step text-center">
          <div className="welcome-icon mb-4">
            <i className="ti ti-robot text-primary" style={{ fontSize: '4rem' }}></i>
          </div>
          <h4 className="mb-3">Welcome to AI-Powered Notifications!</h4>
          <p className="text-muted mb-4 fs-16">
            AI Inbox Triage automatically categorizes your notifications by priority, 
            reducing information overload and helping you focus on what matters most.
          </p>
          
          <div className="features-preview row g-3 mb-4">
            <div className="col-md-4">
              <div className="feature-card p-3 bg-light rounded-3">
                <i className="ti ti-target text-primary fs-24 mb-2"></i>
                <h6 className="fw-semibold">Smart Prioritization</h6>
                <p className="text-muted fs-14 mb-0">AI analyzes content to rank notifications by urgency</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card p-3 bg-light rounded-3">
                <i className="ti ti-stack text-success fs-24 mb-2"></i>
                <h6 className="fw-semibold">Intelligent Grouping</h6>
                <p className="text-muted fs-14 mb-0">Related notifications are grouped to reduce clutter</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card p-3 bg-light rounded-3">
                <i className="ti ti-bulb text-warning fs-24 mb-2"></i>
                <h6 className="fw-semibold">Suggested Actions</h6>
                <p className="text-muted fs-14 mb-0">AI recommends appropriate responses for each notification</p>
              </div>
            </div>
          </div>
          
          <Alert
            message="Getting Started"
            description="This setup will take about 2 minutes and can be customized later in settings."
            type="info"
            showIcon
          />
        </div>
      )
    },
    {
      title: "Enable AI Features",
      description: "Choose which AI capabilities to activate",
      estimated_time: "30 seconds",
      content: (
        <div className="ai-features-step">
          <h5 className="mb-3">AI Feature Configuration</h5>
          <p className="text-muted mb-4">
            Select which AI features you'd like to enable. You can change these settings at any time.
          </p>
          
          <div className="ai-feature-options">
            <div className="feature-option d-flex justify-content-between align-items-center p-3 bg-light rounded-3 mb-3">
              <div>
                <h6 className="mb-1 fw-semibold">
                  <i className="ti ti-robot text-primary me-2"></i>
                  AI-Powered Prioritization
                </h6>
                <p className="text-muted mb-0 fs-14">
                  Automatically categorize notifications as Critical, Important, or Routine
                </p>
              </div>
              <Switch
                checked={state.userPreferences.enableAI}
                onChange={(checked) => setState(prev => ({
                  ...prev,
                  userPreferences: { ...prev.userPreferences, enableAI: checked }
                }))}
                size="default"
              />
            </div>
            
            <div className="feature-option d-flex justify-content-between align-items-center p-3 bg-light rounded-3 mb-3">
              <div>
                <h6 className="mb-1 fw-semibold">
                  <i className="ti ti-brain text-info me-2"></i>
                  Adaptive Learning
                </h6>
                <p className="text-muted mb-0 fs-14">
                  AI learns from your behavior to improve categorization over time
                </p>
              </div>
              <Switch
                checked={state.userPreferences.learningMode}
                onChange={(checked) => setState(prev => ({
                  ...prev,
                  userPreferences: { ...prev.userPreferences, learningMode: checked }
                }))}
                disabled={!state.userPreferences.enableAI}
                size="default"
              />
            </div>
            
            {state.userPreferences.enableAI && (
              <div className="confidence-setting mt-4">
                <label className="form-label fw-medium">
                  AI Confidence Threshold: {Math.round(state.userPreferences.confidenceThreshold * 100)}%
                </label>
                <Slider
                  value={state.userPreferences.confidenceThreshold * 100}
                  onChange={(value) => setState(prev => ({
                    ...prev,
                    userPreferences: { ...prev.userPreferences, confidenceThreshold: value / 100 }
                  }))}
                  marks={{
                    70: '70%',
                    80: '80%',
                    90: '90%',
                    100: '100%'
                  }}
                  min={70}
                  max={100}
                />
                <small className="text-muted">
                  Higher values mean AI will be more conservative in its classifications
                </small>
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      title: "Priority Categories",
      description: "Select which notification types you want to see",
      estimated_time: "30 seconds",
      content: (
        <div className="priority-categories-step">
          <h5 className="mb-3">Notification Priority Preferences</h5>
          <p className="text-muted mb-4">
            Choose which priority levels you want to receive notifications for. 
            You can always adjust these settings later.
          </p>
          
          <div className="priority-options">
            <div className="row g-3">
              <div className="col-md-6">
                <div className={`priority-card p-3 rounded-3 border ${
                  state.userPreferences.priorityCategories.includes('critical') 
                    ? 'border-danger bg-danger-transparent' 
                    : 'border-light'
                }`}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="text-danger fw-semibold mb-1">
                        <i className="ti ti-alert-triangle-filled me-2"></i>
                        Critical
                      </h6>
                      <p className="text-muted fs-14 mb-0">
                        Emergency situations requiring immediate attention
                      </p>
                    </div>
                    <Checkbox
                      checked={state.userPreferences.priorityCategories.includes('critical')}
                      onChange={(e) => {
                        const categories = e.target.checked
                          ? [...state.userPreferences.priorityCategories, 'critical']
                          : state.userPreferences.priorityCategories.filter(c => c !== 'critical');
                        setState(prev => ({
                          ...prev,
                          userPreferences: { ...prev.userPreferences, priorityCategories: categories }
                        }));
                      }}
                    />
                  </div>
                  <div className="examples">
                    <small className="text-muted">
                      Examples: Code Blue, Emergency Response, Critical Lab Results
                    </small>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className={`priority-card p-3 rounded-3 border ${
                  state.userPreferences.priorityCategories.includes('important') 
                    ? 'border-warning bg-warning-transparent' 
                    : 'border-light'
                }`}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="text-warning fw-semibold mb-1">
                        <i className="ti ti-exclamation-circle me-2"></i>
                        Important
                      </h6>
                      <p className="text-muted fs-14 mb-0">
                        High priority items needing prompt attention
                      </p>
                    </div>
                    <Checkbox
                      checked={state.userPreferences.priorityCategories.includes('important')}
                      onChange={(e) => {
                        const categories = e.target.checked
                          ? [...state.userPreferences.priorityCategories, 'important']
                          : state.userPreferences.priorityCategories.filter(c => c !== 'important');
                        setState(prev => ({
                          ...prev,
                          userPreferences: { ...prev.userPreferences, priorityCategories: categories }
                        }));
                      }}
                    />
                  </div>
                  <div className="examples">
                    <small className="text-muted">
                      Examples: Surgery Updates, Urgent Lab Results, Priority Consultations
                    </small>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className={`priority-card p-3 rounded-3 border ${
                  state.userPreferences.priorityCategories.includes('routine') 
                    ? 'border-info bg-info-transparent' 
                    : 'border-light'
                }`}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="text-info fw-semibold mb-1">
                        <i className="ti ti-info-circle me-2"></i>
                        Routine
                      </h6>
                      <p className="text-muted fs-14 mb-0">
                        Standard notifications and updates
                      </p>
                    </div>
                    <Checkbox
                      checked={state.userPreferences.priorityCategories.includes('routine')}
                      onChange={(e) => {
                        const categories = e.target.checked
                          ? [...state.userPreferences.priorityCategories, 'routine']
                          : state.userPreferences.priorityCategories.filter(c => c !== 'routine');
                        setState(prev => ({
                          ...prev,
                          userPreferences: { ...prev.userPreferences, priorityCategories: categories }
                        }));
                      }}
                    />
                  </div>
                  <div className="examples">
                    <small className="text-muted">
                      Examples: Appointment Confirmations, General Updates, Reports
                    </small>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className={`priority-card p-3 rounded-3 border ${
                  state.userPreferences.priorityCategories.includes('informational') 
                    ? 'border-secondary bg-secondary-transparent' 
                    : 'border-light'
                }`}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="text-secondary fw-semibold mb-1">
                        <i className="ti ti-file-info me-2"></i>
                        Informational
                      </h6>
                      <p className="text-muted fs-14 mb-0">
                        System messages and announcements
                      </p>
                    </div>
                    <Checkbox
                      checked={state.userPreferences.priorityCategories.includes('informational')}
                      onChange={(e) => {
                        const categories = e.target.checked
                          ? [...state.userPreferences.priorityCategories, 'informational']
                          : state.userPreferences.priorityCategories.filter(c => c !== 'informational');
                        setState(prev => ({
                          ...prev,
                          userPreferences: { ...prev.userPreferences, priorityCategories: categories }
                        }));
                      }}
                    />
                  </div>
                  <div className="examples">
                    <small className="text-muted">
                      Examples: System Maintenance, Policy Updates, Announcements
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Notification Preferences",
      description: "Configure how you want to be alerted",
      estimated_time: "45 seconds",
      content: (
        <div className="notification-preferences-step">
          <h5 className="mb-3">Alert Preferences</h5>
          <p className="text-muted mb-4">
            Choose how you want to be notified for different priority levels.
          </p>
          
          <div className="notification-options">
            <div className="alert-type-card p-3 bg-light rounded-3 mb-3">
              <h6 className="fw-semibold mb-3">
                <i className="ti ti-bell text-primary me-2"></i>
                Alert Types
              </h6>
              
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="critical-alerts"
                      checked={state.userPreferences.notifications.includes('critical')}
                      onChange={(e) => {
                        const notifications = e.target.checked
                          ? [...state.userPreferences.notifications, 'critical']
                          : state.userPreferences.notifications.filter(n => n !== 'critical');
                        setState(prev => ({
                          ...prev,
                          userPreferences: { ...prev.userPreferences, notifications }
                        }));
                      }}
                    />
                    <label className="form-check-label fw-medium text-danger" htmlFor="critical-alerts">
                      Critical Alert Notifications
                    </label>
                    <small className="d-block text-muted">
                      Immediate notifications for emergency situations
                    </small>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="urgent-alerts"
                      checked={state.userPreferences.notifications.includes('urgent')}
                      onChange={(e) => {
                        const notifications = e.target.checked
                          ? [...state.userPreferences.notifications, 'urgent']
                          : state.userPreferences.notifications.filter(n => n !== 'urgent');
                        setState(prev => ({
                          ...prev,
                          userPreferences: { ...prev.userPreferences, notifications }
                        }));
                      }}
                    />
                    <label className="form-check-label fw-medium text-warning" htmlFor="urgent-alerts">
                      Important Alert Notifications
                    </label>
                    <small className="d-block text-muted">
                      Notifications for high priority items
                    </small>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="routine-alerts"
                      checked={state.userPreferences.notifications.includes('routine')}
                      onChange={(e) => {
                        const notifications = e.target.checked
                          ? [...state.userPreferences.notifications, 'routine']
                          : state.userPreferences.notifications.filter(n => n !== 'routine');
                        setState(prev => ({
                          ...prev,
                          userPreferences: { ...prev.userPreferences, notifications }
                        }));
                      }}
                    />
                    <label className="form-check-label fw-medium text-info" htmlFor="routine-alerts">
                      Routine Notifications
                    </label>
                    <small className="d-block text-muted">
                      Standard notification alerts
                    </small>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="info-alerts"
                      checked={state.userPreferences.notifications.includes('informational')}
                      onChange={(e) => {
                        const notifications = e.target.checked
                          ? [...state.userPreferences.notifications, 'informational']
                          : state.userPreferences.notifications.filter(n => n !== 'informational');
                        setState(prev => ({
                          ...prev,
                          userPreferences: { ...prev.userPreferences, notifications }
                        }));
                      }}
                    />
                    <label className="form-check-label fw-medium text-secondary" htmlFor="info-alerts">
                      Informational Notifications
                    </label>
                    <small className="d-block text-muted">
                      System and administrative alerts
                    </small>
                  </div>
                </div>
              </div>
            </div>
            
            <Alert
              message="Recommendation"
              description="We recommend enabling Critical and Important alerts to ensure you don't miss urgent notifications."
              type="info"
              showIcon
            />
          </div>
        </div>
      )
    },
    {
      title: "Setup Complete",
      description: "Your AI Inbox Triage is ready to use",
      estimated_time: "30 seconds",
      content: (
        <div className="completion-step text-center">
          <div className="completion-icon mb-4">
            <i className="ti ti-circle-check text-success" style={{ fontSize: '4rem' }}></i>
          </div>
          <h4 className="text-success mb-3">Setup Complete!</h4>
          <p className="text-muted mb-4 fs-16">
            Your AI Inbox Triage is now configured and ready to help you manage notifications more efficiently.
          </p>
          
          <div className="setup-summary bg-light rounded-3 p-4 mb-4">
            <h6 className="fw-semibold mb-3">Your Configuration</h6>
            <div className="row g-3 text-start">
              <div className="col-md-6">
                <div className="summary-item">
                  <i className="ti ti-robot text-primary me-2"></i>
                  <span className="fw-medium">AI Features: </span>
                  {state.userPreferences.enableAI ? 'Enabled' : 'Disabled'}
                </div>
              </div>
              <div className="col-md-6">
                <div className="summary-item">
                  <i className="ti ti-target text-info me-2"></i>
                  <span className="fw-medium">Confidence: </span>
                  {Math.round(state.userPreferences.confidenceThreshold * 100)}%
                </div>
              </div>
              <div className="col-md-6">
                <div className="summary-item">
                  <i className="ti ti-category text-warning me-2"></i>
                  <span className="fw-medium">Categories: </span>
                  {state.userPreferences.priorityCategories.length} selected
                </div>
              </div>
              <div className="col-md-6">
                <div className="summary-item">
                  <i className="ti ti-bell text-success me-2"></i>
                  <span className="fw-medium">Alerts: </span>
                  {state.userPreferences.notifications.length} types enabled
                </div>
              </div>
            </div>
          </div>
          
          <div className="next-steps mb-4">
            <h6 className="fw-semibold mb-3">What's Next?</h6>
            <div className="row g-3">
              <div className="col-md-4">
                <div className="next-step-card p-3 border rounded-3">
                  <i className="ti ti-inbox text-primary fs-24 mb-2"></i>
                  <h6 className="fw-semibold">Check Your Inbox</h6>
                  <p className="text-muted fs-14 mb-0">
                    See how AI categorizes your existing notifications
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="next-step-card p-3 border rounded-3">
                  <i className="ti ti-settings text-info fs-24 mb-2"></i>
                  <h6 className="fw-semibold">Customize Settings</h6>
                  <p className="text-muted fs-14 mb-0">
                    Fine-tune AI behavior in advanced settings
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="next-step-card p-3 border rounded-3">
                  <i className="ti ti-help text-warning fs-24 mb-2"></i>
                  <h6 className="fw-semibold">Take a Tour</h6>
                  <p className="text-muted fs-14 mb-0">
                    Learn about all the AI features available
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="tour-option">
            <Button
              type="primary"
              icon={<i className="ti ti-map-pin me-1"></i>}
              onClick={() => setState(prev => ({ ...prev, tourOpen: true }))}
              className="me-2"
            >
              Take Feature Tour
            </Button>
            <Button
              type="default"
              onClick={() => finishOnboarding()}
            >
              Skip Tour
            </Button>
          </div>
        </div>
      )
    }
  ];

  // Tour steps for feature walkthrough
  const tourSteps: TourProps['steps'] = [
    {
      title: 'AI Notification Dropdown',
      description: 'This dropdown shows all your notifications with AI-powered prioritization.',
      target: () => document.querySelector('.ai-notification-dropdown') as HTMLElement,
    },
    {
      title: 'Priority Indicators',
      description: 'Color-coded indicators help you quickly identify notification priority levels.',
      target: () => document.querySelector('.priority-indicator') as HTMLElement,
    },
    {
      title: 'AI Suggested Actions',
      description: 'AI recommends appropriate actions for each notification type.',
      target: () => document.querySelector('.ai-actions') as HTMLElement,
    },
    {
      title: 'Filter Controls',
      description: 'Use these controls to filter notifications by priority, type, or other criteria.',
      target: () => document.querySelector('.ai-filter-controls') as HTMLElement,
    },
    {
      title: 'Settings Panel',
      description: 'Customize AI behavior and preferences in the settings panel.',
      target: () => document.querySelector('.settings-link') as HTMLElement,
    },
  ];

  // Complete onboarding
  const finishOnboarding = () => {
    // Save preferences and mark onboarding as complete
    localStorage.setItem('ai-triage-onboarding-complete', 'true');
    localStorage.setItem('ai-triage-preferences', JSON.stringify(state.userPreferences));
    
    // Redirect to main notifications page or close onboarding
    window.location.href = '/notifications';
  };

  // Navigate between steps
  const nextStep = () => {
    const newCompletedSteps = new Set(state.completedSteps);
    newCompletedSteps.add(state.currentStep);
    
    setState(prev => ({
      ...prev,
      currentStep: prev.currentStep + 1,
      completedSteps: newCompletedSteps
    }));
  };

  const prevStep = () => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1)
    }));
  };

  const skipOnboarding = () => {
    setState(prev => ({ ...prev, skipOnboarding: true }));
  };

  // Calculate progress
  const progressPercent = Math.round(((state.currentStep + 1) / onboardingSteps.length) * 100);

  if (state.skipOnboarding) {
    return (
      <div className="onboarding-skipped text-center p-5">
        <i className="ti ti-check-circle text-success mb-3" style={{ fontSize: '3rem' }}></i>
        <h4 className="mb-3">Onboarding Skipped</h4>
        <p className="text-muted mb-4">
          You can access AI Triage settings anytime to configure your preferences.
        </p>
        <Button type="primary" onClick={finishOnboarding}>
          Go to Notifications
        </Button>
      </div>
    );
  }

  return (
    <div className="ai-onboarding-workflow">
      {/* Header */}
      <div className="onboarding-header bg-white rounded-3 p-4 mb-4 border">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4 className="mb-1 fw-bold">AI Inbox Triage Setup</h4>
            <p className="mb-0 text-muted">Configure your intelligent notification system</p>
          </div>
          <Button type="text" onClick={skipOnboarding} className="text-muted">
            Skip Setup
          </Button>
        </div>
        
        <div className="progress-section">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-medium">Setup Progress</span>
            <span className="text-muted">{progressPercent}% Complete</span>
          </div>
          <Progress percent={progressPercent} strokeColor="#0d6efd" />
        </div>
      </div>

      {/* Steps Navigation */}
      <div className="steps-navigation bg-white rounded-3 p-4 mb-4 border">
        <Steps current={state.currentStep} size="small">
          {onboardingSteps.map((step, index) => (
            <Step
              key={`step-${step.id}-${index}`}
              title={step.title}
              description={step.estimated_time}
              status={
                state.completedSteps.has(index) ? 'finish' :
                state.currentStep === index ? 'process' : 'wait'
              }
            />
          ))}
        </Steps>
      </div>

      {/* Step Content */}
      <div className="step-content bg-white rounded-3 p-4 border">
        <div className="step-header mb-4">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h5 className="mb-1 fw-semibold">{onboardingSteps[state.currentStep].title}</h5>
              <p className="text-muted mb-0">{onboardingSteps[state.currentStep].description}</p>
            </div>
            {onboardingSteps[state.currentStep].estimated_time && (
              <span className="badge bg-info-transparent text-info">
                <i className="ti ti-clock me-1"></i>
                {onboardingSteps[state.currentStep].estimated_time}
              </span>
            )}
          </div>
        </div>
        
        <div className="step-body">
          {onboardingSteps[state.currentStep].content}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="onboarding-navigation d-flex justify-content-between align-items-center mt-4">
        <Button
          type="default"
          onClick={prevStep}
          disabled={state.currentStep === 0}
          icon={<i className="ti ti-arrow-left"></i>}
        >
          Previous
        </Button>
        
        <div className="step-indicator">
          Step {state.currentStep + 1} of {onboardingSteps.length}
        </div>
        
        {state.currentStep < onboardingSteps.length - 1 ? (
          <Button
            type="primary"
            onClick={nextStep}
            icon={<i className="ti ti-arrow-right"></i>}
            iconPosition="end"
          >
            Continue
          </Button>
        ) : (
          <Button
            type="primary"
            onClick={finishOnboarding}
            icon={<i className="ti ti-check"></i>}
          >
            Complete Setup
          </Button>
        )}
      </div>

      {/* Feature Tour */}
      <Tour
        open={state.tourOpen}
        onClose={() => setState(prev => ({ ...prev, tourOpen: false }))}
        steps={tourSteps}
        indicatorsRender={(current, total) => (
          <span className="tour-indicator">
            {current + 1} / {total}
          </span>
        )}
      />
    </div>
  );
};

// Daily Management Workflow Component
export const DailyManagementWorkflow: React.FC = () => {
  const [activeWorkflow, setActiveWorkflow] = useState<string>('morning');

  const workflows = {
    morning: {
      title: "Morning Routine",
      description: "Start your day with AI-prioritized notifications",
      steps: [
        "Review critical overnight notifications",
        "Check urgent patient updates",
        "Prioritize today's tasks based on AI suggestions",
        "Set notification preferences for the day"
      ],
      icon: "ti ti-sunrise",
      color: "warning"
    },
    emergency: {
      title: "Emergency Response",
      description: "Handle critical notifications efficiently",
      steps: [
        "AI automatically flags emergency notifications",
        "Receive immediate alerts for critical situations", 
        "Access suggested emergency protocols",
        "Coordinate team response through smart notifications"
      ],
      icon: "ti ti-alert-triangle",
      color: "danger"
    },
    evening: {
      title: "End of Day Review",
      description: "Wrap up with AI insights and planning",
      steps: [
        "Review day's notification patterns",
        "Check AI performance and accuracy",
        "Plan tomorrow's priorities",
        "Adjust AI settings based on experience"
      ],
      icon: "ti ti-moon",
      color: "info"
    }
  };

  return (
    <div className="daily-management-workflow">
      <div className="workflow-header text-center mb-4">
        <h4 className="fw-bold mb-2">Daily Management Workflows</h4>
        <p className="text-muted">AI-guided workflows for efficient notification management</p>
      </div>

      <div className="workflow-tabs mb-4">
        <div className="row g-3">
          {Object.entries(workflows).map(([key, workflow]) => (
            <div key={key} className="col-lg-4">
              <div
                className={`workflow-tab p-3 rounded-3 border cursor-pointer ${
                  activeWorkflow === key ? `border-${workflow.color} bg-${workflow.color}-transparent` : 'border-light'
                }`}
                onClick={() => setActiveWorkflow(key)}
              >
                <div className="text-center">
                  <i className={`${workflow.icon} fs-24 text-${workflow.color} mb-2`}></i>
                  <h6 className="fw-semibold mb-1">{workflow.title}</h6>
                  <p className="text-muted fs-14 mb-0">{workflow.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="workflow-content">
        <Card title={workflows[activeWorkflow as keyof typeof workflows].title}>
          <div className="workflow-steps">
            {workflows[activeWorkflow as keyof typeof workflows].steps.map((step, index) => (
              <div key={`workflow-${activeWorkflow}-step-${index}-${step.slice(0, 10)}`} className="workflow-step d-flex align-items-start mb-3">
                <div className={`step-number bg-${workflows[activeWorkflow as keyof typeof workflows].color} text-white rounded-circle d-flex align-items-center justify-content-center me-3`} style={{ width: '32px', height: '32px', fontSize: '0.875rem' }}>
                  {index + 1}
                </div>
                <div className="step-content">
                  <p className="mb-0">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AIOnboardingWorkflow;
