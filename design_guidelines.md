# Educational Class Management Platform - Design Guidelines

## Design Approach

**System-Based Approach:** Drawing from Material Design and modern SaaS platforms (Google Classroom, Calendly, Linear) to create a clean, functional interface that prioritizes usability while maintaining visual appeal.

**Core Philosophy:** Clear information hierarchy, efficient workflows, and purposeful use of space to balance professionalism with approachability.

---

## Typography System

**Font Family:** Inter (primary), Plus Jakarta Sans (headings)

**Hierarchy:**
- Hero Headline: 3.5rem (56px), bold, tight leading
- Page Titles: 2.5rem (40px), semibold
- Section Headers: 1.875rem (30px), semibold
- Card Titles: 1.25rem (20px), medium
- Body Text: 1rem (16px), regular
- Captions/Metadata: 0.875rem (14px), medium

---

## Layout System

**Spacing Scale:** Tailwind units of 2, 4, 6, 8, 12, 16, 24
- Component padding: p-6 to p-8
- Section spacing: py-16 to py-24
- Card gaps: gap-6
- Form field spacing: space-y-4

**Container Strategy:**
- Dashboard/App: max-w-7xl with px-6
- Forms: max-w-2xl centered
- Cards: Variable widths in grid layouts

---

## Component Library

### Navigation
**Top Navigation Bar:** Fixed header with platform logo, search bar (center), notifications bell, profile dropdown. Height: 64px, backdrop blur on scroll.

**Sidebar Navigation (Dashboard):** Collapsible 240px width. Icons + labels for: Dashboard, My Classes, Calendar, Students, Analytics, Settings. Active state with accent indicator.

### Hero Section (Landing)
**Layout:** Full-width container with 2-column split (60/40)
- Left: Headline, subtitle (2-3 lines), dual CTA buttons (primary + secondary), trust indicators (user count, rating stars)
- Right: Large hero image (see Images section)
- Height: 85vh, background with subtle gradient overlay

### Dashboard Cards
**Class Card:** Elevated cards with sharp corners (rounded-lg), includes class thumbnail/icon, title, time, student count badge, instructor name, quick action buttons
- Grid: 3 columns desktop, 2 tablet, 1 mobile
- Shadow: soft elevation on hover

**Schedule Calendar:** Week/month view with time slots, color-coded class blocks, drag-to-reschedule capability visual indicator
- Full-width on desktop, scrollable on mobile

### Forms
**Class Creation/Edit:** Multi-step wizard with progress indicator
- Fields: Title, description textarea, date/time pickers, duration selector, enrollment limit
- All inputs with floating labels, clear validation states
- Actions: Save draft + Publish buttons

**Student Enrollment:** Modal overlay with search/filter, student list with checkboxes, bulk actions toolbar

### Data Displays
**Upcoming Classes List:** Compact cards with left-aligned time, class info, attendance count, join button
**Analytics Dashboard:** Stat cards (4-column grid) showing total classes, active students, completion rate, upcoming sessions

### Overlays
**Modals:** Centered, max-w-2xl, backdrop blur with 50% opacity dark overlay
**Notifications:** Top-right toast stack, auto-dismiss in 5s
**Confirmation Dialogs:** Compact, centered, clear action hierarchy

---

## Images

### Hero Image
**Placement:** Right column of hero section, 40% width
**Description:** Bright, modern classroom scene or diverse students engaged in video call on laptop/tablet. Clean, professional photography with warm lighting. Image should show clear faces, modern devices, collaborative energy. Alternatively: 3D illustration of calendar/scheduling interface with floating UI elements.
**Treatment:** Subtle rounded corners (rounded-2xl), no heavy filters

### Class Card Thumbnails
**Description:** Subject-specific icons or abstract patterns (math symbols, language icons, science imagery) in accent colors. Can use gradient backgrounds with centered icon.
**Size:** 16:9 aspect ratio thumbnail at card top

### Dashboard Illustrations
**Empty States:** Friendly spot illustrations for "No classes scheduled" or "No students enrolled" - minimalist line art style
**Onboarding:** Step-by-step guide illustrations showing platform features

---

## Buttons & Interactions

**Primary CTA:** Solid background, medium padding (px-6 py-3), medium font weight, rounded corners
**Secondary:** Outlined variant with border
**Hero CTAs:** Glass-morphism effect (backdrop-blur + semi-transparent bg) when placed on hero image, no hover color changes

**Interactive States:** Subtle scale on hover for cards (scale-102), smooth transitions (150ms), clear focus rings for accessibility

---

## Key Screens Structure

**Landing Page (5 sections):**
1. Hero with image
2. Features grid (3 columns: Scheduling, Enrollment, Analytics)
3. How It Works (3-step visual process)
4. Testimonials (2-column cards with user photos)
5. CTA section with signup form

**Dashboard:**
- Top nav + sidebar
- Main content: Upcoming classes section + Quick stats grid + Recent activity feed
- 3-column layout on desktop

**Class Management:**
- Header with class title + action buttons
- Tabs: Overview, Schedule, Students, Materials
- Content area with relevant forms/lists per tab