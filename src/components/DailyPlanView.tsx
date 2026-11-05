import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, BookOpen, CheckCircle, Award, Sparkles, Plus, Clock } from 'lucide-react';
import { FlattenedLesson, PlanStats, StudySettings } from '../types';
import { playTimerFinishSound } from '../utils/storage';

interface DailyPlanViewProps {
  stats: PlanStats;
  settings: StudySettings;
  flattenedLessons: FlattenedLesson[];
  onToggleLesson: (lessonId: string, completed: boolean) => void;
  onUpdateDailyTarget: (newTarget: number) => void;
}

export const DailyPlanView: React.FC<DailyPlanViewProps> = ({
  stats,
  settings,
  flattenedLessons,
  onToggleLesson,
  onUpdateDailyTarget,
}) => {
  // Pomodoro state
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setTimerRunning(false);
            playTimerFinishSound();
            // Switch mode
            if (timerMode === 'work') {
              setTimerMode('break');
              return (settings.pomodoroBreakMinutes || 5) * 60;
            } else {
              setTimerMode('work');
              return (settings.pomodoroWorkMinutes || 25) * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerMode, settings]);

  const toggleTimer = () => setTimerRunning(!timerRunning);
  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(
      (timerMode === 'work' ? settings.pomodoroWorkMinutes || 25 : settings.pomodoroBreakMinutes || 5) * 60
    );
  };
  const switchMode = () => {
    setTimerRunning(false);
    if (timerMode === 'work') {
      setTimerMode('break');
      setTimerSeconds((settings.pomodoroBreakMinutes || 5) * 60);
    } else {
      setTimerMode('work');
      setTimerSeconds((settings.pomodoroWorkMinutes || 25) * 60);
    }
  };

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Incomplete lessons for today
  const incompleteLessons = flattenedLessons.filter((l) => !l.completed);
  const currentTarget = Math.max(1, settings.dailyTarget || 3);
  const todayLessons = incompleteLessons.slice(0, currentTarget);

  // Projected finish days
  const projectedDays = Math.ceil(stats.remainingLessons / currentTarget);

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Pomodoro Focus Timer */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800/80 text-slate-300 border border-slate-700/60">
            {timerMode === 'work' ? (
              <>
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>جلسة مذاكرة وتركيز</span>
              </>
            ) : (
              <>
                <Coffee className="w-3.5 h-3.5 text-emerald-400" />
                <span>استراحة وتجديد طاقة</span>
              </>
            )}
          </div>

          {/* Clock Display */}
          <div className="text-6xl sm:text-7xl font-extrabold tracking-wider font-mono text-white select-none py-2">
            {timeString}
          </div>

          {/* Timer Controls */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={toggleTimer}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer ${
                timerRunning
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              {timerRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>إيقاف مؤقت</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>بدء الجلسة</span>
                </>
              )}
            </button>

            <button
              onClick={resetTimer}
              title="إعادة تعيين المؤقت"
              className="p-2.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={switchMode}
              title="تبديل بين جلسة المذاكرة والاستراحة"
              className="px-3 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              {timerMode === 'work' ? 'تبديل للراحة (5د)' : 'تبديل للمذاكرة (25د)'}
            </button>
          </div>
        </div>
      </div>

      {/* Target Setting & Smart Pacing Advisor */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>تحديد المستهدف اليومي والتحليل الذكي</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              اختر عدد الدروس التي تنوي إنجازها اليوم لتنظيم قائمة مهامك.
            </p>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 p-1.5 rounded-xl">
            <span className="text-xs text-slate-400 pr-2">المستهدف:</span>
            <button
              onClick={() => onUpdateDailyTarget(Math.max(1, currentTarget - 1))}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center cursor-pointer"
            >
              -
            </button>
            <span className="text-base font-bold text-emerald-400 font-mono tabular-nums px-2">
              {currentTarget}
            </span>
            <button
              onClick={() => onUpdateDailyTarget(currentTarget + 1)}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center cursor-pointer"
            >
              +
            </button>
            <span className="text-xs text-slate-400 pl-2">دروس/يوم</span>
          </div>
        </div>

        {/* Smart advisory pill card */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              بالمعدل المختار ({currentTarget} دروس يوميًا)، ستنتهي من كامل الدروس المتبقية ({stats.remainingLessons} درس) خلال 
              <strong className="text-emerald-400 font-bold mx-1">{projectedDays} يومًا</strong>
            </span>
          </div>
          <div className="text-slate-400 font-mono">
            المعدل الأدنى لتاريخ 1 يناير: <span className="text-amber-400 font-semibold">{stats.requiredDailyRate} درس/يوم</span>
          </div>
        </div>
      </div>

      {/* Today's Action Checklist */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">قائمة مهام اليوم المقترحة</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              حدد كل درس يتم إنجازه لتحديث إحصائياتك ونسبة تقدمك فورًا.
            </p>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            متبقي لليوم: <span className="text-indigo-400 font-bold">{todayLessons.length}</span> درس
          </div>
        </div>

        {todayLessons.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white">عظيم! أنجزت كل ما هو محدد لليوم.</h4>
            <p className="text-xs text-slate-500 mt-1">
              يمكنك زيادة المستهدف اليومي من الأعلى إذا أردت استكمال المزيد من الدروس.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60 mt-2">
            {todayLessons.map((item, index) => (
              <div
                key={item.lessonId}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/40 rounded-xl px-2 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      <span style={{ color: item.subjectColor }} className="font-bold">{item.subjectName}</span>
                      <span>·</span>
                      <span>{item.bookName}</span>
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
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 rounded-xl transition-all cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>تم الإنجاز</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
