# Smart Scheduling Feature Design System

## Overview
This document outlines the comprehensive design specifications for the Smart Scheduling feature integration into the healthcare platform, maintaining strict adherence to the existing UI design system.

## Design System Analysis

### Current Design Patterns Identified
- **Color Palette**: Primary blue, success green (#198754), warning orange (#ffc107), danger red (#dc3545), info light blue (#0dcaf0)
- **Typography**: System font stack with fw-bold, fw-semibold, fw-medium weight classes
- **Components**: Cards with shadow-sm, rounded corners, consistent spacing
- **Icons**: Tabler Icons (ti ti-*) throughout
- **Layout**: Flexbox-based responsive grid system

## Screen Design Specifications

### 1. Enhanced Doctor Appointments Calendar View

#### Base Layout (Existing + Enhancements)
```html
<!-- Enhanced Calendar Header with Smart Toggle -->
<div className="d-flex align-items-sm-center flex-sm-row flex-column gap-2 pb-3 mb-3 border-1 border-bottom">
  <div className="flex-grow-1">
    <div className="d-flex align-items-center gap-3">
      <h4 className="fw-semibold mb-0">Appointments</h4>
      <!-- NEW: Smart Scheduling Toggle -->
      <div className="form-check form-switch">
        <input className="form-check-input" type="checkbox" id="smartSchedulingToggle" checked>
        <label className="form-check-label text-primary fw-medium" for="smartSchedulingToggle">
          <i className="ti ti-brain me-1"></i>Smart Scheduling
        </label>
      </div>
      <!-- NEW: AI Status Indicator -->
      <span className="badge bg-success-transparent text-success fs-12">
        <i className="ti ti-circle-filled fs-8 me-1"></i>AI Active
      </span>
    </div>
    <p className="mb-0 text-muted fs-13">AI-powered optimal slot recommendations</p>
  </div>
  
  <!-- Enhanced Action Buttons -->
  <div className="text-end d-flex">
    <!-- NEW: Smart Insights Button -->
    <button className="btn btn-outline-primary me-2 fs-13 btn-md">
      <i className="ti ti-chart-line me-1"></i>Smart Insights
    </button>
    
    <button className="btn btn-primary ms-2 fs-13 btn-md" data-bs-toggle="offcanvas" data-bs-target="#smart_appointment">
      <i className="ti ti-brain me-1"></i>Smart Book
    </button>
  </div>
</div>
```

#### Calendar Slot Enhancement Overlay
```html
<!-- Smart Scheduling Overlay for Calendar Slots -->
<div className="calendar-slot-container position-relative">
  <!-- Base Calendar Slot -->
  <div className="calendar-slot p-2 border rounded position-relative" 
       data-slot-score="85" 
       data-load-percentage="60"
       data-no-show-risk="12">
    
    <!-- NEW: Slot Intelligence Overlay (appears on hover) -->
    <div className="slot-intelligence-overlay position-absolute top-0 start-0 w-100 h-100 d-none">
      <!-- Intelligence Indicators -->
      <div className="slot-score-indicator position-absolute top-1 end-1">
        <span className="badge bg-success rounded-pill fs-10">85%</span>
      </div>
      
      <!-- Load Intensity Gradient (subtle background) -->
      <div className="load-intensity-bg position-absolute top-0 start-0 w-100 h-100 rounded" 
           style="background: linear-gradient(135deg, rgba(25, 135, 84, 0.1) 0%, rgba(25, 135, 84, 0.05) 100%);">
      </div>
    </div>
    
    <!-- Enhanced Hover Tooltip -->
    <div className="slot-tooltip position-absolute d-none" data-bs-toggle="tooltip" data-bs-placement="top">
      <div className="card shadow-lg border-0 p-3" style="min-width: 280px;">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="fw-semibold">Slot Intelligence</span>
          <span className="badge bg-primary fs-10">AI Powered</span>
        </div>
        
        <!-- Metrics Row -->
        <div className="row g-2 mb-2">
          <div className="col-4 text-center">
            <div className="metric-item">
              <div className="text-success fw-bold">85%</div>
              <small className="text-muted">Optimal Score</small>
            </div>
          </div>
          <div className="col-4 text-center">
            <div className="metric-item">
              <div className="text-warning fw-bold">60%</div>
              <small className="text-muted">Current Load</small>
            </div>
          </div>
          <div className="col-4 text-center">
            <div className="metric-item">
              <div className="text-info fw-bold">12%</div>
              <small className="text-muted">No-show Risk</small>
            </div>
          </div>
        </div>
        
        <!-- Availability Status -->
        <div className="availability-status mb-2">
          <div className="d-flex align-items-center gap-2">
            <i className="ti ti-door text-success"></i>
            <span className="fs-13">Room 203 Available</span>
          </div>
        </div>
        
        <!-- Quick Actions -->
        <div className="d-flex gap-2 mt-2">
          <button className="btn btn-primary btn-sm flex-fill">
            <i className="ti ti-plus me-1"></i>Book Slot
          </button>
          <button className="btn btn-outline-primary btn-sm">
            <i className="ti ti-brain"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
```

#### Smart Suggestions Popover (Empty Slot Click)
```html
<!-- Smart Suggestions Popover -->
<div className="offcanvas offcanvas-end" tabindex="-1" id="smart_suggestions">
  <div className="offcanvas-header border-bottom">
    <div className="d-flex align-items-center">
      <i className="ti ti-brain text-primary fs-20 me-2"></i>
      <div>
        <h5 className="mb-0 fw-bold">Smart Suggestions</h5>
        <small className="text-muted">AI-powered optimal time slots</small>
      </div>
    </div>
    <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
  </div>
  
  <div className="offcanvas-body p-0">
    <!-- Suggestion Context -->
    <div className="suggestion-context bg-light p-3 border-bottom">
      <div className="d-flex align-items-center gap-2 mb-2">
        <i className="ti ti-calendar-time text-primary"></i>
        <span className="fw-medium">Selected: Monday, Jan 15, 2025</span>
      </div>
      <div className="constraint-badges">
        <span className="badge bg-info-transparent text-info me-1">
          <i className="ti ti-users me-1"></i>General Visit
        </span>
        <span className="badge bg-warning-transparent text-warning">
          <i className="ti ti-clock me-1"></i>30 min duration
        </span>
      </div>
    </div>
    
    <!-- Top 3 Recommendations -->
    <div className="recommendations-list p-3">
      <h6 className="fw-semibold mb-3 d-flex align-items-center">
        <i className="ti ti-star text-warning me-2"></i>
        Top Recommendations
      </h6>
      
      <!-- Recommendation Card 1 (Optimal) -->
      <div className="recommendation-card card border-success mb-3">
        <div className="card-body p-3">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-success rounded-pill">1</span>
              <span className="fw-semibold">10:30 AM - 11:00 AM</span>
            </div>
            <div className="confidence-score">
              <span className="badge bg-success-transparent text-success fs-10">
                95% Match
              </span>
            </div>
          </div>
          
          <div className="recommendation-reasons mb-2">
            <div className="reason-tag d-inline-flex align-items-center me-2 mb-1">
              <i className="ti ti-check-circle text-success fs-12 me-1"></i>
              <span className="fs-12">Optimal load (45%)</span>
            </div>
            <div className="reason-tag d-inline-flex align-items-center me-2 mb-1">
              <i className="ti ti-check-circle text-success fs-12 me-1"></i>
              <span className="fs-12">Low no-show risk</span>
            </div>
            <div className="reason-tag d-inline-flex align-items-center mb-1">
              <i className="ti ti-check-circle text-success fs-12 me-1"></i>
              <span className="fs-12">Room available</span>
            </div>
          </div>
          
          <button className="btn btn-success btn-sm w-100">
            <i className="ti ti-calendar-plus me-1"></i>
            Book This Slot
          </button>
        </div>
      </div>
      
      <!-- Recommendation Card 2 (Good) -->
      <div className="recommendation-card card border-warning mb-3">
        <div className="card-body p-3">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-warning rounded-pill">2</span>
              <span className="fw-semibold">2:15 PM - 2:45 PM</span>
            </div>
            <div className="confidence-score">
              <span className="badge bg-warning-transparent text-warning fs-10">
                82% Match
              </span>
            </div>
          </div>
          
          <div className="recommendation-reasons mb-2">
            <div className="reason-tag d-inline-flex align-items-center me-2 mb-1">
              <i className="ti ti-alert-circle text-warning fs-12 me-1"></i>
              <span className="fs-12">Moderate load (70%)</span>
            </div>
            <div className="reason-tag d-inline-flex align-items-center me-2 mb-1">
              <i className="ti ti-check-circle text-success fs-12 me-1"></i>
              <span className="fs-12">Room available</span>
            </div>
          </div>
          
          <button className="btn btn-warning btn-sm w-100">
            <i className="ti ti-calendar-plus me-1"></i>
            Book This Slot
          </button>
        </div>
      </div>
      
      <!-- Recommendation Card 3 (Alternative) -->
      <div className="recommendation-card card border-info mb-3">
        <div className="card-body p-3">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-info rounded-pill">3</span>
              <span className="fw-semibold">4:00 PM - 4:30 PM</span>
            </div>
            <div className="confidence-score">
              <span className="badge bg-info-transparent text-info fs-10">
                78% Match
              </span>
            </div>
          </div>
          
          <div className="recommendation-reasons mb-2">
            <div className="reason-tag d-inline-flex align-items-center me-2 mb-1">
              <i className="ti ti-check-circle text-success fs-12 me-1"></i>
              <span className="fs-12">Low load (35%)</span>
            </div>
            <div className="reason-tag d-inline-flex align-items-center me-2 mb-1">
              <i className="ti ti-alert-circle text-warning fs-12 me-1"></i>
              <span className="fs-12">Alternative room</span>
            </div>
          </div>
          
          <button className="btn btn-info btn-sm w-100">
            <i className="ti ti-calendar-plus me-1"></i>
            Book This Slot
          </button>
        </div>
      </div>
    </div>
    
    <!-- Alternative Options -->
    <div className="alternative-options border-top p-3">
      <h6 className="fw-semibold mb-3">Alternative Suggestions</h6>
      <button className="btn btn-outline-primary btn-sm w-100 mb-2">
        <i className="ti ti-calendar-search me-1"></i>
        Show Next Day Options
      </button>
      <button className="btn btn-outline-secondary btn-sm w-100">
        <i className="ti ti-settings me-1"></i>
        Adjust Parameters
      </button>
    </div>
  </div>
</div>
```

### 2. Enhanced New Appointment Form with Smart Suggestions

#### Smart Suggestions Side Panel Integration
```html
<div className="row justify-content-center">
  <div className="col-lg-12">
    <div className="row">
      <!-- Enhanced Appointment Form (Left) -->
      <div className="col-lg-7">
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between">
            <h5 className="fw-bold mb-0">New Appointment</h5>
            <div className="smart-mode-toggle">
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" id="smartMode" checked>
                <label className="form-check-label text-primary fw-medium" for="smartMode">
                  <i className="ti ti-brain me-1"></i>Smart Mode
                </label>
              </div>
            </div>
          </div>
          
          <div className="card-body">
            <!-- Enhanced Form Fields with Real-time Updates -->
            <div className="form">
              <!-- Patient Selection with Smart Context -->
              <div className="mb-3">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <label className="form-label mb-0 fw-medium">
                    Patient<span className="text-danger ms-1">*</span>
                  </label>
                  <!-- NEW: Patient History Indicator -->
                  <span className="badge bg-info-transparent text-info fs-12">
                    <i className="ti ti-history me-1"></i>Last visit: 2 weeks ago
                  </span>
                </div>
                <select className="form-select" id="patientSelect">
                  <option selected>Alberto Ripley</option>
                  <option>Susan Babin</option>
                </select>
              </div>
              
              <!-- Department with Smart Suggestions -->
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label mb-1 fw-medium">
                      Department<span className="text-danger ms-1">*</span>
                    </label>
                    <select className="form-select" id="departmentSelect">
                      <option selected>Cardiology</option>
                      <option>Neurology</option>
                    </select>
                    <!-- NEW: Smart Suggestion -->
                    <small className="text-primary d-flex align-items-center mt-1">
                      <i className="ti ti-brain fs-12 me-1"></i>
                      AI suggests Cardiology based on history
                    </small>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label mb-1 fw-medium">
                      Doctor<span className="text-danger ms-1">*</span>
                    </label>
                    <select className="form-select" id="doctorSelect">
                      <option selected>Dr. Johnson</option>
                      <option>Dr. Smith</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <!-- Smart Date/Time Selection -->
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label mb-1 fw-medium">
                      Date of Appointment<span className="text-danger ms-1">*</span>
                    </label>
                    <div className="input-icon-end position-relative">
                      <input type="date" className="form-control" id="appointmentDate">
                      <span className="input-icon-addon">
                        <i className="ti ti-calendar"></i>
                      </span>
                    </div>
                    <!-- NEW: Smart Date Suggestions -->
                    <div className="smart-date-suggestions mt-2">
                      <small className="text-muted d-block mb-1">Quick suggestions:</small>
                      <div className="d-flex gap-1 flex-wrap">
                        <button type="button" className="btn btn-outline-primary btn-sm">
                          Today
                        </button>
                        <button type="button" className="btn btn-outline-primary btn-sm">
                          Tomorrow
                        </button>
                        <button type="button" className="btn btn-outline-primary btn-sm">
                          Next Mon
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label mb-1 fw-medium">
                      Time<span className="text-danger ms-1">*</span>
                    </label>
                    <input type="time" className="form-control" id="appointmentTime">
                    <!-- NEW: Smart Time Suggestion -->
                    <div className="smart-time-alert mt-2">
                      <div className="alert alert-info d-flex align-items-center py-2 px-3">
                        <i className="ti ti-info-circle me-2"></i>
                        <small>AI suggests 10:30 AM for optimal scheduling</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Conflict Detection -->
              <div className="conflict-detection mb-3">
                <div className="alert alert-warning d-flex align-items-start py-3">
                  <i className="ti ti-alert-triangle text-warning me-2 mt-1"></i>
                  <div>
                    <strong>Scheduling Conflict Detected</strong>
                    <p className="mb-2 mt-1">Dr. Johnson has another appointment at 10:00 AM</p>
                    <button type="button" className="btn btn-warning btn-sm me-2">
                      <i className="ti ti-wand me-1"></i>Auto-resolve
                    </button>
                    <button type="button" className="btn btn-outline-warning btn-sm">
                      Show alternatives
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Appointment Reason -->
              <div className="mb-3">
                <label className="form-label mb-1 fw-medium">
                  Appointment Reason<span className="text-danger ms-1">*</span>
                </label>
                <textarea className="form-control" rows="3" placeholder="Describe the reason for this appointment..."></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Smart Suggestions Panel (Right) -->
      <div className="col-lg-5">
        <div className="card border-primary">
          <div className="card-header bg-primary-transparent">
            <div className="d-flex align-items-center">
              <i className="ti ti-brain text-primary fs-20 me-2"></i>
              <div>
                <h6 className="mb-0 fw-bold text-primary">Smart Suggestions</h6>
                <small className="text-muted">Live AI recommendations</small>
              </div>
            </div>
          </div>
          
          <div className="card-body p-0">
            <!-- Live Update Status -->
            <div className="suggestion-status bg-light p-3 border-bottom">
              <div className="d-flex align-items-center gap-2">
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <span className="fs-13">Analyzing optimal time slots...</span>
              </div>
            </div>
            
            <!-- Ranked Suggestions List -->
            <div className="suggestions-list">
              <!-- Suggestion 1 - Optimal -->
              <div className="suggestion-item border-bottom p-3">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-success rounded-circle">1</span>
                    <div>
                      <div className="fw-semibold">Today, 10:30 AM</div>
                      <small className="text-muted">30 min duration</small>
                    </div>
                  </div>
                  <div className="confidence-badge">
                    <span className="badge bg-success-transparent text-success fs-10">
                      96% optimal
                    </span>
                  </div>
                </div>
                
                <div className="suggestion-rationale mb-3">
                  <div className="rationale-reasons">
                    <div className="reason-item d-flex align-items-center mb-1">
                      <i className="ti ti-check-circle text-success fs-12 me-2"></i>
                      <span className="fs-12">Perfect patient preference match</span>
                    </div>
                    <div className="reason-item d-flex align-items-center mb-1">
                      <i className="ti ti-check-circle text-success fs-12 me-2"></i>
                      <span className="fs-12">Low clinic load (42%)</span>
                    </div>
                    <div className="reason-item d-flex align-items-center">
                      <i className="ti ti-check-circle text-success fs-12 me-2"></i>
                      <span className="fs-12">Room 203 available</span>
                    </div>
                  </div>
                </div>
                
                <button type="button" className="btn btn-success btn-sm w-100">
                  <i className="ti ti-mouse me-1"></i>
                  One-tap Fill
                </button>
              </div>
              
              <!-- Suggestion 2 - Good -->
              <div className="suggestion-item border-bottom p-3">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-warning rounded-circle">2</span>
                    <div>
                      <div className="fw-semibold">Tomorrow, 9:15 AM</div>
                      <small className="text-muted">30 min duration</small>
                    </div>
                  </div>
                  <div className="confidence-badge">
                    <span className="badge bg-warning-transparent text-warning fs-10">
                      89% optimal
                    </span>
                  </div>
                </div>
                
                <div className="suggestion-rationale mb-3">
                  <div className="rationale-reasons">
                    <div className="reason-item d-flex align-items-center mb-1">
                      <i className="ti ti-check-circle text-success fs-12 me-2"></i>
                      <span className="fs-12">Good timing for patient</span>
                    </div>
                    <div className="reason-item d-flex align-items-center mb-1">
                      <i className="ti ti-alert-circle text-warning fs-12 me-2"></i>
                      <span className="fs-12">Moderate load (65%)</span>
                    </div>
                    <div className="reason-item d-flex align-items-center">
                      <i className="ti ti-check-circle text-success fs-12 me-2"></i>
                      <span className="fs-12">Preferred room available</span>
                    </div>
                  </div>
                </div>
                
                <button type="button" className="btn btn-warning btn-sm w-100">
                  <i className="ti ti-mouse me-1"></i>
                  One-tap Fill
                </button>
              </div>
              
              <!-- Show More Suggestions -->
              <div className="show-more-suggestions p-3">
                <button type="button" className="btn btn-outline-primary btn-sm w-100">
                  <i className="ti ti-chevron-down me-1"></i>
                  Show 3 more suggestions
                </button>
              </div>
            </div>
            
            <!-- Smart Actions -->
            <div className="smart-actions border-top p-3">
              <div className="row g-2">
                <div className="col-6">
                  <button type="button" className="btn btn-outline-info btn-sm w-100">
                    <i className="ti ti-refresh me-1"></i>
                    Refresh
                  </button>
                </div>
                <div className="col-6">
                  <button type="button" className="btn btn-outline-secondary btn-sm w-100">
                    <i className="ti ti-adjustments me-1"></i>
                    Adjust
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Smart Insights Card -->
        <div className="card mt-3 border-info">
          <div className="card-header bg-info-transparent">
            <h6 className="mb-0 fw-bold text-info">
              <i className="ti ti-chart-line me-2"></i>
              Smart Insights
            </h6>
          </div>
          <div className="card-body">
            <div className="insight-metrics">
              <div className="metric-row d-flex justify-content-between mb-2">
                <span className="fs-13">Current week load:</span>
                <span className="fw-semibold text-warning">72%</span>
              </div>
              <div className="metric-row d-flex justify-content-between mb-2">
                <span className="fs-13">Patient no-show risk:</span>
                <span className="fw-semibold text-success">Low (8%)</span>
              </div>
              <div className="metric-row d-flex justify-content-between">
                <span className="fs-13">Optimal booking window:</span>
                <span className="fw-semibold text-info">3-5 days ahead</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

## Component Specifications

### 1. Smart Slot Score Indicator
```scss
.slot-score-indicator {
  .badge {
    font-size: 0.625rem;
    padding: 0.25rem 0.5rem;
    
    &.score-excellent { background-color: #198754; }
    &.score-good { background-color: #ffc107; }
    &.score-fair { background-color: #fd7e14; }
    &.score-poor { background-color: #dc3545; }
  }
}
```

### 2. Load Intensity Visualization
```scss
.load-intensity-bg {
  opacity: 0;
  transition: opacity 0.2s ease;
  
  &.load-low { background: linear-gradient(135deg, rgba(25, 135, 84, 0.1), rgba(25, 135, 84, 0.05)); }
  &.load-medium { background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 193, 7, 0.05)); }
  &.load-high { background: linear-gradient(135deg, rgba(220, 53, 69, 0.1), rgba(220, 53, 69, 0.05)); }
}

.calendar-slot:hover .load-intensity-bg {
  opacity: 1;
}
```

### 3. Confidence Badge System
```html
<!-- Confidence levels with appropriate colors -->
<span className="badge bg-success-transparent text-success">95-100% Optimal</span>
<span className="badge bg-warning-transparent text-warning">80-94% Good</span>
<span className="badge bg-info-transparent text-info">65-79% Fair</span>
<span className="badge bg-danger-transparent text-danger">Below 65% Poor</span>
```

## Workflow Documentation

### User Journey Map: Calendar Entry Point

1. **Initial State**: Doctor views appointments calendar with Smart Scheduling toggle ON
2. **Slot Discovery**: Hover over available slots reveals intelligence overlay with metrics
3. **Suggestion Trigger**: Click empty slot opens Smart Suggestions popover
4. **Recommendation Review**: View top 3 AI-recommended alternatives with rationale
5. **Selection**: One-click booking or request more options
6. **Confirmation**: Standard booking flow with AI optimization notes

### User Journey Map: New Appointment Form Entry Point

1. **Form Access**: Click "Smart Book" button opens enhanced appointment form
2. **Progressive Enhancement**: Each field selection triggers real-time AI suggestions
3. **Conflict Detection**: Inline warnings appear with auto-resolution options
4. **Live Suggestions**: Right panel updates with ranked time slot recommendations
5. **One-tap Filling**: Click suggestion auto-populates form fields
6. **Final Review**: Confirm appointment with AI optimization summary

### State Transitions

#### Loading States
```html
<!-- Suggestion Loading -->
<div className="d-flex align-items-center gap-2">
  <div className="spinner-border spinner-border-sm text-primary"></div>
  <span className="fs-13">Analyzing optimal slots...</span>
</div>

<!-- Slot Analysis Loading -->
<div className="slot-analyzing">
  <div className="badge bg-primary-transparent text-primary">
    <i className="ti ti-loader-2 spin me-1"></i>Processing
  </div>
</div>
```

#### Error States
```html
<!-- AI Service Error -->
<div className="alert alert-warning d-flex align-items-center">
  <i className="ti ti-alert-triangle me-2"></i>
  <div>
    <small><strong>Smart suggestions unavailable</strong></small>
    <small className="d-block">Manual scheduling available</small>
  </div>
</div>

<!-- Conflict Error -->
<div className="alert alert-danger d-flex align-items-center">
  <i className="ti ti-x-circle me-2"></i>
  <div>
    <small><strong>Scheduling conflict detected</strong></small>
    <small className="d-block">Please select alternative time</small>
  </div>
</div>
```

#### Empty States
```html
<!-- No Suggestions Available -->
<div className="empty-suggestions text-center p-4">
  <i className="ti ti-calendar-off text-muted fs-48 mb-3"></i>
  <h6 className="text-muted">No optimal slots found</h6>
  <p className="text-muted fs-13 mb-3">Try adjusting your criteria or selecting a different date</p>
  <button className="btn btn-outline-primary btn-sm">
    <i className="ti ti-adjustments me-1"></i>Adjust Parameters
  </button>
</div>
```

## Accessibility Features

### ARIA Labels and Roles
```html
<!-- Smart Toggle -->
<div className="form-check form-switch" role="switch" aria-label="Enable smart scheduling recommendations">
  <input className="form-check-input" type="checkbox" id="smartMode" aria-describedby="smartModeDescription">
  <label className="form-check-label" for="smartMode">Smart Mode</label>
</div>
<div id="smartModeDescription" className="visually-hidden">
  Enable AI-powered scheduling recommendations and optimization
</div>

<!-- Confidence Indicators -->
<span className="badge bg-success-transparent text-success" 
      role="status" 
      aria-label="High confidence recommendation, 95 percent optimal">
  95% Optimal
</span>

<!-- Interactive Suggestions -->
<button type="button" 
        className="btn btn-success btn-sm w-100"
        aria-label="Book appointment for today at 10:30 AM, 96 percent optimal match">
  <i className="ti ti-mouse me-1" aria-hidden="true"></i>
  One-tap Fill
</button>
```

### Keyboard Navigation
- Tab order: Smart toggle → suggestions → actions
- Enter/Space: Activate suggestions and actions
- Escape: Close popovers and suggestions panel
- Arrow keys: Navigate between suggestions

### Color Contrast Compliance
- All text maintains minimum 4.5:1 contrast ratio
- Interactive elements have 3:1 contrast minimum
- Focus indicators provide clear visual feedback
- Color information supplemented with icons/text

## Responsive Behavior

### Mobile Adaptations (< 768px)
- Smart suggestions panel becomes bottom sheet modal
- Calendar tooltips become full-screen overlays
- One-tap actions maintain touch-friendly 44px minimum target size
- Horizontal scroll for suggestion cards

### Tablet Adaptations (768px - 1024px)
- Smart suggestions panel maintains fixed width
- Calendar grid adapts to available space
- Touch interactions optimized for finger navigation

### Desktop Enhancements (> 1024px)
- Hover interactions for detailed tooltips
- Keyboard shortcuts for power users
- Multiple suggestion panels can be open simultaneously

## Integration Points

### Existing Components Extended
1. **DatePicker**: Enhanced with smart date suggestions
2. **Select Components**: Real-time AI filtering
3. **Badge System**: New confidence and score variants
4. **Alert Components**: Conflict detection styling
5. **Card Components**: Suggestion card variations

### New Components Added
1. **SmartToggle**: Consistent AI feature enablement
2. **ConfidenceBadge**: Standardized confidence display
3. **SuggestionCard**: Reusable recommendation container
4. **ConflictAlert**: Specialized warning component
5. **LoadIndicator**: Slot intensity visualization

This comprehensive design system ensures the Smart Scheduling feature integrates seamlessly with the existing healthcare platform while providing powerful AI-assisted functionality that enhances rather than complicates the user experience.
