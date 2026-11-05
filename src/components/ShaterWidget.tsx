import React, { useState } from 'react';
import { Star, Zap, X, ChevronRight, CheckCircle2, BookOpen, Sparkles } from 'lucide-react';
import { Subject, FlattenedLesson } from '../types';
import { getAllFlattenedLessons } from '../utils/storage';

interface ShaterWidgetProps {
  subjects: Subject[];
  onCompleteShaterLesson: (lesson: FlattenedLesson) => void;
  shaterCount: number;
}

export const ShaterWidget: React.FC<ShaterWidgetProps> = ({
  subjects,
  onCompleteShaterLesson,
  shaterCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');

  const uncompleted = getAllFlattenedLessons(subjects).filter((l) => !l.completed);
  const filtered = selectedSubjectId === 'all'
    ? uncompleted
    : uncompleted.filter((l) => l.subjectId === selectedSubjectId);

  return (
    <>
      {/* Floating Side Button */}
      <div className="fixed left-3 sm:left-5 top-1/2 -translate-y-1/2 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2 px-3 sm:px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-black shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-yellow-200/50"
          title="الشاطر: حل دروس إضافية واكسب نقاط مضاعفة (+100)"
        >
          {/* Glowing pulse ring */}
          <span className="absolute -inset-1 rounded-2xl bg-yellow-400 opacity-40 blur-sm group-hover:opacity-75 transition animate-pulse pointer-events-none" />
          
          <div className="relative flex items-center gap-1.5">
            <span className="text-xl animate-spin-slow">🌟</span>
            <div className="flex flex-col text-right">
              <span className="text-xs sm:text-sm font-extrabold tracking-tight leading-tight">
                الشاطر
              </span>
              <span className="text-[10px] font-bold text-amber-950 bg-yellow-300/80 px-1.5 py-0.2 rounded-md">
                +100 نقطة
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Modal / Drawer for El-Shater */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
          <div 
            className="relative w-full max-w-xl max-h-[88vh] bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-5 sm:p-7 flex flex-col shadow-2xl text-right overflow-hidden animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-md">
                  <Star className="w-7 h-7 fill-slate-950 text-slate-950" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <span>تحدي «الشاطر» للمتفوقين</span>
                    <span className="text-xs font-bold text-amber-950 bg-amber-400 px-2.5 py-0.5 rounded-full">
                      مكافأة مضاعفة
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    أنجز دروساً إضافية تفوق خطتك اليومية واكسب <strong className="text-amber-400 font-bold">+100 نقطة</strong> لكل درس!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Achievement Bar */}
            <div className="my-4 p-3.5 bg-gradient-to-r from-amber-500/10 via-yellow-500/15 to-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Zap className="w-5 h-5 text-amber-400 animate-bounce" />
                <div>
                  <div className="text-xs text-slate-300 font-medium">إنجازات الشاطر المحققة</div>
                  <div className="text-sm font-bold text-white">
                    لقد أنجزت <span className="text-amber-400 font-black">{shaterCount}</span> درساً إضافياً بشجاعة!
                  </div>
                </div>
              </div>
              <span className="text-2xl">⚡</span>
            </div>

            {/* Subject Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-3 no-scrollbar">
              <button
                onClick={() => setSelectedSubjectId('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedSubjectId === 'all'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                جميع المواد ({uncompleted.length})
              </button>
              {subjects.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubjectId(sub.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedSubjectId === sub.id
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>

            {/* Lessons List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 pl-1 custom-scrollbar">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-2 animate-spin-slow" />
                  <p className="text-sm font-bold text-white">ما شاء الله عليك! أنجزت كل هذه الدروس بالكامل!</p>
                  <p className="text-xs text-slate-400 mt-1">اختر مادة أخرى أو راجع ما أنجزته من صفحة المراجعة.</p>
                </div>
              ) : (
                filtered.slice(0, 30).map((l) => (
                  <div
                    key={`${l.bookId}-${l.lessonId}`}
                    className="p-3 bg-slate-800/70 border border-slate-700 hover:border-amber-500/40 rounded-2xl flex items-center justify-between gap-3 transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold text-amber-400 flex-shrink-0">
                        +100
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">
                          {l.lessonTitle}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span className="text-slate-300 font-semibold">{l.subjectName}</span>
                          <span>•</span>
                          <span className="text-indigo-300">{l.bookName}</span>
                          <span>•</span>
                          <span className="truncate">{l.unitName}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onCompleteShaterLesson(l)}
                      className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition-transform active:scale-95 flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>إنجاز شاطر 🌟</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="text-amber-300">
                🚀 الشاطر لا يكتفي بالحد الأدنى.. بل يصنع الفارق!
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
