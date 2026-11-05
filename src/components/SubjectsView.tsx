import React, { useState } from 'react';
import { Search, Plus, Trash2, Edit2, ChevronDown, ChevronUp, Check, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { Subject, FlattenedLesson } from '../types';

interface SubjectsViewProps {
  subjects: Subject[];
  onToggleLesson: (lessonId: string, completed: boolean) => void;
  onAddSubject: (name: string, color?: string) => void;
  onDeleteSubject: (subjectId: string) => void;
  onAddBook: (subjectId: string, bookName: string) => void;
  onAddUnit: (subjectId: string, bookId: string, unitName: string) => void;
  onAddLesson: (subjectId: string, bookId: string, unitId: string, lessonTitle: string) => void;
  onEditLesson: (lessonId: string, newTitle: string) => void;
  onDeleteLesson: (subjectId: string, bookId: string, unitId: string, lessonId: string) => void;
  flattenedLessons: FlattenedLesson[];
}

export const SubjectsView: React.FC<SubjectsViewProps> = ({
  subjects,
  onToggleLesson,
  onAddSubject,
  onDeleteSubject,
  onAddBook,
  onAddUnit,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'done'>('all');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  
  // Track active book tab for each subject: { [subjectId]: 'all' | 'book-1' | 'book-2' }
  const [activeBookTabs, setActiveBookTabs] = useState<Record<string, string>>({});
  const [collapsedUnits, setCollapsedUnits] = useState<Record<string, boolean>>({});

  // Modals & form state
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');

  const [activeUnitForLesson, setActiveUnitForLesson] = useState<{ sId: string; bId: string; uId: string } | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [addLessonToBothBooks, setAddLessonToBothBooks] = useState(true);

  const [activeBookForUnit, setActiveBookForUnit] = useState<{ sId: string; bId: string } | null>(null);
  const [newUnitName, setNewUnitName] = useState('');

  const [editingLesson, setEditingLesson] = useState<{ id: string; currentTitle: string } | null>(null);
  const [editTitleInput, setEditTitleInput] = useState('');

  const toggleUnitCollapse = (unitId: string) => {
    setCollapsedUnits((prev) => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  const setSubjectBookTab = (subjectId: string, bookId: string) => {
    setActiveBookTabs((prev) => ({ ...prev, [subjectId]: bookId }));
  };

  const handleCreateSubject = () => {
    if (!newSubjectName.trim()) return;
    onAddSubject(newSubjectName.trim());
    setNewSubjectName('');
    setShowAddSubjectModal(false);
  };

  const handleCreateLesson = () => {
    if (!activeUnitForLesson || !newLessonTitle.trim()) return;
    onAddLesson(activeUnitForLesson.sId, activeUnitForLesson.bId, activeUnitForLesson.uId, newLessonTitle.trim());
    setNewLessonTitle('');
    setActiveUnitForLesson(null);
  };

  const handleCreateUnit = () => {
    if (!activeBookForUnit || !newUnitName.trim()) return;
    onAddUnit(activeBookForUnit.sId, activeBookForUnit.bId, newUnitName.trim());
    setNewUnitName('');
    setActiveBookForUnit(null);
  };

  const handleSaveEditLesson = () => {
    if (!editingLesson || !editTitleInput.trim()) return;
    onEditLesson(editingLesson.id, editTitleInput.trim());
    setEditingLesson(null);
    setEditTitleInput('');
  };

  const q = searchQuery.toLowerCase().trim();

  // Filter subjects if user selected specific subject tab
  const displayedSubjects = selectedSubjectFilter === 'all'
    ? subjects
    : subjects.filter((s) => s.id === selectedSubjectFilter);

  return (
    <div className="space-y-6">
      
      {/* Top Search & Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-sm">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن مادة، كتاب، فصل، أو درس..."
            className="w-full bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-sm rounded-xl pr-10 pl-4 py-2.5 outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-950/80 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">كافة الدروس</option>
            <option value="todo">غير المكتملة فقط</option>
            <option value="done">المكتملة فقط</option>
          </select>

          <button
            onClick={() => setShowAddSubjectModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shrink-0 shadow-sm shadow-indigo-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مادة جديدة</span>
          </button>
        </div>
      </div>

      {/* 3 Main Subject Tabs / Segment Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedSubjectFilter('all')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            selectedSubjectFilter === 'all'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          كافة المواد الثلاث ({subjects.length})
        </button>

        {subjects.map((sub) => {
          let tot = 0, fin = 0;
          sub.books.forEach((b) =>
            b.units.forEach((u) =>
              u.lessons.forEach((l) => {
                tot++;
                if (l.completed) fin++;
              })
            )
          );
          const isSelected = selectedSubjectFilter === sub.id;

          return (
            <button
              key={sub.id}
              onClick={() => setSelectedSubjectFilter(sub.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap border ${
                isSelected
                  ? 'bg-slate-800 text-white border-indigo-500 shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border-slate-800'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: sub.color || '#6366f1' }}
              />
              <span>{sub.name}</span>
              <span className="font-mono text-[11px] text-slate-500">
                ({fin}/{tot})
              </span>
            </button>
          );
        })}
      </div>

      {/* 3 SEPARATE SUBJECT SECTIONS */}
      <div className="space-y-8">
        {displayedSubjects.map((subject, subIndex) => {
          // Calculate overall stats for this subject
          let subjectTotal = 0;
          let subjectDone = 0;
          subject.books.forEach((b) =>
            b.units.forEach((u) =>
              u.lessons.forEach((l) => {
                subjectTotal++;
                if (l.completed) subjectDone++;
              })
            )
          );
          const subjectPct = subjectTotal > 0 ? Math.round((subjectDone / subjectTotal) * 100) : 0;

          // Check search query
          const subjectMatchesSearch = subject.books.some((b) =>
            b.units.some((u) =>
              u.lessons.some((l) => {
                const textMatch = !q || (subject.name + ' ' + b.name + ' ' + u.name + ' ' + l.title).toLowerCase().includes(q);
                const statusMatch = statusFilter === 'all' || (statusFilter === 'done' && l.completed) || (statusFilter === 'todo' && !l.completed);
                return textMatch && statusMatch;
              })
            )
          );

          if (!subjectMatchesSearch && q) return null;

          // Which book tab is active in this subject? ('all' or specific bookId)
          const activeBookId = activeBookTabs[subject.id] || 'all';

          return (
            <section
              key={subject.id}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-md"
            >
              {/* Distinct Subject Section Header */}
              <div className="p-6 border-b border-slate-800 bg-gradient-to-l from-slate-900 via-slate-900/80 to-slate-950 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-md text-sm"
                    style={{ backgroundColor: subject.color || '#6366f1' }}
                  >
                    0{subIndex + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-extrabold text-white">{subject.name}</h2>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-indigo-300 font-semibold border border-slate-700/60">
                        {subject.books.length} كتب مسجلة
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      مقسمة إلى كتابين منفصلين بنفس الوحدات والدروس لمتابعة تقدم كل كتاب بدقة.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Overall Subject Progress */}
                  <div className="bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-slate-800 flex items-center gap-3 min-w-[200px]">
                    <div className="flex-1">
                      <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                        <span>إجمالي المادة</span>
                        <span className="text-emerald-400 font-bold">{subjectPct}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${subjectPct}%`,
                            backgroundColor: subject.color || '#6366f1',
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-mono text-slate-400 font-bold tabular-nums">
                      {subjectDone}/{subjectTotal}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteSubject(subject.id)}
                    title="حذف المادة بالكامل"
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Book Switcher Tabs for This Subject */}
              <div className="px-6 pt-4 pb-2 border-b border-slate-800/60 bg-slate-950/40 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">عرض الكتب:</span>
                  <div className="inline-flex p-1 bg-slate-900 border border-slate-800 rounded-xl">
                    <button
                      onClick={() => setSubjectBookTab(subject.id, 'all')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        activeBookId === 'all'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      الكتابين معًا
                    </button>
                    {subject.books.map((b, bIdx) => (
                      <button
                        key={b.id}
                        onClick={() => setSubjectBookTab(subject.id, b.id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                          activeBookId === b.id
                            ? bIdx === 0
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-emerald-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            bIdx === 0 ? 'bg-indigo-400' : 'bg-emerald-400'
                          }`}
                        />
                        <span>{b.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-mono">
                  يتضمن كل كتاب {subject.books[0]?.units.length || 0} وحدات و{' '}
                  {subject.books[0]?.units.reduce((acc, u) => acc + u.lessons.length, 0) || 0} درسًا
                </div>
              </div>

              {/* Books Content Container */}
              <div
                className={`p-6 gap-6 ${
                  activeBookId === 'all' && subject.books.length > 1
                    ? 'grid grid-cols-1 xl:grid-cols-2'
                    : 'flex flex-col'
                }`}
              >
                {subject.books.map((book, bookIndex) => {
                  if (activeBookId !== 'all' && activeBookId !== book.id) return null;

                  // Stats for this book
                  let bTot = 0, bDone = 0;
                  book.units.forEach((u) =>
                    u.lessons.forEach((l) => {
                      bTot++;
                      if (l.completed) bDone++;
                    })
                  );
                  const bPct = bTot > 0 ? Math.round((bDone / bTot) * 100) : 0;
                  const isBook1 = bookIndex === 0;
                  const bookAccentColor = isBook1 ? '#6366f1' : '#10b981';

                  return (
                    <div
                      key={book.id}
                      className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-5 space-y-4 flex flex-col justify-between"
                    >
                      {/* Book Header Bar */}
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: bookAccentColor }}
                            />
                            <div>
                              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-slate-400" />
                                <span>{book.name}</span>
                              </h3>
                              <span className="text-[11px] text-slate-400">
                                {book.units.length} وحدات / فصول
                              </span>
                            </div>
                          </div>

                          <div className="text-left font-mono text-xs">
                            <span className="font-bold text-white">{bDone}</span>
                            <span className="text-slate-500"> / {bTot} درس</span>
                            <span
                              className="mr-2 font-extrabold"
                              style={{ color: bookAccentColor }}
                            >
                              ({bPct}%)
                            </span>
                          </div>
                        </div>

                        {/* Book Progress Bar */}
                        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden mt-3 mb-4">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${bPct}%`,
                              backgroundColor: bookAccentColor,
                            }}
                          />
                        </div>

                        {/* Units in Book */}
                        <div className="space-y-3">
                          {book.units.map((unit) => {
                            const uTot = unit.lessons.length;
                            const uDone = unit.lessons.filter((l) => l.completed).length;
                            const isCollapsed = collapsedUnits[unit.id];

                            const filteredLessons = unit.lessons.filter((l) => {
                              const textMatch =
                                !q ||
                                (subject.name + ' ' + book.name + ' ' + unit.name + ' ' + l.title)
                                  .toLowerCase()
                                  .includes(q);
                              const statusMatch =
                                statusFilter === 'all' ||
                                (statusFilter === 'done' && l.completed) ||
                                (statusFilter === 'todo' && !l.completed);
                              return textMatch && statusMatch;
                            });

                            if (filteredLessons.length === 0 && q) return null;

                            return (
                              <div
                                key={unit.id}
                                className="bg-slate-900/60 border border-slate-800/80 rounded-xl overflow-hidden"
                              >
                                {/* Unit Header */}
                                <div className="p-3 flex items-center justify-between gap-2 bg-slate-900/40">
                                  <button
                                    onClick={() => toggleUnitCollapse(unit.id)}
                                    className="flex items-center gap-2 text-right text-xs font-bold text-slate-200 hover:text-indigo-400 transition-colors flex-1 cursor-pointer"
                                  >
                                    <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span className="truncate">{unit.name}</span>
                                    <span className="text-slate-500 font-mono font-normal">
                                      ({uDone}/{uTot})
                                    </span>
                                    {isCollapsed ? (
                                      <ChevronDown className="w-3.5 h-3.5 text-slate-500 mr-auto" />
                                    ) : (
                                      <ChevronUp className="w-3.5 h-3.5 text-slate-500 mr-auto" />
                                    )}
                                  </button>

                                  <button
                                    onClick={() =>
                                      setActiveUnitForLesson({
                                        sId: subject.id,
                                        bId: book.id,
                                        uId: unit.id,
                                      })
                                    }
                                    className="px-2 py-1 text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors shrink-0 cursor-pointer"
                                  >
                                    + درس
                                  </button>
                                </div>

                                {/* Lessons */}
                                {!isCollapsed && (
                                  <div className="divide-y divide-slate-800/40 px-2 py-1">
                                    {filteredLessons.map((lesson) => (
                                      <div
                                        key={lesson.id}
                                        className="py-2 px-2 flex items-center justify-between gap-2 hover:bg-slate-900/40 rounded-lg group transition-colors"
                                      >
                                        <label className="flex items-center gap-2.5 cursor-pointer flex-1 select-none overflow-hidden">
                                          <input
                                            type="checkbox"
                                            checked={lesson.completed}
                                            onChange={(e) =>
                                              onToggleLesson(lesson.id, e.target.checked)
                                            }
                                            className="w-4 h-4 rounded text-emerald-600 focus:ring-0 focus:ring-offset-0 bg-slate-800 border-slate-700 cursor-pointer shrink-0"
                                          />
                                          <span
                                            className={`text-xs transition-all truncate ${
                                              lesson.completed
                                                ? 'line-through text-slate-500'
                                                : 'text-slate-200 font-medium'
                                            }`}
                                          >
                                            {lesson.title}
                                          </span>
                                        </label>

                                        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity shrink-0">
                                          <button
                                            onClick={() => {
                                              setEditingLesson({
                                                id: lesson.id,
                                                currentTitle: lesson.title,
                                              });
                                              setEditTitleInput(lesson.title);
                                            }}
                                            title="تعديل عنوان الدرس"
                                            className="p-1 text-slate-400 hover:text-indigo-400 rounded cursor-pointer"
                                          >
                                            <Edit2 className="w-3 h-3" />
                                          </button>
                                          <button
                                            onClick={() =>
                                              onDeleteLesson(subject.id, book.id, unit.id, lesson.id)
                                            }
                                            title="حذف الدرس"
                                            className="p-1 text-slate-400 hover:text-red-400 rounded cursor-pointer"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-800/60 mt-3">
                        <button
                          onClick={() => setActiveBookForUnit({ sId: subject.id, bId: book.id })}
                          className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                        >
                          + إضافة فصل أو وحدة جديدة لهذا الكتاب
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Modal: Add Subject */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">إضافة مادة جديدة للخطة</h3>
            <p className="text-xs text-slate-400">
              سيتم إنشاء كتابين تلقائيًا للمادة (الكتاب الأول والكتاب الثاني) لتتبع المنهج.
            </p>
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">اسم المادة</label>
              <input
                type="text"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="مثال: الكيمياء، الفيزياء، اللغة الإنجليزية..."
                autoFocus
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddSubjectModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleCreateSubject}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg cursor-pointer"
              >
                حفظ المادة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Unit */}
      {activeBookForUnit && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">إضافة وحدة أو فصل جديد</h3>
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">اسم الوحدة أو الفصل</label>
              <input
                type="text"
                value={newUnitName}
                onChange={(e) => setNewUnitName(e.target.value)}
                placeholder="مثال: الفصل الرابع: الاحتمالات..."
                autoFocus
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveBookForUnit(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleCreateUnit}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg cursor-pointer"
              >
                إضافة الوحدة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Lesson */}
      {activeUnitForLesson && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">إضافة درس جديد</h3>
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">عنوان الدرس</label>
              <input
                type="text"
                value={newLessonTitle}
                onChange={(e) => setNewLessonTitle(e.target.value)}
                placeholder="اكتب عنوان الدرس..."
                autoFocus
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveUnitForLesson(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleCreateLesson}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg cursor-pointer"
              >
                إضافة الدرس
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Lesson Title */}
      {editingLesson && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">تعديل عنوان الدرس</h3>
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">عنوان الدرس</label>
              <input
                type="text"
                value={editTitleInput}
                onChange={(e) => setEditTitleInput(e.target.value)}
                autoFocus
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingLesson(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveEditLesson}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>حفظ التعديل</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
