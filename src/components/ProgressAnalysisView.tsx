import React, { useState } from 'react';
import {
  TrendingUp,
  Layers,
  ShieldCheck,
  AlertTriangle,
  BookOpen,
  ArrowRightLeft,
  CheckCircle2,
  Calendar,
  Sparkles,
  Info,
} from 'lucide-react';
import { Subject, PlanStats, FlattenedLesson } from '../types';

interface ProgressAnalysisViewProps {
  stats: PlanStats;
  subjects: Subject[];
  flattenedLessons: FlattenedLesson[];
}

export const ProgressAnalysisView: React.FC<ProgressAnalysisViewProps> = ({
  stats,
  subjects,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{
    subjectId: string;
    unitIndex: number;
    unitName: string;
    b1Val: number;
    b2Val: number;
    b1Total: number;
    b2Total: number;
    x: number;
    y: number;
  } | null>(null);

  const [chartType, setChartType] = useState<'cumulative' | 'perUnit'>('cumulative');

  const isOnTrack = stats.targetDailyRate >= stats.requiredDailyRate;

  return (
    <div className="space-y-8">
      
      {/* Top Velocity & Health Dashboard */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">تحليل الوتيرة ومقارنة تقدم الكتب</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                تتبع مستقل ودقيق لتقدم «الكتاب الأول» و«الكتاب الثاني» في كل مادة عبر الرسوم البيانية التراكمية.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">نمط الرسم البياني:</span>
            <div className="inline-flex p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs">
              <button
                onClick={() => setChartType('cumulative')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  chartType === 'cumulative'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                تراكمي (Stacked Area)
              </button>
              <button
                onClick={() => setChartType('perUnit')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  chartType === 'perUnit'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                حسب كل وحدة
              </button>
            </div>
          </div>
        </div>

        {/* Global Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">إجمالي الدروس بجميع الكتب</span>
            <div className="text-2xl font-extrabold text-white font-mono mt-1">
              {stats.totalLessons} <sub className="text-xs text-slate-500 font-normal">درس</sub>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              تم إنجاز {stats.completedLessons} درس بنسبة ({stats.completionPercentage}%)
            </p>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">حالة الوتيرة اليومية</span>
            <div className="flex items-center gap-2 mt-1">
              {isOnTrack ? (
                <>
                  <span className="text-2xl font-extrabold text-emerald-400 font-mono">ممتازة</span>
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </>
              ) : (
                <>
                  <span className="text-2xl font-extrabold text-amber-400 font-mono">تتطلب زيادة</span>
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                </>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              المطلوب: {stats.requiredDailyRate} درس/يوم · الحالي: {stats.targetDailyRate} درس/يوم
            </p>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">الأيام المتبقية حتى الموعد</span>
            <div className="text-2xl font-extrabold text-indigo-400 font-mono mt-1">
              {stats.daysRemaining} <sub className="text-xs text-slate-500 font-normal">يومًا</sub>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              تاريخ الهدف: 1 يناير 2027
            </p>
          </div>
        </div>
      </div>

      {/* DEDICATED SECTION FOR EACH SUBJECT WITH STACKED AREA CHART */}
      <div className="space-y-8">
        {subjects.map((subject, subIndex) => {
          const book1 = subject.books[0] || { id: 'b1', name: 'الكتاب الأول', units: [] };
          const book2 = subject.books[1] || { id: 'b2', name: 'الكتاب الثاني', units: [] };

          // Compute Book 1 Stats
          let b1Total = 0;
          let b1Done = 0;
          book1.units.forEach((u) =>
            u.lessons.forEach((l) => {
              b1Total++;
              if (l.completed) b1Done++;
            })
          );
          const b1Pct = b1Total > 0 ? Math.round((b1Done / b1Total) * 100) : 0;

          // Compute Book 2 Stats
          let b2Total = 0;
          let b2Done = 0;
          book2.units.forEach((u) =>
            u.lessons.forEach((l) => {
              b2Total++;
              if (l.completed) b2Done++;
            })
          );
          const b2Pct = b2Total > 0 ? Math.round((b2Done / b2Total) * 100) : 0;

          const totalSubLessons = b1Total + b2Total;
          const totalSubDone = b1Done + b2Done;
          const totalSubPct =
            totalSubLessons > 0 ? Math.round((totalSubDone / totalSubLessons) * 100) : 0;

          // Compare Book 1 vs Book 2
          const diffLessons = b1Done - b2Done;
          let compareMsg = '';
          if (diffLessons > 0) {
            compareMsg = `الكتاب الأول متقدم بـ ${diffLessons} درس (+${b1Pct - b2Pct}%)`;
          } else if (diffLessons < 0) {
            compareMsg = `الكتاب الثاني متقدم بـ ${Math.abs(diffLessons)} درس (+${b2Pct - b1Pct}%)`;
          } else {
            compareMsg = 'الكتابان متطابقان تمامًا في الإنجاز';
          }

          // Build Data Series along the units
          // Reference unit names from book1
          const unitPoints = book1.units.map((u1, idx) => {
            const u2 = book2.units[idx] || { lessons: [] };
            const u1Done = u1.lessons.filter((l) => l.completed).length;
            const u2Done = u2.lessons.filter((l) => l.completed).length;
            const u1Total = u1.lessons.length;
            const u2Total = u2.lessons.length;

            return {
              name: u1.name,
              shortName: u1.name.length > 20 ? u1.name.substring(0, 18) + '...' : u1.name,
              u1Done,
              u2Done,
              u1Total,
              u2Total,
            };
          });

          // Compute cumulative or per-unit values
          let cumB1 = 0;
          let cumB2 = 0;
          const seriesData = unitPoints.map((item) => {
            if (chartType === 'cumulative') {
              cumB1 += item.u1Done;
              cumB2 += item.u2Done;
              return {
                name: item.name,
                shortName: item.shortName,
                b1: cumB1,
                b2: cumB2,
                stacked: cumB1 + cumB2,
                b1Total: b1Total,
                b2Total: b2Total,
              };
            } else {
              return {
                name: item.name,
                shortName: item.shortName,
                b1: item.u1Done,
                b2: item.u2Done,
                stacked: item.u1Done + item.u2Done,
                b1Total: item.u1Total,
                b2Total: item.u2Total,
              };
            }
          });

          // SVG geometry parameters
          const svgWidth = 800;
          const svgHeight = 280;
          const padLeft = 60;
          const padRight = 50;
          const padTop = 30;
          const padBottom = 60;
          const plotW = svgWidth - padLeft - padRight;
          const plotH = svgHeight - padTop - padBottom;
          const baselineY = svgHeight - padBottom;

          // Max value for Y scaling
          const maxStackedVal =
            chartType === 'cumulative'
              ? Math.max(1, totalSubLessons)
              : Math.max(1, ...seriesData.map((d) => Math.max(d.b1Total + d.b2Total, d.stacked)));

          // Points including origin (0, 0)
          const allPoints = [
            {
              name: 'البداية',
              shortName: '0',
              b1: 0,
              b2: 0,
              stacked: 0,
              b1Total: 0,
              b2Total: 0,
            },
            ...seriesData,
          ];

          const stepX = plotW / (allPoints.length - 1);

          const coords = allPoints.map((pt, i) => {
            const x = padLeft + i * stepX;
            const y1 = baselineY - (pt.b1 / maxStackedVal) * plotH;
            const yStacked = baselineY - (pt.stacked / maxStackedVal) * plotH;
            return { x, y1, yStacked, ...pt };
          });

          // Area 1: Book 1 (Bottom Layer - Indigo)
          // Starts at (x0, baselineY), goes up along (xi, y1_i), drops to (xN, baselineY), closes
          const area1Path =
            `M ${coords[0].x} ${baselineY} ` +
            coords.map((c) => `L ${c.x} ${c.y1}`).join(' ') +
            ` L ${coords[coords.length - 1].x} ${baselineY} Z`;

          // Line 1: Book 1 line
          const line1Path =
            `M ${coords[0].x} ${coords[0].y1} ` +
            coords.slice(1).map((c) => `L ${c.x} ${c.y1}`).join(' ');

          // Area 2: Book 2 (Top Stacked Layer - Emerald/Cyan)
          // Starts from (x0, y1_0), goes along yStacked to (xN, yStacked_N), drops to (xN, y1_N), goes backwards along y1 to (x0, y1_0)
          const area2Path =
            `M ${coords[0].x} ${coords[0].y1} ` +
            coords.map((c) => `L ${c.x} ${c.yStacked}`).join(' ') +
            ` L ${coords[coords.length - 1].x} ${coords[coords.length - 1].y1} ` +
            coords.slice().reverse().map((c) => `L ${c.x} ${c.y1}`).join(' ') +
            ` Z`;

          // Line 2: Stacked line
          const line2Path =
            `M ${coords[0].x} ${coords[0].yStacked} ` +
            coords.slice(1).map((c) => `L ${c.x} ${c.yStacked}`).join(' ');

          return (
            <div
              key={subject.id}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-lg"
            >
              {/* Subject Box Header */}
              <div className="p-6 border-b border-slate-800 bg-gradient-to-l from-slate-900 via-slate-900/80 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-md text-sm"
                    style={{ backgroundColor: subject.color || '#6366f1' }}
                  >
                    0{subIndex + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                      <span>{subject.name}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700/60 font-mono">
                        {totalSubDone} من {totalSubLessons} درس مكتمل ({totalSubPct}%)
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      مقارنة أداء الكتاب الأول مع الكتاب الثاني بواسطة المخطط المكدس (Stacked Area Chart)
                    </p>
                  </div>
                </div>

                {/* Comparative Difference Pill */}
                <div className="bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-2 text-xs">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-slate-300 font-semibold">{compareMsg}</span>
                </div>
              </div>

              {/* Two Books KPI Comparison Cards */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-slate-800/60 bg-slate-950/30">
                {/* Book 1 Box */}
                <div className="bg-slate-900/80 border border-indigo-500/30 rounded-2xl p-4 space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-md bg-indigo-500 shadow-sm shadow-indigo-500/50" />
                      <span className="text-sm font-bold text-white">{book1.name}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-indigo-400">
                      {b1Done} / {b1Total} درس ({b1Pct}%)
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                      style={{ width: `${b1Pct}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>متبقي: {b1Total - b1Done} درس</span>
                    <span>اللون بالمخطط: بنفسجي نيلي</span>
                  </div>
                </div>

                {/* Book 2 Box */}
                <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-4 space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-md bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                      <span className="text-sm font-bold text-white">{book2.name}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {b2Done} / {b2Total} درس ({b2Pct}%)
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                      style={{ width: `${b2Pct}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>متبقي: {b2Total - b2Done} درس</span>
                    <span>اللون بالمخطط: أخضر زمردي</span>
                  </div>
                </div>
              </div>

              {/* STACKED AREA CHART (Pure SVG) */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded bg-indigo-500" />
                      <span className="text-slate-200">{book1.name} (الطبقة السفلية)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded bg-emerald-500" />
                      <span className="text-slate-200">{book2.name} (الطبقة المكدسة العلوية)</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                    <Info className="w-3.5 h-3.5" />
                    <span>مرر مؤشر الفأرة فوق النقاط لمشاهدة تفاصيل كل وحدة</span>
                  </span>
                </div>

                <div className="w-full overflow-x-auto bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80">
                  <svg
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    className="w-full h-auto min-w-[620px] select-none"
                  >
                    <defs>
                      {/* Gradient for Book 1 Area */}
                      <linearGradient id={`grad-b1-${subject.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
                      </linearGradient>

                      {/* Gradient for Book 2 Area */}
                      <linearGradient id={`grad-b2-${subject.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.65" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                      const y = baselineY - ratio * plotH;
                      const val = Math.round(ratio * maxStackedVal);
                      return (
                        <g key={ratio}>
                          <line
                            x1={padLeft}
                            y1={y}
                            x2={svgWidth - padRight}
                            y2={y}
                            stroke="#1e293b"
                            strokeDasharray="4 4"
                          />
                          <text
                            x={padLeft - 10}
                            y={y + 4}
                            textAnchor="end"
                            fill="#64748b"
                            fontSize="11"
                            fontFamily="monospace"
                          >
                            {val}
                          </text>
                        </g>
                      );
                    })}

                    {/* Stacked Area 2 (Book 2 Layer on top of Book 1) */}
                    <path
                      d={area2Path}
                      fill={`url(#grad-b2-${subject.id})`}
                      className="transition-all duration-300"
                    />

                    {/* Stacked Area 1 (Book 1 Layer) */}
                    <path
                      d={area1Path}
                      fill={`url(#grad-b1-${subject.id})`}
                      className="transition-all duration-300"
                    />

                    {/* Stacked top stroke line (Book 2 outline) */}
                    <path
                      d={line2Path}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Intermediate stroke line (Book 1 outline) */}
                    <path
                      d={line1Path}
                      fill="none"
                      stroke="#818cf8"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Baseline X Axis */}
                    <line
                      x1={padLeft}
                      y1={baselineY}
                      x2={svgWidth - padRight}
                      y2={baselineY}
                      stroke="#334155"
                      strokeWidth="1.5"
                    />

                    {/* Vertical X Axis labels and tick marks */}
                    {coords.map((c, idx) => (
                      <g key={idx}>
                        <line
                          x1={c.x}
                          y1={baselineY}
                          x2={c.x}
                          y2={baselineY + 6}
                          stroke="#475569"
                        />
                        <text
                          x={c.x}
                          y={baselineY + 22}
                          textAnchor="middle"
                          fill="#94a3b8"
                          fontSize="11"
                          fontWeight="500"
                          className="select-none"
                        >
                          {c.shortName}
                        </text>
                      </g>
                    ))}

                    {/* Interactive Marker Circles for Book 1 & Book 2 */}
                    {coords.slice(1).map((c, idx) => (
                      <g key={idx}>
                        {/* Book 1 Dot */}
                        <circle
                          cx={c.x}
                          cy={c.y1}
                          r="5"
                          fill="#6366f1"
                          stroke="#0f172a"
                          strokeWidth="2"
                          className="hover:r-7 transition-all cursor-pointer"
                          onMouseEnter={() =>
                            setHoveredPoint({
                              subjectId: subject.id,
                              unitIndex: idx,
                              unitName: c.name,
                              b1Val: c.b1,
                              b2Val: c.b2,
                              b1Total: c.b1Total,
                              b2Total: c.b2Total,
                              x: c.x,
                              y: c.y1,
                            })
                          }
                          onMouseLeave={() => setHoveredPoint(null)}
                        />

                        {/* Book 2 Dot (Stacked on top) */}
                        <circle
                          cx={c.x}
                          cy={c.yStacked}
                          r="5"
                          fill="#10b981"
                          stroke="#0f172a"
                          strokeWidth="2"
                          className="hover:r-7 transition-all cursor-pointer"
                          onMouseEnter={() =>
                            setHoveredPoint({
                              subjectId: subject.id,
                              unitIndex: idx,
                              unitName: c.name,
                              b1Val: c.b1,
                              b2Val: c.b2,
                              b1Total: c.b1Total,
                              b2Total: c.b2Total,
                              x: c.x,
                              y: c.yStacked,
                            })
                          }
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      </g>
                    ))}
                  </svg>
                </div>

                {/* Hover Tooltip Card */}
                {hoveredPoint && hoveredPoint.subjectId === subject.id && (
                  <div className="mt-3 p-3.5 rounded-xl bg-slate-950 border border-slate-700/80 text-xs shadow-xl flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <span className="text-slate-400 font-medium">الوحدة / الفصل: </span>
                      <strong className="text-white">{hoveredPoint.unitName}</strong>
                    </div>
                    <div className="flex items-center gap-4 font-mono">
                      <span className="text-indigo-400 font-bold">
                        الكتاب الأول: {hoveredPoint.b1Val} درس منجز
                      </span>
                      <span className="text-slate-500">·</span>
                      <span className="text-emerald-400 font-bold">
                        الكتاب الثاني: {hoveredPoint.b2Val} درس منجز
                      </span>
                      <span className="text-slate-500">·</span>
                      <span className="text-white font-bold">
                        المجموع التراكمي: {hoveredPoint.b1Val + hoveredPoint.b2Val} درس
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Detailed Unit by Unit Dual-Book Breakdown Table */}
              <div className="p-6 pt-0">
                <div className="rounded-2xl border border-slate-800 overflow-hidden">
                  <div className="p-3 bg-slate-950/60 border-b border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    <span>جدول مقارنة إنجاز الوحدات بين الكتاب الأول والكتاب الثاني</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-950/30 text-slate-400">
                          <th className="py-2.5 pr-4">الوحدة / الفصل</th>
                          <th className="py-2.5 px-3 text-center">إجمالي دروس الوحدة</th>
                          <th className="py-2.5 px-3 text-center text-indigo-400">الكتاب الأول (المنجز)</th>
                          <th className="py-2.5 px-3 text-center text-emerald-400">الكتاب الثاني (المنجز)</th>
                          <th className="py-2.5 pl-4 text-center">المقارنة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono">
                        {book1.units.map((u1, uIdx) => {
                          const u2 = book2.units[uIdx] || { lessons: [] };
                          const u1Done = u1.lessons.filter((l) => l.completed).length;
                          const u2Done = u2.lessons.filter((l) => l.completed).length;
                          const uTotal = u1.lessons.length;
                          const uDiff = u1Done - u2Done;

                          return (
                            <tr key={u1.id} className="hover:bg-slate-950/40 transition-colors">
                              <td className="py-3 pr-4 font-sans font-bold text-slate-200">
                                {u1.name}
                              </td>
                              <td className="py-3 px-3 text-center text-slate-400">
                                {uTotal} درس
                              </td>
                              <td className="py-3 px-3 text-center text-indigo-400 font-bold">
                                {u1Done} / {uTotal}
                              </td>
                              <td className="py-3 px-3 text-center text-emerald-400 font-bold">
                                {u2Done} / {uTotal}
                              </td>
                              <td className="py-3 pl-4 text-center font-sans">
                                {uDiff > 0 ? (
                                  <span className="text-indigo-400 text-[11px] font-semibold">
                                    الكتاب الأول متقدم (+{uDiff})
                                  </span>
                                ) : uDiff < 0 ? (
                                  <span className="text-emerald-400 text-[11px] font-semibold">
                                    الكتاب الثاني متقدم (+{Math.abs(uDiff)})
                                  </span>
                                ) : (
                                  <span className="text-slate-500 text-[11px]">
                                    متساويان ({u1Done})
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
