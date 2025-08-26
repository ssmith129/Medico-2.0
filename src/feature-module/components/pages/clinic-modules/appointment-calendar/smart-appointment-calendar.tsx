import { Link } from "react-router";
import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import type { EventApi } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import PredefinedDatePicker from "../../../../../core/common/datePicker";
import { all_routes } from "../../../../routes/all_routes";

interface SlotAnalytics {
  slotId: string;
  loadPercentage: number;
  noShowRisk: number;
  score: number;
  recommendation: string;
  optimalFor: string[];
}

interface SmartSuggestion {
  id: string;
  time: string;
  date: string;
  score: number;
  confidence: number;
  reasons: string[];
  doctorAvailability: string;
  estimatedDuration: string;
  conflictRisk: string;
}

const SmartAppointmentCalendar = () => {
  const calendarRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isAIMode, setIsAIMode] = useState(true);
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestion[]>([]);

  // Mock slot analytics data
  const slotAnalytics: SlotAnalytics[] = [
    {
      slotId: "2025-01-21T09:00",
      loadPercentage: 75,
      noShowRisk: 12,
      score: 88,
      recommendation: "Optimal",
      optimalFor: ["Follow-up", "Consultation"]
    },
    {
      slotId: "2025-01-21T10:30",
      loadPercentage: 45,
      noShowRisk: 8,
      score: 92,
      recommendation: "Highly Recommended",
      optimalFor: ["New Patient", "Consultation"]
    },
    {
      slotId: "2025-01-21T14:00",
      loadPercentage: 90,
      noShowRisk: 25,
      score: 65,
      recommendation: "Consider Alternative",
      optimalFor: ["Emergency", "Urgent"]
    }
  ];

  // Mock smart suggestions
  const mockSuggestions: SmartSuggestion[] = [
    {
      id: "1",
      time: "10:30 AM",
      date: "Today",
      score: 92,
      confidence: 95,
      reasons: ["Low no-show risk", "Doctor's preferred time", "Optimal slot availability"],
      doctorAvailability: "High",
      estimatedDuration: "30 min",
      conflictRisk: "Low"
    },
    {
      id: "2", 
      time: "2:00 PM",
      date: "Tomorrow",
      score: 89,
      confidence: 91,
      reasons: ["Patient preference match", "Reduced wait time", "Good historical outcomes"],
      doctorAvailability: "Medium",
      estimatedDuration: "45 min",
      conflictRisk: "Low"
    },
    {
      id: "3",
      time: "9:00 AM",
      date: "Jan 23",
      score: 85,
      confidence: 88,
      reasons: ["Start of day efficiency", "Doctor freshness", "Lower interruption risk"],
      doctorAvailability: "High", 
      estimatedDuration: "30 min",
      conflictRisk: "Very Low"
    }
  ];

  const events = [
    {
      id: "1",
      title: "Alberto Ripley - Cardiology",
      start: "2025-01-21T09:00:00",
      end: "2025-01-21T09:30:00",
      image: "assets/img/users/user-01.jpg",
      backgroundColor: "#2E37A4",
      borderColor: "#2E37A4",
      status: "confirmed",
      riskLevel: "low"
    },
    {
      id: "2",
      title: "Susan Babin - Orthopedic",
      start: "2025-01-21T11:00:00", 
      end: "2025-01-21T11:45:00",
      image: "assets/img/users/user-02.jpg",
      backgroundColor: "#27AE60",
      borderColor: "#27AE60",
      status: "tentative",
      riskLevel: "medium"
    },
    {
      id: "3",
      title: "Carol Lam - Pediatrics",
      start: "2025-01-21T14:30:00",
      end: "2025-01-21T15:00:00", 
      image: "assets/img/users/user-03.jpg",
      backgroundColor: "#E2B93B",
      borderColor: "#E2B93B",
      status: "high-risk",
      riskLevel: "high"
    }
  ];

  const renderEventContent = (eventInfo: any) => {
    const { image, status, riskLevel } = eventInfo.event.extendedProps;
    const slotAnalytic = slotAnalytics.find(slot => 
      slot.slotId === eventInfo.event.start?.toISOString().slice(0, 16)
    );

    return (
      <div className="custom-event-content position-relative">
        <div className="d-flex align-items-center">
          {image && (
            <span className="me-2">
              <ImageWithBasePath
                src={image}
                alt="patient"
                className="avatar-xs rounded-circle"
              />
            </span>
          )}
          <span className="event-title fs-12 fw-medium text-truncate">
            {eventInfo.event.title}
          </span>
        </div>
        
        {/* AI Risk Indicators */}
        {isAIMode && (
          <div className="ai-indicators mt-1">
            <div className="d-flex gap-1">
              {riskLevel === 'high' && (
                <span className="badge badge-soft-danger fs-10">
                  <i className="ti ti-alert-triangle me-1"></i>High Risk
                </span>
              )}
              {status === 'tentative' && (
                <span className="badge badge-soft-warning fs-10">
                  <i className="ti ti-clock me-1"></i>Tentative
                </span>
              )}
              {slotAnalytic && (
                <span className="badge badge-soft-info fs-10">
                  Score: {slotAnalytic.score}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleDateClick = (dateClickInfo: any) => {
    setSelectedDate(dateClickInfo.date);
    setSmartSuggestions(mockSuggestions);
    setShowSuggestions(true);
  };

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo.event);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  const closeSuggestions = () => {
    setShowSuggestions(false);
    setSelectedDate(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 75) return 'info';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return '#27AE60';
    if (confidence >= 75) return '#2F80ED';
    if (confidence >= 60) return '#E2B93B';
    return '#EF1E1E';
  };

  const calculateSlotPosition = (slotId: string) => {
    // This is a simplified calculation - in a real implementation,
    // you would calculate based on the actual calendar DOM structure
    const date = new Date(slotId);
    const hour = date.getHours();
    const minute = date.getMinutes();

    // Calculate position based on time grid layout
    // These percentages would be calculated based on actual calendar geometry
    const top = ((hour - 7) * 8.33) + (minute / 60 * 8.33); // Assuming 7AM start, each hour is ~8.33% of height
    const left = 15; // Assuming first column for simplicity

    return { top, left };
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* Enhanced Page Header with AI Toggle */}
          <div className="d-flex align-items-sm-center flex-sm-row flex-column gap-2 pb-3 mb-3 border-1 border-bottom">
            <div className="flex-grow-1">
              <div className="d-flex align-items-center gap-3">
                <h4 className="fw-semibold mb-0">Smart Scheduling</h4>
                <div className="ai-mode-toggle">
                  <div className="form-check form-switch">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="aiModeToggle"
                      checked={isAIMode}
                      onChange={(e) => setIsAIMode(e.target.checked)}
                    />
                    <label className="form-check-label fw-medium text-primary" htmlFor="aiModeToggle">
                      <i className="ti ti-robot me-1"></i>
                      AI Insights {isAIMode ? 'On' : 'Off'}
                    </label>
                  </div>
                </div>
                {isAIMode && (
                  <div className="ai-status-indicators d-flex gap-2">
                    <span className="badge badge-soft-success fs-12">
                      <i className="ti ti-check-circle me-1"></i>
                      Analytics Active
                    </span>
                    <span className="badge badge-soft-info fs-12">
                      <i className="ti ti-brain me-1"></i>
                      Learning Mode
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-end d-flex">
              <div className="dropdown me-1">
                <Link
                  to="#"
                  className="btn btn-md fs-14 fw-normal border bg-white rounded text-dark d-inline-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  Export
                  <i className="ti ti-chevron-down ms-2" />
                </Link>
                <ul className="dropdown-menu p-2">
                  <li>
                    <Link className="dropdown-item" to="#">
                      Download as PDF
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Download as Excel
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Export AI Analytics
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white border rounded px-1 pb-0 text-center d-flex align-items-center shadow-sm justify-content-center">
                <Link
                  to={all_routes.appointments}
                  className="bg-white rounded p-1 d-flex align-items-center justify-content-center"
                >
                  <i className="ti ti-list fs-14 text-body" />
                </Link>
                <Link
                  to={all_routes.appointmentCalendar}
                  className="bg-light rounded p-1 d-flex align-items-center justify-content-center"
                >
                  <i className="ti ti-calendar-event fs-14 text-body" />
                </Link>
              </div>
              
              <Link
                to={all_routes.newAppointment}
                className="btn btn-primary ms-2 fs-13 btn-md"
              >
                <i className="ti ti-plus me-1" /> New Appointment
              </Link>
            </div>
          </div>

          {/* AI Insights Dashboard */}
          {isAIMode && (
            <div className="ai-dashboard-cards mb-4">
              <div className="row g-3">
                <div className="col-md-3">
                  <div className="card border-0 bg-primary-transparent">
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <i className="ti ti-target text-primary fs-24"></i>
                        </div>
                        <div>
                          <h6 className="mb-0 fw-bold text-primary">92%</h6>
                          <small className="text-muted">Optimal Slots Available</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-3">
                  <div className="card border-0 bg-success-transparent">
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <i className="ti ti-user-check text-success fs-24"></i>
                        </div>
                        <div>
                          <h6 className="mb-0 fw-bold text-success">8%</h6>
                          <small className="text-muted">Avg No-Show Risk</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-3">
                  <div className="card border-0 bg-warning-transparent">
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <i className="ti ti-clock-hour-2 text-warning fs-24"></i>
                        </div>
                        <div>
                          <h6 className="mb-0 fw-bold text-warning">15min</h6>
                          <small className="text-muted">Avg Wait Time</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-3">
                  <div className="card border-0 bg-info-transparent">
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <i className="ti ti-trending-up text-info fs-24"></i>
                        </div>
                        <div>
                          <h6 className="mb-0 fw-bold text-info">96%</h6>
                          <small className="text-muted">Schedule Efficiency</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filter Section */}
          <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="d-flex align-items-center gap-2">
              <div className="d-flex right-content align-items-center flex-wrap mb-3">
                <div className="custom-range-picker position-relative">
                  <span className="input-icon-addon fs-14 text-dark">
                    <i className="ti ti-calendar" />
                  </span>
                  <PredefinedDatePicker />
                </div>
              </div>
            </div>
            
            <div className="d-flex table-dropdown mb-3 pb-1 right-content align-items-center flex-wrap row-gap-3">
              {isAIMode && (
                <div className="dropdown me-2">
                  <Link
                    to="#"
                    className="bg-white border rounded btn btn-md text-dark fs-14 py-1 align-items-center d-flex fw-normal"
                    data-bs-toggle="dropdown"
                  >
                    <i className="ti ti-robot text-primary me-1" />
                    AI Filters
                  </Link>
                  <div className="dropdown-menu dropdown-lg dropdown-menu-end p-3">
                    <h6 className="mb-2 fw-bold">Smart Filters</h6>
                    <div className="form-check mb-2">
                      <input className="form-check-input" type="checkbox" id="highScore" />
                      <label className="form-check-label" htmlFor="highScore">
                        High Score Slots (90+)
                      </label>
                    </div>
                    <div className="form-check mb-2">
                      <input className="form-check-input" type="checkbox" id="lowRisk" />
                      <label className="form-check-label" htmlFor="lowRisk">
                        Low No-Show Risk (&lt;10%)
                      </label>
                    </div>
                    <div className="form-check mb-2">
                      <input className="form-check-input" type="checkbox" id="optimal" />
                      <label className="form-check-label" htmlFor="optimal">
                        Optimal Slots Only
                      </label>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="dropdown me-2">
                <Link
                  to="#"
                  className="bg-white border rounded btn btn-md text-dark fs-14 py-1 align-items-center d-flex fw-normal"
                  data-bs-toggle="dropdown"
                >
                  <i className="ti ti-filter text-gray-5 me-1" />
                  Filters
                </Link>
                <div
                  className="dropdown-menu dropdown-lg dropdown-menu-end filter-dropdown p-0"
                  id="filter-dropdown"
                >
                  <div className="d-flex align-items-center justify-content-between border-bottom filter-header">
                    <h4 className="mb-0 fw-bold">Filter</h4>
                    <div className="d-flex align-items-center">
                      <Link
                        to="#"
                        className="link-danger text-decoration-underline"
                      >
                        Clear All
                      </Link>
                    </div>
                  </div>
                  <form action="#">
                    <div className="filter-body pb-0">
                      <div className="mb-3">
                        <div className="d-flex align-items-center justify-content-between">
                          <label className="form-label">Patient</label>
                          <Link to="#" className="link-primary mb-1">
                            Reset
                          </Link>
                        </div>
                        <div className="dropdown">
                          <Link
                            to="#"
                            className="dropdown-toggle btn bg-white d-flex align-items-center justify-content-start fs-13 p-2 fw-normal border"
                            data-bs-toggle="dropdown"
                          >
                            Select <i className="ti ti-chevron-down ms-auto" />
                          </Link>
                          <div className="dropdown-menu shadow-lg w-100 dropdown-info p-3">
                            <div className="mb-3">
                              <div className="input-icon-start input-icon position-relative">
                                <span className="input-icon-addon fs-12">
                                  <i className="ti ti-search" />
                                </span>
                                <input
                                  type="text"
                                  className="form-control form-control-md"
                                  placeholder="Search"
                                />
                              </div>
                            </div>
                            <ul className="mb-3">
                              <li className="mb-1">
                                <label className="dropdown-item px-2 d-flex align-items-center text-dark">
                                  <input
                                    className="form-check-input m-0 me-2"
                                    type="checkbox"
                                  />
                                  <span className="avatar avatar-xs rounded-circle me-2">
                                    <ImageWithBasePath
                                      src="assets/img/users/user-33.jpg"
                                      className="flex-shrink-0 rounded-circle"
                                      alt="img"
                                    />
                                  </span>
                                  Alberto Ripley
                                </label>
                              </li>
                              <li className="mb-1">
                                <label className="dropdown-item px-2 d-flex align-items-center text-dark">
                                  <input
                                    className="form-check-input m-0 me-2"
                                    type="checkbox"
                                  />
                                  <span className="avatar avatar-xs rounded-circle me-2">
                                    <ImageWithBasePath
                                      src="assets/img/users/user-12.jpg"
                                      className="flex-shrink-0 rounded-circle"
                                      alt="img"
                                    />
                                  </span>
                                  Bernard Griffith
                                </label>
                              </li>
                            </ul>
                            <div className="row g-2">
                              <div className="col-6">
                                <Link
                                  to="#"
                                  className="btn btn-outline-white w-100 close-filter"
                                >
                                  Cancel
                                </Link>
                              </div>
                              <div className="col-6">
                                <Link to="#" className="btn btn-primary w-100">
                                  Select
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="d-flex align-items-center justify-content-between">
                          <label className="form-label">Doctor</label>
                          <Link to="#" className="link-primary mb-1">
                            Reset
                          </Link>
                        </div>
                        <div className="dropdown">
                          <Link
                            to="#"
                            className="dropdown-toggle btn bg-white d-flex align-items-center justify-content-start fs-13 p-2 fw-normal border"
                            data-bs-toggle="dropdown"
                          >
                            Select <i className="ti ti-chevron-down ms-auto" />
                          </Link>
                          <div className="dropdown-menu shadow-lg w-100 dropdown-info p-3">
                            <div className="mb-3">
                              <div className="input-icon-start input-icon position-relative">
                                <span className="input-icon-addon fs-12">
                                  <i className="ti ti-search" />
                                </span>
                                <input
                                  type="text"
                                  className="form-control form-control-md"
                                  placeholder="Search"
                                />
                              </div>
                            </div>
                            <ul className="mb-3">
                              <li className="mb-1">
                                <label className="dropdown-item px-2 d-flex align-items-center text-dark">
                                  <input
                                    className="form-check-input m-0 me-2"
                                    type="checkbox"
                                  />
                                  <span className="avatar avatar-xs rounded-circle me-2">
                                    <ImageWithBasePath
                                      src="assets/img/doctors/doctor-01.jpg"
                                      className="flex-shrink-0 rounded-circle"
                                      alt="img"
                                    />
                                  </span>
                                  Dr. Mick Thompson
                                </label>
                              </li>
                              <li className="mb-1">
                                <label className="dropdown-item px-2 d-flex align-items-center text-dark">
                                  <input
                                    className="form-check-input m-0 me-2"
                                    type="checkbox"
                                  />
                                  <span className="avatar avatar-xs rounded-circle me-2">
                                    <ImageWithBasePath
                                      src="assets/img/doctors/doctor-02.jpg"
                                      className="flex-shrink-0 rounded-circle"
                                      alt="img"
                                    />
                                  </span>
                                  Dr. Sarah Johnson
                                </label>
                              </li>
                            </ul>
                            <div className="row g-2">
                              <div className="col-6">
                                <Link
                                  to="#"
                                  className="btn btn-outline-white w-100 close-filter"
                                >
                                  Cancel
                                </Link>
                              </div>
                              <div className="col-6">
                                <Link to="#" className="btn btn-primary w-100">
                                  Select
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="d-flex align-items-center justify-content-between">
                          <label className="form-label">Status</label>
                          <Link to="#" className="link-primary mb-1">
                            Reset
                          </Link>
                        </div>
                        <div className="dropdown">
                          <Link
                            to="#"
                            className="dropdown-toggle btn bg-white d-flex align-items-center justify-content-start fs-13 p-2 fw-normal border"
                            data-bs-toggle="dropdown"
                          >
                            Select <i className="ti ti-chevron-down ms-auto" />
                          </Link>
                          <div className="dropdown-menu shadow-lg w-100 dropdown-info p-3">
                            <ul className="mb-3">
                              <li className="mb-1">
                                <label className="dropdown-item px-2 d-flex align-items-center text-dark">
                                  <input
                                    className="form-check-input m-0 me-2"
                                    type="checkbox"
                                  />
                                  Confirmed
                                </label>
                              </li>
                              <li className="mb-1">
                                <label className="dropdown-item px-2 d-flex align-items-center text-dark">
                                  <input
                                    className="form-check-input m-0 me-2"
                                    type="checkbox"
                                  />
                                  Tentative
                                </label>
                              </li>
                              <li className="mb-1">
                                <label className="dropdown-item px-2 d-flex align-items-center text-dark">
                                  <input
                                    className="form-check-input m-0 me-2"
                                    type="checkbox"
                                  />
                                  Cancelled
                                </label>
                              </li>
                            </ul>
                            <div className="row g-2">
                              <div className="col-6">
                                <Link
                                  to="#"
                                  className="btn btn-outline-white w-100 close-filter"
                                >
                                  Cancel
                                </Link>
                              </div>
                              <div className="col-6">
                                <Link to="#" className="btn btn-primary w-100">
                                  Select
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="filter-footer d-flex align-items-center justify-content-end border-top">
                      <Link
                        to="#"
                        className="btn btn-light btn-md me-2 fw-medium"
                        id="close-filter"
                      >
                        Close
                      </Link>
                      <button
                        type="submit"
                        className="btn btn-primary btn-md fw-medium"
                      >
                        Filter
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              
              <div className="dropdown">
                <Link
                  to="#"
                  className="dropdown-toggle btn bg-white btn-md d-inline-flex align-items-center fw-normal rounded border text-dark px-2 py-1 fs-14"
                  data-bs-toggle="dropdown"
                >
                  <span className="me-1">Sort By :</span> AI Score
                </Link>
                <ul className="dropdown-menu dropdown-menu-end p-2">
                  <li>
                    <Link to="#" className="dropdown-item rounded-1">
                      AI Score
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="dropdown-item rounded-1">
                      Recent
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="dropdown-item rounded-1">
                      Risk Level
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Enhanced Calendar Card */}
          <div className="card mb-0">
            <div className="card-body">
              <div className="calendar-container position-relative">
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="timeGridWeek"
                  events={events}
                  headerToolbar={{
                    start: "today,prev,next",
                    center: "title",
                    end: "timeGridDay,timeGridWeek,dayGridMonth",
                  }}
                  eventContent={renderEventContent}
                  eventClick={handleEventClick}
                  dateClick={handleDateClick}
                  ref={calendarRef}
                  height="auto"
                  slotMinTime="07:00:00"
                  slotMaxTime="19:00:00"
                  slotDuration="00:30:00"
                  businessHours={{
                    daysOfWeek: [1, 2, 3, 4, 5],
                    startTime: '08:00',
                    endTime: '18:00'
                  }}
                  slotLabelFormat={{
                    hour: 'numeric',
                    minute: '2-digit',
                    meridiem: 'short'
                  }}
                />
                
                {/* AI Slot Overlays - would be positioned absolutely over time slots */}
                {isAIMode && (
                  <div className="slot-overlays position-absolute w-100 h-100 top-0 start-0 pointer-events-none">
                    {slotAnalytics.map((slot) => (
                      <div
                        key={slot.slotId}
                        className="slot-score-overlay"
                        style={{
                          position: 'absolute',
                          top: `${calculateSlotPosition(slot.slotId).top}%`,
                          left: `${calculateSlotPosition(slot.slotId).left}%`,
                          width: '120px',
                          height: '25px',
                          zIndex: 1000,
                        }}
                        onMouseEnter={() => setHoveredSlot(slot.slotId)}
                        onMouseLeave={() => setHoveredSlot(null)}
                      >
                        {hoveredSlot === slot.slotId && (
                          <div className="slot-tooltip bg-dark text-white p-2 rounded shadow-lg">
                            <div className="d-flex align-items-center justify-content-between mb-1">
                              <small className="fw-bold">Slot Score</small>
                              <span className={`badge badge-soft-${getScoreColor(slot.score)} fs-10`}>
                                {slot.score}
                              </span>
                            </div>
                            <div className="tooltip-metrics">
                              <div className="d-flex justify-content-between">
                                <small>Load:</small>
                                <small>{slot.loadPercentage}%</small>
                              </div>
                              <div className="d-flex justify-content-between">
                                <small>No-Show Risk:</small>
                                <small className={`text-${slot.noShowRisk > 20 ? 'danger' : slot.noShowRisk > 10 ? 'warning' : 'success'}`}>
                                  {slot.noShowRisk}%
                                </small>
                              </div>
                              <div className="d-flex justify-content-between">
                                <small>Status:</small>
                                <small className={`text-${slot.recommendation === 'Optimal' ? 'success' : slot.recommendation === 'Highly Recommended' ? 'primary' : 'warning'}`}>
                                  {slot.recommendation}
                                </small>
                              </div>
                              <div className="mt-1">
                                <small className="text-muted">Best for:</small>
                                <div className="d-flex gap-1 mt-1">
                                  {slot.optimalFor.map((type, idx) => (
                                    <span key={idx} className="badge bg-light text-dark fs-10">
                                      {type}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="score-indicator">
                          <div
                            className={`score-bar bg-${getScoreColor(slot.score)}`}
                            style={{
                              width: '100%',
                              height: '3px',
                              borderRadius: '2px',
                              opacity: 0.8
                            }}
                          ></div>
                          <small className={`score-text text-${getScoreColor(slot.score)} fw-bold fs-10`}>
                            {slot.score}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Suggestions Modal */}
      {showSuggestions && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title d-flex align-items-center">
                  <i className="ti ti-robot me-2"></i>
                  Smart Time Suggestions
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={closeSuggestions}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="suggestions-header mb-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="mb-1 fw-bold">
                        Recommended Times for {selectedDate?.toLocaleDateString()}
                      </h6>
                      <small className="text-muted">
                        Based on historical data, doctor preferences, and patient patterns
                      </small>
                    </div>
                    <div className="confidence-meter">
                      <span className="badge badge-soft-success">
                        <i className="ti ti-shield-check me-1"></i>
                        95% Confidence
                      </span>
                    </div>
                  </div>
                </div>

                <div className="suggestions-list">
                  {smartSuggestions.map((suggestion, index) => (
                    <div key={suggestion.id} className="suggestion-card card border mb-3">
                      <div className="card-body p-3">
                        <div className="row align-items-center">
                          <div className="col-md-3">
                            <div className="time-display text-center">
                              <h5 className="mb-0 fw-bold text-primary">{suggestion.time}</h5>
                              <small className="text-muted">{suggestion.date}</small>
                              <div className="mt-2">
                                <span className={`badge badge-soft-${getScoreColor(suggestion.score)} fs-12`}>
                                  Score: {suggestion.score}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="col-md-6">
                            <div className="suggestion-details">
                              <h6 className="mb-2 fw-medium">Why this time works:</h6>
                              <ul className="list-unstyled mb-2">
                                {suggestion.reasons.map((reason, idx) => (
                                  <li key={idx} className="d-flex align-items-center mb-1">
                                    <i className="ti ti-check text-success me-2 fs-12"></i>
                                    <span className="fs-13">{reason}</span>
                                  </li>
                                ))}
                              </ul>
                              
                              <div className="metrics-row d-flex gap-3 mt-2">
                                <small className="text-muted">
                                  <strong>Duration:</strong> {suggestion.estimatedDuration}
                                </small>
                                <small className="text-muted">
                                  <strong>Conflict Risk:</strong> 
                                  <span className={`text-${suggestion.conflictRisk === 'Low' ? 'success' : suggestion.conflictRisk === 'Medium' ? 'warning' : 'danger'} ms-1`}>
                                    {suggestion.conflictRisk}
                                  </span>
                                </small>
                              </div>
                            </div>
                          </div>
                          
                          <div className="col-md-3">
                            <div className="suggestion-actions text-end">
                              <div className="confidence-bar mb-2">
                                <div className="d-flex align-items-center justify-content-end mb-1">
                                  <small className="text-muted me-2">Confidence:</small>
                                  <span className="fw-bold" style={{ color: getConfidenceColor(suggestion.confidence) }}>
                                    {suggestion.confidence}%
                                  </span>
                                </div>
                                <div className="progress" style={{ height: '4px' }}>
                                  <div 
                                    className="progress-bar" 
                                    style={{ 
                                      width: `${suggestion.confidence}%`,
                                      backgroundColor: getConfidenceColor(suggestion.confidence)
                                    }}
                                  ></div>
                                </div>
                              </div>
                              
                              <Link 
                                to={all_routes.newAppointment}
                                className="btn btn-primary btn-sm w-100"
                              >
                                <i className="ti ti-calendar-plus me-1"></i>
                                Book This Slot
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="suggestions-footer mt-4 p-3 bg-light rounded">
                  <div className="row">
                    <div className="col-md-8">
                      <h6 className="mb-1 fw-medium">Need a different time?</h6>
                      <small className="text-muted">
                        Our AI can analyze alternative slots and provide personalized recommendations
                        based on your specific requirements.
                      </small>
                    </div>
                    <div className="col-md-4 text-end">
                      <button className="btn btn-outline-primary btn-sm">
                        <i className="ti ti-search me-1"></i>
                        Find More Options
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Standard Event Details Modal */}
      {selectedEvent && (
        <div
          className={`modal fade ${modalOpen ? "show d-block" : ""}`}
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={closeModal}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  Appointment Details
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="appointment-details">
                  <div className="d-flex align-items-center mb-3">
                    <ImageWithBasePath
                      src={selectedEvent.extendedProps.image}
                      alt="patient"
                      className="avatar-md rounded-circle me-3"
                    />
                    <div>
                      <h6 className="mb-0 fw-bold">{selectedEvent.title}</h6>
                      <small className="text-muted">Patient Appointment</small>
                    </div>
                  </div>
                  
                  <div className="appointment-info">
                    <p className="d-flex align-items-center mb-2">
                      <i className="ti ti-calendar text-primary me-2"></i>
                      {selectedEvent.start?.toLocaleDateString()}
                    </p>
                    <p className="d-flex align-items-center mb-2">
                      <i className="ti ti-clock text-primary me-2"></i>
                      {selectedEvent.start?.toLocaleTimeString()} - {selectedEvent.end?.toLocaleTimeString()}
                    </p>
                    <p className="d-flex align-items-center mb-2">
                      <i className="ti ti-map-pin text-primary me-2"></i>
                      Room 205, Cardiology Wing
                    </p>
                  </div>

                  {isAIMode && (
                    <div className="ai-insights mt-3 p-3 bg-light rounded">
                      <h6 className="mb-2 fw-medium">
                        <i className="ti ti-robot text-primary me-1"></i>
                        AI Insights
                      </h6>
                      <div className="insights-grid">
                        <div className="d-flex justify-content-between mb-2">
                          <span>No-Show Risk:</span>
                          <span className="badge badge-soft-success">Low (8%)</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Optimal Duration:</span>
                          <span className="text-muted">30 minutes</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Slot Score:</span>
                          <span className="badge badge-soft-primary">92/100</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-secondary" onClick={closeModal}>
                  Close
                </button>
                <Link to="#" className="btn btn-primary">
                  Edit Appointment
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SmartAppointmentCalendar;
