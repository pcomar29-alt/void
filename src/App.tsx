/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Subject, StudyDates, StudySettings, FlattenedLesson, StudentProfile, RewardItem, ThemeColor, RedemptionRecord } from './types';
import {
  loadSubjects,
  saveSubjects,
  loadDates,
  saveDates,
  loadSettings,
  saveSettings,
  loadProfile,
  saveProfile,
  loadRewards,
  saveRewards,
  getAllFlattenedLessons,
  calculateStats,
  playChimeSound,
} from './utils/storage';
import { INITIAL_SUBJECTS, DEFAULT_DATES, DEFAULT_SETTINGS } from './data/initialData';
import { THEME_CONFIGS } from './data/motivationAndRewards';
import { downloadStandaloneHtmlFile } from './utils/exportHtml';

import { Navbar, NavTab } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { SubjectsView } from './components/SubjectsView';
import { DailyPlanView } from './components/DailyPlanView';
import { TargetRoadmapView } from './components/TargetRoadmapView';
import { CompletedReviewView } from './components/CompletedReviewView';
import { ProgressAnalysisView } from './components/ProgressAnalysisView';
import { SettingsView } from './components/SettingsView';

import { CelebrationModal } from './components/CelebrationModal';
import { RewardsModal } from './components/RewardsModal';
import { MotivationModal } from './components/MotivationModal';
import { ProfileModal } from './components/ProfileModal';
import { ShaterWidget } from './components/ShaterWidget';
import { RewardMemeCelebrationModal } from './components/RewardMemeCelebrationModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [subjects, setSubjects] = useState<Subject[]>(() => loadSubjects());
  const [dates, setDates] = useState<StudyDates>(() => loadDates());
  const [settings, setSettings] = useState<StudySettings>(() => loadSettings());
  const [profile, setProfile] = useState<StudentProfile>(() => loadProfile());
  const [rewards, setRewards] = useState<RewardItem[]>(() => loadRewards());

  // Modals state
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [celebratedLessonTitle, setCelebratedLessonTitle] = useState('');
  const [celebratedPoints, setCelebratedPoints] = useState(10);
  const [selectedJoyReward, setSelectedJoyReward] = useState<RewardItem | null>(null);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [isMotivationOpen, setIsMotivationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Save changes to localStorage
  useEffect(() => {
    saveSubjects(subjects);
  }, [subjects]);

  useEffect(() => {
    saveDates(dates);
  }, [dates]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveRewards(rewards);
  }, [rewards]);

  // Flattened lessons list
  const flattenedLessons = useMemo<FlattenedLesson[]>(
    () => getAllFlattenedLessons(subjects),
    [subjects]
  );

  // Global study stats
  const stats = useMemo(
    () => calculateStats(subjects, dates, settings),
    [subjects, dates, settings]
  );

  // Theme configuration
  const currentTheme = profile.theme || 'navy';
  const themeConfig = THEME_CONFIGS[currentTheme] || THEME_CONFIGS.navy;

  const handleSelectTheme = (newTheme: ThemeColor) => {
    setProfile((prev) => {
      const updated = { ...prev, theme: newTheme };
      saveProfile(updated);
      return updated;
    });
  };

  // Lesson check/uncheck toggle - Harder economy (+10 points per lesson)
  const handleToggleLesson = (lessonId: string, completed: boolean) => {
    let completedLessonTitle = '';

    setSubjects((prevSubjects) => {
      let toggled = false;
      const updated = prevSubjects.map((sub) => ({
        ...sub,
        books: sub.books.map((book) => ({
          ...book,
          units: book.units.map((unit) => ({
            ...unit,
            lessons: unit.lessons.map((lesson) => {
              if (lesson.id === lessonId) {
                toggled = true;
                completedLessonTitle = lesson.title;
                return {
                  ...lesson,
                  completed,
                  completedAt: completed ? new Date().toISOString() : undefined,
                };
              }
              return lesson;
            }),
          })),
        })),
      }));

      if (toggled && completed) {
        playChimeSound();
        // Award +10 points (disciplined, realistic economy)
        const pointsAdded = 10;
        setProfile((prev) => {
          const updatedProf = {
            ...prev,
            points: prev.points + pointsAdded,
            totalPointsEarned: prev.totalPointsEarned + pointsAdded,
          };
          saveProfile(updatedProf);
          return updatedProf;
        });

        // Trigger celebratory popup
        setCelebratedLessonTitle(completedLessonTitle || 'درس جديد من المنهج');
        setCelebratedPoints(pointsAdded);
        setIsCelebrationOpen(true);
      }

      return updated;
    });
  };

  // "El-Shater" Extra Lesson Challenge Handler (+25 bonus points)
  const handleCompleteShaterLesson = (lesson: FlattenedLesson) => {
    setSubjects((prevSubjects) => {
      return prevSubjects.map((sub) => ({
        ...sub,
        books: sub.books.map((book) => ({
          ...book,
          units: book.units.map((unit) => ({
            ...unit,
            lessons: unit.lessons.map((l) => {
              if (l.id === lesson.lessonId) {
                return {
                  ...l,
                  completed: true,
                  completedAt: new Date().toISOString(),
                };
              }
              return l;
            }),
          })),
        })),
      }));
    });

    playChimeSound();
    // Add +25 bonus points
    const bonus = 25;
    setProfile((prev) => {
      const updatedProf = {
        ...prev,
        points: prev.points + bonus,
        totalPointsEarned: prev.totalPointsEarned + bonus,
        shaterBonusCount: (prev.shaterBonusCount || 0) + 1,
      };
      saveProfile(updatedProf);
      return updatedProf;
    });

    setCelebratedLessonTitle(`[إنجاز الشاطر 🌟] ${lesson.lessonTitle}`);
    setCelebratedPoints(bonus);
    setIsCelebrationOpen(true);
  };

  // Daily target automated evaluation (+25 bonus or -25 deficit penalty)
  const handleApplyTargetEvaluation = (met: boolean) => {
    if (met) {
      setProfile((prev) => {
        const updated = {
          ...prev,
          points: prev.points + 25,
          totalPointsEarned: prev.totalPointsEarned + 25,
          lastTargetEvaluationDate: new Date().toISOString().slice(0, 10),
        };
        saveProfile(updated);
        return updated;
      });
      playChimeSound();
    } else {
      setProfile((prev) => {
        const deduction = Math.min(prev.points, 25);
        const updated = {
          ...prev,
          points: Math.max(0, prev.points - deduction),
          penaltyCount: (prev.penaltyCount || 0) + 1,
          lastTargetEvaluationDate: new Date().toISOString().slice(0, 10),
        };
        saveProfile(updated);
        return updated;
      });
    }
  };

  // Rewards handlers with Egyptian Joy Meme and Gym tracking
  const handleRedeemReward = (reward: RewardItem) => {
    if (profile.points < reward.cost) return;

    const isGym = reward.isGym || reward.id.includes('gym');
    const newGymVisits = isGym ? (profile.gymVisitsCount || 0) + 1 : (profile.gymVisitsCount || 0);

    const record: RedemptionRecord = {
      id: `rec-${Date.now()}`,
      rewardId: reward.id,
      rewardTitle: reward.title,
      cost: reward.cost,
      date: new Date().toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      icon: reward.icon,
      isGym,
    };

    const updatedProfile: StudentProfile = {
      ...profile,
      points: profile.points - reward.cost,
      gymVisitsCount: newGymVisits,
      redeemHistory: [record, ...(profile.redeemHistory || [])],
    };

    setProfile(updatedProfile);
    saveProfile(updatedProfile);

    setRewards((prev) => {
      const updated = prev.map((r) =>
        r.id === reward.id ? { ...r, timesRedeemed: r.timesRedeemed + 1 } : r
      );
      saveRewards(updated);
      return updated;
    });

    playChimeSound();
    // Trigger Egyptian joy celebration meme popup!
    setSelectedJoyReward(reward);
  };

  const handleAddReward = (newReward: Omit<RewardItem, 'id' | 'timesRedeemed'>) => {
    const item: RewardItem = {
      ...newReward,
      id: `rew-${Date.now()}`,
      timesRedeemed: 0,
      isGym: newReward.title.includes('جيم') || newReward.icon === '🏋️‍♂️',
    };
    setRewards((prev) => {
      const updated = [item, ...prev];
      saveRewards(updated);
      return updated;
    });
  };

  const handleDeleteReward = (rewardId: string) => {
    setRewards((prev) => {
      const updated = prev.filter((r) => r.id !== rewardId);
      saveRewards(updated);
      return updated;
    });
  };

  const handleSaveProfile = (updatedProfile: StudentProfile) => {
    setProfile(updatedProfile);
    saveProfile(updatedProfile);
  };

  // Add Subject
  const handleAddSubject = (name: string, color?: string) => {
    const colors = ['#6366f1', '#8b5cf6', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899'];
    const chosenColor = color || colors[subjects.length % colors.length];

    const newSubject: Subject = {
      id: `sub-${Date.now()}`,
      name,
      color: chosenColor,
      books: [
        {
          id: `book-${Date.now()}-1`,
          name: 'الكتاب الأول',
          units: [
            {
              id: `unit-${Date.now()}-1`,
              name: 'الوحدة الأولى',
              lessons: [],
            },
          ],
        },
        {
          id: `book-${Date.now()}-2`,
          name: 'الكتاب الثاني',
          units: [
            {
              id: `unit-${Date.now()}-2`,
              name: 'الوحدة الأولى',
              lessons: [],
            },
          ],
        },
      ],
    };

    setSubjects((prev) => [...prev, newSubject]);
  };

  // Delete Subject
  const handleDeleteSubject = (subjectId: string) => {
    if (!window.confirm('هل تريد بالتأكيد حذف هذه المادة وجميع كتبها ودروسها؟')) return;
    setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
  };

  // Add Book
  const handleAddBook = (subjectId: string, bookName: string) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== subjectId) return sub;
        return {
          ...sub,
          books: [
            ...sub.books,
            {
              id: `book-${Date.now()}`,
              name: bookName,
              units: [
                {
                  id: `unit-${Date.now()}`,
                  name: 'الوحدة الأولى',
                  lessons: [],
                },
              ],
            },
          ],
        };
      })
    );
  };

  // Add Unit
  const handleAddUnit = (subjectId: string, bookId: string, unitName: string) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== subjectId) return sub;
        return {
          ...sub,
          books: sub.books.map((book) => {
            if (book.id !== bookId) return book;
            return {
              ...book,
              units: [
                ...book.units,
                {
                  id: `unit-${Date.now()}`,
                  name: unitName,
                  lessons: [],
                },
              ],
            };
          }),
        };
      })
    );
  };

  // Add Lesson
  const handleAddLesson = (subjectId: string, bookId: string, unitId: string, lessonTitle: string) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== subjectId) return sub;
        return {
          ...sub,
          books: sub.books.map((book) => {
            if (book.id !== bookId) return book;
            return {
              ...book,
              units: book.units.map((unit) => {
                if (unit.id !== unitId) return unit;
                return {
                  ...unit,
                  lessons: [
                    ...unit.lessons,
                    {
                      id: `l-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                      title: lessonTitle,
                      completed: false,
                    },
                  ],
                };
              }),
            };
          }),
        };
      })
    );
  };

  // Edit Lesson
  const handleEditLesson = (lessonId: string, newTitle: string) => {
    setSubjects((prev) =>
      prev.map((sub) => ({
        ...sub,
        books: sub.books.map((book) => ({
          ...book,
          units: book.units.map((unit) => ({
            ...unit,
            lessons: unit.lessons.map((lesson) => {
              if (lesson.id === lessonId) {
                return { ...lesson, title: newTitle };
              }
              return lesson;
            }),
          })),
        })),
      }))
    );
  };

  // Delete Lesson
  const handleDeleteLesson = (
    subjectId: string,
    bookId: string,
    unitId: string,
    lessonId: string
  ) => {
    if (!window.confirm('هل تريد حذف هذا الدرس بالتأكيد؟')) return;
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== subjectId) return sub;
        return {
          ...sub,
          books: sub.books.map((book) => {
            if (book.id !== bookId) return book;
            return {
              ...book,
              units: book.units.map((unit) => {
                if (unit.id !== unitId) return unit;
                return {
                  ...unit,
                  lessons: unit.lessons.filter((l) => l.id !== lessonId),
                };
              }),
            };
          }),
        };
      })
    );
  };

  // Update Lesson Gaps and Mastery Notes
  const handleUpdateLessonGaps = (
    lessonId: string,
    hasGaps: boolean,
    missingItems: string,
    masteryLevel: 'mastered' | 'needs_revision'
  ) => {
    setSubjects((prevSubjects) =>
      prevSubjects.map((sub) => ({
        ...sub,
        books: sub.books.map((book) => ({
          ...book,
          units: book.units.map((unit) => ({
            ...unit,
            lessons: unit.lessons.map((lesson) => {
              if (lesson.id === lessonId) {
                return {
                  ...lesson,
                  hasGaps,
                  missingItems,
                  masteryLevel,
                };
              }
              return lesson;
            }),
          })),
        })),
      }))
    );
  };

  // Update Daily Target
  const handleUpdateDailyTarget = (newTarget: number) => {
    setSettings((prev) => ({ ...prev, dailyTarget: newTarget }));
  };

  // Export JSON
  const handleExportJson = () => {
    const payload = {
      version: 2,
      exportedAt: new Date().toISOString(),
      subjects,
      dates,
      settings,
      profile,
      rewards,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Study-Progress-Backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.subjects && Array.isArray(parsed.subjects)) {
          setSubjects(parsed.subjects);
          if (parsed.dates) setDates(parsed.dates);
          if (parsed.settings) setSettings(parsed.settings);
          if (parsed.profile) setProfile(parsed.profile);
          if (parsed.rewards) setRewards(parsed.rewards);
          alert('تم استيراد البيانات والتقدم بنجاح!');
        } else {
          alert('صيغة الملف غير متوافقة.');
        }
      } catch (err) {
        alert('حدث خطأ أثناء قراءة ملف النسخة الاحتياطية.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Reset to initial
  const handleResetToInitial = () => {
    if (
      window.confirm(
        'هل تريد بالتأكيد إعادة ضبط الخطة ومسح التقدم الحالي والعودة للمنهج الأولي بالكامل؟'
      )
    ) {
      localStorage.removeItem('studyPlanV2');
      localStorage.removeItem('studyPlanV1');
      localStorage.removeItem('studyDatesV2');
      localStorage.removeItem('studySettingsV2');
      localStorage.removeItem('studyProfileV2');
      localStorage.removeItem('studyRewardsV2');
      setSubjects(JSON.parse(JSON.stringify(INITIAL_SUBJECTS)));
      setDates(JSON.parse(JSON.stringify(DEFAULT_DATES)));
      setSettings(JSON.parse(JSON.stringify(DEFAULT_SETTINGS)));
      window.location.reload();
    }
  };

  // Download Standalone HTML file
  const handleDownloadHtml = () => {
    downloadStandaloneHtmlFile(subjects, dates, settings, profile, rewards);
  };

  return (
    <div className={`min-h-screen ${themeConfig.bgClass} text-slate-100 flex flex-col font-sans transition-colors duration-300`}>
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        stats={stats}
        onDownloadHtml={handleDownloadHtml}
        profile={profile}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenRewards={() => setIsRewardsOpen(true)}
        onOpenMotivation={() => setIsMotivationOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            stats={stats}
            dates={dates}
            subjects={subjects}
            flattenedLessons={flattenedLessons}
            profile={profile}
            onToggleLesson={handleToggleLesson}
            onNavigateTab={setActiveTab}
            onOpenRewards={() => setIsRewardsOpen(true)}
          />
        )}

        {activeTab === 'subjects' && (
          <SubjectsView
            subjects={subjects}
            onToggleLesson={handleToggleLesson}
            onAddSubject={handleAddSubject}
            onDeleteSubject={handleDeleteSubject}
            onAddBook={handleAddBook}
            onAddUnit={handleAddUnit}
            onAddLesson={handleAddLesson}
            onEditLesson={handleEditLesson}
            onDeleteLesson={handleDeleteLesson}
            flattenedLessons={flattenedLessons}
          />
        )}

        {activeTab === 'target' && (
          <TargetRoadmapView
            stats={stats}
            dates={dates}
            settings={settings}
            flattenedLessons={flattenedLessons}
            subjects={subjects}
            profile={profile}
            onToggleLesson={handleToggleLesson}
            onUpdateDailyTarget={handleUpdateDailyTarget}
            onApplyTargetEvaluation={handleApplyTargetEvaluation}
          />
        )}

        {activeTab === 'completed' && (
          <CompletedReviewView
            flattenedLessons={flattenedLessons}
            subjects={subjects}
            onUpdateLessonGaps={handleUpdateLessonGaps}
            onToggleLesson={handleToggleLesson}
          />
        )}

        {activeTab === 'today' && (
          <DailyPlanView
            stats={stats}
            settings={settings}
            flattenedLessons={flattenedLessons}
            onToggleLesson={handleToggleLesson}
            onUpdateDailyTarget={handleUpdateDailyTarget}
          />
        )}

        {activeTab === 'analysis' && (
          <ProgressAnalysisView
            stats={stats}
            subjects={subjects}
            flattenedLessons={flattenedLessons}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            dates={dates}
            settings={settings}
            onUpdateDates={setDates}
            onUpdateSettings={setSettings}
            onExportJson={handleExportJson}
            onImportJson={handleImportJson}
            onResetToInitial={handleResetToInitial}
            onDownloadHtml={handleDownloadHtml}
          />
        )}
      </main>

      {/* Floating El-Shater Bonus Widget */}
      <ShaterWidget
        subjects={subjects}
        onCompleteShaterLesson={handleCompleteShaterLesson}
        shaterCount={profile.shaterBonusCount || 0}
      />

      {/* Celebratory Completion Modal (When checking off any lesson) */}
      <CelebrationModal
        isOpen={isCelebrationOpen}
        lessonTitle={celebratedLessonTitle}
        pointsAdded={celebratedPoints}
        totalPoints={profile.points}
        onClose={() => setIsCelebrationOpen(false)}
      />

      {/* Egyptian Joy Meme Modal (When redeeming Gym or any reward!) */}
      <RewardMemeCelebrationModal
        isOpen={!!selectedJoyReward}
        reward={selectedJoyReward}
        gymVisitsCount={profile.gymVisitsCount || 0}
        remainingPoints={profile.points}
        onClose={() => setSelectedJoyReward(null)}
      />

      {/* Rewards Store Modal with Gym Tracker & History */}
      <RewardsModal
        isOpen={isRewardsOpen}
        onClose={() => setIsRewardsOpen(false)}
        profile={profile}
        rewards={rewards}
        onRedeemReward={handleRedeemReward}
        onAddReward={handleAddReward}
        onDeleteReward={handleDeleteReward}
      />

      {/* Motivation Modal */}
      <MotivationModal
        isOpen={isMotivationOpen}
        onClose={() => setIsMotivationOpen(false)}
      />

      {/* Profile Modal with Egyptian Meme Avatars */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>خطة مذاكرتي | تانية بكالوريا · نظام متابعة مستقل ومحلي 100%</span>
          <span>البيانات محفوظة تلقائيًا في متصفحك</span>
        </div>
      </footer>

    </div>
  );
}
