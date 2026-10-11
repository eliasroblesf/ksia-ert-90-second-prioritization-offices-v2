/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'en' | 'ar';

export interface Translations {
  appName: string;
  appSubtitle: string;
  badgeTag: string;
  switchLanguage: string;
  langEn: string;
  langAr: string;

  // Splash / Sign-In
  signInTitle: string;
  signInSubtitle: string;
  traineeBadge: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  badgeNumberLabel: string;
  badgeNumberPlaceholder: string;
  createSampleId: string;
  nameCertificateNotice: string;
  startPracticeDrill: string;
  quickTrainingBadge: string;
  sampleBadgeTitle: string;
  traineeTag: string;
  readyToPractice: string;
  validationNameRequired: string;
  validationBadgeRequired: string;

  // Lobby / Campaign Progression
  campaignTitle: string;
  campaignSubtitle: string;
  overallProgress: string;
  stageLabel: string;
  passedBadge: string;
  lockedBadge: string;
  inProgressBadge: string;
  passMarkNotice: string;
  drillUnlocked: string;
  stageMustPassNotice: string;
  stageCompletedBestScore: string;
  startDrillButton: string;
  resumeDrillButton: string;
  redoStageButton: string;
  allDrillsCompletedBanner: string;
  masterCertReady: string;
  downloadMasterCert: string;

  // Color Tags Guide
  colorGuideTitle: string;
  redTagTitle: string;
  redTagDesc: string;
  yellowTagTitle: string;
  yellowTagDesc: string;
  greenTagTitle: string;
  greenTagDesc: string;
  blackTagTitle: string;
  blackTagDesc: string;
  proTipTitle: string;
  proTipDesc: string;

  // Terminal / Drill
  casualtyTabLabel: string;
  viewAllCasualties: string;
  screamingAlert: string;
  breathingLabel: string;
  bleedingLabel: string;
  alertnessLabel: string;
  whatYouHearLabel: string;
  choosePriorityColor: string;
  redHelpText: string;
  yellowHelpText: string;
  greenHelpText: string;
  blackHelpText: string;
  untaggedHelpText: string;
  actionQuestionTitle: string;
  actionQuestionSubtitle: string;
  explanationTitle: string;
  explanationSubtitle: string;
  explanationPlaceholder: string;
  submitDrillButton: string;
  timerSecondsLeft: string;
  distressWarning: string;
  decompensationWarning: string;
  timerPausedWarning: string;

  // Results & Sharing Rules
  drillResultsTitle: string;
  stagePassedTitle: string;
  stageFailedTitle: string;
  stagePassedDesc: string;
  stageFailedDesc: string;
  totalScoreLabel: string;
  timeTakenLabel: string;
  scoreBreakdownTitle: string;
  scoreCorrectColors: string;
  scoreIgnoredScreams: string;
  scoreBestFirstAid: string;
  scoreGoodSpeed: string;
  scoreClearExplanation: string;
  answersReviewTitle: string;
  yourChoiceWas: string;
  correctChoiceWas: string;
  whyExplanation: string;
  proceedToNextDrill: string;
  redoForHigherScore: string;
  mustRedoStageButton: string;
  savePdfCertificate: string;
  shareWhatsApp: string;
  backToLobby: string;

  // Sharing Lock / Full Completion Rules
  sharingLockedTitle: string;
  sharingLockedNotice: string;
  certificateUnlocked: string;
  allDrillsPassedSuccess: string;
  averageScoreLabel: string;
  viewFinalCertificate: string;

  // Individual Briefing
  individualBriefingTitle: string;
  individualBriefingSubtitle: string;
  officerOnDuty: string;
  individualMissionGoal: string;
  individualMissionGoalDesc: string;
  startCountdownNotice: string;
  start90sDrillNow: string;
  backToList: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "Airport Office Safety Drill",
    appSubtitle: "Everyday 90-second prioritization training for airport staff",
    badgeTag: "OFFICES ERT",
    switchLanguage: "Language",
    langEn: "English",
    langAr: "العربية",

    // Splash / Sign-In
    signInTitle: "Student Sign-In",
    signInSubtitle: "Welcome to the Airport Office Emergency Drill. Practice rapid, life-saving triage in realistic office scenarios under 90 seconds.",
    traineeBadge: "TRAINEE BADGE",
    fullNameLabel: "Your Full Name",
    fullNamePlaceholder: "e.g. Mohammed Al-Salem",
    badgeNumberLabel: "Badge Number or Employee ID",
    badgeNumberPlaceholder: "e.g. KSIA-4820",
    createSampleId: "Create sample ID",
    nameCertificateNotice: "This name and ID will appear on your completion certificates.",
    startPracticeDrill: "Start Safety Drills",
    quickTrainingBadge: "90-second tactical drill",
    sampleBadgeTitle: "KSIA AIRPORT OFFICE SAFETY",
    traineeTag: "TRAINEE",
    readyToPractice: "Ready for Drill Progression",
    validationNameRequired: "Please enter your full name to begin.",
    validationBadgeRequired: "Please enter your badge number or employee ID.",

    // Lobby / Campaign Progression
    campaignTitle: "Airport Office Safety Progression",
    campaignSubtitle: "Complete all 5 office drills in order. You must score 80% or higher to unlock the next drill.",
    overallProgress: "Campaign Progress",
    stageLabel: "Drill",
    passedBadge: "PASSED (80%+)",
    lockedBadge: "LOCKED",
    inProgressBadge: "ACTIVE STAGE",
    passMarkNotice: "Pass requirement: 80% or higher",
    drillUnlocked: "Unlocked & Ready",
    stageMustPassNotice: "You must score at least 80% on this drill to unlock the next one.",
    stageCompletedBestScore: "Best Score",
    startDrillButton: "Begin Drill",
    resumeDrillButton: "Continue Drill",
    redoStageButton: "Replay Stage",
    allDrillsCompletedBanner: "All 5 Airport Drills Mastered!",
    masterCertReady: "You have successfully passed all 5 drills with scores over 80%.",
    downloadMasterCert: "Download Master Certificate (PDF)",

    // Color Tags Guide
    colorGuideTitle: "Triage Priority Color System",
    redTagTitle: "RED (Immediate)",
    redTagDesc: "Critical emergency! Suffocating, spurting arterial blood, or cardiac arrest.",
    yellowTagTitle: "YELLOW (Delayed)",
    yellowTagDesc: "Serious injury (broken bone, deep cut). Breathing and pulse stable. Can wait.",
    greenTagTitle: "GREEN (Minor)",
    greenTagDesc: "Walking wounded. Minor scrapes, alert, can walk and talk easily.",
    blackTagTitle: "BLACK (Deceased)",
    blackTagDesc: "No heartbeat or respiration even after airway reposition. Unsurvivable.",
    proTipTitle: "Priority Secret:",
    proTipDesc: "Loud shouting means the airway is open. Never prioritize screaming over a quiet victim who is choking or bleeding out.",

    // Terminal / Drill
    casualtyTabLabel: "Person",
    viewAllCasualties: "View All 3 People",
    screamingAlert: "SCREAMING LOUDLY",
    breathingLabel: "Breathing & Airway:",
    bleedingLabel: "Bleeding & Body Check:",
    alertnessLabel: "Alertness & Response:",
    whatYouHearLabel: "What You Hear:",
    choosePriorityColor: "Assign Priority Tag:",
    redHelpText: "🔴 Critical immediate danger",
    yellowHelpText: "🟡 Serious, but stable for a few minutes",
    greenHelpText: "🟢 Minor injury (walking wounded)",
    blackHelpText: "⚫ No heartbeat or breathing",
    untaggedHelpText: "Tap RED, YEL, GRN, or BLK to tag",
    actionQuestionTitle: "What is the #1 first-aid action right now?",
    actionQuestionSubtitle: "Choose the single most urgent life-saving step before medics arrive",
    explanationTitle: "Explain your tactical rationale:",
    explanationSubtitle: "Why did you prioritize this way? (1-2 sentences)",
    explanationPlaceholder: "Example: Person A had severe arterial bleeding requiring immediate pressure. Person B was shouting loudly meaning airway was open...",
    submitDrillButton: "Lock & Submit Drill Decisions",
    timerSecondsLeft: "Seconds Left",
    distressWarning: "DISTRACTING SCREAMS",
    decompensationWarning: "CONDITION DETERIORATING",
    timerPausedWarning: "TIMER PAUSED",

    // Results & Sharing Rules
    drillResultsTitle: "Drill Completed",
    stagePassedTitle: "Stage Passed! (Score: >= 80%)",
    stageFailedTitle: "Stage Not Passed (Score below 80%)",
    stagePassedDesc: "Excellent triage prioritization! You met the 80% pass threshold.",
    stageFailedDesc: "You scored below 80%. You must redo this stage and achieve at least 80% to unlock the next drill.",
    totalScoreLabel: "Stage Score (Pass: 80)",
    timeTakenLabel: "Time Taken",
    scoreBreakdownTitle: "Score Calculation Breakdown",
    scoreCorrectColors: "Accurate Color Tags",
    scoreIgnoredScreams: "Ignored Distracting Screams",
    scoreBestFirstAid: "Correct First-Aid Action",
    scoreGoodSpeed: "Completed Under 90s",
    scoreClearExplanation: "Clear Decision Rationale",
    answersReviewTitle: "Casualties Clinical Review",
    yourChoiceWas: "Your tag:",
    correctChoiceWas: "Correct tag:",
    whyExplanation: "Medical Rationale:",
    proceedToNextDrill: "Proceed to Next Drill",
    redoForHigherScore: "Retry Drill for Higher Score",
    mustRedoStageButton: "Redo This Stage (Try Again)",
    savePdfCertificate: "Save Official Certificate (PDF)",
    shareWhatsApp: "Share Full Results to WhatsApp",
    backToLobby: "Back to Drills Map",

    // Sharing Lock / Full Completion Rules
    sharingLockedTitle: "Certificate & Sharing Locked",
    sharingLockedNotice: "Official certification and sharing unlock only after you finish all 5 drills with scores of 80% or higher.",
    certificateUnlocked: "Official 5-Drill Master Certification Unlocked!",
    allDrillsPassedSuccess: "Outstanding! You have completed all 5 airport drills above 80%. You can now save your official certificate and share your certified results.",
    averageScoreLabel: "Overall Average Score",
    viewFinalCertificate: "View & Download Master Certificate",

    // Individual Briefing
    individualBriefingTitle: "Incident Briefing & Visual Inspection",
    individualBriefingSubtitle: "Review the real scene photo, assess the hazards, and proceed as the sole emergency triage officer.",
    officerOnDuty: "Responding Officer",
    individualMissionGoal: "Individual Mission Objective",
    individualMissionGoalDesc: "You are the sole first responder on the scene. You have 90 seconds to inspect 3 injured individuals, assign the proper triage priority color, and execute the primary first-aid intervention.",
    startCountdownNotice: "The 90-second countdown will start immediately upon launching.",
    start90sDrillNow: "Launch 90-Second Drill",
    backToList: "Back to Drills"
  },
  ar: {
    appName: "تدريب طوارئ مكاتب المطار",
    appSubtitle: "تدريب فرز أولوية إسعافي سريع خلال 90 ثانية لموظفي ومساعدي المطار",
    badgeTag: "فريق طوارئ المكاتب",
    switchLanguage: "اللغة",
    langEn: "English",
    langAr: "العربية",

    // Splash / Sign-In
    signInTitle: "تسجيل المتدرب",
    signInSubtitle: "مرحباً بك في تدريب الاستجابة لطوارئ مكاتب المطار. تدرب على اتخاذ قرارات فرز المصابين وإنقاذ الحياة في سيناريوهات مكتبية واقعية خلال 90 ثانية.",
    traineeBadge: "بطاقة متدرب",
    fullNameLabel: "الاسم الكامل",
    fullNamePlaceholder: "مثال: محمد السالم",
    badgeNumberLabel: "رقم البطاقة أو الرقم الوظيفي",
    badgeNumberPlaceholder: "مثال: KSIA-4820",
    createSampleId: "إنشاء رقم تجريبي",
    nameCertificateNotice: "سيتم طباعة هذا الاسم والرقم على شهادات إتمام التدريب الرسمية.",
    startPracticeDrill: "بدء التدريبات العملية",
    quickTrainingBadge: "تدريب تكتيكي في 90 ثانية",
    sampleBadgeTitle: "سلامة مكاتب مطار الملك سلمان",
    traineeTag: "متدرب",
    readyToPractice: "جاهز لبدء مراحل التدريب",
    validationNameRequired: "يرجى إدخال اسمك الكامل للمتابعة.",
    validationBadgeRequired: "يرجى إدخال رقم البطاقة أو الرقم الوظيفي.",

    // Lobby / Campaign Progression
    campaignTitle: "خارطة مراحل تدريب طوارئ المكاتب",
    campaignSubtitle: "عليك إكمال التدريبات الـ 5 بالتسلسل. يجب تحقيق 80% أو أكثر للانتقال إلى المرحلة التالية.",
    overallProgress: "تقدم التدريب الكلي",
    stageLabel: "التدريب",
    passedBadge: "تم الاجتياز (80%+)",
    lockedBadge: "مغلق",
    inProgressBadge: "المرحلة الحالية",
    passMarkNotice: "درجة الاجتياز المطلوبة: 80% فأعلى",
    drillUnlocked: "متاح وجاهز للبدء",
    stageMustPassNotice: "يجب تحقيق 80% كحد أدنى في هذا التدريب لفتح التدريب التالي.",
    stageCompletedBestScore: "أعلى درجة",
    startDrillButton: "بدء التدريب",
    resumeDrillButton: "متابعة التدريب",
    redoStageButton: "إعادة المرحلة",
    allDrillsCompletedBanner: "تهانينا! أكملت جميع تدريبات طوارئ المكاتب بنجاح!",
    masterCertReady: "لقد اجتزت جميع مراحل التدريب الـ 5 بدرجات تفوق 80% المؤهلة للاعتماد.",
    downloadMasterCert: "تحميل الشهادة الشاملة (PDF)",

    // Color Tags Guide
    colorGuideTitle: "دليل تصنيف أولوية المصابين بالألوان",
    redTagTitle: "أحمر (حرج فوري)",
    redTagDesc: "خطر موت فوري! اختناق حاد، نزيف شرياني دافق، أو توقف عضلة القلب.",
    yellowTagTitle: "أصفر (تأجيل)",
    yellowTagDesc: "إصابة بليغة (كسر عظم، جرح عميق) مع استقرار التنفس والنبض. يمكنه الانتظار قليلاً.",
    greenTagTitle: "أخضر (طفيف)",
    greenTagDesc: "إصابات بسيطة وقادر على المشي والتحدث بوضوح دون تدهور.",
    blackTagTitle: "أسود (متوفى)",
    blackTagDesc: "لا يوجد نبض ولا تنفس إطلاقاً حتى بعد فتح مجرى الهواء. لا يمكن إنعاذه في هذا الحادث.",
    proTipTitle: "سر الأولوية الإسعافية:",
    proTipDesc: "الصراخ بصوت عالٍ يعني أن مجرى الهواء مفتوح والتنفس سليم! لا تنخدع بالصراخ وابحث أولاً عن المصاب الهادئ الذي ينزف أو يختنق في صمت.",

    // Terminal / Drill
    casualtyTabLabel: "المصاب",
    viewAllCasualties: "عرض جميع المصابين الـ 3",
    screamingAlert: "يصرخ بصوت عالٍ",
    breathingLabel: "مجرى الهواء والتنفس:",
    bleedingLabel: "النزيف وفحص الجسم:",
    alertnessLabel: "درجة الوعي والاستجابة:",
    whatYouHearLabel: "ما تسمعه من المصاب:",
    choosePriorityColor: "حدد لون الأولوية الإسعافية:",
    redHelpText: "🔴 حالة حرجة فورية (خطر موت سريع)",
    yellowHelpText: "🟡 إصابة خطيرة لكنها مستقرة لبضع دقائق",
    greenHelpText: "🟢 إصابة طفيفة (قادر على المشي)",
    blackHelpText: "⚫ لا يوجد نبض أو تنفس إطلاقاً",
    untaggedHelpText: "اضغط أحمر أو أصفر أو أخضر أو أسود لتصنيف المصاب",
    actionQuestionTitle: "ما هو الإجراء الإسعافي الأول والأهم الآن؟",
    actionQuestionSubtitle: "اختر التدخل العاجل لإنقاذ الحياة قبل وصول سيارة الإسعاف",
    explanationTitle: "اشرح سبب قراراتك بإيجاز:",
    explanationSubtitle: "لماذا رتبت الأولويات بهذا الشكل؟ (جملة أو جملتان)",
    explanationPlaceholder: "مثال: الشخص (أ) كان يعاني من نزيف شرياني دافق يهدد حياته فبدأت به أولاً، بينما الشخص (ب) كان يصرخ مما يعني أن مجرى تنفسه مفتوح...",
    submitDrillButton: "اعتماد وإنهاء التدريب",
    timerSecondsLeft: "ثانية متبقية",
    distressWarning: "صراخ وتشويش عالٍ",
    decompensationWarning: "تدهور حالة المصاب",
    timerPausedWarning: "المؤقت متوقف مؤقتاً",

    // Results & Sharing Rules
    drillResultsTitle: "اكتمل التدريب",
    stagePassedTitle: "تم اجتياز المرحلة بنجاح! (الدرجة: >= 80%)",
    stageFailedTitle: "لم يتم اجتياز المرحلة (الدرجة أقل من 80%)",
    stagePassedDesc: "أداء ممتاز وتحديد أولويات دقيق! لقد حققت حد الاجتياز المطلوب 80%.",
    stageFailedDesc: "حصلت على درجة أقل من 80%. يتوجب عليك إعادة هذه المرحلة وتحقيق 80% على الأقل للانتقال إلى المرحلة التالية.",
    totalScoreLabel: "درجة هذه المرحلة (الاجتياز: 80)",
    timeTakenLabel: "الوقت المستغرق",
    scoreBreakdownTitle: "تفاصيل احتساب الدرجة",
    scoreCorrectColors: "دقة تصنيف الألوان",
    scoreIgnoredScreams: "تجاهل تشتيت الصراخ",
    scoreBestFirstAid: "الإجراء الإسعافي الأنسب",
    scoreGoodSpeed: "الإنجاز قبل 90 ثانية",
    scoreClearExplanation: "وضوح التبرير الإسعافي",
    answersReviewTitle: "المراجعة الطبية للحالات",
    yourChoiceWas: "اختيارك:",
    correctChoiceWas: "الصحيح:",
    whyExplanation: "السبب الطبي:",
    proceedToNextDrill: "الانتقال إلى التدريب التالي",
    redoForHigherScore: "إعادة التدريب لتحسين الدرجة",
    mustRedoStageButton: "إعادة هذه المرحلة (محاولة جديدة)",
    savePdfCertificate: "حفظ الشهادة الرسمية (PDF)",
    shareWhatsApp: "مشاركة النتيجة الشاملة عبر واتساب",
    backToLobby: "العودة لخارطة التدريبات",

    // Sharing Lock / Full Completion Rules
    sharingLockedTitle: "المشاركة والشهادة مغلقة مؤقتاً",
    sharingLockedNotice: "تُتاح الشهادة الرسمية ومشاركة النتائج فقط بعد إنهاء واجتياز جميع التدريبات الـ 5 بنسبة 80% أو أكثر.",
    certificateUnlocked: "تم فتح شهادة الاعتماد الشاملة لجميع التدريبات الـ 5!",
    allDrillsPassedSuccess: "إنجاز استثنائي! لقد أكملت كافة مراحل التدريب الـ 5 بنجاح. يمكنك الآن استخراج شهادتك الرسمية ومشاركة نتائجك المعتمدة.",
    averageScoreLabel: "المعدل التراكمي العام",
    viewFinalCertificate: "عرض وتحميل الشهادة الشاملة",

    // Individual Briefing
    individualBriefingTitle: "إحاطة الحادث والمعاينة البصرية",
    individualBriefingSubtitle: "عاين الصورة الواقعية للحادث واستعرض المخاطر قبل البدء كضابط استجابة فردي.",
    officerOnDuty: "الضابط المستجيب",
    individualMissionGoal: "هدف المهمة الفردية",
    individualMissionGoalDesc: "أنت المستجيب الوحيد في موقع الحادث. لديك 90 ثانية لفحص 3 مصابين، وتحديد لون أولوية الفرز لكل منهم، وتنفيذ الإجراء الإسعافي الأولي المنقذ للحياة.",
    startCountdownNotice: "سيبدأ العد التنازلي لمدة 90 ثانية فوراً بمجرد الضغط على زر البدء.",
    start90sDrillNow: "بدء تدريب الـ 90 ثانية فوراً",
    backToList: "العودة للتدريبات"
  }
};
