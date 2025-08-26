# Smart Scheduling Design System

## Overview

This document outlines the design system components, patterns, and specifications for the Smart Scheduling feature. All components maintain 100% visual consistency with the existing healthcare platform design system while introducing AI-enhanced functionality.

---

## 🎨 Design Tokens

### Color Palette

The Smart Scheduling feature uses the existing platform color system with specific AI-related extensions:

```scss
// Primary Colors (From existing system)
--primary: #2E37A4;           // Main primary blue
--secondary: #00D3C7;         // Teal accent
--success: #27AE60;           // Green for positive states
--info: #2F80ED;              // Blue for informational
--warning: #E2B93B;           // Yellow for warnings
--danger: #EF1E1E;            // Red for errors

// AI-Specific Colors
--ai-primary: var(--primary);          // AI elements use primary
--ai-confidence-high: var(--success);  // 90%+ confidence
--ai-confidence-medium: var(--info);   // 75-89% confidence  
--ai-confidence-low: var(--warning);   // Below 75% confidence
--ai-accent: var(--secondary);         // AI accent elements

// Transparent Backgrounds
--primary-transparent: #ECEDF7;
--success-transparent: #F4FBF7;
--info-transparent: #F4F9FE;
--warning-transparent: #FEFBF5;
--danger-transparent: #FEF4F4;
```

### Typography Scale

Following the existing Inter font family system:

```scss
// Font Family
font-family: 'Inter', sans-serif;

// Font Weights
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;

// Font Sizes (following existing system)
--fs-10: 0.625rem;    // 10px - small badges
--fs-12: 0.75rem;     // 12px - detail text
--fs-13: 0.8125rem;   // 13px - body text
--fs-14: 0.875rem;    // 14px - default body
--fs-18: 1.125rem;    // 18px - section headers
--fs-24: 1.5rem;      // 24px - page headers
```

### Spacing System

Consistent with Bootstrap 5 spacing scale:

```scss
// Spacing Scale (rem units)
0.25rem  // 1 (4px)
0.5rem   // 2 (8px) 
0.75rem  // 3 (12px)
1rem     // 4 (16px)
1.25rem  // 5 (20px)
1.5rem   // 6 (24px)
2rem     // 7 (32px)
2.5rem   // 8 (40px)
3rem     // 9 (48px)
```

---

## 🧩 Component Library

### 1. AI Mode Toggle

**Purpose**: Switch between standard and AI-enhanced views

**Specifications**:
- Switch input with primary color when active
- Robot icon indicator
- Clear "On/Off" state labeling
- Accessibility: proper ARIA labels

```tsx
interface AIModeToggleProps {
  isActive: boolean;
  onToggle: (active: boolean) => void;
  label?: string;
}
```

**Visual States**:
- Inactive: Gray switch, "AI Insights Off"
- Active: Primary blue switch, "AI Insights On"
- Focus: 2px primary outline
- Disabled: Reduced opacity (0.6)

**Usage Example**:
```html
<div class="form-check form-switch">
  <input class="form-check-input" type="checkbox" id="aiMode" checked>
  <label class="form-check-label fw-medium text-primary" for="aiMode">
    <i class="ti ti-robot me-1"></i>
    AI Insights On
  </label>
</div>
```

### 2. Smart Suggestion Card

**Purpose**: Display individual time slot recommendations with AI analysis

**Specifications**:
- Fixed height: auto (responsive content)
- Border radius: 0.375rem (6px)
- Padding: 1rem (16px)
- Hover effect: translateY(-1px) + shadow
- Selection state: primary background + left border

```tsx
interface SmartSuggestionProps {
  slot: {
    id: string;
    time: string;
    date: string;
    score: number;
    confidence: number;
    reasons: string[];
    conflicts: string[];
    metrics: {
      doctorMatch: number;
      patientPreference: number;
      departmentLoad: number;
    };
  };
  isSelected: boolean;
  onSelect: (slotId: string) => void;
}
```

**Layout Structure**:
```
┌─────────────────────────────────────────┐
│ Time Info    │         │ Score Badge    │
│ 10:30 AM     │         │ Score: 95      │
│ Today        │         │ Conf: 92%      │
├─────────────────────────────────────────┤
│ Doctor │ Patient │ Dept   ← Metrics     │
│  98%   │   87%   │  65%                 │  
├─────────────────────────────────────────┤
│ ✓ Doctor's peak performance time        │
│ ✓ Low patient traffic period            │
├──────��──────────────────────────────────┤
│ ⚠ Minor overlap with lunch break        │
├─────────────────────────────────────────┤
│        [Select This Time]               │
└─────────────────────────────────────────┘
```

### 3. AI Dashboard Cards

**Purpose**: Display real-time scheduling metrics and insights

**Specifications**:
- Card elevation: box-shadow-lg on hover
- Icon size: 32px
- Metric display: Large number + descriptive label
- Color coding by metric type

```tsx
interface AIDashboardProps {
  metrics: {
    optimalSlots: number;
    noShowRisk: number;
    avgWaitTime: string;
    scheduleEfficiency: number;
  };
  isLoading?: boolean;
}
```

**Visual Pattern**:
```
┌─────────────────────────┐
│ [Icon] │ 92%            │
│        │ Optimal Slots  │
│        │ Available      │
└─────────────────────────┘
```

### 4. Conflict Warning Component

**Purpose**: Alert users to scheduling conflicts with actionable suggestions

**Specifications**:
- Left border: 4px solid (color-coded by severity)
- Alert icon: 20px, positioned top-left
- Suggestion list: Bullet points with arrow icons
- Severity levels: low (info), medium (warning), high (danger)

```tsx
interface ConflictWarningProps {
  conflicts: Array<{
    type: 'scheduling' | 'doctor' | 'room' | 'patient';
    severity: 'low' | 'medium' | 'high';
    message: string;
    suggestions: string[];
  }>;
  onSuggestionClick?: (suggestion: string) => void;
}
```

**Visual Structure**:
```
┌─│ ⚠ Doctor Conflict Detected
│ │ Dr. Thompson typically takes lunch break during this time
│ │ 
│ │ Suggestions:
│ │ → Book at 10:30 AM instead (95% optimal)
│ │ → Schedule for 2:00 PM or later
└─┘
```

### 5. Slot Score Overlay

**Purpose**: Show AI-generated slot scores on calendar hover

**Specifications**:
- Tooltip positioning: Bottom-up, centered
- Max width: 200px
- Z-index: 1050 (above calendar)
- Animation: Fade in/out (0.3s ease)

```tsx
interface SlotScoreOverlayProps {
  slot: {
    slotId: string;
    score: number;
    loadPercentage: number;
    noShowRisk: number;
    recommendation: string;
    optimalFor: string[];
  };
  isVisible: boolean;
  position: { top: number; left: number };
}
```

**Tooltip Content**:
```
┌─────────────────────────┐
│ Slot Analysis   Score: 88│
├─────────────────────────┤
│ Load Percentage:    75% │
│ No-Show Risk:       12% │
│ Recommendation: Optimal │
├─────────────────────────┤
│ Best for:               │
│ [Follow-up] [Consult]   │
└─────────────────────────┘
```

### 6. Confidence Meter

**Purpose**: Visualize AI confidence levels with progress bars

**Specifications**:
- Height: 4px
- Border radius: 2px
- Background: #e9ecef
- Fill colors: Based on confidence percentage
- Animation: width transition (0.3s ease)

```tsx
interface ConfidenceMeterProps {
  confidence: number; // 0-100
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
```

**Color Mapping**:
- 90-100%: Success green (#27AE60)
- 75-89%: Info blue (#2F80ED)  
- 60-74%: Warning yellow (#E2B93B)
- Below 60%: Danger red (#EF1E1E)

---

## 🎯 Interaction Patterns

### 1. Smart Suggestion Selection

**Flow**:
1. User clicks suggestion card
2. Visual feedback: Card becomes selected state
3. Form auto-fills with selected time/date
4. Conflict detection runs automatically
5. Button text changes to "Selected"

**States**:
- Default: Outline button "Select This Time"
- Hover: Background color change
- Selected: Primary button "Selected" with checkmark
- Loading: Spinner in button

### 2. AI Mode Activation

**Flow**:
1. User toggles AI mode switch
2. Loading state shows on relevant components
3. AI components fade in/slide in
4. Dashboard metrics update
5. Calendar overlays become visible

### 3. Conflict Detection

**Flow**:
1. User changes date/time input
2. 300ms debounce for API call
3. Loading indicator on form
4. Conflict warnings appear/update
5. Suggestions populate if conflicts found

### 4. Calendar Slot Interaction

**Flow**:
1. User hovers over calendar slot
2. Score overlay fades in
3. Detailed tooltip shows metrics
4. User clicks empty slot
5. Smart suggestions modal opens
6. Top 3 recommendations display

---

## 📱 Responsive Behavior

### Desktop (1200px+)
- Side-by-side layout (8/4 column split)
- Full suggestions panel visible
- Hover interactions enabled
- Complete tooltips display

### Tablet (768px - 1199px)
- Stacked layout (suggestions below form)
- Condensed dashboard cards (2x2 grid)
- Touch-optimized button sizes (44px min)
- Simplified tooltips

### Mobile (< 768px)
- Single column layout
- Collapsible suggestions panel
- Swipe gestures for navigation
- Bottom sheet modal for suggestions
- Touch-friendly spacing (8px minimum)

### Responsive Breakpoints

```scss
// Desktop
@media (min-width: 1200px) {
  .smart-suggestions-panel {
    position: sticky;
    top: 20px;
  }
}

// Tablet
@media (max-width: 1199px) and (min-width: 768px) {
  .smart-suggestions-panel {
    margin-top: 2rem;
    position: static;
  }
  
  .ai-dashboard-cards .row {
    --bs-gutter-x: 0.75rem;
  }
}

// Mobile
@media (max-width: 767px) {
  .suggestion-card .row {
    --bs-gutter-x: 0.5rem;
  }
  
  .metric-card {
    padding: 0.375rem;
  }
  
  .btn {
    min-height: 44px;
  }
}
```

---

## ♿ Accessibility Guidelines

### WCAG AA+ Compliance

#### Color Contrast Requirements
- Text on backgrounds: 4.5:1 minimum ratio
- Interactive elements: 3:1 minimum ratio
- Color-blind testing: All information accessible without color

#### Keyboard Navigation
```
Tab Order:
1. AI Mode Toggle
2. Form fields (sequential)
3. Smart suggestions (↑↓ arrows)
4. Action buttons
5. Modal elements (if open)

Keyboard Shortcuts:
- Enter: Select focused suggestion
- Escape: Close modals/tooltips
- Space: Toggle AI mode switch
```

#### Screen Reader Support

**Semantic HTML Structure**:
```html
<section aria-label="Smart Time Suggestions" role="region">
  <h2 id="suggestions-heading">AI-Powered Recommendations</h2>
  <ul role="list" aria-labelledby="suggestions-heading">
    <li role="listitem">
      <button aria-describedby="suggestion-1-details">
        10:30 AM Today - Score 95
      </button>
      <div id="suggestion-1-details" aria-live="polite">
        High confidence recommendation based on doctor availability
      </div>
    </li>
  </ul>
</section>
```

**ARIA Live Regions**:
```html
<!-- Status announcements -->
<div aria-live="assertive" aria-atomic="true" class="sr-only">
  Conflict detected: Doctor lunch break
</div>

<div aria-live="polite" aria-atomic="false">
  Smart suggestions updated: 3 new recommendations available
</div>
```

#### Focus Management
- Focus indicators: 2px solid primary color outline
- Focus trap in modals
- Skip links for complex suggestion lists
- Focus restoration after modal close

---

## 🔧 Technical Implementation

### CSS Custom Properties

```scss
:root {
  // AI Component Variables
  --ai-suggestion-padding: 1rem;
  --ai-suggestion-border-radius: 0.375rem;
  --ai-suggestion-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075);
  --ai-suggestion-shadow-hover: 0 0.25rem 0.5rem rgba(0,0,0,0.15);
  
  // Animation Timings
  --ai-transition-fast: 0.15s ease;
  --ai-transition-normal: 0.3s ease;
  --ai-transition-slow: 0.5s ease;
  
  // Z-Index Scale
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
}
```

### Component Base Classes

```scss
// Base AI Component
.ai-component {
  font-family: var(--font-family-base);
  transition: var(--ai-transition-normal);
  
  &:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
}

// Base Suggestion Card
.suggestion-card {
  @extend .ai-component;
  
  padding: var(--ai-suggestion-padding);
  border-radius: var(--ai-suggestion-border-radius);
  border: 1px solid var(--border-color);
  background: white;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--ai-suggestion-shadow-hover);
  }
  
  &.selected {
    background: var(--primary-transparent);
    border-left: 3px solid var(--primary);
  }
  
  &:focus {
    @extend :focus-visible;
  }
}

// Base Badge Styling
.badge-ai {
  font-size: 0.75rem;
  font-weight: var(--font-weight-medium);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  
  &.badge-ai-score {
    background: linear-gradient(135deg, var(--primary) 0%, var(--info) 100%);
    color: white;
  }
  
  &.badge-ai-confidence {
    background: linear-gradient(135deg, var(--success) 0%, var(--info) 100%);
    color: white;
  }
}
```

### Animation Keyframes

```scss
// Loading Animation
@keyframes ai-pulse {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.02);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

// Suggestion Appear
@keyframes suggestion-appear {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Confidence Fill
@keyframes confidence-fill {
  from {
    width: 0%;
  }
  to {
    width: var(--confidence-percent);
  }
}

// Usage
.ai-loading {
  animation: ai-pulse 2s infinite;
}

.suggestion-card {
  animation: suggestion-appear 0.3s ease-out;
}

.confidence-bar-fill {
  animation: confidence-fill 1s ease-out;
}
```

### State Management Patterns

```scss
// Loading States
.ai-component {
  &.loading {
    pointer-events: none;
    opacity: 0.7;
    
    .ai-content {
      filter: blur(1px);
    }
    
    .loading-indicator {
      display: block;
    }
  }
}

// Error States
.ai-component {
  &.error {
    border-color: var(--danger);
    background: var(--danger-transparent);
    
    .error-message {
      color: var(--danger);
      display: block;
    }
  }
}

// Success States
.ai-component {
  &.success {
    border-color: var(--success);
    
    .success-indicator {
      color: var(--success);
      display: inline-block;
    }
  }
}
```

---

## 📋 Component Usage Guidelines

### Do's ✅

1. **Maintain Visual Hierarchy**
   - Use established font scales
   - Respect spacing systems
   - Follow color patterns

2. **Provide Clear Feedback**
   - Show loading states during AI processing
   - Display confidence levels prominently
   - Explain AI reasoning in simple terms

3. **Ensure Accessibility**
   - Include proper ARIA labels
   - Test with screen readers
   - Maintain keyboard navigation

4. **Performance Optimization**
   - Debounce API calls (300ms)
   - Use lazy loading for heavy components
   - Implement proper error boundaries

### Don'ts ❌

1. **Don't Override Core Colors**
   - Stick to defined color palette
   - Don't create new color variables without approval
   - Maintain contrast ratios

2. **Don't Break Responsive Flow**
   - Don't use fixed pixel widths
   - Don't ignore mobile breakpoints
   - Don't assume screen sizes

3. **Don't Hide AI Functionality**
   - Always provide opt-out mechanisms
   - Don't force AI suggestions
   - Don't hide confidence levels

4. **Don't Ignore Loading States**
   - Always show feedback during processing
   - Don't leave users guessing
   - Don't skip error handling

---

## 🧪 Testing Checklist

### Visual Testing

- [ ] Components match design specifications exactly
- [ ] Color contrast meets WCAG AA standards
- [ ] Typography scales properly across devices
- [ ] Spacing follows established patterns
- [ ] Hover states work correctly
- [ ] Focus indicators are visible

### Functional Testing

- [ ] AI toggle switches modes correctly
- [ ] Suggestions update when form changes
- [ ] Conflict detection works in real-time
- [ ] Calendar interactions trigger suggestions
- [ ] Form auto-fills from suggestions
- [ ] Loading states display appropriately

### Accessibility Testing

- [ ] Screen reader announces all content
- [ ] Keyboard navigation works completely
- [ ] Focus management is logical
- [ ] ARIA labels are descriptive
- [ ] Color-blind users can distinguish states
- [ ] Voice control compatibility

### Responsive Testing

- [ ] Layout adapts to all screen sizes
- [ ] Touch targets meet size requirements (44px)
- [ ] Content remains readable at all zooms
- [ ] Horizontal scrolling is avoided
- [ ] Performance is acceptable on mobile

---

## 📚 Reference Materials

### Design Resources
- Figma Component Library: [Link to Figma]
- Icon Library: Tabler Icons
- Color Palette Generator: [Coolors.co](https://coolors.co)
- Accessibility Checker: [WAVE](https://wave.webaim.org)

### Development Resources
- Component Storybook: [Link to Storybook]
- CSS Documentation: [MDN Web Docs](https://developer.mozilla.org)
- React Patterns: [React Patterns](https://reactpatterns.com)
- TypeScript Handbook: [TypeScript Docs](https://www.typescriptlang.org/docs)

### Testing Tools
- Jest + React Testing Library
- Cypress for E2E testing
- axe-core for accessibility testing
- Lighthouse for performance testing

---

*This design system documentation ensures consistent implementation of Smart Scheduling components while maintaining the integrity of the existing healthcare platform design system.*
