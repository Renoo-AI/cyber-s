# Enterprise Visual Identity Deployment

## Overview
This directory contains the High-Fidelity Enterprise Simulation assets for challenges 21-80.

## Core Stylesheets

### `enterprise-base.css`
- **Purpose**: Corporate Neutral palette for realistic enterprise interfaces
- **Usage**: Link in all Level 21+ challenge HTML files
- **Key Features**:
  - GPU stabilization (`transform: translateZ(0)`, `backface-visibility: hidden`)
  - Explicit `background-color: #f9fafb` to prevent palette bleeding
  - Inter/System-UI fonts for professional typography
  - Subtle borders, shadows, and transitions

### `tactical-overlay.css`
- **Purpose**: Byte's minimalist tactical HUD for hints/intel briefings
- **Usage**: Optional link for challenges with Byte assistance
- **Key Features**:
  - Translucent backdrop with blur effect
  - Terminal-style intel briefings
  - Minimize/close controls
  - Responsive positioning

## Updated Challenges

### Challenge 21 - IDOR Vulnerability
- **File**: `21/index.html`
- **Style**: Enterprise user settings panel
- **Features**: Data tables, form grids, security badges
- **Byte Overlay**: No (direct hint in UI)

### Challenge 25 - Referer Header Validation  
- **File**: `25/index.html`
- **Style**: Security gateway interface
- **Features**: Status panels, verification steps, access banners
- **Byte Overlay**: Yes (intel briefing on header spoofing)

### Challenge 30 - SQL Injection
- **File**: `30/index.html`
- **Style**: Internal user database search
- **Features**: User cards, search panel, injection detection
- **Byte Overlay**: Yes (tactical approach hints)

## Implementation Checklist

For each challenge 21-80:

1. [ ] Link `enterprise-base.css` from parent directory
2. [ ] Link `tactical-overlay.css` if Byte hints needed
3. [ ] Remove old `style.css` file
4. [ ] Update HTML structure to use enterprise components:
   - `.card` containers
   - `.btn-primary` / `.btn-secondary` buttons
   - `.alert-info` / `.alert-success` / `.alert-danger` alerts
   - `.badge` components for status
   - `.data-table` for tabular data
5. [ ] Add Byte tactical overlay if hints required
6. [ ] Ensure explicit background colors prevent inheritance issues
7. [ ] Test in iframe for GPU stabilization

## Palette Reference

```css
--corp-white: #ffffff
--corp-gray-50: #f9fafb
--corp-gray-100: #f3f4f6
--corp-gray-200: #e5e7eb
--corp-gray-700: #374151
--corp-gray-900: #111827
--corp-primary: #2563eb
--corp-success: #059669
--corp-warning: #d97706
--corp-danger: #dc2626
```

## Font Stack

```css
font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

## Production Build Notes

- Ensure `dist/app/browser` copies updated challenge files
- Verify CSS is not minified in a way that breaks GPU hints
- Test iframe embedding for flicker/palette issues
- Confirm Byte overlay z-index doesn't conflict with host app
