import React, { useState } from 'react';
import {
  Target,
  CheckCircle2,
  Calendar,
  Flame,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  Layers,
  ChevronLeft,
  BookOpen,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Dumbbell,
} from 'lucide-react';
import { FlattenedLesson, PlanStats, StudyDates, StudySettings, Subject, StudentProfile } from '../types';

interface TargetRoadmapViewProps {
  stats: PlanStats;
  dates: StudyDates;
  settings: StudySettings;
  flattenedLessons: FlattenedLesson[];
  subjects: Subject[];
  profile: StudentProfile;
  onToggleLesson: (lessonId: string, completed: boolean) => void;
  onUpdateDailyTarget: (newTarget: number) => void;
  onApplyTargetEvaluation: (met: boolean) => void;
}

export const TargetRoadmapView: React.FC<TargetRoadmapViewProps> = ({
  stats,
  dates,
  settings,
  flattenedLessons,
  subjects,
  profile,
  onToggleLesson,
  onUpdateDailyTarget,
  onApplyTargetEvaluation,
}) => {
  const [activeRoadmapSubject, setActiveRoadmapSubject] = useState<string>('all');
  const [roadmapScope, setRoadmapScope] = useState<'today' | 'week' | 'allRemaining'>('today');
  const [evaluationFeedback, setEvaluationFeedback] = useState<string | null>(null);

  // Incomplete lessons ordered sequentially
  const remainingLessons = flattenedLessons.filter((l) => !l.completed);

  // Automatic target quota required to finish on time
  const requiredTodayCount = Math.max(1, stats.todayRequiredToFinishOnTime || Math.ceil(stats.requiredDailyRate) || 2);
  const completedToday = stats.completedToday || 0;
  const isTargetAchievedToday = completedToday >= requiredTodayCount;
  const progressRatio = Math.min(100, Math.round((completedToday / requiredTodayCount) * 100));

  const todayTargetLessons = remainingLessons.slice(0, Math.max(1, requiredTodayCount - completedToday));
  const weeklyTargetLessons = remainingLessons.slice(0, requiredTodayCount * 7);

  // Milestone targets
  const currentDone = stats.completedLessons;
  const total = stats.totalLessons;
  const target25 = Math.ceil(total * 0.25);
  const target50 = Math.ceil(total * 0.5);
  const target75 = Math.ceil(total * 0.75);
  const target100 = total;

  const nextMilestone =
    currentDone < target25
      ? { label: '25%', targetVal: target25, needed: target25 - currentDone }
      : currentDone < target50
      ? { label: '50%', targetVal: target50, needed: target50 - currentDone }
      : currentDone < target75
      ? { label: '75%', targetVal: target75, needed: target75 - currentDone }
      : { label: '100% (الختام)', targetVal: target100, needed: Math.max(0, target100 - currentDone) };

  // Filter lessons based on active subject
  const getSubjectLessons = (list: FlattenedLesson[]) => {
    if (activeRoadmapSubject === 'all') return list;
    return list.filter((l) => l.subjectId === activeRoadmapSubject);
  };

  const currentListToDisplay =
    roadmapScope === 'today'
      ? getSubjectLessons(todayTargetLessons)
      : roadmapScope === 'week'
      ? getSubjectLessons(weeklyTargetLessons)
      : getSubjectLessons(remainingLessons);

  // Automatic verification of today's target based on actual completed lessons
  const handleVerifyTodayTarget = () => {
    if (isTargetAchievedToday) {
      onApplyTargetEvaluation(true);
      setEvaluationFeedback(
        `✅ تم التحقق حسابياً: أنجزت اليوم ${completedToday} درس من ${requiredTodayCount} المطلوبة لإنهاء المنهج في ${dates.end}! مبروك مكافأة الالتزام (+25 نقطة).`
      );
    } else {
      onApplyTargetEvaluation(false);
      setEvaluationFeedback(
        `⚠️ تم التحقق حسابياً: أنجزت اليوم ${completedToday} درس فقط من أصل ${requiredTodayCount} المطلوبة لإنهاء المنهج في موعده! تم خصم 25 نقطة جزاء تأخير.`
      );
    }
    setTimeout(() => setEvaluationFeedback(null), 6000);
  };

  return (
    <div className="space-y-6">
      
      {/* Target Roadmap Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 rounded-3xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-1">
              <Target className="w-4 h-4" />
              <span>خارطة تحقيق التارجت المنهجي المحسوب آلياً</span>
            </div>
            <h2 className="text-xl font-extrabold text-white">
              المطلوب إنجازه لإنهاء المنهج في {dates.end}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              التارجت لا يُقاس بالكلام؛ بل يُحسب بدقة رياضية بناءً على الدروس التي تضمن ختم المنهج في موعدك المحدد.
            </p>
          </div>

          {/* Stepper for Daily Target */}
          <div className="bg-slate-950/90 border border-slate-800 p-2.5 rounded-2xl flex items-center gap-3 self-start md:self-auto">
            <div className="text-xs text-slate-400 pl-1">
              المطلوب يومياً للموعد: <strong className="text-emerald-400 font-mono text-sm">{requiredTodayCount}</strong> درس/يوم
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onUpdateDailyTarget(Math.max(1, requiredTodayCount - 1))}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center cursor-pointer"
                title="تقليل الهدف اليومي"
              >
                -
              </button>
              <button
                onClick={() => onUpdateDailyTarget(requiredTodayCount + 1)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center cursor-pointer"
                title="زيادة الهدف اليومي"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* 4 Roadmap Milestone Strips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/90">
            <span className="text-[11px] text-slate-400 block font-medium">المطلوب لإنهاء المنهج</span>
            <div className="text-2xl font-extrabold text-white font-mono mt-0.5">
              {stats.remainingLessons} <sub className="text-xs text-slate-500 font-normal">درس متبقي</sub>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              من إجمالي {stats.totalLessons} درس بالكتابين
            </p>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/90">
            <span className="text-[11px] text-slate-400 block font-medium">المعدل الحاسم رياضياً</span>
            <div className="text-2xl font-extrabold text-amber-400 font-mono mt-0.5">
              {stats.requiredDailyRate} <sub className="text-xs text-slate-500 font-normal">درس / يوم</sub>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              حتى تاريخ {dates.end}
            </p>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/90">
            <span className="text-[11px] text-slate-400 block font-medium">المحطة القادمة للتارجت</span>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-0.5">
              مرحلة {nextMilestone.label}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              ناقصك <strong className="text-emerald-300 font-bold">{nextMilestone.needed}</strong> درس لتخطيها
            </p>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/90">
            <span className="text-[11px] text-slate-400 block font-medium">الأيام المتبقية للختام</span>
            <div className="text-2xl font-extrabold text-indigo-400 font-mono mt-0.5">
              {stats.daysRemaining} <sub className="text-xs text-slate-500 font-normal">يومًا</sub>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              حتى نهاية الخطة المحددة
            </p>
          </div>
        </div>
      </div>

      {/* Target Accountability Box Measured Mathematically (نظام القياس الآلي الفعلي) */}
      <div className={`p-5 rounded-3xl border-2 shadow-lg transition-all ${
        isTargetAchievedToday
          ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/40 border-emerald-500/50'
          : 'bg-gradient-to-r from-slate-900 via-rose-950/20 to-slate-900 border-rose-500/30'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-xl border ${
              isTargetAchievedToday
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
            }`}>
              {isTargetAchievedToday ? <ShieldCheck className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">
                  القياس الآلي الفعلي لتارجت اليوم ({completedToday} / {requiredTodayCount} درس)
                </h3>
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${
                  isTargetAchievedToday
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  {isTargetAchievedToday ? 'التارجت محقق فعلياً ✓' : 'قيد الإنجاز اليومي'}
                </span>
              </div>

              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {isTargetAchievedToday ? (
                  <span>
                    🎉 <strong className="text-emerald-400 font-bold">عاش يا بطل!</strong> قمت بإنهاء ما يضمن لك ختم المنهج في موعدك ({dates.end}) اليوم بالكامل!
                  </span>
                ) : (
                  <span>
                    ⏳ أنجزت اليوم <strong className="text-white font-mono">{completedToday}</strong> درس. متبقي لك <strong className="text-amber-400 font-mono">{Math.max(0, requiredTodayCount - completedToday)}</strong> درس لحسم تارجت اليوم وتفادي الخصم!
                  </span>
                )}
              </p>

              {/* Progress bar of today's target */}
              <div className="w-full max-w-md bg-slate-950 rounded-full h-2.5 mt-2.5 overflow-hidden border border-slate-800">
                <div
                  className={`h-full transition-all duration-500 ${isTargetAchievedToday ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  style={{ width: `${progressRatio}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            <button
              onClick={handleVerifyTodayTarget}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                isTargetAchievedToday
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>فحص وتطبيق التقييم الآلي لليوم</span>
            </button>
          </div>
        </div>

        {evaluationFeedback && (
          <div className="mt-3.5 p-3 bg-slate-950/90 rounded-xl border border-slate-700 text-xs font-semibold text-slate-200 animate-fade-in flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{evaluationFeedback}</span>
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div>
            رصيدك الحالي: <strong className="text-amber-400 font-mono">🪙 {profile.points} نقطة</strong>
          </div>
          <div>
            مرات الجيم المكتملة: <strong className="text-emerald-400 font-mono">{profile.gymVisitsCount || 0} مرات 🏋️‍♂️</strong>
          </div>
          <div>
            عدد مرات الجزاء: <strong className="text-rose-400 font-mono">{profile.penaltyCount || 0} مرة</strong>
          </div>
        </div>
      </div>

      {/* Scope Navigation Tabs */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Scope selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto text-xs">
          <button
            onClick={() => setRoadmapScope('today')}
            className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              roadmapScope === 'today'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>تارجت اليوم المتبقي ({todayTargetLessons.length} دروس)</span>
          </button>

          <button
            onClick={() => setRoadmapScope('week')}
            className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              roadmapScope === 'week'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>تارجت الأسبوع الحالي ({weeklyTargetLessons.length} درس)</span>
          </button>

          <button
            onClick={() => setRoadmapScope('allRemaining')}
            className={`px-4 py-2 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              roadmapScope === 'allRemaining'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>خارطة كل الدروس المتبقية ({remainingLessons.length} درس)</span>
          </button>
        </div>

        {/* Subject Filter inside roadmap */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">تصفية بالمادة:</span>
          <select
            value={activeRoadmapSubject}
            onChange={(e) => setActiveRoadmapSubject(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-slate-300 outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">كافة المواد الثلاث</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Lessons Queue Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="text-base font-bold text-white">
              {roadmapScope === 'today'
                ? 'قائمة الدروس المتبقية اليوم لضمان الختام بالموعد المحدد'
                : roadmapScope === 'week'
                ? 'خارطة الدروس المطلوبة خلال الأسبوع الحالي'
                : 'القائمة الكاملة لكل الدروس المتبقية بالترتيب'}
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {currentListToDisplay.length} درس بالقائمة
          </span>
        </div>

        {currentListToDisplay.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white">عظيم! لقد أنجزت كل ما هو مطلوب في هذا النطاق.</h4>
            <p className="text-xs text-slate-500 mt-1">
              أنت متقدم في التارجت تماماً، يمكنك أخذ راحة أو حل دروس إضافية من أيقونة الشاطر!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {currentListToDisplay.map((item, idx) => {
              const isBook1 = item.bookName.includes('الأول');
              return (
                <div
                  key={item.lessonId}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-950/40 px-3 rounded-2xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span
                          className="font-bold"
                          style={{ color: item.subjectColor }}
                        >
                          {item.subjectName}
                        </span>
                        <span>·</span>
                        <span
                          className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                            isBook1
                              ? 'bg-indigo-500/10 text-indigo-400'
                              : 'bg-emerald-500/10 text-emerald-400'
                          }`}
                        >
                          {item.bookName}
                        </span>
                        <span>·</span>
                        <span>{item.unitName}</span>
                      </div>
                      <div className="text-sm font-semibold text-slate-100 mt-1">
                        {item.lessonTitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                      onClick={() => onToggleLesson(item.lessonId, true)}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-sm shadow-emerald-600/20 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>تم إنجازه وحسمه بالتارجت</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
