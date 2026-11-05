import React, { useState } from 'react';
import { Calendar, Download, Upload, RefreshCw, AlertOctagon, CheckCircle2, ShieldCheck, FileCode } from 'lucide-react';
import { StudyDates, StudySettings } from '../types';

interface SettingsViewProps {
  dates: StudyDates;
  settings: StudySettings;
  onUpdateDates: (newDates: StudyDates) => void;
  onUpdateSettings: (newSettings: StudySettings) => void;
  onExportJson: () => void;
  onImportJson: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetToInitial: () => void;
  onDownloadHtml: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  dates,
  settings,
  onUpdateDates,
  onUpdateSettings,
  onExportJson,
  onImportJson,
  onResetToInitial,
  onDownloadHtml,
}) => {
  const [startDate, setStartDate] = useState(dates.start);
  const [endDate, setEndDate] = useState(dates.end);
  const [dailyTarget, setDailyTarget] = useState(settings.dailyTarget);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSaveTimeline = () => {
    onUpdateDates({ start: startDate, end: endDate });
    onUpdateSettings({ ...settings, dailyTarget });
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Toast Alert */}
      {showSavedToast && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>تم حفظ التواريخ والإعدادات بنجاح وإعادة احتساب المؤشرات تلقائيًا.</span>
        </div>
      )}

      {/* Standalone HTML Export Showcase */}
      <div className="bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileCode className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">تحميل التطبيق كملف HTML مستقل كامل (Single File)</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              يمكنك تنزيل ملف HTML واحد يضم واجهة التطبيق، الرسوم، الأكواد، وجميع بياناتك ودروسك المخزنة. يفتح مباشرة بنقرة مزدوجة في متصفح الكمبيوتر أو الموبايل دون إنترنت ودون أي خادم خارجي.
            </p>
          </div>

          <button
            onClick={onDownloadHtml}
            className="flex items-center gap-2 px-5 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 rounded-xl transition-all shadow-md shadow-indigo-600/30 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>تحميل ملف HTML الآن</span>
          </button>
        </div>
      </div>

      {/* Timeline Dates Configuration */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <h3 className="text-base font-bold text-white">الجدول الزمني ومواعيد الامتحانات</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">تاريخ بداية الخطة</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1.5 font-medium">موعد إنهاء المنهج المستهدف</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-400 block mb-1.5 font-medium">المستهدف اليومي الافتراضي (دروس/يوم)</label>
          <input
            type="number"
            min={1}
            max={20}
            value={dailyTarget}
            onChange={(e) => setDailyTarget(parseInt(e.target.value, 10) || 1)}
            className="w-32 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        <div className="pt-2">
          <button
            onClick={handleSaveTimeline}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors cursor-pointer"
          >
            حفظ التواريخ والمستهدف
          </button>
        </div>
      </div>

      {/* Backup and JSON Migration */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h3 className="text-base font-bold text-white">النسخ الاحتياطي ونقل البيانات</h3>
        </div>

        <p className="text-xs text-slate-400">
          بياناتك وتقدمك في المذاكرة محفوظة دائمًا في متصفحك. يمكنك إنشاء نسخة احتياطية بصيغة JSON لنقلها إلى جهاز آخر أو استعادتها في أي وقت.
        </p>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            onClick={onExportJson}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700/80 rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تصدير نسخة احتياطية (JSON)</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700/80 rounded-xl transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>استيراد ملف نسخة احتياطية</span>
            <input
              type="file"
              accept=".json"
              onChange={onImportJson}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Factory Reset */}
      <div className="bg-slate-900/90 border border-red-500/20 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <AlertOctagon className="w-4 h-4 text-red-400" />
          <h3 className="text-base font-bold text-red-400">إعادة تعيين البيانات للمنهج الأولي</h3>
        </div>

        <p className="text-xs text-slate-400">
          سيؤدي هذا الإجراء إلى مسح كل الدروس الإضافية والتقدم المسجل وإعادة تحميل المنهج الافتراضي الأصلي (اللغة العربية والرياضيات والتاريخ).
        </p>

        <div className="pt-2">
          <button
            onClick={onResetToInitial}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/30 rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>إعادة ضبط البيانات الأصلية</span>
          </button>
        </div>
      </div>

    </div>
  );
};
