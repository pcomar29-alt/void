import { RewardItem, StudentProfile, MotivationQuote, EgyptianMeme } from '../types';

export const DEFAULT_PROFILE: StudentProfile = {
  name: 'بطل تانية ثانوي',
  avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=gayarMeme2026',
  points: 40, // Balanced, harder start
  totalPointsEarned: 40,
  shaterBonusCount: 0,
  penaltyCount: 0,
  gymVisitsCount: 0,
  theme: 'navy',
  redeemHistory: [],
};

// Harder, realistic economy: Each lesson = +10 pts, so Gym (100 pts) requires 10 lessons!
export const INITIAL_REWARDS: RewardItem[] = [
  {
    id: 'rew-gym',
    title: 'الذهاب للجيم وتمرين حديد فولاذي',
    cost: 100, // 10 complete lessons needed
    icon: '🏋️‍♂️',
    category: 'fitness',
    timesRedeemed: 0,
    isGym: true,
  },
  {
    id: 'rew-shopping',
    title: 'شراء حاجة نفسي فيها أو هدية مكافأة',
    cost: 200, // 20 lessons
    icon: '🛍️',
    category: 'treat',
    timesRedeemed: 0,
  },
  {
    id: 'rew-gaming',
    title: 'ساعة بلايستيشن / جيمنج رايقة بدون ضمير يأنبني',
    cost: 120, // 12 lessons
    icon: '🎮',
    category: 'entertainment',
    timesRedeemed: 0,
  },
  {
    id: 'rew-food',
    title: 'طلب وجبة دليفري دسمة / شاورما أو بيتزا',
    cost: 150, // 15 lessons
    icon: '🍕',
    category: 'treat',
    timesRedeemed: 0,
  },
  {
    id: 'rew-cafe',
    title: 'قعدة مروقة في كافيه مع مشروب مميز',
    cost: 80, // 8 lessons
    icon: '☕',
    category: 'treat',
    timesRedeemed: 0,
  },
  {
    id: 'rew-movie',
    title: 'مشاهدة فيلم سهرة أو حلقتين من مسلسل',
    cost: 90, // 9 lessons
    icon: '🎬',
    category: 'entertainment',
    timesRedeemed: 0,
  },
];

// Egyptian Memes for Profile Avatars
export const EGYPTIAN_MEME_AVATARS: EgyptianMeme[] = [
  {
    id: 'meme-gayar',
    title: 'الجيار (يا رب نجحني)',
    character: 'مستر الجيار',
    tagline: 'يا رب نجحني ده أنا داخل بالبركة ومستني المعجزة!',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=gayarLegend',
    joyText: 'يا صلاة النبي.. الجيار فخور بيك يا بني!',
  },
  {
    id: 'meme-zaeem',
    title: 'عادل إمام (الزعيم)',
    character: 'الزعيم',
    tagline: 'بلد شهادات صحيح.. وأنا هجيب أعلى مجموع غصب عن أي حد!',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=zaeemAdel',
    joyText: 'يا برنس الليالي.. يا سيدي أنا!',
  },
  {
    id: 'meme-lemby',
    title: 'اللمبي (ارقص يا بلحة)',
    character: 'اللمبي',
    tagline: 'إيه اللي أنا بهببه ده؟ بس معلش المنهج هيتلم هيتلم!',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=lembyHero',
    joyText: 'لولولوليييي.. ارقص يا بلحة عضلات ودماغ حديد!',
  },
  {
    id: 'meme-henedy',
    title: 'هنيدي (د. خلف الدهشوري)',
    character: 'محمد هنيدي',
    tagline: 'رايحين على فين يا رجالة؟ رايحين نجيب الترتيب إن شاء الله!',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=henedyKhalf',
    joyText: 'عاش يا وحش الكواكب.. الجيم بيناديك!',
  },
  {
    id: 'meme-helmy',
    title: 'أحمد حلمي (كده رضا)',
    character: 'أحمد حلمي',
    tagline: 'أنا بقاوم النوم والسرير في نفس ذات اللحظة!',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=helmyReda',
    joyText: 'كده رضا وزيادة.. مية مية يا برنس!',
  },
  {
    id: 'meme-abla',
    title: 'عبلة كامل (الصبر الجميل)',
    character: 'عبلة كامل',
    tagline: 'أنا مش زعلانة.. أنا بس مستنية الإجازة تيجي وأرتاح!',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=ablaKamel',
    joyText: 'أهو شفت لما شديت حيلك ربنا جبر بخاطرك إزاي!',
  },
  {
    id: 'meme-bayoumi',
    title: 'بيومي فؤاد (وحش المجرة)',
    character: 'بيومي فؤاد',
    tagline: 'اللي يذاكر صح يروح الجيم وهو رافع راسه!',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=bayoumiBoss',
    joyText: 'الفورمة والدماغ.. ثنائية لا تقهر يا كابتن!',
  },
  {
    id: 'meme-fouad',
    title: 'فؤاد المهندس (مستر إكس)',
    character: 'فؤاد المهندس',
    tagline: 'الامتحان لا يغفل ولا ينام.. والشاطر جاهز دايماً!',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=fouadX',
    joyText: 'مستر إكس بيهنيك.. أداء أسطوري!',
  },
];

// Egyptian Joy Memes when redeeming rewards (especially Gym)
export const EGYPTIAN_JOY_MEMES = [
  {
    id: 'joy-zaeem',
    character: 'الزعيم عادل إمام',
    title: 'يا برنس الليالي يا سيدي أنا!',
    quote: 'تستاهل الجيم والتفاريح كلها بعد طحن المذاكرة ده.. هو ده الكلام اللي يفرّح القلب!',
    badge: 'فرحة الزعيم 🕺',
    bgGradient: 'from-amber-600 via-yellow-500 to-amber-700',
    icon: '👑',
  },
  {
    id: 'joy-lemby',
    character: 'اللمبي في الفرح',
    title: 'لولولولييي.. ارقص يا بلحة وفكها!',
    quote: 'عاش يا وحش الوحوش! رايحين الجيم نبني الباي والتراي بعد ما فرتكنا المنهج!',
    badge: 'رقصة الفرح البلدي 🎉',
    bgGradient: 'from-emerald-600 via-teal-500 to-emerald-700',
    icon: '🥁',
  },
  {
    id: 'joy-gayar',
    character: 'مستر الجيار',
    title: 'عاش يا ابني.. الدعوة استجابت!',
    quote: 'أهو ده الشغل النظيف! كده تروح الجيم وأنت راضي عن نفسك وضميرك مستريح ومرتاح!',
    badge: 'رضا الجيار 🌟',
    bgGradient: 'from-indigo-600 via-violet-500 to-indigo-700',
    icon: '⚡',
  },
  {
    id: 'joy-henedy',
    character: 'هنيدي (وش إجرام)',
    title: 'أنا رايح الجيم يا ناس.. حد له شوق في حاجة؟!',
    quote: 'طالما خلصت تارجتك ونقاطك من عرق جبينك، يبقى تنزل تكسر أوزان في الجيم براحتك!',
    badge: 'وحش الأوزان 💪',
    bgGradient: 'from-rose-600 via-orange-500 to-rose-700',
    icon: '🏋️‍♂️',
  },
  {
    id: 'joy-bayoumi',
    character: 'بيومي فؤاد',
    title: 'الفورمة بتنادي يا كابتن مصر!',
    quote: 'دماغ شغالة في المذاكرة وجسم حديد في الجيم.. دي تركيبة أوائل الجمهورية يا بطل!',
    badge: 'ختم الوحوش 🏆',
    bgGradient: 'from-blue-600 via-cyan-500 to-blue-700',
    icon: '🔥',
  },
];

export const MOTIVATION_QUOTES: MotivationQuote[] = [
  {
    id: 'q1',
    text: 'القمة لا تتسع إلا لمن يستحقها.. ومجهودك الصادق اليوم يحدد مكانتك غداً!',
    author: 'همة بطل',
    category: 'طموح',
  },
  {
    id: 'q2',
    text: 'كل درس تتقنه وكل فكرة تفهمها تقربك خطوة عملاقة من حلم كليتك ومستقبلك.',
    author: 'طريق التفوق',
    category: 'هدف',
  },
  {
    id: 'q3',
    text: 'التعب يزول والدرجات والأمجاد تبقى.. تخيل فرحة والديك يوم النتيجة!',
    author: 'إصرار وعزيمة',
    category: 'تحفيز',
  },
  {
    id: 'q4',
    text: 'لا تنتظر المزاج المناسب؛ العظماء يصنعون نجاحهم بالانضباط اليومي المستمر.',
    author: 'قانون الإنجاز',
    category: 'انضباط',
  },
  {
    id: 'q5',
    text: 'تانية ثانوي هي قاعدة الانطلاق.. ابنِ أساسك الآن بقوة لتتفوق بسهولة لاحقاً!',
    author: 'نصيحة ذهبية',
    category: 'دراسة',
  },
  {
    id: 'q6',
    text: 'أنت لست متأخراً أبداً.. كل دقيقة تركيز تبدأها الآن تعوض ما فاتك وتزيدك ثقة.',
    author: 'بداية جديدة',
    category: 'أمل',
  },
  {
    id: 'q7',
    text: 'لا تقارن سرعة غيرك بسرعتك، استمر في السير بخطتك وسوف تصل إلى هدفك بإذن الله.',
    author: 'ثقة وهدوء',
    category: 'يقين',
  },
  {
    id: 'q8',
    text: 'عاش يا وحش! إنجاز اليوم كان كبيراً، ونقاطك تزداد وخطوتك نحو التفوق أصبحت أقرب.',
    author: 'فخر الإنجاز',
    category: 'احتفال',
  },
];

export const THEME_CONFIGS = {
  navy: {
    id: 'navy',
    name: 'كحلي أكاديمي (الأصلي)',
    bgClass: 'bg-slate-950',
    primaryColor: '#6366f1',
    accentText: 'text-indigo-400',
    borderClass: 'border-slate-800',
    cardClass: 'bg-slate-900',
  },
  emerald: {
    id: 'emerald',
    name: 'أسود وزمردي (طاقة وإنجاز)',
    bgClass: 'bg-[#0a110e]',
    primaryColor: '#10b981',
    accentText: 'text-emerald-400',
    borderClass: 'border-emerald-950/80',
    cardClass: 'bg-[#0d1814]',
  },
  indigo: {
    id: 'indigo',
    name: 'بنفسجي نيلي (تركيز عميق)',
    bgClass: 'bg-[#0d0d1e]',
    primaryColor: '#8b5cf6',
    accentText: 'text-violet-400',
    borderClass: 'border-indigo-950/80',
    cardClass: 'bg-[#121128]',
  },
  charcoal: {
    id: 'charcoal',
    name: 'فحمي وعنبر (دافئ ومريح)',
    bgClass: 'bg-[#121214]',
    primaryColor: '#f59e0b',
    accentText: 'text-amber-400',
    borderClass: 'border-neutral-800',
    cardClass: 'bg-[#18181b]',
  },
};
