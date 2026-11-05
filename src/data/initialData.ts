import { Subject, StudyDates, StudySettings, Unit } from '../types';

export const DEFAULT_DATES: StudyDates = {
  start: '2026-09-01',
  end: '2027-01-01',
};

export const DEFAULT_SETTINGS: StudySettings = {
  dailyTarget: 3,
  pomodoroWorkMinutes: 25,
  pomodoroBreakMinutes: 5,
  soundEnabled: true,
};

// Base units definitions for each subject
const ARABIC_UNITS_BASE: Unit[] = [
  {
    id: 'unit-ar-1',
    name: 'الوحدة الأولى: العلم والضمير',
    lessons: [
      { id: 'ar-1-1', title: 'العلم بين القانون والضمير', completed: false },
      { id: 'ar-1-2', title: 'الخلق جوهر الفضيلة', completed: false },
      { id: 'ar-1-3', title: 'العلم نور (نص شعري)', completed: false },
      { id: 'ar-1-4', title: 'الأسماء الخمسة', completed: false },
      { id: 'ar-1-5', title: 'ألف الوصل وهمزة القطع', completed: false },
      { id: 'ar-1-6', title: 'الأسلوب الخبري والإنشائي', completed: false },
      { id: 'ar-1-7', title: 'الإيجاز والإطناب', completed: false },
    ],
  },
  {
    id: 'unit-ar-2',
    name: 'الوحدة الثانية: سلطان الكلمة الرقمية',
    lessons: [
      { id: 'ar-2-1', title: 'التقنية وصناعة الرأي العام', completed: false },
      { id: 'ar-2-2', title: 'وصية إلى ولدي', completed: false },
      { id: 'ar-2-3', title: 'أثر الكلمة وحفظ اللسان (نص شعري)', completed: false },
      { id: 'ar-2-4', title: 'الممنوع من الصرف', completed: false },
    ],
  },
  {
    id: 'unit-ar-3',
    name: 'الوحدة الثالثة: الإنسان وكرامته',
    lessons: [
      { id: 'ar-3-1', title: 'حقوق الإنسان بين العالمية والخصوصية', completed: false },
      { id: 'ar-3-2', title: 'الحرية الفكرية', completed: false },
      { id: 'ar-3-3', title: 'يا أخي الإنسان (نص شعري)', completed: false },
      { id: 'ar-3-4', title: 'النعت والبدل والعطف والتمييز', completed: false },
      { id: 'ar-3-5', title: 'قواعد رسم الهمزات', completed: false },
      { id: 'ar-3-6', title: 'المقابلة والإيقاع الموسيقي', completed: false },
    ],
  },
  {
    id: 'unit-ar-4',
    name: 'أعمال أدبية – يلزم تأكيد نطاقها',
    lessons: [
      { id: 'ar-lit-1', title: 'كفاح طيبة', completed: false },
      { id: 'ar-lit-2', title: 'عودة الروح', completed: false },
      { id: 'ar-lit-3', title: 'حكايات الغريب', completed: false },
      { id: 'ar-lit-4', title: 'العبرات', completed: false },
      { id: 'ar-lit-5', title: 'الأرض', completed: false },
    ],
  },
];

const MATH_UNITS_BASE: Unit[] = [
  {
    id: 'unit-math-1',
    name: 'الفصل الأول: البراهين الجبرية',
    lessons: [
      { id: 'math-1-1', title: 'مفكوك المقادير التكعيبية', completed: false },
      { id: 'math-1-2', title: 'تحليل المقادير التكعيبية', completed: false },
      { id: 'math-1-3', title: 'نظرية ذات الحدين', completed: false },
      { id: 'math-1-4', title: 'نظرية متعددة الحدود', completed: false },
      { id: 'math-1-5', title: 'تطبيقات على نظرية ذات الحدين', completed: false },
      { id: 'math-1-6', title: 'قسمة كثيرات الحدود', completed: false },
      { id: 'math-1-7', title: 'خارج القسمة وباقي قسمة كثيرات الحدود', completed: false },
      { id: 'math-1-8', title: 'ضرب وقسمة المقادير النسبية', completed: false },
      { id: 'math-1-9', title: 'جمع وطرح المقادير النسبية', completed: false },
      { id: 'math-1-10', title: 'الكسور المركبة', completed: false },
      { id: 'math-1-11', title: 'المتطابقات', completed: false },
      { id: 'math-1-12', title: 'إثبات المتساويات (1)', completed: false },
      { id: 'math-1-13', title: 'إثبات المتساويات (2) – الشرطية', completed: false },
      { id: 'math-1-14', title: 'إثبات المتساويات (3) – الشرطية بالتناسب', completed: false },
      { id: 'math-1-15', title: 'إثبات المتباينات (1) – الشرطية', completed: false },
      { id: 'math-1-16', title: 'إثبات المتباينات (2) – غير شرطية', completed: false },
      { id: 'math-1-17', title: 'إثبات المتباينات (3) – تتضمن جذور', completed: false },
      { id: 'math-1-18', title: 'إثبات المتباينات (4) – الوسط الحسابي والهندسي', completed: false },
    ],
  },
  {
    id: 'unit-math-2',
    name: 'الفصل الثاني: المتتابعات',
    lessons: [
      { id: 'math-2-1', title: 'المتتابعات والحد العام', completed: false },
      { id: 'math-2-2', title: 'المتتابعة الحسابية (1)', completed: false },
      { id: 'math-2-3', title: 'المتتابعة الحسابية (2)', completed: false },
      { id: 'math-2-4', title: 'مجموع المتتابعة الحسابية (1)', completed: false },
      { id: 'math-2-5', title: 'مجموع المتتابعة الحسابية (2)', completed: false },
      { id: 'math-2-6', title: 'مجموع المتتابعة الحسابية (3)', completed: false },
      { id: 'math-2-7', title: 'المتتابعة الهندسية (1)', completed: false },
      { id: 'math-2-8', title: 'المتتابعة الهندسية (2)', completed: false },
      { id: 'math-2-9', title: 'مجموع المتتابعة الهندسية (1)', completed: false },
      { id: 'math-2-10', title: 'مجموع المتتابعة الهندسية (2)', completed: false },
      { id: 'math-2-11', title: 'رمز المجموع (1)', completed: false },
      { id: 'math-2-12', title: 'رمز المجموع (2)', completed: false },
      { id: 'math-2-13', title: 'رمز المجموع (3)', completed: false },
      { id: 'math-2-14', title: 'مجموع المتتابعات الكسرية', completed: false },
      { id: 'math-2-15', title: 'مجموع متتابعة حسابية × متتابعة هندسية', completed: false },
      { id: 'math-2-16', title: 'المتتابعة التي يكون حدها العام عبارة عن مجموع', completed: false },
      { id: 'math-2-17', title: 'مجموع متتابعة والحد العام', completed: false },
      { id: 'math-2-18', title: 'متتابعات الفروق', completed: false },
      { id: 'math-2-19', title: 'المتتابعات المجزأة إلى مجموعات', completed: false },
      { id: 'math-2-20', title: 'العلاقات التكرارية (1)', completed: false },
      { id: 'math-2-21', title: 'العلاقات التكرارية (2)', completed: false },
      { id: 'math-2-22', title: 'العلاقات التكرارية (3)', completed: false },
      { id: 'math-2-23', title: 'الاستنتاج الرياضي لإثبات متساويات', completed: false },
      { id: 'math-2-24', title: 'الاستنتاج الرياضي لإثبات متباينات', completed: false },
      { id: 'math-2-25', title: 'إثبات قابلية القسمة بالاستنتاج الرياضي', completed: false },
      { id: 'math-2-26', title: 'العلاقات التكرارية والاستنتاج الرياضي', completed: false },
    ],
  },
  {
    id: 'unit-math-3',
    name: 'الفصل الثالث: الهندسة والمعادلات',
    lessons: [
      { id: 'math-3-1', title: 'التقسيم الداخلي والخارجي على خط الأعداد', completed: false },
      { id: 'math-3-2', title: 'النقاط على المستوى الإحداثي', completed: false },
      { id: 'math-3-3', title: 'المسافة بين نقطتين', completed: false },
      { id: 'math-3-4', title: 'نقاط متساوية البعد عن نقطتين', completed: false },
      { id: 'math-3-5', title: 'نقاط التقسيم الداخلي والخارجي في المستوى الإحداثي', completed: false },
      { id: 'math-3-6', title: 'النقاط المتطابقة', completed: false },
      { id: 'math-3-7', title: 'توازي القطع المستقيمة', completed: false },
      { id: 'math-3-8', title: 'معادلة الخط المستقيم', completed: false },
      { id: 'math-3-9', title: 'تطبيقات على معادلة الخط المستقيم', completed: false },
      { id: 'math-3-10', title: 'الخطوط المتوازية والمتعامدة', completed: false },
      { id: 'math-3-11', title: 'المنصف العمودي والنقاط المتماثلة بالنسبة لخط مستقيم', completed: false },
      { id: 'math-3-12', title: 'المسافة بين نقطة وخط مستقيم', completed: false },
      { id: 'math-3-13', title: 'مساحة المثلث', completed: false },
      { id: 'math-3-14', title: 'الخط المستقيم المار بنقطة ثابتة', completed: false },
      { id: 'math-3-15', title: 'شروط عدم تكوين مثلث', completed: false },
      { id: 'math-3-16', title: 'معادلة الدائرة (1)', completed: false },
      { id: 'math-3-17', title: 'معادلة الدائرة (2)', completed: false },
      { id: 'math-3-18', title: 'معادلة الدائرة (3)', completed: false },
      { id: 'math-3-19', title: 'شروط تكوين دائرة', completed: false },
      { id: 'math-3-20', title: 'نقاط تقاطع دائرة وخط مستقيم (1)', completed: false },
      { id: 'math-3-21', title: 'نقاط تقاطع دائرة وخط مستقيم (2)', completed: false },
      { id: 'math-3-22', title: 'طول وتر الدائرة', completed: false },
      { id: 'math-3-23', title: 'مماس الدائرة', completed: false },
      { id: 'math-3-24', title: 'العلاقة بين دائرتين', completed: false },
      { id: 'math-3-25', title: 'نقطتا تقاطع دائرتين', completed: false },
      { id: 'math-3-26', title: 'الدائرة المارة بنقطتي تقاطع دائرتين', completed: false },
      { id: 'math-3-27', title: 'المحل الهندسي للنقطة', completed: false },
    ],
  },
];

const HISTORY_UNITS_BASE: Unit[] = [
  {
    id: 'unit-history-1',
    name: 'محتوى متاح جزئيًا من الملف المرفق',
    lessons: [
      { id: 'hist-1-1', title: 'حركات التحرر الوطني ضد الاحتلال الفرنسي والإيطالي في العالم العربي', completed: false },
      { id: 'hist-1-2', title: 'حركات التحرر الوطني ضد الاحتلال البريطاني والإسباني في العالم العربي', completed: false },
      { id: 'hist-1-3', title: 'محددات الدور المصري إقليميًا ودوليًا', completed: false },
      { id: 'hist-1-4', title: 'دور مصر في دعم حركات التحرر الوطني', completed: false },
    ],
  },
];

// Helper to duplicate units for Book 2 with clean separate IDs
function cloneUnitsForBook2(baseUnits: Unit[], prefix: string): Unit[] {
  return baseUnits.map((u) => ({
    id: `${u.id}-b2`,
    name: u.name,
    lessons: u.lessons.map((l) => ({
      id: `${prefix}-b2-${l.id}`,
      title: l.title,
      completed: false,
    })),
  }));
}

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub-arabic',
    name: 'اللغة العربية',
    color: '#6366f1', // Indigo
    books: [
      {
        id: 'book-arabic-1',
        name: 'الكتاب الأول',
        units: JSON.parse(JSON.stringify(ARABIC_UNITS_BASE)),
      },
      {
        id: 'book-arabic-2',
        name: 'الكتاب الثاني',
        units: cloneUnitsForBook2(ARABIC_UNITS_BASE, 'ar'),
      },
    ],
  },
  {
    id: 'sub-math',
    name: 'الرياضيات',
    color: '#8b5cf6', // Violet
    books: [
      {
        id: 'book-math-1',
        name: 'الكتاب الأول',
        units: JSON.parse(JSON.stringify(MATH_UNITS_BASE)),
      },
      {
        id: 'book-math-2',
        name: 'الكتاب الثاني',
        units: cloneUnitsForBook2(MATH_UNITS_BASE, 'math'),
      },
    ],
  },
  {
    id: 'sub-history',
    name: 'التاريخ',
    color: '#0ea5e9', // Sky blue
    books: [
      {
        id: 'book-history-1',
        name: 'الكتاب الأول',
        units: JSON.parse(JSON.stringify(HISTORY_UNITS_BASE)),
      },
      {
        id: 'book-history-2',
        name: 'الكتاب الثاني',
        units: cloneUnitsForBook2(HISTORY_UNITS_BASE, 'hist'),
      },
    ],
  },
];
