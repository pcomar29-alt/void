import { Subject, StudyDates, StudySettings, FlattenedLesson, PlanStats, StudentProfile, RewardItem } from '../types';
import { INITIAL_SUBJECTS, DEFAULT_DATES, DEFAULT_SETTINGS } from '../data/initialData';
import { DEFAULT_PROFILE, INITIAL_REWARDS } from '../data/motivationAndRewards';

const STORAGE_KEYS = {
  PLAN_V2: 'studyPlanV2',
  DATES_V2: 'studyDatesV2',
  SETTINGS_V2: 'studySettingsV2',
  PROFILE_V2: 'studyProfileV2',
  REWARDS_V2: 'studyRewardsV2',
  TODAY_DATE: 'studyTodayDate',
  TODAY_OVERRIDE_IDS: 'studyTodayOverrideIds',
  LEGACY_PLAN_V1: 'studyPlanV1',
  LEGACY_DATES_V1: 'studyDates',
};

// Check and migrate legacy format if needed
export function loadSubjects(): Subject[] {
  try {
    const savedV2 = localStorage.getItem(STORAGE_KEYS.PLAN_V2);
    if (savedV2) {
      const parsed: Subject[] = JSON.parse(savedV2);
      if (Array.isArray(parsed) && parsed.length > 0) {
        let needsResave = false;
        parsed.forEach((sub: Subject) => {
          if (sub.books && sub.books.length === 1) {
            needsResave = true;
            const b1 = sub.books[0];
            b1.name = b1.name.includes('الأول') ? b1.name : 'الكتاب الأول';
            const b2Units = b1.units.map((u) => ({
              id: `${u.id}-b2`,
              name: u.name,
              lessons: u.lessons.map((l) => ({
                id: `${l.id}-b2`,
                title: l.title,
                completed: false,
              })),
            }));
            sub.books.push({
              id: `${sub.id}-book-2`,
              name: 'الكتاب الثاني',
              units: b2Units,
            });
          }
        });
        if (needsResave) {
          saveSubjects(parsed);
        }
        return parsed;
      }
    }

    // Try legacy V1
    const savedV1 = localStorage.getItem(STORAGE_KEYS.LEGACY_PLAN_V1);
    if (savedV1) {
      const v1Data = JSON.parse(savedV1);
      if (Array.isArray(v1Data)) {
        // Deep copy initial and apply done flags
        const migrated: Subject[] = JSON.parse(JSON.stringify(INITIAL_SUBJECTS));
        v1Data.forEach((s1: any, sIdx: number) => {
          if (!migrated[sIdx]) return;
          s1.books?.forEach((b1: any, bIdx: number) => {
            if (!migrated[sIdx].books[bIdx]) return;
            b1.units?.forEach((u1: any, uIdx: number) => {
              if (!migrated[sIdx].books[bIdx].units[uIdx]) return;
              const targetUnit = migrated[sIdx].books[bIdx].units[uIdx];
              u1.lessons?.forEach((_lName: string, lIdx: number) => {
                if (targetUnit.lessons[lIdx] && u1.done?.[lIdx]) {
                  targetUnit.lessons[lIdx].completed = true;
                }
              });
            });
          });
        });
        saveSubjects(migrated);
        return migrated;
      }
    }
  } catch (err) {
    console.error('Error loading study plan:', err);
  }

  return INITIAL_SUBJECTS;
}

export function saveSubjects(subjects: Subject[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PLAN_V2, JSON.stringify(subjects));
    // Also sync to legacy format so other scripts or old tools can read it
    const legacy = subjects.map(s => ({
      name: s.name,
      books: s.books.map(b => ({
        name: b.name,
        units: b.units.map(u => {
          const doneObj: Record<number, boolean> = {};
          u.lessons.forEach((l, idx) => {
            if (l.completed) doneObj[idx] = true;
          });
          return {
            name: u.name,
            lessons: u.lessons.map(l => l.title),
            done: doneObj,
          };
        }),
      })),
    }));
    localStorage.setItem(STORAGE_KEYS.LEGACY_PLAN_V1, JSON.stringify(legacy));
  } catch (err) {
    console.error('Error saving study plan:', err);
  }
}

export function loadDates(): StudyDates {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.DATES_V2) || localStorage.getItem(STORAGE_KEYS.LEGACY_DATES_V1);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading study dates:', e);
  }
  return DEFAULT_DATES;
}

export function saveDates(dates: StudyDates): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DATES_V2, JSON.stringify(dates));
    localStorage.setItem(STORAGE_KEYS.LEGACY_DATES_V1, JSON.stringify(dates));
  } catch (e) {
    console.error('Error saving study dates:', e);
  }
}

export function loadSettings(): StudySettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS_V2);
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Error loading settings:', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: StudySettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS_V2, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings:', e);
  }
}

export function getAllFlattenedLessons(subjects: Subject[]): FlattenedLesson[] {
  const result: FlattenedLesson[] = [];
  subjects.forEach(subject => {
    subject.books.forEach(book => {
      book.units.forEach(unit => {
        unit.lessons.forEach(lesson => {
          result.push({
            subjectId: subject.id,
            subjectName: subject.name,
            subjectColor: subject.color || '#6366f1',
            bookId: book.id,
            bookName: book.name,
            unitId: unit.id,
            unitName: unit.name,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            completed: !!lesson.completed,
            completedAt: lesson.completedAt,
            hasGaps: lesson.hasGaps,
            missingItems: lesson.missingItems,
            masteryLevel: lesson.masteryLevel,
          });
        });
      });
    });
  });
  return result;
}

export function calculateStats(subjects: Subject[], dates: StudyDates, settings: StudySettings): PlanStats {
  const flattened = getAllFlattenedLessons(subjects);
  const totalLessons = flattened.length;
  const completedLessons = flattened.filter(l => l.completed).length;
  const remainingLessons = Math.max(0, totalLessons - completedLessons);
  const completionPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const now = new Date();
  const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const endParts = dates.end.split('-').map(Number);
  const endDate = new Date(endParts[0], endParts[1] - 1, endParts[2]);

  const startParts = dates.start.split('-').map(Number);
  const startDate = new Date(startParts[0], startParts[1] - 1, startParts[2]);

  const msPerDay = 86400000;
  const daysRemaining = Math.max(1, Math.ceil((endDate.getTime() - todayOnly.getTime()) / msPerDay));
  const totalDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / msPerDay));
  const daysElapsed = Math.max(0, Math.ceil((todayOnly.getTime() - startDate.getTime()) / msPerDay));

  const requiredDailyRate = Number((remainingLessons / daysRemaining).toFixed(1));
  const todayIso = now.toISOString().slice(0, 10);
  const completedToday = flattened.filter(
    (l) => l.completed && l.completedAt && l.completedAt.slice(0, 10) === todayIso
  ).length;
  const todayRequiredToFinishOnTime = Math.max(1, Math.ceil(remainingLessons / daysRemaining));
  const effectiveTarget = Math.max(todayRequiredToFinishOnTime, settings.dailyTarget || 1);
  const todayTargetMet = completedToday >= effectiveTarget;

  return {
    totalLessons,
    completedLessons,
    remainingLessons,
    completionPercentage,
    daysRemaining,
    totalDays,
    daysElapsed,
    requiredDailyRate,
    targetDailyRate: settings.dailyTarget,
    completedToday,
    todayTargetMet,
    todayRequiredToFinishOnTime,
  };
}

// Play pleasant completion chime using Web Audio API (Zero dependencies, offline safe)
export function playChimeSound(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Smooth pleasant chime: chord C5 - E5 - G5
    const freqs = [523.25, 659.25, 783.99];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.6);
    });
  } catch (e) {
    // Ignore audio permission errors
  }
}

// Play timer end chime
export function playTimerFinishSound(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Two high notes chime
    [880, 1174.66].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.2);

      gain.gain.setValueAtTime(0.01, ctx.currentTime + idx * 0.2);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + idx * 0.2 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.2 + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.2);
      osc.stop(ctx.currentTime + idx * 0.2 + 0.8);
    });
  } catch (e) {
    // Audio context error
  }
}

export function loadProfile(): StudentProfile {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE_V2);
    if (saved) {
      return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Error loading profile:', e);
  }
  return DEFAULT_PROFILE;
}

export function saveProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE_V2, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving profile:', e);
  }
}

export function loadRewards(): RewardItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.REWARDS_V2);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((r: RewardItem) =>
          r.id === 'rew-gym' ? { ...r, isGym: true, cost: 100 } : r
        );
      }
    }
  } catch (e) {
    console.error('Error loading rewards:', e);
  }
  return INITIAL_REWARDS;
}

export function saveRewards(rewards: RewardItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REWARDS_V2, JSON.stringify(rewards));
  } catch (e) {
    console.error('Error saving rewards:', e);
  }
}
