# Study Progress Tracker – 2nd Secondary (خطة مذاكرتي)

A professional, high-performance study management system designed specifically for 2nd Secondary (الصف الثاني الثانوي) students, featuring a calm academic visual identity, complete syllabus tracking with zero data loss, interactive progress analytics, intelligent daily pacing, and offline single-file HTML export.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The architectural and design decisions below incorporate the clarifications confirmed by the student:

- **Confirmed Aesthetic**: Calm Academic (رمادي داكن كحلي مع لمسات بنفسجية نيلية وأخضر زمردي للإنجاز) with high-contrast typography, RTL Arabic layout, and clean cards.
- **Confirmed Daily Plan Engine**: Flexible daily goal setting (تحديد عدد الدروس اليومية يدويًا) backed by smart pacing recommendations based on remaining days to the target deadline (1 January 2027).
- **Confirmed Export & Offline Capability**: Dedicated one-click generator to download the entire self-contained, offline-executable single `HTML` file, alongside complete JSON backup and restore functions.
- **Data Fidelity Guarantee**: 100% preservation of all original curriculum entries (Arabic: 3 units + Literature books; Mathematics: Algebraic Proofs, Sequences, Geometry & Equations with 71 total lessons; History: National Liberation Movements and Egypt's Regional Role).

---

### 1. Overview & Core Concept

- **What It Does**: A complete personal study operating system tailored for Egyptian/Arab curriculum 2nd Secondary students. It tracks every subject, book, unit, and lesson; calculates real-time completion velocity and remaining daily targets; visualizes mastery curves; provides a focused daily study queue with a built-in Pomodoro focus timer; and allows full CRUD management (adding, editing, deleting subjects, books, units, lessons).
- **Target Audience**: Secondary school students preparing for mid-term and final examinations who need structured pacing, accountability, and offline portability without requiring account logins or external databases.
- **Key Value**: Replaces disorganized paper checklists and rigid spreadsheets with an interactive, beautiful RTL dashboard that adapts dynamically to the student's actual study rate and target end dates.

---

### 2. User Experience & Visual Design

#### Navigation & 5 Core Views

```
┌────────────────────────────────────────────────────────────────────────┐
│  Top Bar: [خطة مذاكرتي · تانية بكالوريا]   [Tabs: 5 Views]   [تحميل HTML]│
└────────────────────────────────────────────────────────────────────────┘
```

1. **Dashboard (لوحة التحكم الرئيسية)**:
   - Key metric cards: Total Lessons (إجمالي الدروس), Completed (المكتملة), Completion Rate (نسبة الإنجاز), Days Left to Target (الأيام المتبقية).
   - Milestone timeline bar with start date (1 Sept 2026), current date, and completion deadline (1 Jan 2027).
   - Real-time study velocity tracker (Average lessons needed per day).
   - Quick "Resume Study" card highlighting today's priority lessons with one-click completion toggles.
   - Motivational streak and milestone indicators (e.g. 25%, 50%, 75%, 100%).

2. **Subjects & Curriculum Explorer (المواد والدروس)**:
   - Hierarchical accordion and tree explorer: Subject $\rightarrow$ Book $\rightarrow$ Unit $\rightarrow$ Lesson.
   - Live search input filtering across subjects, units, and lesson titles.
   - Status filters (All, Completed, Incomplete).
   - Granular management: Add new subject, add book, add unit, add lesson, edit titles, and delete items with confirmation.
   - Inline progress bar and lesson count per subject and unit.

3. **Daily Plan & Focus Workspace (خطة اليوم وجلسة التركيز)**:
   - Dynamic daily lesson allocation based on the user's manual target (or smart recommended pacing).
   - Interactive checklist with strike-through and celebration feedback upon completion.
   - Integrated Study Pomodoro Timer (25 min study / 5 min break) with audio chime and start/pause/reset controls.
   - "Add Extra Lesson to Today" quick-picker.

4. **Progress Analysis (تحليل التقدم والرسوم البيانية)**:
   - Subject-by-subject completion comparison bars (e.g. Arabic vs Mathematics vs History).
   - Visual breakdown chart showing completed vs remaining distribution.
   - Projected completion forecast: shows whether the current velocity meets the 1 January deadline.
   - Subject detail inspection with completion breakdown per unit.

5. **Settings & Data Management (الإعدادات والنسخ الاحتياطي)**:
   - Study plan timeline configuration (Start Date and Target End Date with live recalculation).
   - One-Click "Download Standalone HTML File" (تحميل ملف HTML مستقل وشامل للكمبيوتر والموبايل) that packages the entire app, state, and styles into a standalone file runnable offline in any browser.
   - Full JSON Export and Import (backup study history and restore on any device).
   - Reset database button with safety confirmation dialog.

#### Visual Identity & Design System

- **Direction**: Calm Academic (`#0F172A` Slate Canvas, `#1E293B` Surface cards, `#6366F1` Indigo primary accents, `#10B981` Emerald completion cues, `#F59E0B` Amber warnings).
- **Typography**: Modern Arabic typography (`Tajawal` / `Cairo` / system font stack with fallback to `Tahoma, Arial, sans-serif`), balanced line-heights, and tabular numbers (`tabular-nums`) for all metrics and counters.
- **Zero-Pill Discipline**: Metadata rendered with typographic dividers (`·`), clear card borders (`border border-slate-700/60`), and no unnecessary decorative badges.
- **RTL & Responsiveness**: Native `dir="rtl"` layout, responsive 4-column metric grid on desktop collapsing to 2-column and 1-column on tablets and phones, touch targets $\ge 44\text{px}$.

---

### 3. Key Product Decisions & Trade-Offs

- **Storage & State Strategy**:
  - *Chosen Approach*: `localStorage` with a unified schema (`studyPlanV2`, `studyDatesV2`, `studySettingsV2`), combined with seamless migration from the user's existing `studyPlanV1` so no historical progress is lost.
  - *Why*: Immediate persistence without network dependencies, guarantees 100% offline functionality.
- **Dual-Delivery Model**:
  - *Chosen Approach*: Modern responsive web application running in Vite with React + Tailwind + Lucide, paired with a dedicated client-side standalone HTML bundler/exporter.
  - *Why*: Gives the user a fast, reactive UI in the live preview while fulfilling the explicit requirement: *"سلّمني ملف HTML جاهزًا للتحميل والتشغيل مباشرة على الكمبيوتر"*.
- **Pacing Engine**:
  - *Chosen Approach*: Smart dynamic divisor ($\text{Remaining Lessons} \div \text{Days Left}$) presented as a recommendation, while giving the student a manual slider/number stepper to choose their preferred daily quota for the day.
  - *Why*: Matches the user's explicit preference for manual control with intelligent guidance.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        App Root (dir="rtl")                            │
├────────────────────────────────────────────────────────────────────────┤
│  Top Navigation Bar: Brand · 5 Tab Buttons · Standalone HTML Export    │
├────────────────────────────────────────────────────────────────────────┤
│  Active View Router:                                                   │
│    ├── 1. Dashboard View (Overview KPIs · Velocity · Quick Actions)    │
│    ├── 2. Subjects View (Curriculum Tree · Add/Edit/Delete · Search)   │
│    ├── 3. Daily Plan View (Quota Stepper · Focus Timer · Checklist)   │
│    ├── 4. Analysis View (SVG Bar Charts · Progress Projections)        │
│    └── 5. Settings View (Date Ranges · JSON Backup/Restore · Reset)    │
├────────────────────────────────────────────────────────────────────────┤
│  State & Persistence Layer:                                            │
│    ├── LocalStorage (studyPlanV2, studyDatesV2, dailyTarget)           │
│    ├── Legacy Migrator (auto-imports studyPlanV1 and studyDates)       │
│    └── HTML Bundler (generates self-contained downloadable .html)      │
└────────────────────────────────────────────────────────────────────────┘
```

#### Data Model

```typescript
interface Lesson {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

interface Unit {
  id: string;
  name: string;
  lessons: Lesson[];
}

interface Book {
  id: string;
  name: string;
  units: Unit[];
}

interface Subject {
  id: string;
  name: string;
  color?: string;
  books: Book[];
}

interface StudyDates {
  start: string; // "2026-09-01"
  end: string;   // "2027-01-01"
}
```

---

### 5. Verification & Testing Plan

1. **Data Integrity Check**: Verify all 71 math lessons, 22 Arabic lessons + 5 literature works, and 4 history lessons are present and intact upon first load.
2. **CRUD Operations**: Test adding, editing, and deleting subjects, books, units, and individual lessons.
3. **Pacing Calculations**: Test dynamic calculation of remaining days, total vs completed counts, and daily required quotas across various dates.
4. **Interactive Focus Timer**: Verify start, pause, reset, and audio notifications.
5. **JSON Backup & Restore**: Verify exporting JSON, modifying state, and restoring state cleanly.
6. **Offline HTML File Generation**: Verify clicking "تنزيل ملف HTML" downloads a valid single-file `.html` containing all HTML, CSS, JavaScript, and user data ready to double-click and run in Chrome, Safari, Edge, or mobile browsers.
7. **Compilation & Linting**: Run `compile_applet` and `lint_applet` to ensure zero syntax or type errors.
