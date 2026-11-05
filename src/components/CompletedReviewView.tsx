import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Search,
  BookOpen,
  Filter,
  Layers,
  Edit3,
  RotateCcw,
  Tag,
  Check,
} from 'lucide-react';
import { FlattenedLesson, Subject } from '../types';

interface CompletedReviewViewProps {
  flattenedLessons: FlattenedLesson[];
  subjects: Subject[];
  onUpdateLessonGaps: (
    lessonId: string,
    hasGaps: boolean,
    missingItems: string,
    masteryLevel: 'mastered' | 'needs_revision'
  ) => void;
  onToggleLesson: (lessonId: string, completed: boolean) => void;
}

export const CompletedReviewView: React.FC<CompletedReviewViewProps> = ({
  flattenedLessons,
  subjects,
  onUpdateLessonGaps,
  onToggleLesson,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'mastered' | 'gaps'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedBook, setSelectedBook] = useState<'all' | 'b1' | 'b2'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Editing state for missing items notes: { [lessonId]: string }
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});

  const completedList = flattenedLessons.filter((l) => l.completed);

  // Quick preset chips
  const PRESET_CHIPS = [
    'حل تدريبات إضافية',
    'حفظ وتسميع القوانين',
    'مراجعة أسئلة الامتحانات السابقة',
    'إعادة تلخيص الدرس بيدي',
    'التأكد من حل المسائل الصعبة',
  ];

  const handleNoteChange = (lessonId: string, value: string) => {
    setEditingNotes((prev) => ({ ...prev, [lessonId]: value }));
  };

  const handleSaveMissingNote = (lesson: FlattenedLesson, textToSave?: string) => {
    const text = textToSave !== undefined ? textToSave : (editingNotes[lesson.lessonId] ?? lesson.missingItems ?? '');
    const hasGaps = text.trim().length > 0;
    const mastery = hasGaps ? 'needs_revision' : 'mastered';
    onUpdateLessonGaps(lesson.lessonId, hasGaps, text, mastery);
  };

  const handleSetMastery = (lesson: FlattenedLesson, isMastered: boolean) => {
    const currentText = editingNotes[lesson.lessonId] ?? lesson.missingItems ?? '';
    const newText = isMastered ? '' : (currentText || 'بحاجة لمراجعة وتثبيت');
    onUpdateLessonGaps(
      lesson.lessonId,
      !isMastered,
      newText,
      isMastered ? 'mastered' : 'needs_revision'
    );
    setEditingNotes((prev) => ({ ...prev, [lesson.lessonId]: newText }));
  };

  const handleAddPresetChip = (lesson: FlattenedLesson, chipText: string) => {
    const current = editingNotes[lesson.lessonId] ?? lesson.missingItems ?? '';
    let updated = '';
    if (current.includes(chipText)) {
      return; // already has it
    }
    updated = current.trim() ? `${current} · ${chipText}` : chipText;
    setEditingNotes((prev) => ({ ...prev, [lesson.lessonId]: updated }));
    handleSaveMissingNote(lesson, updated);
  };

  // Filter lessons
  const filteredCompleted = completedList.filter((item) => {
    // Subject filter
    if (selectedSubject !== 'all' && item.subjectId !== selectedSubject) return false;

    // Book filter
    if (selectedBook === 'b1' && !item.bookName.includes('الأول')) return false;
    if (selectedBook === 'b2' && !item.bookName.includes('الثاني')) return false;

    // Mastery filter
    const isMastered = !item.hasGaps && (!item.missingItems || !item.missingItems.trim());
    if (filterType === 'mastered' && !isMastered) return false;
    if (filterType === 'gaps' && isMastered) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText =
        `${item.subjectName} ${item.bookName} ${item.unitName} ${item.lessonTitle} ${item.missingItems || ''}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }

    return true;
  });

  const totalCompleted = completedList.length;
  const countGaps = completedList.filter(
    (l) => l.hasGaps || (l.missingItems && l.missingItems.trim().length > 0)
  ).length;
  const countMastered = totalCompleted - countGaps;

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>سجل ما تم إنجازه ومتابعة النواقص</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              هنا تجد كل ما أنهيته، ويمكنك تحديد ما إذا كان متقنًا 100% أو ناقصك فيه نقاط (حل تدريبات، حفظ، مراجعة) مع كتابة ملاحظاتك بيدك.
            </p>
          </div>

          {/* Quick Counter Chips */}
          <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
            <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
              إجمالي المنجز: <strong className="text-white">{totalCompleted}</strong>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              متقن بالكامل: <strong>{countMastered}</strong>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              به نواقص للتثبيت: <strong>{countGaps}</strong>
            </span>
          </div>
        </div>

        {/* Filter Controls Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في الدروس المنجزة أو النواقص..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
            />
          </div>

          {/* Mastery Status Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">كافة الدروس المنجزة ({totalCompleted})</option>
            <option value="mastered">متقن تمامًا وبدون نواقص ({countMastered})</option>
            <option value="gaps">دروس بها نواقص مسجلة ({countGaps})</option>
          </select>

          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">كافة المواد</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Book Filter */}
          <select
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">الكتابين (الأول والثاني)</option>
            <option value="b1">الكتاب الأول فقط</option>
            <option value="b2">الكتاب الثاني فقط</option>
          </select>
        </div>
      </div>

      {/* Completed Lessons List with Custom Gaps */}
      {filteredCompleted.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">لا توجد دروس مطابقة في هذا التصنيف</h3>
          <p className="text-xs text-slate-500 mt-1">
            {totalCompleted === 0
              ? 'لم تقم بتحديد أي درس كمكتمل بعد. يمكنك تمييز الدروس المنجزة من صفحة المواد أو خطة اليوم.'
              : 'جرب تغيير خيارات التصفية أو البحث أعلاه لعرض الدروس المكتملة.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCompleted.map((item) => {
            const hasGaps =
              item.hasGaps ||
              (item.missingItems && item.missingItems.trim().length > 0);
            const currentNoteText =
              editingNotes[item.lessonId] !== undefined
                ? editingNotes[item.lessonId]
                : item.missingItems || '';
            const isBook1 = item.bookName.includes('الأول');

            return (
              <div
                key={item.lessonId}
                className={`bg-slate-900/90 border rounded-2xl p-5 transition-all shadow-sm ${
                  hasGaps
                    ? 'border-amber-500/40 hover:border-amber-500/60 bg-gradient-to-l from-slate-900 via-slate-900 to-amber-950/10'
                    : 'border-emerald-500/30 hover:border-emerald-500/50 bg-gradient-to-l from-slate-900 via-slate-900 to-emerald-950/10'
                }`}
              >
                {/* Lesson Top Meta */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        hasGaps
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-emerald-500/10 text-emerald-400'
                      }`}
                    >
                      {hasGaps ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
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
                        <span className="text-slate-400">{item.unitName}</span>
                      </div>
                      <h4 className="text-base font-bold text-white mt-1">
                        {item.lessonTitle}
                      </h4>
                    </div>
                  </div>

                  {/* Actions & Mastery Radio */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {/* Mastery Toggle Buttons */}
                    <div className="inline-flex p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs">
                      <button
                        onClick={() => handleSetMastery(item, true)}
                        className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                          !hasGaps
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>متقن 100%</span>
                      </button>

                      <button
                        onClick={() => handleSetMastery(item, false)}
                        className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                          hasGaps
                            ? 'bg-amber-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>ناقصني فيه نقاط</span>
                      </button>
                    </div>

                    <button
                      onClick={() => onToggleLesson(item.lessonId, false)}
                      title="إعادة الدرس لغير المكتمل إذا أردت مذاكرته من جديد"
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sub-section: "أنا ناقصني فيها حاجة ولا لأ وأنا اللي أحطها" */}
                <div className="mt-4 pt-1">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>النواقص والملاحظات الخاصة بهذا الدرس (أنا اللي باحددها):</span>
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {hasGaps ? (
                        <span className="text-amber-400 font-semibold">
                          ⚠️ يوجد نواقص مسجلة تحتاج استكمال
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-semibold">
                          ✔ تم إتقان الدرس بدون نواقص
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Input for custom missing items */}
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={currentNoteText}
                        onChange={(e) => handleNoteChange(item.lessonId, e.target.value)}
                        onBlur={() => handleSaveMissingNote(item)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveMissingNote(item);
                        }}
                        placeholder="اكتب هنا ما ينقصك في هذا الدرس (مثال: حل تدريبات صفحة 30، حفظ النظريات، مراجعة الإعراب...)"
                        className="flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                      />
                      <button
                        onClick={() => handleSaveMissingNote(item)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0"
                      >
                        حفظ الملاحظة
                      </button>
                    </div>

                    {/* Quick Preset Chips */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[11px] text-slate-500 ml-1">إضافة سريعة:</span>
                      {PRESET_CHIPS.map((chip, cIdx) => (
                        <button
                          key={cIdx}
                          onClick={() => handleAddPresetChip(item, chip)}
                          className="px-2.5 py-1 text-[11px] rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Tag className="w-3 h-3 text-slate-500" />
                          <span>+ {chip}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
