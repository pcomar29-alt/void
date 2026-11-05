import React from 'react';
import { BookOpen, CheckCircle2, TrendingUp, Calendar, ArrowLeft, Flame, Sparkles, Target, AlertCircle } from 'lucide-react';
import { Subject, StudyDates, PlanStats, FlattenedLesson, StudentProfile } from '../types';
import { NavTab } from './Navbar';
import { Dumbbell, ShieldCheck, Clock } from 'lucide-react';

interface DashboardViewProps {
  stats: PlanStats;
  dates: StudyDates;
  subjects: Subject[];
  flattenedLessons: FlattenedLesson[];
  profile?: StudentProfile;
  onToggleLesson: (lessonId: string, completed: boolean) => void;
  onNavigateTab: (tab: NavTab) => void;
  onFilterSubject?: (subjectId: string) => void;
  onOpenRewards?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  dates,
  subjects,
  flattenedLessons,
  profile,
  onToggleLesson,
  onNavigateTab,
  onOpenRewards,
}) => {
  // Suggest lessons for today (first N incomplete lessons)
  const todaySuggested = flattenedLessons
    .filter((l) => !l.completed)
    .slice(0, Math.max(1, stats.targetDailyRate || 3));

  const gymVisits = profile?.gymVisitsCount || 0;
  const isTargetMet = stats.todayTargetMet;

  return (
    <div className="space-y-6">
      
      {/* Gym Visits & Points Showcase Bar */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-amber-950/40 border border-emerald-500/30 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-2xl shrink-0">
            🏋️‍♂️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-white">
                أنا روحت الجيم كم مرة: <span className="text-emerald-400 font-mono text-lg">{gymVisits}</span> مرات
              </span>
              <span className="text-[10px] bg-emerald-500/15 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                فورمة ودماغ 🦾
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              النقاط صعبة ومستحقة: كل 10 دروس تخلصهم يفتحوا لك تمرينة جيم كاملة مع ميمات الفرحة المصرية!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
          <div className="text-right px-3.5 py-2 bg-slate-950/80 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">رصيد النقاط:</span>
            <span className="text-base font-black text-amber-300 font-mono">🪙 {profile?.points || 0} نقطة</span>
          </div>
          {onOpenRewards && (
            <button
              onClick={onOpenRewards}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs rounded-2xl shadow-md transition-all cursor-pointer active:scale-95"
            >
              فتح المتجر 🎁
            </button>
          )}
        </div>
      </div>

      {/* Daily Measured Target Indicator */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
        isTargetMet
          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
          : 'bg-slate-900 border-slate-800 text-slate-300'
      }`}>
        <div className="flex items-center gap-2">
          {isTargetMet ? <ShieldCheck className="w-5 h-5 text-emerald-400" /> : <Clock className="w-5 h-5 text-amber-400" />}
          <div>
            <span className="font-bold text-white">
              قياس التارجت اليومي الآلي:
            </span>{' '}
            أنجزت اليوم <strong className="text-white font-mono">{stats.completedToday || 0}</strong> من أصل{' '}
            <strong className="text-emerald-400 font-mono">{stats.todayRequiredToFinishOnTime || 2}</strong> دروس مطلوبة لختام المنهج في {dates.end}.
          </div>
        </div>
        <button
          onClick={() => onNavigateTab('target')}
          className="text-xs font-bold text-indigo-400 hover:text-indigo-300 whitespace-nowrap cursor-pointer"
        >
          تفاصيل التارجت ←
        </button>
      </div>
      
      {/* 4 Stat KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700/80 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">إجمالي الدروس</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-white font-mono tabular-nums">
              {stats.totalLessons}
            </span>
            <span className="text-xs text-slate-500">درس بالمنهج</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            موزعة على {subjects.length} مواد دراسية
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700/80 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">الدروس المكتملة</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-emerald-400 font-mono tabular-nums">
              {stats.completedLessons}
            </span>
            <span className="text-xs text-slate-500">منجز حتى الآن</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            متبقي {stats.remainingLessons} درس للمراجعة
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700/80 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">نسبة الإنجاز</span>
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-violet-400 font-mono tabular-nums">
              {stats.completionPercentage}%
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-violet-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.completionPercentage}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700/80 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">الأيام المتبقية</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-amber-400 font-mono tabular-nums">
              {stats.daysRemaining}
            </span>
            <span className="text-xs text-slate-500">يومًا حتى الهدف</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            الموعد المستهدف: {dates.end}
          </div>
        </div>

      </div>

      {/* Main Timeline Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>مؤشر وتيرة المذاكرة والجدول الزمني</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              بداية الخطة: {dates.start} · الهدف إنهاء المنهج قبل: {dates.end}
            </p>
          </div>
          <div className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg font-mono tabular-nums">
            المعدل المطلوب: <strong className="text-amber-400 text-sm">{stats.requiredDailyRate}</strong> درس/يوم
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5 space-y-2">
          <div className="flex justify-between text-xs text-slate-400 font-medium">
            <span>التقدم الإجمالي نحو إنهاء المنهج</span>
            <span className="font-mono tabular-nums text-emerald-400 font-semibold">{stats.completionPercentage}%</span>
          </div>
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className="h-full bg-gradient-to-l from-indigo-500 via-indigo-400 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${Math.max(2, stats.completionPercentage)}%` }}
            />
          </div>
        </div>

        {/* Breakdown chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">الدروس المتبقية</div>
            <div className="text-xl font-bold text-white mt-1 font-mono tabular-nums">
              {stats.remainingLessons} <span className="text-xs text-slate-500 font-normal">درس</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">من أصل {stats.totalLessons} درس</div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">المتوسط اليومي المطلوب</div>
            <div className="text-xl font-bold text-amber-400 mt-1 font-mono tabular-nums">
              {stats.requiredDailyRate} <span className="text-xs text-slate-500 font-normal">درس / يوم</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">لحسم المنهج قبل {dates.end}</div>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">مستهدفك اليومي الحالي</div>
            <div className="text-xl font-bold text-emerald-400 mt-1 font-mono tabular-nums">
              {stats.targetDailyRate} <span className="text-xs text-slate-500 font-normal">درس / يوم</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {stats.targetDailyRate >= stats.requiredDailyRate
                ? 'ممتاز! وتيرتك تضمن إنهاء المنهج مبكرًا'
                : 'يُفضل رفع الهدف اليومي لتفادي التراكم'}
            </div>
          </div>
        </div>
      </div>

      {/* 2 Quick Access Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Target Roadmap Card */}
        <div
          onClick={() => onNavigateTab('target')}
          className="bg-gradient-to-l from-slate-900 to-indigo-950/40 border border-indigo-500/30 hover:border-indigo-500/60 rounded-2xl p-5 cursor-pointer transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                  المفروض أخلص إيه عشان أخلص التارجت؟
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  خارطة الدروس المطلوبة لحسم تارجت اليوم وتارجت الأسبوع حتى 1 يناير
                </p>
              </div>
            </div>
            <ArrowLeft className="w-4 h-4 text-indigo-400 group-hover:-translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Completed & Gaps Review Card */}
        <div
          onClick={() => onNavigateTab('completed')}
          className="bg-gradient-to-l from-slate-900 to-emerald-950/30 border border-emerald-500/30 hover:border-emerald-500/60 rounded-2xl p-5 cursor-pointer transition-all shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  أنا خلصت إيه؟ وهل ناقصني فيه حاجة؟
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  سجل الدروس المنجزة وتحديد النواقص والملاحظات الخاصة بك
                </p>
              </div>
            </div>
            <ArrowLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Grid: Quick Today Focus & Subject Summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Today Focus (2 Columns) */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">دروس مقترحة لليوم</h3>
            </div>
            <button
              onClick={() => onNavigateTab('today')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>فتح خطة اليوم الكاملة ومؤقت التركيز</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          {todaySuggested.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="font-semibold text-white">رائع جدًا! أنهيت جميع الدروس المتبقية.</p>
              <p className="text-xs text-slate-500 mt-1">يمكنك إضافة مواد أو وحدات جديدة من تبويب المواد.</p>
            </div>
          ) : (
            <div className="space-y-2.5 mt-4">
              {todaySuggested.map((item) => (
                <div
                  key={item.lessonId}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={(e) => onToggleLesson(item.lessonId, e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-0 focus:ring-offset-0 bg-slate-800 border-slate-700 cursor-pointer shrink-0"
                    />
                    <div className="truncate">
                      <div className="text-xs text-slate-400 flex items-center gap-1.5">
                        <span style={{ color: item.subjectColor }} className="font-semibold">{item.subjectName}</span>
                        <span>·</span>
                        <span className="truncate">{item.unitName}</span>
                      </div>
                      <div className="text-sm font-medium text-slate-200 mt-0.5 truncate">
                        {item.lessonTitle}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleLesson(item.lessonId, true)}
                    className="px-3 py-1.5 text-xs font-semibold bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-lg transition-colors shrink-0 cursor-pointer"
                  >
                    تم الإنجاز
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subjects Snapshot (1 Column) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">نسبة إنجاز المواد</h3>
              <button
                onClick={() => onNavigateTab('subjects')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
              >
                تصفح الكل
              </button>
            </div>

            <div className="space-y-4 mt-4">
              {subjects.map((subject) => {
                let total = 0;
                let done = 0;
                subject.books.forEach((b) =>
                  b.units.forEach((u) =>
                    u.lessons.forEach((l) => {
                      total++;
                      if (l.completed) done++;
                    })
                  )
                );
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;

                return (
                  <div key={subject.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200">{subject.name}</span>
                      <span className="text-slate-400 font-mono tabular-nums">
                        {done}/{total} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: subject.color || '#6366f1',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={() => onNavigateTab('analysis')}
              className="w-full py-2.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700/80 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>عرض تفاصيل التحليل والرسوم البيانية</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
