# AI Inbox Triage - Responsive Design Specifications

## Overview

This document outlines the comprehensive responsive design specifications and interaction states for the AI Inbox Triage feature. All components are designed to work seamlessly across desktop, tablet, and mobile devices while maintaining accessibility and usability standards.

## Breakpoint Strategy

### Breakpoint Definitions
```scss
// Breakpoints used throughout the AI Triage system
$breakpoint-xs: 576px;   // Extra small devices (portrait phones)
$breakpoint-sm: 768px;   // Small devices (landscape phones)
$breakpoint-md: 992px;   // Medium devices (tablets)
$breakpoint-lg: 1200px;  // Large devices (desktops)
$breakpoint-xl: 1400px;  // Extra large devices (large desktops)
```

### Design Philosophy
- **Mobile-First Approach**: All components start with mobile-optimized layouts
- **Progressive Enhancement**: Features and complexity increase with screen size
- **Content Priority**: Critical information remains accessible at all breakpoints
- **Touch-Friendly**: Minimum 44px touch targets on mobile devices
- **Readable Typography**: Font sizes and line heights optimized for each device type

## Component Responsive Specifications

### 1. AI Inbox Triage Dashboard

#### Desktop (≥992px)
- **Layout**: 3-column layout with sidebar, main content, and details panel
- **Metrics Cards**: 4 cards per row with full statistics
- **Priority Distribution**: Horizontal progress bars with percentages
- **Filter Controls**: Full 6-column filter row with all options visible
- **Notification Cards**: Expanded cards with full metadata and actions

#### Tablet (768px - 991px)
- **Layout**: 2-column layout with collapsible sidebar
- **Metrics Cards**: 2 cards per row, stacked in pairs
- **Priority Distribution**: Compact progress bars, 2 per row
- **Filter Controls**: 3-column filter layout with some controls stacked
- **Notification Cards**: Condensed cards with essential information

#### Mobile (≤767px)
- **Layout**: Single-column stacked layout
- **Metrics Cards**: 1 card per row, full width
- **Priority Distribution**: Vertical stacked progress indicators
- **Filter Controls**: Single-column stacked filters with collapsible advanced options
- **Notification Cards**: Minimized cards with swipe actions

```scss
// Example responsive implementation
.ai-inbox-triage {
  .triage-metrics {
    @media (max-width: 992px) {
      .row .col-xl-3 {
        margin-bottom: 1rem;
      }
    }
  }
  
  .triage-filters {
    @media (max-width: 768px) {
      .row {
        .col-md-2, .col-md-4 {
          margin-bottom: 1rem;
        }
      }
    }
  }
}
```

### 2. Message Detail View

#### Desktop Features
- **Full Width Layout**: Tabs with complete content areas
- **AI Analysis**: Side-by-side comparison panels
- **Timeline**: Horizontal timeline with detailed timestamps
- **Related Messages**: Grid layout with previews

#### Tablet Adaptations
- **Stacked Layout**: Tabs remain but content stacks vertically
- **Condensed Analysis**: Single-column AI analysis panels
- **Simplified Timeline**: Vertical timeline with condensed information
- **List View**: Related messages in simple list format

#### Mobile Optimizations
- **Tab Icons**: Text labels converted to icons for space
- **Swipe Navigation**: Touch gestures for tab switching
- **Collapsed Sections**: Expandable content sections
- **Bottom Actions**: Fixed action bar for primary buttons

```scss
.ai-message-detail-view {
  @media (max-width: 768px) {
    .detail-header {
      .d-flex.align-items-center {
        flex-direction: column;
        align-items: flex-start !important;
        gap: 1rem;
      }
    }
    
    .ant-tabs {
      .ant-tabs-nav .ant-tabs-tab {
        flex: 1;
        text-align: center;
        font-size: 0.8rem;
        
        i {
          display: block;
          margin-bottom: 0.25rem;
        }
      }
    }
  }
}
```

### 3. Filter Controls

#### Responsive Behavior
- **Desktop**: All filters visible in single row
- **Tablet**: Filters wrap to multiple rows
- **Mobile**: Vertical stacking with collapsible advanced options

#### Interaction States
- **Hover**: Subtle color changes and elevation
- **Active**: Clear visual indication of selected filters
- **Focus**: Keyboard navigation support with visible focus rings
- **Loading**: Spinner states for async operations

```scss
.ai-filter-controls {
  @media (max-width: 768px) {
    .filter-presets {
      .input-group {
        width: 100% !important;
      }
    }
    
    .active-filters .d-flex {
      flex-direction: column;
      gap: 0.5rem;
      align-items: flex-start;
    }
  }
  
  // Interaction states
  .btn {
    transition: all 0.2s ease;
    
    &:hover {
      transform: translateY(-1px);
    }
    
    &:focus {
      outline: 2px solid #0d6efd;
      outline-offset: 2px;
    }
    
    &:active {
      transform: translateY(0);
    }
  }
}
```

### 4. Visual Flags System

#### Size Adaptations
- **Large Screens**: Full labels with icons
- **Medium Screens**: Icons with tooltips
- **Small Screens**: Compact icons only

#### Responsive Flag Display
```scss
.ai-visual-flags {
  &.flags-small {
    .flag-icon {
      padding: 0.125rem 0.25rem;
      
      i { font-size: 0.75rem; }
      .flag-label { font-size: 0.7rem; }
    }
  }
  
  @media (max-width: 768px) {
    &:not(.flags-compact) {
      .flag-icon .flag-label {
        display: none;
      }
    }
  }
  
  @media (max-width: 576px) {
    .flag-icons {
      flex-wrap: wrap;
      gap: 0.25rem;
    }
  }
}
```

### 5. Settings Panel

#### Responsive Layout Strategy
- **Desktop**: Side-by-side tab content with detailed forms
- **Tablet**: Stacked content with collapsible sections
- **Mobile**: Single-column with accordion-style sections

```scss
.ai-triage-settings {
  @media (max-width: 992px) {
    .settings-content {
      .tab-content .row {
        .col-lg-6, .col-lg-8, .col-lg-4 {
          margin-bottom: 1rem;
        }
      }
    }
  }
  
  @media (max-width: 768px) {
    .setting-item {
      flex-direction: column;
      align-items: flex-start !important;
      gap: 0.5rem;
      
      .ant-switch {
        align-self: flex-end;
      }
    }
  }
}
```

## Interaction States Specification

### 1. Button States

#### Primary Buttons
```scss
.btn-primary {
  // Default state
  background: #0d6efd;
  border: 1px solid #0d6efd;
  color: white;
  
  // Hover state
  &:hover {
    background: #0b5ed7;
    border-color: #0a58ca;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(13, 110, 253, 0.3);
  }
  
  // Active/Pressed state
  &:active {
    background: #0a58ca;
    border-color: #0a53be;
    transform: translateY(0);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  // Focus state (keyboard navigation)
  &:focus {
    outline: 2px solid #86b7fe;
    outline-offset: 2px;
  }
  
  // Disabled state
  &:disabled {
    background: #6c757d;
    border-color: #6c757d;
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  // Loading state
  &.loading {
    position: relative;
    pointer-events: none;
    
    &::after {
      content: "";
      position: absolute;
      inset: 0;
      background: rgba(255, 255, 255, 0.2);
      border-radius: inherit;
    }
  }
}
```

#### Secondary Buttons
```scss
.btn-outline-primary {
  background: transparent;
  border: 1px solid #0d6efd;
  color: #0d6efd;
  
  &:hover {
    background: #0d6efd;
    color: white;
    transform: translateY(-1px);
  }
  
  &:active {
    background: #0b5ed7;
    border-color: #0a58ca;
    transform: translateY(0);
  }
}
```

### 2. Card States

#### Notification Cards
```scss
.triage-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  
  // Default state
  background: white;
  border: 1px solid #e9ecef;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  // Hover state
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    border-color: #0d6efd;
  }
  
  // Selected state
  &.selected {
    border-color: #0d6efd;
    background: #f8f9ff;
    box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
  }
  
  // Unread state
  &.unread {
    border-left: 4px solid #0d6efd;
    background: linear-gradient(135deg, #fff 0%, #f8f9ff 100%);
  }
  
  // Priority states
  &.priority-critical {
    border-left-color: #dc3545;
    background: linear-gradient(135deg, #fff 0%, #fff5f5 100%);
  }
  
  &.priority-urgent {
    border-left-color: #ffc107;
    background: linear-gradient(135deg, #fff 0%, #fffdf5 100%);
  }
}
```

### 3. Form Element States

#### Input Fields
```scss
.form-control {
  transition: all 0.2s ease;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  
  // Focus state
  &:focus {
    border-color: #0d6efd;
    box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
    outline: 0;
  }
  
  // Error state
  &.is-invalid {
    border-color: #dc3545;
    
    &:focus {
      border-color: #dc3545;
      box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
    }
  }
  
  // Success state
  &.is-valid {
    border-color: #198754;
    
    &:focus {
      border-color: #198754;
      box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.25);
    }
  }
  
  // Disabled state
  &:disabled {
    background-color: #f8f9fa;
    opacity: 0.6;
    cursor: not-allowed;
  }
}
```

#### Switches and Checkboxes
```scss
.ant-switch {
  // Default state
  background-color: #dee2e6;
  
  // Checked state
  &.ant-switch-checked {
    background-color: #0d6efd;
  }
  
  // Hover state
  &:hover:not(.ant-switch-disabled) {
    background-color: #495057;
  }
  
  // Focus state
  &:focus {
    outline: 2px solid #86b7fe;
    outline-offset: 2px;
  }
  
  // Disabled state
  &.ant-switch-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
```

### 4. Loading States

#### Skeleton Loading
```scss
.loading-skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

#### Spinner States
```scss
.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #0d6efd;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

## Accessibility Specifications

### 1. Keyboard Navigation
- **Tab Order**: Logical sequence through interactive elements
- **Focus Indicators**: Visible focus rings with 2px solid outline
- **Skip Links**: Allow users to bypass repetitive navigation
- **Keyboard Shortcuts**: Common shortcuts for frequent actions

### 2. Screen Reader Support
- **ARIA Labels**: Descriptive labels for all interactive elements
- **Role Attributes**: Proper semantic roles for complex widgets
- **Live Regions**: Dynamic content updates announced to screen readers
- **Alt Text**: Meaningful descriptions for all images and icons

### 3. Color and Contrast
- **WCAG AA Compliance**: Minimum 4.5:1 contrast ratio for normal text
- **Color Independence**: Information not conveyed by color alone
- **High Contrast Mode**: Support for system high contrast preferences
- **Dark Mode**: Complete dark theme implementation

```scss
// High contrast mode support
@media (prefers-contrast: high) {
  .triage-card {
    border: 2px solid #000;
    
    &.unread {
      border-left: 6px solid #0000ff;
    }
  }
  
  .btn {
    border: 2px solid currentColor;
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Touch and Gesture Support

### 1. Touch Targets
- **Minimum Size**: 44px × 44px for all interactive elements
- **Spacing**: Minimum 8px between adjacent touch targets
- **Visual Feedback**: Clear pressed states for touch interactions

### 2. Gesture Support
- **Swipe Actions**: Left/right swipe for common actions on cards
- **Pull to Refresh**: Standard pull-to-refresh behavior on lists
- **Pinch to Zoom**: Support for text scaling and content zoom
- **Long Press**: Context menus and additional options

```scss
// Touch-friendly sizing
@media (max-width: 768px) {
  .btn {
    min-height: 44px;
    min-width: 44px;
    padding: 0.75rem 1rem;
  }
  
  .form-control {
    min-height: 44px;
    font-size: 16px; // Prevents zoom on iOS
  }
  
  .notification-item {
    padding: 1rem;
    margin-bottom: 0.5rem;
  }
}
```

## Performance Considerations

### 1. Lazy Loading
- **Images**: Progressive loading for notification avatars
- **Components**: Code splitting for non-critical components
- **Data**: Infinite scroll with virtual scrolling for large lists

### 2. Animation Performance
- **GPU Acceleration**: Use transform and opacity for animations
- **Reduced Motion**: Respect user's motion preferences
- **Frame Rate**: Target 60fps for smooth interactions

### 3. Network Optimization
- **Critical CSS**: Inline critical styles for above-the-fold content
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Offline Support**: Basic functionality available offline

## Testing Specifications

### 1. Responsive Testing
- **Device Testing**: Physical testing on representative devices
- **Browser Testing**: Cross-browser compatibility verification
- **Orientation Changes**: Proper handling of portrait/landscape switches

### 2. Accessibility Testing
- **Screen Reader Testing**: NVDA, JAWS, VoiceOver compatibility
- **Keyboard Testing**: Complete functionality via keyboard alone
- **Color Blindness**: Testing with color vision simulators

### 3. Performance Testing
- **Load Times**: Target <3s initial load on 3G networks
- **Interaction Response**: <100ms response to user interactions
- **Animation Performance**: Maintain 60fps during animations

## Implementation Guidelines

### 1. CSS-in-JS vs SCSS
```scss
// Preferred SCSS approach for responsive design
.component {
  // Mobile-first base styles
  padding: 1rem;
  font-size: 0.875rem;
  
  // Tablet enhancements
  @media (min-width: 768px) {
    padding: 1.5rem;
    font-size: 1rem;
  }
  
  // Desktop optimizations
  @media (min-width: 992px) {
    padding: 2rem;
    font-size: 1.125rem;
  }
}
```

### 2. Component Design Patterns
```tsx
// Responsive component example
const ResponsiveComponent: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return (
    <div className={`component ${isMobile ? 'mobile' : 'desktop'}`}>
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
    </div>
  );
};
```

### 3. Utility Classes
```scss
// Responsive utility classes
.d-mobile-none { @media (max-width: 767px) { display: none !important; } }
.d-tablet-none { @media (min-width: 768px) and (max-width: 991px) { display: none !important; } }
.d-desktop-none { @media (min-width: 992px) { display: none !important; } }

.text-mobile-center { @media (max-width: 767px) { text-align: center !important; } }
.p-mobile-1 { @media (max-width: 767px) { padding: 0.25rem !important; } }
.m-mobile-0 { @media (max-width: 767px) { margin: 0 !important; } }
```

This comprehensive responsive design specification ensures that the AI Inbox Triage feature provides an optimal user experience across all devices and interaction methods while maintaining accessibility and performance standards.
