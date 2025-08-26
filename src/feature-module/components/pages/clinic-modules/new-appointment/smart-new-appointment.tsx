import { Link } from "react-router";
import { useState, useEffect } from "react";
import { all_routes } from "../../../../routes/all_routes";
import {
  Appointment_Type,
  Department,
  Doctor,
  Patient,
  Status_Checkout,
} from "../../../../../core/common/selectOption";
import CommonSelect from "../../../../../core/common/common-select/commonSelect";
import { DatePicker, TimePicker, type TimePickerProps } from "antd";
import dayjs from "dayjs";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import Modals from "./modals/modals";

interface SmartTimeSlot {
  id: string;
  time: string;
  date: string;
  score: number;
  confidence: number;
  availability: string;
  estimatedDuration: string;
  reasons: string[];
  conflicts: string[];
  doctorMatch: number;
  patientPreference: number;
  departmentLoad: number;
}

interface ConflictWarning {
  type: 'scheduling' | 'doctor' | 'room' | 'patient';
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestions: string[];
}

const SmartNewAppointment = () => {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedAppointmentType, setSelectedAppointmentType] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [selectedTime, setSelectedTime] = useState<any>(null);
  const [isSmartMode, setIsSmartMode] = useState(true);
  const [smartSlots, setSmartSlots] = useState<SmartTimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conflicts, setConflicts] = useState<ConflictWarning[]>([]);
  const [selectedSmartSlot, setSelectedSmartSlot] = useState<string | null>(null);

  // Mock smart time slots data
  const mockSmartSlots: SmartTimeSlot[] = [
    {
      id: "slot-1",
      time: "10:30 AM",
      date: "Today",
      score: 95,
      confidence: 92,
      availability: "High",
      estimatedDuration: "30 min",
      reasons: [
        "Doctor's peak performance time",
        "Low patient traffic period", 
        "Optimal for consultation type",
        "High historical success rate"
      ],
      conflicts: [],
      doctorMatch: 98,
      patientPreference: 87,
      departmentLoad: 65
    },
    {
      id: "slot-2", 
      time: "2:00 PM",
      date: "Tomorrow",
      score: 89,
      confidence: 88,
      availability: "Medium",
      estimatedDuration: "45 min",
      reasons: [
        "Good patient-doctor compatibility",
        "Adequate preparation time",
        "Reduced wait time expected"
      ],
      conflicts: ["Minor overlap with lunch break"],
      doctorMatch: 85,
      patientPreference: 92,
      departmentLoad: 78
    },
    {
      id: "slot-3",
      time: "9:00 AM",
      date: "Jan 23",
      score: 86,
      confidence: 90,
      availability: "High",
      estimatedDuration: "30 min", 
      reasons: [
        "Start of day efficiency",
        "Doctor freshness optimal",
        "Lower interruption risk"
      ],
      conflicts: [],
      doctorMatch: 88,
      patientPreference: 75,
      departmentLoad: 55
    },
    {
      id: "slot-4",
      time: "11:15 AM",
      date: "Jan 24",
      score: 82,
      confidence: 85,
      availability: "Medium",
      estimatedDuration: "30 min",
      reasons: [
        "Good department availability",
        "Reasonable patient preference match"
      ],
      conflicts: ["Potential equipment conflict"],
      doctorMatch: 78,
      patientPreference: 82,
      departmentLoad: 85
    },
    {
      id: "slot-5",
      time: "4:30 PM",
      date: "Jan 24",
      score: 78,
      confidence: 80,
      availability: "Low",
      estimatedDuration: "45 min",
      reasons: [
        "Available slot for urgent cases",
        "Department has capacity"
      ],
      conflicts: ["End of day fatigue factor", "Potential overtime"],
      doctorMatch: 70,
      patientPreference: 65,
      departmentLoad: 90
    }
  ];

  const getModalContainer = () => {
    const modalElement = document.getElementById("modal-datepicker");
    return modalElement ? modalElement : document.body;
  };

  const onChangeTime: TimePickerProps["onChange"] = (time, timeString) => {
    setSelectedTime(time);
    if (isSmartMode) {
      triggerSmartAnalysis();
    }
  };

  const triggerSmartAnalysis = () => {
    if (!selectedPatient || !selectedDepartment || !selectedDoctor) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSmartSlots(mockSmartSlots);
      checkForConflicts();
      setIsLoading(false);
    }, 1000);
  };

  const checkForConflicts = () => {
    const mockConflicts: ConflictWarning[] = [];
    
    if (selectedTime && selectedDate) {
      const hour = selectedTime.hour();
      if (hour < 8 || hour > 17) {
        mockConflicts.push({
          type: 'scheduling',
          severity: 'medium',
          message: 'Selected time is outside normal business hours',
          suggestions: [
            'Consider 10:30 AM slot (95% optimal)',
            'Try 2:00 PM tomorrow (89% optimal)'
          ]
        });
      }
      
      if (hour >= 12 && hour <= 13) {
        mockConflicts.push({
          type: 'doctor',
          severity: 'high',
          message: 'Doctor typically takes lunch break during this time',
          suggestions: [
            'Book at 11:15 AM instead',
            'Schedule for 2:00 PM or later'
          ]
        });
      }
    }
    
    setConflicts(mockConflicts);
  };

  const handleSmartSlotSelect = (slotId: string) => {
    const slot = smartSlots.find(s => s.id === slotId);
    if (slot) {
      setSelectedSmartSlot(slotId);
      // Auto-fill the time based on smart suggestion
      const time = dayjs(slot.time, 'h:mm A');
      setSelectedTime(time);
      
      // You would also set the date here based on slot.date
      if (slot.date === 'Today') {
        setSelectedDate(dayjs());
      } else if (slot.date === 'Tomorrow') {
        setSelectedDate(dayjs().add(1, 'day'));
      }
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 80) return 'primary'; 
    if (score >= 70) return 'warning';
    return 'danger';
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'High': return 'success';
      case 'Medium': return 'warning';
      case 'Low': return 'danger';
      default: return 'secondary';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'secondary';
    }
  };

  useEffect(() => {
    if (selectedPatient && selectedDepartment && selectedDoctor && isSmartMode) {
      triggerSmartAnalysis();
    }
  }, [selectedPatient, selectedDepartment, selectedDoctor]);

  useEffect(() => {
    if (selectedDate || selectedTime) {
      checkForConflicts();
    }
  }, [selectedDate, selectedTime]);

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            {/* Main Form Column */}
            <div className={`${isSmartMode ? 'col-lg-8' : 'col-lg-12'}`}>
              <div className="mb-4">
                <div className="d-flex align-items-center justify-content-between">
                  <h6 className="fw-bold mb-0 d-flex align-items-center">
                    <Link to={all_routes.appointments} className="text-dark">
                      <i className="ti ti-chevron-left me-1" />
                      Appointments
                    </Link>
                  </h6>
                  
                  <div className="smart-mode-toggle">
                    <div className="form-check form-switch">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="smartModeToggle"
                        checked={isSmartMode}
                        onChange={(e) => setIsSmartMode(e.target.checked)}
                      />
                      <label className="form-check-label fw-medium text-primary" htmlFor="smartModeToggle">
                        <i className="ti ti-robot me-1"></i>
                        Smart Scheduling {isSmartMode ? 'On' : 'Off'}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="form">
                    <div className="mb-3">
                      <label className="form-label mb-1 fw-medium">
                        Appointment ID
                        <span className="text-danger ms-1">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="AP234354"
                        disabled
                      />
                    </div>
                    
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <div className="d-flex align-items-center justify-content-between mb-1">
                            <label className="form-label mb-0 fw-medium">
                              Patient<span className="text-danger ms-1">*</span>
                            </label>
                            <Link
                              to="#"
                              className="link-primary"
                              data-bs-toggle="modal"
                              data-bs-target="#add_modal"
                            >
                              <i className="ti ti-circle-plus me-1" />
                              Add New
                            </Link>
                          </div>
                          <CommonSelect
                            options={Patient}
                            className="select"
                            defaultValue={Patient[0]}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label mb-1 fw-medium">
                            Department
                            <span className="text-danger ms-1">*</span>
                          </label>
                          <CommonSelect
                            options={Department}
                            className="select"
                            defaultValue={Department[0]}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label mb-1 fw-medium">
                            Doctor<span className="text-danger ms-1">*</span>
                          </label>
                          <CommonSelect
                            options={Doctor}
                            className="select"
                            defaultValue={Doctor[0]}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label mb-1 fw-medium">
                            Appointment Type
                            <span className="text-danger ms-1">*</span>
                          </label>
                          <CommonSelect
                            options={Appointment_Type}
                            className="select"
                            defaultValue={Appointment_Type[0]}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label mb-1 fw-medium">
                            Date of Appointment
                            <span className="text-danger ms-1">*</span>
                            {isSmartMode && (
                              <span className="badge badge-soft-info ms-2 fs-10">
                                <i className="ti ti-robot me-1"></i>
                                AI Enhanced
                              </span>
                            )}
                          </label>
                          <div className="input-icon-end position-relative">
                            <DatePicker
                              className="form-control datetimepicker"
                              format={{
                                format: "DD-MM-YYYY",
                                type: "mask",
                              }}
                              getPopupContainer={getModalContainer}
                              placeholder="DD-MM-YYYY"
                              suffixIcon={null}
                              value={selectedDate}
                              onChange={(date) => setSelectedDate(date)}
                            />
                            <span className="input-icon-addon">
                              <i className="ti ti-calendar" />
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label mb-1 fw-medium">
                            Time<span className="text-danger ms-1">*</span>
                            {isSmartMode && (
                              <span className="badge badge-soft-info ms-2 fs-10">
                                <i className="ti ti-robot me-1"></i>
                                Smart Suggestions Available
                              </span>
                            )}
                          </label>
                          <div className="input-icon-end position-relative">
                            <TimePicker
                              className="form-control"
                              onChange={onChangeTime}
                              value={selectedTime}
                              defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                            />
                            <span className="input-icon-addon">
                              <i className="ti ti-clock text-gray-7" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Conflict Warnings */}
                    {conflicts.length > 0 && (
                      <div className="conflict-warnings mb-3">
                        {conflicts.map((conflict, index) => (
                          <div key={index} className={`alert alert-${getSeverityColor(conflict.severity)} border-start border-${getSeverityColor(conflict.severity)} border-3`}>
                            <div className="d-flex align-items-start">
                              <div className="me-3">
                                <i className={`ti ti-alert-triangle text-${getSeverityColor(conflict.severity)} fs-18`}></i>
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="mb-1 fw-bold">
                                  {conflict.type.charAt(0).toUpperCase() + conflict.type.slice(1)} Conflict Detected
                                </h6>
                                <p className="mb-2">{conflict.message}</p>
                                {conflict.suggestions.length > 0 && (
                                  <div className="suggestions">
                                    <small className="fw-medium text-muted">Suggestions:</small>
                                    <ul className="list-unstyled mb-0 mt-1">
                                      {conflict.suggestions.map((suggestion, idx) => (
                                        <li key={idx} className="d-flex align-items-center">
                                          <i className="ti ti-arrow-right text-muted me-2 fs-12"></i>
                                          <span className="fs-13">{suggestion}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="mb-3">
                      <label className="form-label mb-1 fw-medium">
                        Appointment Reason
                        <span className="text-danger ms-1">*</span>
                      </label>
                      <textarea
                        className="form-control"
                        rows={3}
                        defaultValue={""}
                      />
                    </div>
                    
                    <div className="mb-0">
                      <label className="form-label mb-1 fw-medium">
                        Status<span className="text-danger ms-1">*</span>
                      </label>
                      <CommonSelect
                        options={Status_Checkout}
                        className="select"
                        defaultValue={Status_Checkout[0]}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="d-flex align-items-center justify-content-end">
                <Link to="#" className="btn btn-light me-2">
                  Cancel
                </Link>
                <Link to="#" className="btn btn-primary">
                  Create Appointment
                </Link>
              </div>
            </div>

            {/* Smart Suggestions Panel */}
            {isSmartMode && (
              <div className="col-lg-4">
                <div className="smart-suggestions-panel sticky-top" style={{ top: '20px' }}>
                  <div className="card border-primary">
                    <div className="card-header bg-primary text-white">
                      <h6 className="mb-0 fw-bold d-flex align-items-center">
                        <i className="ti ti-robot me-2"></i>
                        Smart Time Suggestions
                        {isLoading && (
                          <div className="spinner-border spinner-border-sm ms-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        )}
                      </h6>
                      <small className="opacity-75">
                        AI-powered recommendations based on historical data and preferences
                      </small>
                    </div>
                    
                    <div className="card-body p-0">
                      {!selectedPatient || !selectedDepartment || !selectedDoctor ? (
                        <div className="empty-state p-4 text-center">
                          <i className="ti ti-info-circle text-muted fs-48 mb-3"></i>
                          <h6 className="text-muted mb-2">Complete Basic Information</h6>
                          <p className="text-muted fs-13 mb-0">
                            Select patient, department, and doctor to see smart time suggestions
                          </p>
                        </div>
                      ) : isLoading ? (
                        <div className="loading-state p-4 text-center">
                          <div className="spinner-border text-primary mb-3" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <h6 className="text-muted mb-2">Analyzing Optimal Times</h6>
                          <p className="text-muted fs-13 mb-0">
                            Processing schedules, preferences, and availability...
                          </p>
                        </div>
                      ) : (
                        <div className="suggestions-list">
                          {smartSlots.map((slot, index) => (
                            <div 
                              key={slot.id} 
                              className={`suggestion-item p-3 border-bottom cursor-pointer ${selectedSmartSlot === slot.id ? 'bg-primary-transparent border-primary' : ''}`}
                              onClick={() => handleSmartSlotSelect(slot.id)}
                            >
                              <div className="d-flex align-items-start justify-content-between mb-2">
                                <div className="time-info">
                                  <h6 className="mb-0 fw-bold text-primary">{slot.time}</h6>
                                  <small className="text-muted">{slot.date}</small>
                                </div>
                                <div className="score-info text-end">
                                  <span className={`badge badge-soft-${getScoreColor(slot.score)} mb-1`}>
                                    Score: {slot.score}
                                  </span>
                                  <div className="d-flex align-items-center">
                                    <small className="text-muted me-1">Confidence:</small>
                                    <span className="fw-bold fs-12">{slot.confidence}%</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="slot-metrics mb-2">
                                <div className="row g-2 text-center">
                                  <div className="col-4">
                                    <div className="metric-card">
                                      <div className="metric-value text-success fs-12 fw-bold">
                                        {slot.doctorMatch}%
                                      </div>
                                      <small className="metric-label text-muted">Doctor Match</small>
                                    </div>
                                  </div>
                                  <div className="col-4">
                                    <div className="metric-card">
                                      <div className="metric-value text-info fs-12 fw-bold">
                                        {slot.patientPreference}%
                                      </div>
                                      <small className="metric-label text-muted">Patient Pref</small>
                                    </div>
                                  </div>
                                  <div className="col-4">
                                    <div className="metric-card">
                                      <div className={`metric-value text-${slot.departmentLoad > 80 ? 'warning' : 'success'} fs-12 fw-bold`}>
                                        {slot.departmentLoad}%
                                      </div>
                                      <small className="metric-label text-muted">Dept Load</small>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="slot-details">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                  <span className={`badge badge-soft-${getAvailabilityColor(slot.availability)} fs-10`}>
                                    <i className="ti ti-clock me-1"></i>
                                    {slot.availability} Availability
                                  </span>
                                  <small className="text-muted">
                                    <i className="ti ti-clock-hour-4 me-1"></i>
                                    {slot.estimatedDuration}
                                  </small>
                                </div>
                                
                                <div className="reasons">
                                  <small className="fw-medium text-muted d-block mb-1">Why this works:</small>
                                  <ul className="list-unstyled mb-0">
                                    {slot.reasons.slice(0, 2).map((reason, idx) => (
                                      <li key={idx} className="d-flex align-items-start">
                                        <i className="ti ti-check text-success me-2 fs-10 mt-1"></i>
                                        <span className="fs-12 text-muted">{reason}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                
                                {slot.conflicts.length > 0 && (
                                  <div className="conflicts mt-2">
                                    <small className="fw-medium text-warning d-block mb-1">
                                      <i className="ti ti-alert-triangle me-1"></i>
                                      Minor Issues:
                                    </small>
                                    <ul className="list-unstyled mb-0">
                                      {slot.conflicts.map((conflict, idx) => (
                                        <li key={idx} className="d-flex align-items-start">
                                          <i className="ti ti-info-circle text-warning me-2 fs-10 mt-1"></i>
                                          <span className="fs-12 text-muted">{conflict}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                              
                              <div className="slot-actions mt-3">
                                <button 
                                  className={`btn btn-sm w-100 ${selectedSmartSlot === slot.id ? 'btn-primary' : 'btn-outline-primary'}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSmartSlotSelect(slot.id);
                                  }}
                                >
                                  <i className={`ti ${selectedSmartSlot === slot.id ? 'ti-check' : 'ti-calendar-plus'} me-1`}></i>
                                  {selectedSmartSlot === slot.id ? 'Selected' : 'Select This Time'}
                                </button>
                              </div>
                            </div>
                          ))}
                          
                          <div className="suggestions-footer p-3 bg-light">
                            <div className="d-flex align-items-center justify-content-between">
                              <small className="text-muted">
                                <i className="ti ti-refresh me-1"></i>
                                Updated 2 min ago
                              </small>
                              <button className="btn btn-outline-primary btn-sm">
                                <i className="ti ti-search me-1"></i>
                                More Options
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* AI Insights Card */}
                  {smartSlots.length > 0 && (
                    <div className="card border-info mt-3">
                      <div className="card-header bg-info-transparent">
                        <h6 className="mb-0 fw-bold text-info">
                          <i className="ti ti-bulb me-2"></i>
                          AI Insights
                        </h6>
                      </div>
                      <div className="card-body p-3">
                        <div className="insights-list">
                          <div className="insight-item d-flex align-items-start mb-2">
                            <i className="ti ti-trending-up text-success me-2 mt-1"></i>
                            <div>
                              <small className="fw-medium">Peak Performance</small>
                              <p className="fs-12 text-muted mb-0">
                                Dr. Smith performs best during 10-11 AM slots (95% success rate)
                              </p>
                            </div>
                          </div>
                          
                          <div className="insight-item d-flex align-items-start mb-2">
                            <i className="ti ti-user-check text-info me-2 mt-1"></i>
                            <div>
                              <small className="fw-medium">Patient Preference</small>
                              <p className="fs-12 text-muted mb-0">
                                Similar patients prefer afternoon appointments (78% satisfaction)
                              </p>
                            </div>
                          </div>
                          
                          <div className="insight-item d-flex align-items-start">
                            <i className="ti ti-clock text-warning me-2 mt-1"></i>
                            <div>
                              <small className="fw-medium">Wait Time</small>
                              <p className="fs-12 text-muted mb-0">
                                Booking 10:30 AM reduces average wait time by 12 minutes
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Modals />
    </>
  );
};

export default SmartNewAppointment;
