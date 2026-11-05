import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  BarChart3,
  Settings,
  Download,
  Target,
  CheckCircle2,
  Gift,
  Flame,
  Palette,
} from 'lucide-react';
import { PlanStats, StudentProfile, ThemeColor } from '../types';

export type NavTab =
  | 'dashboard'
  | 'subjects'
  | 'target'
  | 'completed'
  | 'today'
  | 'analysis'
  | 'settings';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  stats: PlanStats;
  onDownloadHtml: () => void;
  profile: StudentProfile;
  currentTheme: ThemeColor;
  onSelectTheme: (theme: ThemeColor) => void;
  onOpenProfile: () => void;
  onOpenRewards: () => void;
  onOpenMotivation: () => void;
}

const THEME_BUTTONS: { id: ThemeColor; label: string; bgClass: string; borderClass: string }[] = [
  { id: 'navy', label: 'كحلي', bgClass: 'bg-slate-900', borderClass: 'border-blue-500' },
  { id: 'emerald', label: 'زمردي', bgClass: 'bg-[#0a1f16]', borderClass: 'border-emerald-500' },
  { id: 'indigo', label: 'نيلي', bgClass: 'bg-[#150f2e]', borderClass: 'border-indigo-500' },
  { id: 'charcoal', label: 'فحمي', bgClass: 'bg-[#1c1917]', borderClass: 'border-amber-500' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  stats,
  onDownloadHtml,
  profile,
  currentTheme,
  onSelectTheme,
  onOpenProfile,
  onOpenRewards,
  onOpenMotivation,
}) => {
  const tabs = [
    { id: 'dashboard' as NavTab, label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'subjects' as NavTab, label: 'المواد والدروس', icon: BookOpen },
    { id: 'target' as NavTab, label: 'مطلوب التارجت', icon: Target },
    { id: 'completed' as NavTab, label: 'المنجز والنواقص', icon: CheckCircle2 },
    { id: 'today' as NavTab, label: 'خطة اليوم', icon: CalendarCheck },
    { id: 'analysis' as NavTab, label: 'تحليل التقدم', icon: BarChart3 },
    { id: 'settings' as NavTab, label: 'الإعدادات', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Zone 1: Profile & Brand Wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Student Avatar button */}
            <button
              onClick={onOpenProfile}
              className="relative group p-0.5 rounded-xl border border-slate-700 hover:border-indigo-400 transition-all cursor-pointer"
              title="الملف الشخصي وصورة البروفايل"
            >
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-9 h-9 rounded-xl object-cover bg-slate-950"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/bottts/svg?seed=student2026';
                }}
              />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
            </button>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-bold tracking-tight text-white block leading-tight">
                  {profile.name}
                </span>
                <span className="hidden sm:inline-block text-[10px] bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.2 rounded-md font-medium">
                  تانية ثانوي
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium hidden sm:block">
                نظام المتابعة والمكافآت
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Points Pill, Motivation, 4 Background Color Buttons, and Download */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* 4 Background Theme Buttons */}
            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800" title="اختر لون خلفية التطبيق">
              <Palette className="w-3.5 h-3.5 text-slate-400 ml-1 hidden sm:block" />
              {THEME_BUTTONS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onSelectTheme(t.id)}
                  title={`تغيير الخلفية إلى ثيم ${t.label}`}
                  className={`w-5 h-5 rounded-lg ${t.bgClass} border-2 transition-all cursor-pointer ${
                    currentTheme === t.id
                      ? `${t.borderClass} scale-110 shadow-sm shadow-white/20`
                      : 'border-slate-700/60 hover:border-slate-500 opacity-60 hover:opacity-100'
                  }`}
                />
              ))}
            </div>

            {/* Motivation Button */}
            <button
              onClick={onOpenMotivation}
              title="جرعة تحفيز واقتباسات العزيمة"
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 text-xs font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 rounded-xl transition-all cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">تحفيز</span>
            </button>

            {/* Points Button (Opens Rewards Store) */}
            <button
              onClick={onOpenRewards}
              title="متجر استبدال النقاط بالمكافآت (الجيم، مشتريات، ألعاب)"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-black text-amber-300 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-400/40 hover:border-amber-400 rounded-xl transition-all shadow-sm shadow-amber-500/10 cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5 text-yellow-400" />
              <span>🪙 {profile.points}</span>
            </button>

            {/* Download Standalone HTML Button */}
            <button
              onClick={onDownloadHtml}
              title="تنزيل نسخة HTML واحدة كاملة تعمل أوفلاين دون إنترنت"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 rounded-xl transition-all shadow-sm shadow-indigo-600/30 whitespace-nowrap cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">تحميل HTML</span>
            </button>
          </div>

        </div>

        {/* Mobile / Tablet Navigation row */}
        <div className="flex xl:hidden items-center justify-start py-2 border-t border-slate-800/60 gap-1 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 py-1.5 px-3 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
