import { Subject, StudyDates, StudySettings, StudentProfile, RewardItem } from '../types';
import {
  DEFAULT_PROFILE,
  INITIAL_REWARDS,
  MOTIVATION_QUOTES,
  EGYPTIAN_MEME_AVATARS,
  EGYPTIAN_JOY_MEMES,
} from '../data/motivationAndRewards';

export function generateStandaloneHtml(
  subjects: Subject[],
  dates: StudyDates,
  settings: StudySettings,
  profile?: StudentProfile,
  rewards?: RewardItem[]
): string {
  const currentProfile = profile || DEFAULT_PROFILE;
  const currentRewards = rewards || INITIAL_REWARDS;

  const jsonSubjects = JSON.stringify(subjects).replace(/<\/script>/gi, '<\\/script>');
  const jsonDates = JSON.stringify(dates).replace(/<\/script>/gi, '<\\/script>');
  const jsonSettings = JSON.stringify(settings).replace(/<\/script>/gi, '<\\/script>');
  const jsonProfile = JSON.stringify(currentProfile).replace(/<\/script>/gi, '<\\/script>');
  const jsonRewards = JSON.stringify(currentRewards).replace(/<\/script>/gi, '<\\/script>');
  const jsonQuotes = JSON.stringify(MOTIVATION_QUOTES).replace(/<\/script>/gi, '<\\/script>');
  const jsonMemes = JSON.stringify(EGYPTIAN_MEME_AVATARS).replace(/<\/script>/gi, '<\\/script>');
  const jsonJoyMemes = JSON.stringify(EGYPTIAN_JOY_MEMES).replace(/<\/script>/gi, '<\\/script>');

  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>خطة مذاكرتي | تانية بكالوريا – Study Progress Tracker</title>
  <meta name="description" content="نظام احترافي لمتابعة وإدارة المذاكرة لطلاب الصف الثاني الثانوي مع تحليلات الإنجاز ومتابعة النواقص والتارجت والمكافآت" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0b0f19;
      --card: #151d30;
      --card-hover: #1c263f;
      --border: #243250;
      --border-subtle: #1e2942;
      --text: #f1f5f9;
      --text-muted: #94a3b8;
      --text-dim: #64748b;
      --primary: #6366f1;
      --primary-hover: #4f46e5;
      --primary-soft: rgba(99, 102, 241, 0.15);
      --book1-color: #6366f1;
      --book2-color: #10b981;
      --success: #10b981;
      --success-soft: rgba(16, 185, 129, 0.15);
      --warning: #f59e0b;
      --warning-soft: rgba(245, 158, 11, 0.15);
      --danger: #ef4444;
      --danger-soft: rgba(239, 68, 68, 0.15);
      --radius: 16px;
    }

    body.theme-navy {
      --bg: #0b0f19;
      --card: #151d30;
      --card-hover: #1c263f;
      --border: #243250;
      --primary: #6366f1;
    }
    body.theme-emerald {
      --bg: #07130e;
      --card: #0d2119;
      --card-hover: #132d22;
      --border: #1a3f30;
      --primary: #10b981;
    }
    body.theme-indigo {
      --bg: #0d0d1e;
      --card: #14122d;
      --card-hover: #1c193f;
      --border: #292454;
      --primary: #8b5cf6;
    }
    body.theme-charcoal {
      --bg: #121214;
      --card: #1c1c21;
      --card-hover: #26262c;
      --border: #33333c;
      --primary: #f59e0b;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: 'Cairo', Tahoma, Arial, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      line-height: 1.6;
      transition: background-color 0.3s ease;
    }
    header {
      background: rgba(15, 23, 42, 0.95);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(12px);
    }
    .header-inner {
      max-width: 1240px;
      margin: 0 auto;
      padding: 12px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: var(--text);
    }
    .brand-avatar {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      border: 2px solid var(--primary);
      object-fit: cover;
      cursor: pointer;
      background: #020617;
    }
    .brand-text h1 { font-size: 16px; font-weight: 800; color: #fff; line-height: 1.2; }
    .brand-text p { font-size: 11px; color: var(--text-muted); }
    .nav-tabs {
      display: flex;
      gap: 4px;
      background: rgba(15, 23, 42, 0.8);
      padding: 4px;
      border-radius: 12px;
      border: 1px solid var(--border);
      overflow-x: auto;
    }
    .nav-tabs button {
      background: transparent;
      border: 0;
      color: var(--text-muted);
      padding: 7px 12px;
      font-size: 12px;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
      font-family: inherit;
    }
    .nav-tabs button:hover { color: var(--text); background: rgba(255, 255, 255, 0.05); }
    .nav-tabs button.active {
      background: var(--primary);
      color: #fff;
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
    }
    .theme-palette {
      display: flex;
      gap: 6px;
      align-items: center;
      background: rgba(0,0,0,0.4);
      padding: 4px 8px;
      border-radius: 10px;
      border: 1px solid var(--border);
    }
    .theme-circle {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      cursor: pointer;
      border: 2px solid rgba(255,255,255,0.2);
      transition: transform 0.2s;
    }
    .theme-circle:hover { transform: scale(1.15); border-color: #fff; }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      font-size: 12px;
      font-weight: 700;
      border-radius: 10px;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.2s;
      font-family: inherit;
    }
    .btn-primary { background: var(--primary); color: #fff; }
    .btn-primary:hover { opacity: 0.9; }
    .btn-secondary { background: var(--card); color: var(--text); border-color: var(--border); }
    .btn-secondary:hover { background: var(--card-hover); }
    .btn-success { background: var(--success); color: #fff; }
    .btn-warning { background: var(--warning); color: #000; }
    .btn-danger { background: var(--danger-soft); color: var(--danger); border-color: rgba(239, 68, 68, 0.3); }
    .btn-danger:hover { background: var(--danger); color: #fff; }
    .btn-ghost { background: transparent; color: var(--text-muted); border-color: var(--border); }
    .btn-points {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(234, 179, 8, 0.25));
      border: 1px solid rgba(245, 158, 11, 0.5);
      color: #fde047;
      font-weight: 800;
    }
    main {
      max-width: 1240px;
      width: 100%;
      margin: 20px auto;
      padding: 0 16px;
      flex: 1;
    }
    .view { display: none; }
    .view.active { display: block; animation: fadeIn 0.25s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      margin-bottom: 20px;
    }
    .stat-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 16px;
    }
    .stat-card small { font-size: 12px; color: var(--text-muted); font-weight: 600; display: block; }
    .stat-card .val {
      font-size: 26px;
      font-weight: 800;
      color: #fff;
      margin-top: 4px;
      font-variant-numeric: tabular-nums;
      display: flex;
      align-items: baseline;
      gap: 6px;
    }
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 20px;
      margin-bottom: 18px;
    }
    .card-title {
      font-size: 15px;
      font-weight: 800;
      color: #fff;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .progress-bar-bg {
      height: 8px;
      background: var(--border-subtle);
      border-radius: 999px;
      overflow: hidden;
      margin: 8px 0;
    }
    .progress-bar-fill {
      height: 100%;
      background: var(--success);
      border-radius: 999px;
      transition: width 0.4s ease;
    }
    .floating-shater {
      position: fixed;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 90;
      background: linear-gradient(135deg, #f59e0b, #eab308);
      color: #172033;
      padding: 10px 14px;
      border-radius: 16px;
      font-weight: 900;
      font-size: 13px;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4);
      display: flex;
      align-items: center;
      gap: 6px;
      border: 2px solid #fef08a;
      transition: transform 0.2s;
    }
    .floating-shater:hover { transform: translateY(-50%) scale(1.06); }
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(8px);
      z-index: 200;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .modal-overlay.active { display: flex; animation: fadeIn 0.2s ease; }
    .modal-box {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 24px;
      width: 100%;
      max-width: 620px;
      max-height: 88vh;
      overflow-y: auto;
      padding: 24px;
      position: relative;
    }
    .modal-close {
      position: absolute;
      top: 18px;
      left: 18px;
      background: transparent;
      border: 0;
      color: var(--text-muted);
      font-size: 20px;
      cursor: pointer;
    }
    .input-control {
      background: rgba(0,0,0,0.3);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 8px 12px;
      color: #fff;
      font-family: inherit;
      font-size: 13px;
    }
    .subject-section {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .book-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 8px;
    }
    .book-tab-btn {
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
      background: transparent;
      border: 0;
      color: var(--text-muted);
      cursor: pointer;
    }
    .book-tab-btn.active {
      background: var(--primary);
      color: #fff;
    }
    .lesson-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 14px;
      border-radius: 12px;
      margin-bottom: 6px;
      background: rgba(0,0,0,0.2);
      border: 1px solid rgba(255,255,255,0.04);
    }
    .lesson-item.done {
      background: rgba(16, 185, 129, 0.06);
      border-color: rgba(16, 185, 129, 0.2);
    }
    .lesson-item.done .lesson-text {
      text-decoration: line-through;
      color: var(--text-dim);
    }
    .badge {
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 6px;
      font-weight: 700;
    }
    .gym-showcase {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(245, 158, 11, 0.1));
      border: 2px solid rgba(16, 185, 129, 0.4);
      border-radius: 20px;
      padding: 18px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }
    .accountability-box {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(245, 158, 11, 0.08));
      border: 2px solid rgba(239, 68, 68, 0.3);
      border-radius: 18px;
      padding: 18px;
      margin-bottom: 20px;
    }
    .meme-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: 10px;
      margin-top: 10px;
    }
    .meme-card {
      background: rgba(0,0,0,0.3);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 10px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .meme-card:hover { border-color: var(--warning); transform: translateY(-2px); }
    @media(max-width: 768px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .header-inner { flex-direction: column; align-items: stretch; }
      .floating-shater { left: 8px; font-size: 11px; padding: 6px 10px; }
    }
  </style>
</head>
<body class="theme-navy">

  <!-- Floating El-Shater Side Button -->
  <button class="floating-shater" onclick="openShaterModal()">
    <span>🌟</span>
    <span>الشاطر (+25)</span>
  </button>

  <!-- Header -->
  <header>
    <div class="header-inner">
      <div style="display:flex; align-items:center; gap:12px">
        <img id="header-avatar" class="brand-avatar" src="${currentProfile.avatarUrl}" onclick="openProfileModal()" title="تعديل البروفايل وميمات الثانوية">
        <div class="brand-text">
          <h1 id="header-student-name">${currentProfile.name}</h1>
          <p>تانية بكالوريا · نظام المتابعة والمكافآت وميمات الجيار</p>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <nav class="nav-tabs">
        <button class="active" onclick="switchTab('dashboard')">لوحة التحكم</button>
        <button onclick="switchTab('subjects')">المواد والكتب</button>
        <button onclick="switchTab('target')">مطلوب التارجت</button>
        <button onclick="switchTab('completed')">المنجز والنواقص</button>
        <button onclick="switchTab('today')">خطة اليوم</button>
        <button onclick="switchTab('analysis')">تحليل التقدم</button>
        <button onclick="switchTab('settings')">الإعدادات</button>
      </nav>

      <!-- Actions: 4 Themes, Motivation, Points -->
      <div style="display:flex; align-items:center; gap:8px">
        <!-- 4 Theme Switcher Buttons -->
        <div class="theme-palette" title="اختر لون خلفية التطبيق">
          <div class="theme-circle" style="background:#0b0f19" onclick="applyTheme('navy')" title="كحلي"></div>
          <div class="theme-circle" style="background:#07130e" onclick="applyTheme('emerald')" title="زمردي"></div>
          <div class="theme-circle" style="background:#0d0d1e" onclick="applyTheme('indigo')" title="نيلي"></div>
          <div class="theme-circle" style="background:#121214" onclick="applyTheme('charcoal')" title="فحمي"></div>
        </div>

        <button class="btn btn-secondary" onclick="openMotivationModal()" style="color:#fde047">
          🔥 تحفيز
        </button>

        <button class="btn btn-points" onclick="openRewardsModal()">
          🪙 <span id="header-points">${currentProfile.points}</span> نقطة
        </button>
      </div>
    </div>
  </header>

  <!-- Main Views Container -->
  <main>
    <!-- View 1: Dashboard -->
    <section id="view-dashboard" class="view active">
      <!-- Gym Visits & Points Showcase Bar -->
      <div class="gym-showcase">
        <div style="display:flex; align-items:center; gap:12px">
          <div style="font-size:36px">🏋️‍♂️</div>
          <div>
            <div style="font-size:16px; font-weight:900; color:#fff">
              أنا روحت الجيم كم مرة: <span id="dash-gym-count" style="color:var(--success)">${currentProfile.gymVisitsCount || 0}</span> مرات
            </div>
            <p style="font-size:12px; color:var(--text-muted); margin-top:2px">
              النقاط صعبة ومستحقة: الدرس = +10 نقاط فقط · الجيم = 100 نقطة (لازم تخلص 10 دروس لتروح الجيم وتفتح ميمات الفرحة)!
            </p>
          </div>
        </div>
        <button class="btn btn-warning" onclick="openRewardsModal()">فتح متجر الجيم والمكافآت 🎁</button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <small>إجمالي المنهج (الكتابين)</small>
          <div class="val" id="stat-total-lessons">0 <sub>درس</sub></div>
        </div>
        <div class="stat-card">
          <small>الدروس المنجزة</small>
          <div class="val" style="color:var(--success)" id="stat-done-lessons">0 <sub>درس</sub></div>
        </div>
        <div class="stat-card">
          <small>الدروس المتبقية</small>
          <div class="val" style="color:var(--warning)" id="stat-remaining-lessons">0 <sub>درس</sub></div>
        </div>
        <div class="stat-card">
          <small>نسبة الإنجاز العامة</small>
          <div class="val" style="color:var(--primary)" id="stat-percentage">0%</div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">
          <span>تقدم المذاكرة حتى موعد الختام</span>
          <span style="font-size:12px; color:var(--text-muted)" id="stat-days-left">0 يوم متبقي</span>
        </div>
        <div class="progress-bar-bg">
          <div id="stat-progress-bar" class="progress-bar-fill" style="width:0%"></div>
        </div>
      </div>

      <!-- Quick Subjects Cards -->
      <div id="dashboard-subjects-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:16px"></div>
    </section>

    <!-- View 2: Subjects & Dual Books (3 Separate Sections) -->
    <section id="view-subjects" class="view">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px">
        <h2 style="font-size:18px; font-weight:800">المواد والكتب الدراسية (3 مواد منفصلة بكتابين لكل مادة)</h2>
      </div>
      <div id="subjects-container"></div>
    </section>

    <!-- View 3: Target Roadmap with Automatic Measurement -->
    <section id="view-target" class="view">
      <!-- Accountability Box Measured Mathematically -->
      <div id="target-accountability-card" class="accountability-box">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px">
          <div>
            <h3 style="font-size:15px; font-weight:900; color:#fff" id="target-metric-title">
              🛡️ نظام القياس الآلي الفعلي لتارجت اليوم
            </h3>
            <p style="font-size:12px; color:var(--text-muted); margin-top:4px" id="target-metric-desc">
              التارجت لا يُقاس بالكلام؛ بل يُحسب بناءً على عدد الدروس التي تضمن ختم المنهج في موعدك المحدد.
            </p>
          </div>
          <button class="btn btn-primary" onclick="verifyTodayTargetAuto()">
            فحص وتطبيق التقييم الآلي لليوم ✨
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-title">المطلوب إنجازه من الدروس لحسم التارجت بالترتيب</div>
        <div id="target-lessons-list"></div>
      </div>
    </section>

    <!-- View 4: Completed Review -->
    <section id="view-completed" class="view">
      <div class="card">
        <div class="card-title">
          <span>أنا خلصت إيه وناقصني فيه حاجة ولا لأ</span>
          <span style="font-size:12px; color:var(--text-muted)">حدد مستوى الإتقان وسجل أي ملاحظات</span>
        </div>
        <div id="completed-review-list"></div>
      </div>
    </section>

    <!-- View 5: Daily Plan -->
    <section id="view-today" class="view">
      <div class="card">
        <div class="card-title">خطة اليوم المقترحة</div>
        <div id="daily-plan-list"></div>
      </div>
    </section>

    <!-- View 6: Progress Analysis (Stacked Area SVG) -->
    <section id="view-analysis" class="view">
      <div class="card">
        <div class="card-title">مخطط تقدم الكتابين لكل مادة (Stacked Area Chart)</div>
        <div id="analysis-charts-container"></div>
      </div>
    </section>

    <!-- View 7: Settings -->
    <section id="view-settings" class="view">
      <div class="card">
        <div class="card-title">الجدول الزمني للخطة</div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px; margin-bottom:16px">
          <div>
            <label style="display:block; font-size:13px; color:var(--text-muted); margin-bottom:6px">تاريخ بداية الخطة</label>
            <input type="date" id="setting-start-date" class="input-control" style="width:100%">
          </div>
          <div>
            <label style="display:block; font-size:13px; color:var(--text-muted); margin-bottom:6px">موعد إنهاء المنهج</label>
            <input type="date" id="setting-end-date" class="input-control" style="width:100%">
          </div>
        </div>
        <button class="btn btn-primary" onclick="savePlanDates()">حفظ التواريخ</button>
      </div>

      <div class="card">
        <div class="card-title">النسخ الاحتياطي ونقل البيانات</div>
        <div style="display:flex; gap:10px; flex-wrap:wrap">
          <button class="btn btn-secondary" onclick="exportDataJson()">📥 تصدير ملف النسخة الاحتياطية (JSON)</button>
          <label class="btn btn-ghost" style="cursor:pointer">
            📤 استيراد نسخة احتياطية
            <input type="file" accept=".json" style="display:none" onchange="importDataJson(event)">
          </label>
        </div>
      </div>

      <div class="card" style="border-color: rgba(239, 68, 68, 0.3)">
        <div class="card-title" style="color:var(--danger)">إعادة التعيين الأصلية</div>
        <button class="btn btn-danger" onclick="resetToInitial()">إعادة ضبط البيانات الأصلية</button>
      </div>
    </section>
  </main>

  <!-- Egyptian Joy Meme Celebration Modal (when buying Gym or rewards) -->
  <div id="modal-joy-meme" class="modal-overlay">
    <div class="modal-box" style="text-align:center; border:2px solid #10b981">
      <div style="font-size:52px; margin-bottom:8px" id="joy-meme-icon">🏋️‍♂️</div>
      <span class="badge" style="background:rgba(16,185,129,0.2); color:#6ee7b7; font-size:12px; margin-bottom:8px" id="joy-meme-badge">فرحة مصرية 🎉</span>
      <h3 style="font-size:14px; font-weight:800; color:#fde047; margin-bottom:4px" id="joy-meme-character"></h3>
      <h2 style="font-size:22px; font-weight:900; color:#fff; margin-bottom:12px" id="joy-meme-title"></h2>

      <div style="background:rgba(0,0,0,0.3); border:1px solid var(--border); border-radius:16px; padding:16px; margin-bottom:16px; text-align:right">
        <p id="joy-meme-quote" style="font-size:14px; color:#fff; font-weight:700; line-height:1.6"></p>
      </div>

      <div id="joy-gym-highlight" style="background:rgba(16,185,129,0.15); border:1px solid rgba(16,185,129,0.4); border-radius:14px; padding:12px; margin-bottom:18px">
        <div style="font-size:15px; font-weight:900; color:#6ee7b7">
          أنت روحت الجيم <span id="joy-gym-number">0</span> مرات حتى الآن! 💪
        </div>
      </div>

      <button class="btn btn-success" style="width:100%; padding:12px; font-size:14px" onclick="closeJoyMemeModal()">
        عاش يا بطل! استمتع بوقتك 🚀
      </button>
    </div>
  </div>

  <!-- Celebratory Completion Modal (for lesson checkoff) -->
  <div id="modal-celebration" class="modal-overlay">
    <div class="modal-box" style="text-align:center; border:2px solid #f59e0b">
      <div style="font-size:48px; margin-bottom:12px">🏆</div>
      <span class="badge" style="background:rgba(245,158,11,0.2); color:#fde047; font-size:12px; margin-bottom:8px">إنجاز بطل! 🌟</span>
      <h2 style="font-size:22px; font-weight:900; color:#fff; margin-bottom:8px">عاش يا وحش! تم إنهاء الدرس</h2>
      <p id="celebration-lesson-title" style="font-size:13px; color:var(--text-muted); margin-bottom:16px"></p>
      
      <div style="background:rgba(245,158,11,0.15); border:1px solid rgba(245,158,11,0.4); border-radius:16px; padding:12px; margin-bottom:16px">
        <div style="font-size:20px; font-weight:900; color:#fde047">+10 نقاط أضيفت لرصيدك! 🪙</div>
        <div style="font-size:12px; color:var(--text-muted)">رصيدك الحالي: <strong id="celebration-total-pts" style="color:#fff">0</strong> نقطة (الجيم بـ 100 نقطة)</div>
      </div>

      <div style="background:rgba(0,0,0,0.3); border:1px solid var(--border); border-radius:14px; padding:14px; margin-bottom:20px; text-align:right">
        <div style="font-size:11px; color:var(--primary); font-weight:800; margin-bottom:4px">رسالة تحفيزية:</div>
        <div id="celebration-quote" style="font-size:13px; color:#fff; font-weight:600"></div>
      </div>

      <button class="btn btn-warning" style="width:100%; padding:12px; font-size:14px" onclick="closeCelebrationModal()">
        متابعة المذاكرة والإنجاز 🚀
      </button>
    </div>
  </div>

  <!-- Rewards Store Modal -->
  <div id="modal-rewards" class="modal-overlay">
    <div class="modal-box">
      <button class="modal-close" onclick="closeRewardsModal()">✕</button>
      <div class="card-title">
        <span>🎁 متجر المكافآت وسجل الجيم</span>
        <span class="btn-points" style="padding:4px 10px; border-radius:8px">🪙 <span id="rewards-store-points">0</span> نقطة</span>
      </div>
      <p style="font-size:12px; color:var(--text-muted); margin-bottom:14px">
        النقاط صعبة ومستحقة: كل درس = +10 نقاط · الجيم = 100 نقطة (10 دروس كاملة).
      </p>

      <!-- Gym Visits Summary Banner inside modal -->
      <div style="background:rgba(16,185,129,0.15); border:1px solid rgba(16,185,129,0.4); border-radius:14px; padding:12px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center">
        <div>
          <div style="font-size:13px; font-weight:800; color:#fff">سجل الذهاب للجيم:</div>
          <div style="font-size:12px; color:var(--text-muted)">روحت الجيم حتى الآن: <strong id="modal-gym-visits" style="color:#6ee7b7">0</strong> مرات</div>
        </div>
        <span style="font-size:24px">🏋️‍♂️</span>
      </div>

      <div id="rewards-list-container" style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px"></div>

      <!-- Add Custom Reward Form -->
      <div style="background:rgba(0,0,0,0.3); padding:14px; border-radius:14px; border:1px solid var(--border)">
        <h4 style="font-size:13px; font-weight:800; margin-bottom:8px">إضافة مكافأة مخصصة ترغب فيها:</h4>
        <div style="display:flex; gap:8px; margin-bottom:8px">
          <input type="text" id="custom-reward-title" placeholder="اسم المكافأة" class="input-control" style="flex:2">
          <input type="number" id="custom-reward-cost" placeholder="النقاط" value="100" class="input-control" style="flex:1">
        </div>
        <button class="btn btn-primary" onclick="addCustomReward()">+ حفظ المكافأة</button>
      </div>
    </div>
  </div>

  <!-- Motivation Modal -->
  <div id="modal-motivation" class="modal-overlay">
    <div class="modal-box">
      <button class="modal-close" onclick="closeMotivationModal()">✕</button>
      <div class="card-title">🔥 جرعة تحفيز وتفوق</div>
      <p style="font-size:12px; color:var(--text-muted); margin-bottom:14px">كلمات حقيقية تشحن همتك وتذكرك بمستقبلك وحلمك</p>

      <div style="background:linear-gradient(135deg, rgba(99,102,241,0.2), rgba(245,158,11,0.15)); border:1px solid var(--primary); border-radius:18px; padding:18px; margin-bottom:16px">
        <p id="featured-quote-text" style="font-size:16px; font-weight:800; color:#fff; line-height:1.6"></p>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px">
          <small id="featured-quote-author" style="color:var(--text-muted); font-weight:700"></small>
          <button class="btn btn-secondary" onclick="generateRandomQuote()">🔄 اقتباس آخر</button>
        </div>
      </div>

      <div id="all-quotes-container" style="max-height:260px; overflow-y:auto; display:flex; flex-direction:column; gap:8px"></div>
    </div>
  </div>

  <!-- El-Shater Modal -->
  <div id="modal-shater" class="modal-overlay">
    <div class="modal-box" style="border:2px solid #f59e0b">
      <button class="modal-close" onclick="closeShaterModal()">✕</button>
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px">
        <span style="font-size:24px">🌟</span>
        <h2 style="font-size:18px; font-weight:900; color:#fff">تحدي «الشاطر» للمتفوقين</h2>
      </div>
      <p style="font-size:12px; color:var(--text-muted); margin-bottom:16px">
        هل ترغب في زيادة نقاطك؟ أنجز دروساً إضافية سابقة لتارجتك اليوم واحصل على <strong style="color:#fde047">+25 نقطة</strong> لكل درس!
      </p>

      <div id="shater-lessons-list" style="max-height:360px; overflow-y:auto; display:flex; flex-direction:column; gap:8px"></div>
    </div>
  </div>

  <!-- Profile Modal with Egyptian Meme Avatars -->
  <div id="modal-profile" class="modal-overlay">
    <div class="modal-box">
      <button class="modal-close" onclick="closeProfileModal()">✕</button>
      <div class="card-title">👤 الملف الشخصي وميمات الثانوية المصرية</div>
      <div style="display:flex; gap:14px; align-items:center; margin-bottom:16px">
        <img id="profile-edit-preview" src="${currentProfile.avatarUrl}" style="width:64px; height:64px; border-radius:16px; border:2px solid var(--primary); object-fit:cover">
        <div style="flex:1">
          <label style="font-size:12px; color:var(--text-muted); display:block; margin-bottom:4px">اسم الطالب / البطل</label>
          <input type="text" id="profile-edit-name" value="${currentProfile.name}" class="input-control" style="width:100%">
        </div>
      </div>

      <div style="background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); border-radius:12px; padding:10px; margin-bottom:14px; display:flex; justify-content:space-between">
        <span style="font-size:12px; color:#fff">🏋️‍♂️ مرات الذهاب للجيم:</span>
        <strong id="profile-gym-visits-display" style="color:#6ee7b7">0 مرات</strong>
      </div>

      <label style="font-size:12px; color:var(--text-muted); display:block; margin-bottom:8px">
        اختر شخصيتك من ميمات الثانوية المصرية الشهيرة (الجيار، عادل إمام، اللمبي، هنيدي...):
      </label>
      <div class="meme-grid" id="meme-avatars-grid"></div>

      <button class="btn btn-primary" style="width:100%; margin-top:16px" onclick="saveProfileData()">حفظ التعديلات</button>
    </div>
  </div>

  <script>
    const INITIAL_DATA = ${jsonSubjects};
    const INITIAL_DATES = ${jsonDates};
    const INITIAL_SETTINGS = ${jsonSettings};
    const INITIAL_PROFILE = ${jsonProfile};
    const INITIAL_REWARDS_DATA = ${jsonRewards};
    const QUOTES_DATA = ${jsonQuotes};
    const MEMES_DATA = ${jsonMemes};
    const JOY_MEMES_DATA = ${jsonJoyMemes};

    let subjects = JSON.parse(localStorage.getItem('studyPlanV2') || 'null') || INITIAL_DATA;
    let dates = JSON.parse(localStorage.getItem('studyDatesV2') || 'null') || INITIAL_DATES;
    let settings = JSON.parse(localStorage.getItem('studySettingsV2') || 'null') || INITIAL_SETTINGS;
    let profile = JSON.parse(localStorage.getItem('studyProfileV2') || 'null') || INITIAL_PROFILE;
    let rewards = JSON.parse(localStorage.getItem('studyRewardsV2') || 'null') || INITIAL_REWARDS_DATA;

    let activeBookTabs = {};

    function saveState() {
      localStorage.setItem('studyPlanV2', JSON.stringify(subjects));
      localStorage.setItem('studyDatesV2', JSON.stringify(dates));
      localStorage.setItem('studySettingsV2', JSON.stringify(settings));
      localStorage.setItem('studyProfileV2', JSON.stringify(profile));
      localStorage.setItem('studyRewardsV2', JSON.stringify(rewards));
      renderAll();
    }

    function applyTheme(themeName) {
      document.body.className = 'theme-' + themeName;
      profile.theme = themeName;
      localStorage.setItem('studyProfileV2', JSON.stringify(profile));
    }

    function switchTab(tabId) {
      document.querySelectorAll('.nav-tabs button').forEach((btn, idx) => {
        const tabs = ['dashboard', 'subjects', 'target', 'completed', 'today', 'analysis', 'settings'];
        btn.classList.toggle('active', tabs[idx] === tabId);
      });
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      const activeView = document.getElementById('view-' + tabId);
      if (activeView) activeView.classList.add('active');
    }

    // Audio chime using Web Audio API
    function playChime() {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
          gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + idx * 0.08 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.08);
          osc.stop(ctx.currentTime + idx * 0.08 + 0.6);
        });
      } catch (e) {}
    }

    function getAllLessons() {
      const list = [];
      subjects.forEach(s => {
        s.books.forEach(b => {
          b.units.forEach(u => {
            u.lessons.forEach(l => {
              list.push({ s, b, u, l });
            });
          });
        });
      });
      return list;
    }

    // Lesson Toggle - Harder economy (+10 points)
    function toggleLesson(lessonId, markAs) {
      let completedLessonTitle = '';
      subjects.forEach(s => {
        s.books.forEach(b => {
          b.units.forEach(u => {
            u.lessons.forEach(l => {
              if (l.id === lessonId) {
                l.completed = (typeof markAs === 'boolean') ? markAs : !l.completed;
                if (l.completed) {
                  l.completedAt = new Date().toISOString();
                  completedLessonTitle = l.title;
                }
              }
            });
          });
        });
      });

      if (completedLessonTitle) {
        playChime();
        profile.points = (profile.points || 0) + 10;
        profile.totalPointsEarned = (profile.totalPointsEarned || 0) + 10;
        showCelebration(completedLessonTitle, 10);
      }

      saveState();
    }

    function showCelebration(title, pts) {
      document.getElementById('celebration-lesson-title').textContent = title;
      document.getElementById('celebration-total-pts').textContent = profile.points;
      const randomQ = QUOTES_DATA[Math.floor(Math.random() * QUOTES_DATA.length)];
      document.getElementById('celebration-quote').textContent = '"' + randomQ.text + '" — ' + randomQ.author;
      document.getElementById('modal-celebration').classList.add('active');
    }

    function closeCelebrationModal() {
      document.getElementById('modal-celebration').classList.remove('active');
    }

    // Automatic Target Verification based on actual count
    function verifyTodayTargetAuto() {
      const all = getAllLessons();
      const todayIso = new Date().toISOString().slice(0, 10);
      const completedToday = all.filter(item => item.l.completed && item.l.completedAt && item.l.completedAt.slice(0, 10) === todayIso).length;
      
      const remaining = all.filter(item => !item.l.completed).length;
      const endParts = dates.end.split('-').map(Number);
      const endDate = new Date(endParts[0], endParts[1] - 1, endParts[2]);
      const now = new Date();
      const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const daysRemaining = Math.max(1, Math.ceil((endDate.getTime() - todayOnly.getTime()) / 86400000));
      const requiredDaily = Math.max(1, Math.ceil(remaining / daysRemaining));

      if (completedToday >= requiredDaily) {
        profile.points = (profile.points || 0) + 25;
        profile.totalPointsEarned = (profile.totalPointsEarned || 0) + 25;
        playChime();
        alert('✅ تم التحقق الرياضي: أنجزت ' + completedToday + ' درس اليوم من أصل ' + requiredDaily + ' المطلوبة لإنهاء المنهج في ' + dates.end + '! مبروك +25 نقطة التزام!');
      } else {
        profile.points = Math.max(0, (profile.points || 0) - 25);
        profile.penaltyCount = (profile.penaltyCount || 0) + 1;
        alert('⚠️ تم التحقق الرياضي: أنجزت ' + completedToday + ' درس فقط من أصل ' + requiredDaily + ' درس مطلوبين اليوم لإنهاء المنهج في موعده! تم خصم 25 نقطة جزاء تأخير.');
      }
      saveState();
    }

    // El-Shater extra credit modal (+25 pts)
    function openShaterModal() {
      const all = getAllLessons().filter(item => !item.l.completed);
      const container = document.getElementById('shater-lessons-list');
      container.innerHTML = '';
      if (all.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-muted)">ما شاء الله! أنجزت كل المنهج بالكامل!</div>';
      } else {
        all.slice(0, 20).forEach(item => {
          const div = document.createElement('div');
          div.className = 'lesson-item';
          div.innerHTML = \`
            <div>
              <div style="font-weight:700; font-size:13px; color:#fff">\${item.l.title}</div>
              <div style="font-size:11px; color:var(--text-muted)">\${item.s.name} · \${item.b.name}</div>
            </div>
            <button class="btn btn-warning" onclick="completeShaterLesson('\${item.l.id}')">+25 إنجاز شاطر 🌟</button>
          \`;
          container.appendChild(div);
        });
      }
      document.getElementById('modal-shater').classList.add('active');
    }
    function closeShaterModal() {
      document.getElementById('modal-shater').classList.remove('active');
    }

    function completeShaterLesson(lessonId) {
      subjects.forEach(s => {
        s.books.forEach(b => {
          b.units.forEach(u => {
            u.lessons.forEach(l => {
              if (l.id === lessonId) {
                l.completed = true;
                l.completedAt = new Date().toISOString();
              }
            });
          });
        });
      });
      playChime();
      profile.points = (profile.points || 0) + 25;
      profile.totalPointsEarned = (profile.totalPointsEarned || 0) + 25;
      profile.shaterBonusCount = (profile.shaterBonusCount || 0) + 1;
      closeShaterModal();
      showCelebration('[إنجاز الشاطر 🌟] درس إضافي', 25);
      saveState();
    }

    // Rewards modal with Gym visits and Egyptian Joy Memes
    function openRewardsModal() {
      document.getElementById('rewards-store-points').textContent = profile.points;
      document.getElementById('modal-gym-visits').textContent = profile.gymVisitsCount || 0;
      const container = document.getElementById('rewards-list-container');
      container.innerHTML = '';
      rewards.forEach(r => {
        const canAfford = profile.points >= r.cost;
        const isGym = r.isGym || r.id.includes('gym');
        const div = document.createElement('div');
        div.className = 'lesson-item';
        div.style.flexDirection = 'column';
        div.style.alignItems = 'stretch';
        div.style.border = isGym ? '2px solid rgba(16,185,129,0.5)' : '1px solid var(--border)';
        div.innerHTML = \`
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px">
            <span style="font-size:24px">\${r.icon}</span>
            <div>
              <div style="font-size:12px; font-weight:800; color:#fff">\${r.title}</div>
              <div style="font-size:11px; color:#fde047; font-weight:700">🪙 \${r.cost} نقطة</div>
            </div>
          </div>
          <button class="btn \${canAfford ? 'btn-warning' : 'btn-ghost'}" \${canAfford ? '' : 'disabled'} onclick="redeemReward('\${r.id}')">
            \${canAfford ? (isGym ? 'استبدال وتأكيد الذهاب للجيم 🏋️‍♂️' : 'استبدال المكافأة') : 'تحتاج ' + (r.cost - profile.points) + ' نقطة'}
          </button>
        \`;
        container.appendChild(div);
      });
      document.getElementById('modal-rewards').classList.add('active');
    }
    function closeRewardsModal() {
      document.getElementById('modal-rewards').classList.remove('active');
    }

    function redeemReward(id) {
      const rew = rewards.find(r => r.id === id);
      if (rew && profile.points >= rew.cost) {
        profile.points -= rew.cost;
        rew.timesRedeemed = (rew.timesRedeemed || 0) + 1;
        const isGym = rew.isGym || rew.id.includes('gym');
        if (isGym) {
          profile.gymVisitsCount = (profile.gymVisitsCount || 0) + 1;
        }

        saveState();
        closeRewardsModal();
        openJoyMemeModal(rew, isGym);
      }
    }

    function openJoyMemeModal(rew, isGym) {
      const joyMeme = JOY_MEMES_DATA[Math.floor(Math.random() * JOY_MEMES_DATA.length)];
      document.getElementById('joy-meme-icon').textContent = isGym ? '🏋️‍♂️' : joyMeme.icon;
      document.getElementById('joy-meme-badge').textContent = joyMeme.badge;
      document.getElementById('joy-meme-character').textContent = joyMeme.character + ' بيهنيك بالفرحة:';
      document.getElementById('joy-meme-title').textContent = '«' + joyMeme.title + '»';
      document.getElementById('joy-meme-quote').textContent = '"' + joyMeme.quote + '"';
      
      const gymHighlight = document.getElementById('joy-gym-highlight');
      if (isGym) {
        gymHighlight.style.display = 'block';
        document.getElementById('joy-gym-number').textContent = profile.gymVisitsCount || 0;
      } else {
        gymHighlight.style.display = 'none';
      }

      playChime();
      document.getElementById('modal-joy-meme').classList.add('active');
    }

    function closeJoyMemeModal() {
      document.getElementById('modal-joy-meme').classList.remove('active');
    }

    function addCustomReward() {
      const title = document.getElementById('custom-reward-title').value.trim();
      const cost = Number(document.getElementById('custom-reward-cost').value) || 100;
      if (!title) return;
      rewards.unshift({
        id: 'rew-' + Date.now(),
        title,
        cost,
        icon: '🎁',
        category: 'custom',
        timesRedeemed: 0,
        isGym: title.includes('جيم')
      });
      document.getElementById('custom-reward-title').value = '';
      saveState();
      openRewardsModal();
    }

    // Motivation Modal
    function openMotivationModal() {
      generateRandomQuote();
      const container = document.getElementById('all-quotes-container');
      container.innerHTML = '';
      QUOTES_DATA.forEach(q => {
        const div = document.createElement('div');
        div.style.background = 'rgba(0,0,0,0.2)';
        div.style.padding = '10px 12px';
        div.style.borderRadius = '10px';
        div.innerHTML = \`<p style="font-size:12px; color:#fff; font-weight:600">"\${q.text}"</p><small style="font-size:10px; color:var(--text-muted)">— \${q.author}</small>\`;
        container.appendChild(div);
      });
      document.getElementById('modal-motivation').classList.add('active');
    }
    function closeMotivationModal() {
      document.getElementById('modal-motivation').classList.remove('active');
    }
    function generateRandomQuote() {
      const q = QUOTES_DATA[Math.floor(Math.random() * QUOTES_DATA.length)];
      document.getElementById('featured-quote-text').textContent = '"' + q.text + '"';
      document.getElementById('featured-quote-author').textContent = '— ' + q.author;
    }

    // Profile Modal with Egyptian Memes
    function openProfileModal() {
      document.getElementById('profile-edit-name').value = profile.name || 'بطل تانية ثانوي';
      document.getElementById('profile-edit-preview').src = profile.avatarUrl;
      document.getElementById('profile-gym-visits-display').textContent = (profile.gymVisitsCount || 0) + ' مرات';

      const grid = document.getElementById('meme-avatars-grid');
      grid.innerHTML = '';
      MEMES_DATA.forEach(meme => {
        const div = document.createElement('div');
        div.className = 'meme-card';
        div.innerHTML = \`
          <img src="\${meme.avatarUrl}" style="width:48px; height:48px; border-radius:10px; margin:0 auto 6px">
          <div style="font-size:11px; font-weight:800; color:#fff">\${meme.character}</div>
          <div style="font-size:9px; color:var(--warning)">\${meme.title}</div>
        \`;
        div.onclick = () => selectAvatar(meme.avatarUrl);
        grid.appendChild(div);
      });

      document.getElementById('modal-profile').classList.add('active');
    }
    function closeProfileModal() {
      document.getElementById('modal-profile').classList.remove('active');
    }
    function selectAvatar(url) {
      document.getElementById('profile-edit-preview').src = url;
    }
    function saveProfileData() {
      profile.name = document.getElementById('profile-edit-name').value.trim() || 'بطل تانية ثانوي';
      profile.avatarUrl = document.getElementById('profile-edit-preview').src;
      saveState();
      closeProfileModal();
    }

    function renderAll() {
      // Header info
      document.getElementById('header-avatar').src = profile.avatarUrl;
      document.getElementById('header-student-name').textContent = profile.name;
      document.getElementById('header-points').textContent = profile.points;
      document.getElementById('dash-gym-count').textContent = profile.gymVisitsCount || 0;

      const all = getAllLessons();
      const total = all.length;
      const done = all.filter(item => item.l.completed).length;
      const remaining = Math.max(0, total - done);
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;

      document.getElementById('stat-total-lessons').innerHTML = total + ' <sub>درس</sub>';
      document.getElementById('stat-done-lessons').innerHTML = done + ' <sub>درس</sub>';
      document.getElementById('stat-remaining-lessons').innerHTML = remaining + ' <sub>درس</sub>';
      document.getElementById('stat-percentage').textContent = pct + '%';
      document.getElementById('stat-progress-bar').style.width = pct + '%';

      // Render 3 Separate Subject Sections
      const subjContainer = document.getElementById('subjects-container');
      subjContainer.innerHTML = '';
      subjects.forEach((s) => {
        if (!activeBookTabs[s.id]) {
          activeBookTabs[s.id] = s.books[0]?.id;
        }
        const activeBookId = activeBookTabs[s.id];

        const sec = document.createElement('div');
        sec.className = 'subject-section';
        sec.style.borderTop = '4px solid ' + s.color;

        let bookTabsHtml = '<div class="book-tabs">';
        s.books.forEach(b => {
          const isActive = b.id === activeBookId;
          bookTabsHtml += \`<button class="book-tab-btn \${isActive ? 'active' : ''}" onclick="selectBookTab('\${s.id}', '\${b.id}')">\${b.name}</button>\`;
        });
        bookTabsHtml += '</div>';

        const currentBook = s.books.find(b => b.id === activeBookId) || s.books[0];
        let unitsHtml = '';
        if (currentBook) {
          currentBook.units.forEach(u => {
            unitsHtml += \`<div style="margin-bottom:14px"><h4 style="font-size:13px; font-weight:800; color:var(--text-muted); margin-bottom:8px">📁 \${u.name}</h4>\`;
            u.lessons.forEach(l => {
              unitsHtml += \`
                <div class="lesson-item \${l.completed ? 'done' : ''}">
                  <label style="display:flex; align-items:center; gap:10px; cursor:pointer; flex:1">
                    <input type="checkbox" \${l.completed ? 'checked' : ''} onchange="toggleLesson('\${l.id}')" style="accent-color:var(--success); width:16px; height:16px">
                    <span class="lesson-text" style="font-size:13px; font-weight:600">\${l.title}</span>
                  </label>
                  <span class="badge" style="background:rgba(255,255,255,0.05); color:var(--text-muted)">\${l.completed ? 'منجز ✓' : 'متبقي'}</span>
                </div>
              \`;
            });
            unitsHtml += '</div>';
          });
        }

        sec.innerHTML = \`
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px">
            <h3 style="font-size:16px; font-weight:900; color:\${s.color}">\${s.name}</h3>
            <span style="font-size:12px; color:var(--text-muted)">\${s.books.length} كتب</span>
          </div>
          \${bookTabsHtml}
          \${unitsHtml}
        \`;
        subjContainer.appendChild(sec);
      });

      // Target Roadmap view
      const targetContainer = document.getElementById('target-lessons-list');
      targetContainer.innerHTML = '';
      const incomplete = all.filter(item => !item.l.completed);
      if (incomplete.length === 0) {
        targetContainer.innerHTML = '<div style="text-align:center; padding:24px; color:var(--success)">عظيم! كل دروس التارجت مكتملة بالكامل!</div>';
      } else {
        incomplete.slice(0, 15).forEach((item, idx) => {
          const div = document.createElement('div');
          div.className = 'lesson-item';
          div.innerHTML = \`
            <div style="display:flex; align-items:center; gap:10px">
              <span style="font-size:11px; font-weight:800; color:var(--text-muted)">#\${idx + 1}</span>
              <div>
                <div style="font-size:13px; font-weight:700; color:#fff">\${item.l.title}</div>
                <div style="font-size:11px; color:var(--text-muted)">\${item.s.name} · \${item.b.name}</div>
              </div>
            </div>
            <button class="btn btn-success" onclick="toggleLesson('\${item.l.id}', true)">تم الإنجاز ✓</button>
          \`;
          targetContainer.appendChild(div);
        });
      }

      // Completed Review view
      const completedContainer = document.getElementById('completed-review-list');
      completedContainer.innerHTML = '';
      const finished = all.filter(item => item.l.completed);
      if (finished.length === 0) {
        completedContainer.innerHTML = '<div style="text-align:center; padding:24px; color:var(--text-muted)">لم تبدأ في إنجاز الدروس بعد. اختر من خطة اليوم وابدأ!</div>';
      } else {
        finished.slice(0, 25).forEach(item => {
          const div = document.createElement('div');
          div.className = 'lesson-item done';
          div.innerHTML = \`
            <div>
              <div style="font-size:13px; font-weight:700; color:#fff">\${item.l.title}</div>
              <div style="font-size:11px; color:var(--text-muted)">\${item.s.name} · \${item.b.name}</div>
              \${item.l.missingItems ? '<div style="font-size:11px; color:#fde047; margin-top:4px">⚠️ نواقص: ' + item.l.missingItems + '</div>' : ''}
            </div>
            <button class="btn btn-ghost" onclick="toggleLesson('\${item.l.id}', false)">إلغاء التمام</button>
          \`;
          completedContainer.appendChild(div);
        });
      }

      // Progress Analysis Stacked Area SVG Charts
      const chartsContainer = document.getElementById('analysis-charts-container');
      chartsContainer.innerHTML = '';
      subjects.forEach(s => {
        const b1 = s.books[0];
        const b2 = s.books[1];
        const b1Total = b1 ? b1.units.reduce((acc, u) => acc + u.lessons.length, 0) : 0;
        const b1Done = b1 ? b1.units.reduce((acc, u) => acc + u.lessons.filter(l => l.completed).length, 0) : 0;
        const b2Total = b2 ? b2.units.reduce((acc, u) => acc + u.lessons.length, 0) : 0;
        const b2Done = b2 ? b2.units.reduce((acc, u) => acc + u.lessons.filter(l => l.completed).length, 0) : 0;
        const b1Pct = b1Total > 0 ? Math.round((b1Done / b1Total) * 100) : 0;
        const b2Pct = b2Total > 0 ? Math.round((b2Done / b2Total) * 100) : 0;

        const card = document.createElement('div');
        card.style.background = 'rgba(0,0,0,0.2)';
        card.style.border = '1px solid var(--border)';
        card.style.borderRadius = '14px';
        card.style.padding = '14px';
        card.style.marginBottom = '12px';

        card.innerHTML = \`
          <div style="display:flex; justify-content:space-between; margin-bottom:8px">
            <strong style="color:\${s.color}">\${s.name}</strong>
            <span style="font-size:12px; color:var(--text-muted)">الكتاب 1: \${b1Pct}% | الكتاب 2: \${b2Pct}%</span>
          </div>
          <div style="height:24px; background:rgba(0,0,0,0.4); border-radius:8px; display:flex; overflow:hidden">
            <div style="width:\${b1Pct / 2}%; background:#6366f1" title="الكتاب الأول: \${b1Done}/\${b1Total}"></div>
            <div style="width:\${b2Pct / 2}%; background:#10b981" title="الكتاب الثاني: \${b2Done}/\${b2Total}"></div>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:11px; margin-top:6px; color:var(--text-muted)">
            <span>🟣 الكتاب الأول (\${b1Done}/\${b1Total})</span>
            <span>🟢 الكتاب الثاني (\${b2Done}/\${b2Total})</span>
          </div>
        \`;
        chartsContainer.appendChild(card);
      });
    }

    function selectBookTab(subId, bookId) {
      activeBookTabs[subId] = bookId;
      renderAll();
    }

    // JSON export/import
    function exportDataJson() {
      const data = { subjects, dates, settings, profile, rewards, version: 2, exportedAt: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'study-progress-backup.json';
      a.click();
    }
    function importDataJson(e) {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          const d = JSON.parse(ev.target.result);
          if (d.subjects) subjects = d.subjects;
          if (d.dates) dates = d.dates;
          if (d.settings) settings = d.settings;
          if (d.profile) profile = d.profile;
          if (d.rewards) rewards = d.rewards;
          saveState();
          alert('تم استيراد النسخة الاحتياطية بنجاح!');
        } catch(err) { alert('خطأ في صيغة الملف.'); }
      };
      reader.readAsText(file);
    }
    function resetToInitial() {
      if (confirm('هل تريد بالتأكيد إعادة ضبط الخطة ومسح التقدم بالكامل؟')) {
        localStorage.clear();
        subjects = INITIAL_DATA;
        dates = INITIAL_DATES;
        settings = INITIAL_SETTINGS;
        profile = INITIAL_PROFILE;
        rewards = INITIAL_REWARDS_DATA;
        saveState();
        location.reload();
      }
    }

    // Initialize
    if (profile.theme) applyTheme(profile.theme);
    renderAll();
  </script>
</body>
</html>`;
}

export async function downloadStandaloneHtmlFile(
  subjects: Subject[],
  dates: StudyDates,
  settings: StudySettings,
  profile?: StudentProfile,
  rewards?: RewardItem[]
): Promise<void> {
  try {
    const res = await fetch('/study-progress-tracker.html');
    if (res.ok) {
      let html = await res.text();
      // Inject current student state into localStorage on first load or when a fresh export is downloaded
      const exportTime = Date.now();
      const stateInjection = `
    <script>
      (function() {
        try {
          var exportTime = ${exportTime};
          var lastLoaded = Number(localStorage.getItem('studyLastExportLoaded') || '0');
          if (exportTime > lastLoaded || !localStorage.getItem('studyPlanV2')) {
            localStorage.setItem('studyPlanV2', ${JSON.stringify(JSON.stringify(subjects))});
            localStorage.setItem('studyDatesV2', ${JSON.stringify(JSON.stringify(dates))});
            localStorage.setItem('studySettingsV2', ${JSON.stringify(JSON.stringify(settings))});
            localStorage.setItem('studyProfileV2', ${JSON.stringify(JSON.stringify(profile))});
            localStorage.setItem('studyRewardsV2', ${JSON.stringify(JSON.stringify(rewards))});
            localStorage.setItem('studyLastExportLoaded', String(exportTime));
          }
        } catch(e) {
          console.warn('Storage sync notice:', e);
        }
      })();
    </script>`;
      if (html.includes('<div id="root"></div>')) {
        html = html.replace('<div id="root"></div>', `${stateInjection}\n    <div id="root"></div>`);
      }
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Study-Progress-Tracker-2nd-Secondary.html';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return;
    }
  } catch (err) {
    console.error('Error fetching prebuilt standalone html:', err);
  }

  // Fallback to generated HTML if fetch is not available
  const content = generateStandaloneHtml(subjects, dates, settings, profile, rewards);
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Study-Progress-Tracker-2nd-Secondary.html';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
