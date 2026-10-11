/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TriageTag = 'RED' | 'YEL' | 'GRN' | 'BLK';

export interface Telemetry {
  airway: string;
  airwayAr: string;
  resp: string;
  respAr: string;
  circ: string;
  circAr: string;
  neuro: string;
  neuroAr: string;
  visual: string;
  visualAr: string;
  audio: string;
  audioAr: string;
  vitals: {
    hr: number;
    rr: number;
    bp: string;
    avpu: string;
    avpuAr: string;
  };
}

export interface CasualtyProfile {
  id: string;
  name: string;
  nameAr: string;
  telemetry: Telemetry;
  correctTag: TriageTag;
  isVocal: boolean;
  justification: string;
  justificationAr: string;
}

export interface Scenario {
  id: number;
  stageNumber: number;
  group: string;
  groupAr: string;
  title: string;
  titleAr: string;
  location: string;
  locationAr: string;
  facilitySector: string;
  facilitySectorAr: string;
  summary: string;
  summaryAr: string;
  officeContext: string;
  officeContextAr: string;
  illustrationKey: 'drill1_glass' | 'drill2_fire' | 'drill3_cabinet' | 'drill4_electrical' | 'drill5_archives';
  casualties: CasualtyProfile[];
  interventions: {
    label: string;
    labelAr: string;
    isCorrect: boolean;
  }[];
}

export const scenarios: Scenario[] = [
  {
    id: 1,
    stageNumber: 1,
    group: "DRILL 1",
    groupAr: "التدريب 1",
    title: "Glass Wall Breaks in Meeting Room",
    titleAr: "انهيار جدار زجاجي في قاعة الاجتماعات",
    location: "4th Floor - Executive Meeting Room 402",
    locationAr: "الطابق الرابع - قاعة الاجتماعات التنفيذية 402",
    facilitySector: "Headquarters Meeting Rooms",
    facilitySectorAr: "قاعات اجتماعات الإدارة العامة",
    summary: "During a morning presentation, a large architectural glass partition broke loose and crashed onto a conference table. Broken glass and heavy metal frames injured three office staff members.",
    summaryAr: "أثناء عرض تقديمي صباحي، انهار قاطع زجاجي كبير وسقط على طاولة الاجتماعات مسبباً تطاير الزجاج الحاد وإطارات الألمنيوم الثقيلة وإصابة ثلاثة من موظفي المكتب.",
    officeContext: "Airport Executive Directorate Offices - Meeting Room 402",
    officeContextAr: "مكاتب الإدارة التنفيذية للمطار - قاعة 402",
    illustrationKey: "drill1_glass",
    casualties: [
      {
        id: 'A',
        name: 'Person A (Office Secretary)',
        nameAr: 'الشخص (أ) - سكرتيرة المكتب',
        telemetry: {
          airway: 'Gasping for air, breathing hard and fast',
          airwayAr: 'تلهث بحثاً عن الهواء، تنفس سريع ومجهد',
          resp: '30 breaths/min (Very fast)',
          respAr: '30 نفس/دقيقة (سريع جداً)',
          circ: 'Severe arterial bleeding: Bright red blood spurting fast from arm cut',
          circAr: 'نزيف شرياني حاد: دم أحمر قاني يتدفق بنبضات سريعة من جرح العضد',
          neuro: 'Almost passed out, only makes a sound when touched',
          neuroAr: 'شبه فاقدة للوعي، تصدر أنيناً خافتاً فقط عند اللمس',
          visual: 'Deep laceration on upper arm, growing pool of bright red blood on carpet, very pale face',
          visualAr: 'جرح قطعي غائر في أعلى الذراع، بركة دم تتسع على السجاد، شحوب شديد في الوجه',
          audio: 'Quiet weak groans, sound of blood spurting',
          audioAr: 'أنين ضعيف وخافت جداً، صوت تدفق النزيف',
          vitals: { hr: 138, rr: 30, bp: '80/48 (Very low)', avpu: 'Reacts only to pain', avpuAr: 'تستجيب للألم فقط' }
        },
        correctTag: 'RED',
        isVocal: false,
        justification: 'Severe arterial bleeding! If you do not stop the bleeding immediately, she will lose critical blood volume and die within minutes.',
        justificationAr: 'نزيف شرياني حاد دافق! إن لم يتم إيقافه فوراً بضغط مباشر قوي أو عاصبة فستفقد حياتها خلال دقائق معدودة.'
      },
      {
        id: 'B',
        name: 'Person B (Finance Manager)',
        nameAr: 'الشخص (ب) - مدير المالية',
        telemetry: {
          airway: 'Breathing loudly while shouting and crying',
          airwayAr: 'تنفس صاخب ومستمر أثناء الصراخ والبكاء',
          resp: '24 breaths/min',
          respAr: '24 نفس/دقيقة',
          circ: 'Strong wrist pulse (94 bpm), dark blood dripping slowly',
          circAr: 'نبض كعبري قوي (94 نبضة/د)، دم وريدي داكن يقطر ببطء',
          neuro: 'Fully awake and alert, standing up and pacing',
          neuroAr: 'واعي تماماً ومتنبه، يقف ويتحرك بارتباك',
          visual: 'Scrapes and superficial cuts on forearms, bloody shirt',
          visualAr: 'خدوش وجروح سطحية على الساعدين، بقع دم على القميص',
          audio: 'Screaming loudly: "Help me! Look at all this blood on my arms!"',
          audioAr: 'يصرخ بصوت مرتفع: "ساعدوني! انظروا إلى كل هذه الدماء على يدي!"',
          vitals: { hr: 94, rr: 24, bp: '130/82 (Normal)', avpu: 'Fully awake', avpuAr: 'واعي تماماً' }
        },
        correctTag: 'YEL',
        isVocal: true,
        justification: 'Loud screaming means his airway is wide open! Bleeding is dark and slow (non-arterial). He is stable and can safely wait a few minutes.',
        justificationAr: 'صراخه العالي يؤكد أن مجرى الهواء سليم ومفتوح! النزيف داكن ويقطر ببطء. حالته مستقرة ويمكنه الانتظار بأمان.'
      },
      {
        id: 'C',
        name: 'Person C (Office Guest)',
        nameAr: 'الشخص (ج) - ضيف ومراجع',
        telemetry: {
          airway: 'Not breathing at all, even after head tilt maneuver',
          airwayAr: 'لا يتنفس إطلاقاً حتى بعد إمالة الرأس للخلف',
          resp: '0 (No respiration)',
          respAr: '0 (انعدام التنفس)',
          circ: 'No carotid or radial pulse felt',
          circAr: 'انعدام النبض السباتي والكعبري تماماً',
          neuro: 'Unresponsive, flaccid and motionless',
          neuroAr: 'فاقد للوعي تماماً، ارتخاء كامل في العضلات',
          visual: 'Massive crushing head trauma from heavy aluminum frame, fixed non-reactive pupils',
          visualAr: 'تهتك شديد في الجمجمة نتيجة سقوط إطار معدني ثقيل، حدقتا العين ثابتتان ولا تستجيبان',
          audio: 'Complete silence',
          audioAr: 'صمت تام دون أي صوت',
          vitals: { hr: 0, rr: 0, bp: '0/0', avpu: 'Unresponsive', avpuAr: 'عديم الاستجابة' }
        },
        correctTag: 'BLK',
        isVocal: false,
        justification: 'No heartbeat and not breathing at all. Catastrophic unsurvivable trauma in a mass casualty drill.',
        justificationAr: 'توقف كامل للقلب والتنفس مع إصابة دماغية مدمرة لا يمكن إنقاذها في فرز حوادث الإصابات المتعددة.'
      }
    ],
    interventions: [
      {
        label: 'Put a tight tourniquet or firm direct pressure on Person A\'s spurting arm wound right now',
        labelAr: 'وضع عاصبة محكمة أو ضغط مباشر قوي فوراً على ذراع الشخص (أ) لإيقاف النزيف الشرياني',
        isCorrect: true
      },
      {
        label: 'Clean and bandage Person B\'s arm scrapes first because he is screaming loudly',
        labelAr: 'تنظيف وتضميد خدوش الشخص (ب) أولاً لأنه يصرخ بصوت مرتفع',
        isCorrect: false
      },
      {
        label: 'Start 2 minutes of chest compressions on Person C',
        labelAr: 'البدء في إجراء إنعاش قلبي رئوي للشخص (ج)',
        isCorrect: false
      },
      {
        label: 'Sit Person A upright in an office chair',
        labelAr: 'إجلاس الشخص (أ) على كرسي مكتب مرتفع',
        isCorrect: false
      }
    ]
  },
  {
    id: 2,
    stageNumber: 2,
    group: "DRILL 2",
    groupAr: "التدريب 2",
    title: "Coffee Machine Fire & Smoke in Breakroom",
    titleAr: "حريق صانعة القهوة ودخان كثيف في استراحة الموظفين",
    location: "2nd Floor - Staff Kitchen & Break Room",
    locationAr: "الطابق الثاني - مطبخ واستراحة الموظفين",
    facilitySector: "Office Breakroom & Kitchen",
    facilitySectorAr: "مطبخ واستراحة المكاتب الإدارية",
    summary: "An electric coffee appliance caught fire on a counter in the office breakroom. The enclosed room filled with dense acrid smoke, burning hot water spilled, and workers panicked.",
    summaryAr: "اندلع حريق في جهاز تسخين القهوة الكهربائي داخل استراحة الموظفين. امتلأت الغرفة بدخان كيميائي خانق، وانسكبت مياه مغلية مع حالة هلع بين الموظفين.",
    officeContext: "Airport Administrative IT Wing - Kitchen & Rest Area Suite 210",
    officeContextAr: "جناح تقنية المعلومات الإداري - استراحة الموظفين 210",
    illustrationKey: "drill2_fire",
    casualties: [
      {
        id: 'A',
        name: 'Person A (IT Support Specialist)',
        nameAr: 'الشخص (أ) - أخصائي الدعم الفني',
        telemetry: {
          airway: 'Severe stridor, throat swelling, gasping for breath',
          airwayAr: 'صرير تنفسي حاد، تورم بالحلق، يصارع لالتقاط أنفاسه',
          resp: '36 breaths/min (Struggling hard)',
          respAr: '36 نفس/دقيقة (جهد تنفسي عنيف)',
          circ: 'Cyanosis (blue lips and fingertips), weak rapid pulse (142 bpm)',
          circAr: 'ازرقاق الشفتين والأصابع، نبض ضعيف وسريع (142 نبضة/د)',
          neuro: 'Drowsy, only opens eyes to loud shouting',
          neuroAr: 'شبه غائب عن الوعي، يفتح عينيه فقط عند المناداة بصوت مرتفع',
          visual: 'Soot deposits around nostrils and mouth, singed facial hair, clutching neck',
          visualAr: 'سخام أسود حول الأنف والفم، احتراق شعر الوجه، يمسك برقبته بقوة',
          audio: 'Loud high-pitched whistling and choking sounds',
          audioAr: 'صوت صفير واختناق حاد مع كل محاولة تنفس',
          vitals: { hr: 142, rr: 36, bp: '88/54 (Low)', avpu: 'Responds to voice', avpuAr: 'يستجيب للصوت فقط' }
        },
        correctTag: 'RED',
        isVocal: false,
        justification: 'Acute toxic smoke inhalation injury! Airway is closing due to thermal and chemical edema. Imminent asphyxiation requires immediate intervention.',
        justificationAr: 'إصابة استنشاق دخان حار وسام! مجرى الهواء يغلق بسبب تورم الأنسجة، وهناك خطر اختناق وشيك يتطلب تدخلاً فورياً.'
      },
      {
        id: 'B',
        name: 'Person B (Office Supplies Clerk)',
        nameAr: 'الشخص (ب) - كاتب المستودع المكتبي',
        telemetry: {
          airway: 'Clear and patent, yelling at top of lungs',
          airwayAr: 'مجرى الهواء سالك، يصرخ بأعلى صوته',
          resp: '22 breaths/min',
          respAr: '22 نفس/دقيقة',
          circ: 'Strong radial pulse, warm skin',
          circAr: 'نبض كعبري قوي، حرارة الجلد طبيعية',
          neuro: 'Alert and ambulatory, running out of room',
          neuroAr: 'يقظ وقادر على المشي، يهرول خارج الغرفة',
          visual: 'Erythema and small blisters on dorsum of both hands from scald',
          visualAr: 'احمرار وفقاعات مائية صغيرة على ظهر اليدين بسبب رذاذ الماء المغلي',
          audio: 'Yelling in panic: "My hands are burning! Where is the cold water?"',
          audioAr: 'يصرخ بهلع: "يداي تحترقان! أين الماء البارد؟"',
          vitals: { hr: 108, rr: 22, bp: '136/84', avpu: 'Fully awake', avpuAr: 'واعي تماماً' }
        },
        correctTag: 'GRN',
        isVocal: true,
        justification: 'Walking wounded. Minor superficial burn on hands. Completely ambulatory and communicating clearly.',
        justificationAr: 'جريح قادر على المشي. حرق سطحي طفيف باليدين، حالته العامة ممتازة وقادر على إخلاء نفسه.'
      },
      {
        id: 'C',
        name: 'Person C (Accounting Clerk)',
        nameAr: 'الشخص (ج) - محاسب',
        telemetry: {
          airway: 'Clear, speaking in coherent sentences',
          airwayAr: 'مجرى الهواء سالك، يتحدث بجمل واضحة',
          resp: '20 breaths/min',
          respAr: '20 نفس/دقيقة',
          circ: 'Normal radial pulse (86 bpm)',
          circAr: 'نبض كعبري منتظم وطبيعي (86 نبضة/د)',
          neuro: 'Fully alert and oriented',
          neuroAr: 'واعي تماماً ومدرك للمكان والزمان',
          visual: 'Supporting right arm, visibly deformed right clavicle from collision with cabinet',
          visualAr: 'يسند ذراعه اليمنى، تشوه واضح بعظمة الترقوة نتيجة الاصطدام بخزانة أثناء التدافع',
          audio: 'Groaning with shoulder pain during movement: "I think my collarbone snapped"',
          audioAr: 'يتألم عند حركة الكتف: "أعتقد أن عظمة الترقوة انكسرت"',
          vitals: { hr: 86, rr: 20, bp: '122/76 (Normal)', avpu: 'Fully awake', avpuAr: 'واعي تماماً' }
        },
        correctTag: 'YEL',
        isVocal: false,
        justification: 'Closed fracture of clavicle. Painful orthopedic injury requiring stabilization, but airway and hemodynamics are completely stable.',
        justificationAr: 'كسر مغلق في الترقوة. إصابة عظمية مؤلمة تتطلب تثبيتاً ولكن العلامات الحيوية والتنفسية مستقرة تماماً.'
      }
    ],
    interventions: [
      {
        label: 'Evacuate Person A into fresh unpolluted air immediately and ensure open airway positioning',
        labelAr: 'إخلاء الشخص (أ) فوراً إلى الهواء النقي وفتح مجرى التنفس ومراقبته',
        isCorrect: true
      },
      {
        label: 'Apply direct ice cubes to Person B\'s burned fingertips',
        labelAr: 'وضع مكعبات ثلج مباشرة على أصابع الشخص (ب) المحترقة',
        isCorrect: false
      },
      {
        label: 'Attempt to forcefully manipulate Person C\'s collarbone back into alignment',
        labelAr: 'محاولة تعديل وشد كسر ترقوة الشخص (ج) بالقوة',
        isCorrect: false
      },
      {
        label: 'Administer oral cold water to Person A while choking',
        labelAr: 'إعطاء ماء بارد للشخص (أ) ليشربه أثناء نوبة الاختناق',
        isCorrect: false
      }
    ]
  },
  {
    id: 3,
    stageNumber: 3,
    group: "DRILL 3",
    groupAr: "التدريب 3",
    title: "Heavy Filing Cabinet Falls in Badging Office",
    titleAr: "سقوط خزانة ملفات فولاذية بمكتب تصاريح المطار",
    location: "Ground Floor - Staff Badging & ID Office",
    locationAr: "الطابق الأرضي - مكتب تصاريح وبطاقات الموظفين",
    facilitySector: "Customer Badging Counters",
    facilitySectorAr: "كاونترات إصدار البطاقات والتصاريح",
    summary: "A tall 4-drawer metal filing cabinet tipped over during morning badge renewal, crashing directly onto the employee counters and trapping staff underneath.",
    summaryAr: "انقلبت خزانة ملفات معدنية ضخمة ذات 4 أدراج أثناء تجديد بطاقات الموظفين الصباحية، وسقطت مباشرة على مكاتب الخدمة محاصرة العاملين تحتها.",
    officeContext: "Airport Security Badging Center - Counters 1 to 6",
    officeContextAr: "مركز تصاريح أمن المطار - كاونترات 1 إلى 6",
    illustrationKey: "drill3_cabinet",
    casualties: [
      {
        id: 'A',
        name: 'Person A (Badging Service Clerk)',
        nameAr: 'الشخص (أ) - موظف خدمة التصاريح',
        telemetry: {
          airway: 'Marked dyspnea, paradoxical chest wall movement',
          airwayAr: 'صعوبة تنفس شديدة، حركة متناقضة بجدار الصدر',
          resp: '34 breaths/min (Shallow, labored)',
          respAr: '34 نفس/دقيقة (سطحي ومجهد للغاية)',
          circ: 'Weak thready pulse, distended jugular neck veins, marked pallor',
          circAr: 'نبض خيطي ضعيف، انتفاخ في أوردة العنق، شحوب شديد',
          neuro: 'Stuporous, reacts only with grunts to painful stimuli',
          neuroAr: 'شبه غائب عن الوعي، يستجيب بأنات خافتة فقط للمؤثرات المؤلمة',
          visual: 'Right thorax crushed under cabinet lip, multiple rib fractures, flail segment',
          visualAr: 'القفص الصدري الأيمن مهشم تحت حافة الخزانة، كسور متعددة في الأضلاع مع انخساف',
          audio: 'Painful grunts, inability to formulate speech',
          audioAr: 'أنات مؤلمة، عاجز تماماً عن نطق أي كلمة',
          vitals: { hr: 136, rr: 34, bp: '78/46 (Very low)', avpu: 'Reacts to pain', avpuAr: 'يستجيب للألم فقط' }
        },
        correctTag: 'RED',
        isVocal: false,
        justification: 'Crush chest trauma with tension physiology/flail chest. Severe oxygenation failure and shock requiring instant stabilization.',
        justificationAr: 'إصابة هرس شديدة في الصدر واشتباه استرواح صدري ضاغط وهبوط حاد في ضغط الدم يهدد الحياة.'
      },
      {
        id: 'B',
        name: 'Person B (Job Applicant)',
        nameAr: 'الشخص (ب) - متقدم لوظيفة بالمطار',
        telemetry: {
          airway: 'Completely clear, shouting incessantly',
          airwayAr: 'مجرى الهواء سليم تماماً، صراخ مستمر',
          resp: '24 breaths/min',
          respAr: '24 نفس/دقيقة',
          circ: 'Strong bounding radial pulse, good color',
          circAr: 'نبض كعبري قوي، تدفق دموي ممتاز بالأطراف',
          neuro: 'Alert, sitting on carpet',
          neuroAr: 'يقظ تماماً، جالس على السجاد',
          visual: 'Inversion ankle sprain and minor knee abrasion, no major hemorrhage',
          visualAr: 'التواء في الكاحل الأيمن مع كشط بسيط بالركبة، لا يوجد نزيف',
          audio: 'Screaming loudly: "My ankle! Someone call 911 right now!"',
          audioAr: 'يصرخ بأعلى صوته: "كاحلي يؤلمني! اطلبوا الإسعاف حالاً!"',
          vitals: { hr: 104, rr: 24, bp: '128/80 (Normal)', avpu: 'Fully awake', avpuAr: 'واعي تماماً' }
        },
        correctTag: 'GRN',
        isVocal: true,
        justification: 'Vocal and loud, but minor isolated ankle sprain. Can hop or be assisted out of the hazard zone easily.',
        justificationAr: 'يصرخ بصوت عالٍ لكن إصابته تقتصر على التواء بسيط بالكاحل، حالته طفيفة وقادر على الحركة بمساعدة بسيطة.'
      },
      {
        id: 'C',
        name: 'Person C (Office Supervisor)',
        nameAr: 'الشخص (ج) - مشرف المكتب',
        telemetry: {
          airway: 'Patent, speaking calmly and clearly',
          airwayAr: 'مجرى الهواء سالك، يتحدث بهدوء ووضوح',
          resp: '18 breaths/min (Normal)',
          respAr: '18 نفس/دقيقة (طبيعي)',
          circ: 'Regular pulse (82 bpm), steady slow dark venous ooze from leg',
          circAr: 'نبض منتظم (82 نبضة/د)، نضح وريدي بطيء وداكن من الساق',
          neuro: 'Fully awake and calm',
          neuroAr: 'واعي وهادئ تماماً',
          visual: 'Compound tibial fracture with bone protrusion; slow dark ooze (non-pulsatile)',
          visualAr: 'كسر مضاعف بعظم الساق مع بروز جزء عظمي ونزف وريدي بطيء غير نابض',
          audio: 'Calm voice: "My lower leg was caught under the desk, please help me lift this corner"',
          audioAr: 'صوت هادئ: "ساقي انحصرت تحت المكتب، أرجو مساعدتي في رفع هذه الزاوية"',
          vitals: { hr: 82, rr: 18, bp: '124/78 (Normal)', avpu: 'Fully awake', avpuAr: 'واعي تماماً' }
        },
        correctTag: 'YEL',
        isVocal: false,
        justification: 'Open fracture of tibia. High-grade orthopedic injury needing hospital surgery, but vitals are normal and bleeding is non-arterial.',
        justificationAr: 'كسر مفتوح في الساق. إصابة جراحية بليغة ولكن التنفس طبيعي والنزيف بطيء وغير شرياني ويمكنه الانتظار قليلاً.'
      }
    ],
    interventions: [
      {
        label: 'Safely de-weight the heavy cabinet off Person A\'s chest and support respiration posture immediately',
        labelAr: 'رفع ثقل الخزانة بحذر عن قفص الشخص (أ) الصدري وتأمين وضعه لتسهيل التنفس فوراً',
        isCorrect: true
      },
      {
        label: 'Apply emergency ice packs to Person B\'s ankle first',
        labelAr: 'وضع كمادات ثلج طارئة على كاحل الشخص (ب) أولاً',
        isCorrect: false
      },
      {
        label: 'Push the protruding tibial bone back inside Person C\'s leg wound',
        labelAr: 'دفع العظم البارز وإعادته بالقوة داخل جرح ساق الشخص (ج)',
        isCorrect: false
      },
      {
        label: 'Place a tight arterial tourniquet on Person C despite absence of arterial bleeding',
        labelAr: 'ربط عاصبة شريانية مشدودة جداً على ساق الشخص (ج) رغم عدم وجود نزف شرياني',
        isCorrect: false
      }
    ]
  },
  {
    id: 4,
    stageNumber: 4,
    group: "DRILL 4",
    groupAr: "التدريب 4",
    title: "Electric Spark & Wire Flash in Dispatch Office",
    titleAr: "شرارة وانفجار كهربائي بكابلات غرفة ترحيل الرحلات",
    location: "3rd Floor - Flight Dispatch & Scheduling Office",
    locationAr: "الطابق الثالث - مكتب ترحيل وجدولة الرحلات الجوية",
    facilitySector: "Operations & Dispatch Office",
    facilitySectorAr: "مكاتب عمليات وترحيل حركة الطيران",
    summary: "Underfloor power cabling short-circuited during maintenance beneath office desks, producing an intense electrical flashover, arc burn, and loud explosive blast.",
    summaryAr: "حدث تماس كهربائي شديد في كابلات الطاقة الأرضية أسفل مكاتب ترحيل الرحلات، مما أدى لوميض قوسي حارق ودوي انفجاري ألقى بالموظفين أرضاً.",
    officeContext: "Airport Operations Building - Flight Dispatch Desk 14",
    officeContextAr: "مبنى عمليات المطار - كاونتر ترحيل الرحلات 14",
    illustrationKey: "drill4_electrical",
    casualties: [
      {
        id: 'A',
        name: 'Person A (Senior Flight Dispatcher)',
        nameAr: 'الشخص (أ) - مهدئ رحلات أول',
        telemetry: {
          airway: 'Apneic, trismus/jaw clenching',
          airwayAr: 'انقطاع تام للتنفس، انقباض في الفك',
          resp: '0 (Apnea)',
          respAr: '0 (انقطاع التنفس)',
          circ: 'Pulseless (Ventricular fibrillation / Sudden electrical cardiac arrest)',
          circAr: 'انعدام النبض تماماً (رجفان بطيني / توقف قلب ناجم عن الصعق)',
          neuro: 'Unresponsive, collapsed on floor beside cable channel',
          neuroAr: 'فاقد للوعي تماماً، ملقى بجانب مجرى الكابلات الأرضية',
          visual: 'Circumscribed entry burn on right palm and exit burn on shoe sole, motionless',
          visualAr: 'حرق دخول كهربائي دائري براحة اليد وحرق خروج في أسفل الحذاء، لا يتحرك',
          audio: 'Zero vocalization, completely silent',
          audioAr: 'صمت مطبق دون أي صوت',
          vitals: { hr: 0, rr: 0, bp: '0/0', avpu: 'Unresponsive', avpuAr: 'عديم الاستجابة' }
        },
        correctTag: 'RED',
        isVocal: false,
        justification: 'Witnessed electrical sudden cardiac arrest! Immediate CPR chest compressions and early AED defibrillation can reverse VF arrest and save his life.',
        justificationAr: 'توقف قلب مفاجئ ناجم عن صعق كهربائي! بدء الإنعاش القلبي الرئوي الفوري واستخدام مزيل الرجفان الآلي (AED) قد ينقذ حياته.'
      },
      {
        id: 'B',
        name: 'Person B (Shift Coordinator)',
        nameAr: 'الشخص (ب) - منسق النوبة الإدارية',
        telemetry: {
          airway: 'Clear, vocalizing angrily and loudly',
          airwayAr: 'مجرى الهواء سالك، يصرخ بغضب وألم',
          resp: '26 breaths/min',
          respAr: '26 نفس/دقيقة',
          circ: 'Strong radial pulse (110 bpm)',
          circAr: 'نبض كعبري قوي (110 نبضات/د)',
          neuro: 'Alert and awake',
          neuroAr: 'يقظ ومنتبه تماماً',
          visual: 'Shoulder joint dislocation following violent fall off office chair, guarding arm',
          visualAr: 'خلع بمفصل الكتف نتيجة السقوط العنيف من الكرسي الدوار، يمسك ذراعه بثبات',
          audio: 'Yelling loudly: "My shoulder popped out! Get this power cut now!"',
          audioAr: 'يصرخ بصوت مرتفع: "كتفي انخلع من مكانه! افصلوا التيار فوراً!"',
          vitals: { hr: 110, rr: 26, bp: '138/88', avpu: 'Fully awake', avpuAr: 'واعي تماماً' }
        },
        correctTag: 'YEL',
        isVocal: true,
        justification: 'Acute joint dislocation with severe pain, but cardiovascular and respiratory functions are robust. Not in immediate danger of death.',
        justificationAr: 'خلع مؤلم في مفصل الكتف لكن الوظائف الحيوية والتنفسية قوية ومستقرة، ولا يوجد خطر على الحياة حالياً.'
      },
      {
        id: 'C',
        name: 'Person C (Trainee Assistant)',
        nameAr: 'الشخص (ج) - مساعد متدرب',
        telemetry: {
          airway: 'Clear, talking quietly',
          airwayAr: 'مجرى الهواء سليم، يتحدث بصوت خافت',
          resp: '16 breaths/min (Normal)',
          respAr: '16 نفس/دقيقة (طبيعي)',
          circ: 'Normal pulse (76 bpm)',
          circAr: 'نبض طبيعي تماماً (76 نبضة/د)',
          neuro: 'Alert, mildly frightened',
          neuroAr: 'واعي، يشعر بالخوف فقط',
          visual: 'Minor 1st-degree superficial flash erythema on tip of index finger, seated safely',
          visualAr: 'احمرار سطحي بسيط من الدرجة الأولى في طرف السبابة، جالس على الكرسي',
          audio: 'Shaken, quiet crying: "The explosion scared me so much"',
          audioAr: 'صوت مرتجف يبكي بهدوء: "أفزعني دوي الانفجار"',
          vitals: { hr: 76, rr: 16, bp: '118/74 (Normal)', avpu: 'Fully awake', avpuAr: 'واعي تماماً' }
        },
        correctTag: 'GRN',
        isVocal: false,
        justification: 'Minimal localized superficial flash mark and situational anxiety. Complete physiological stability.',
        justificationAr: 'احمرار طفيف جداً في طرف الإصبع مع قلق نفسي طبيعي، جميع مؤشراته الحيوية ممتازة.'
      }
    ],
    interventions: [
      {
        label: 'Verify scene electrical clearance, then commence immediate CPR chest compressions and apply AED for Person A',
        labelAr: 'التأكد من أمان الموقع وفصل التيار، ثم بدء الضغطات الصدرية (CPR) وطلب جهاز الصدمات (AED) للشخص (أ) فوراً',
        isCorrect: true
      },
      {
        label: 'Pull vigorously on Person B\'s arm to attempt joint reduction',
        labelAr: 'شد ذراع الشخص (ب) بقوة لإعادة مفصل الكتف لمكانه',
        isCorrect: false
      },
      {
        label: 'Submerge Person C\'s finger in running tap water for 20 minutes',
        labelAr: 'وضع إصبع الشخص (ج) تحت صنبور الماء لمدة 20 دقيقة',
        isCorrect: false
      },
      {
        label: 'Transfer Person A to an office sofa before assessing respiration',
        labelAr: 'نقل الشخص (أ) إلى أريكة المكتب قبل فحص التنفس',
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    stageNumber: 5,
    group: "DRILL 5",
    groupAr: "التدريب 5",
    title: "Rolling File Shelf Traps Worker in Records Room",
    titleAr: "انحصار موظف بدواليب الأرشيف المتحركة بقسم السجلات",
    location: "Basement 1 - Employee Records & HR Archive",
    locationAr: "القبو 1 - أرشيف سجلات الموارد البشرية",
    facilitySector: "Office File & Records Archive",
    facilitySectorAr: "أرشيف السجلات والمستندات الإدارية",
    summary: "A heavy mechanized rolling compact shelf system malfunctioned and closed rapidly while staff were retrieving file boxes, trapping workers against fixed steel racks.",
    summaryAr: "تعطل نظام الخزائن والأرفف الفولاذية المتحركة عالية الكثافة وانغلق بشكل مفاجئ أثناء سحب ملفات الموظفين، مما حاصر العاملين وضغط أجسادهم بين الرفوف.",
    officeContext: "Airport Central Administration Records Archive - Room B-14",
    officeContextAr: "أرشيف الإدارة المركزية لمطار الملك سلمان - قاعة B-14",
    illustrationKey: "drill5_archives",
    casualties: [
      {
        id: 'A',
        name: 'Person A (HR Records Officer)',
        nameAr: 'الشخص (أ) - مسؤول سجلات الموارد البشرية',
        telemetry: {
          airway: 'Labored breathing, weak groans',
          airwayAr: 'تنفس مجهد، أنين متواصل',
          resp: '32 breaths/min (Rapid, shallow)',
          respAr: '32 نفس/دقيقة (سريع وسطحي)',
          circ: 'Profound shock: barely palpable rapid pulse (144 bpm), cold clammy ashen skin',
          circAr: 'صدمة وعائية حادة: نبض سريع وضعيف جداً (144 نبضة/د)، برودة وتعرق رمادي في الجلد',
          neuro: 'Obtunded, only vocalizes faint grunts',
          neuroAr: 'شبه غائب عن الوعي، يصدر همهمات ضعيفة فقط',
          visual: 'Severe pelvic compression between mechanized shelf banks, pelvic instability, shivering',
          visualAr: 'انضغاط هرس شديد في الحوض وأسفل البطن بين الرفوف المعدنية، عدم ثبات بالحوض، ارتعاش',
          audio: 'Faint moaning: "I feel freezing cold... please help me..."',
          audioAr: 'أنين خافت: "أشعر ببرودة شديدة في جسدي... أرجوكم ساعدوني..."',
          vitals: { hr: 144, rr: 32, bp: '72/42 (Critical)', avpu: 'Responds to voice', avpuAr: 'يستجيب للصوت فقط' }
        },
        correctTag: 'RED',
        isVocal: false,
        justification: 'Severe pelvic crush injury with catastrophic concealed retroperitoneal hemorrhage. Patient is in decompensated hypovolemic shock.',
        justificationAr: 'إصابة هرس شديدة في الحوض مع نزيف داخلي غزير وصدمة نقص حجم دموي حادة تهدد الحياة بالوفاة خلال دقائق.'
      },
      {
        id: 'B',
        name: 'Person B (Archive Supervisor)',
        nameAr: 'الشخص (ب) - مشرف الأرشيف',
        telemetry: {
          airway: 'Clear, yelling loudly at coworkers',
          airwayAr: 'مجرى الهواء سالك، يصرخ بصوت مرتفع على زملائه',
          resp: '24 breaths/min',
          respAr: '24 نفس/دقيقة',
          circ: 'Strong radial pulse (112 bpm)',
          circAr: 'نبض كعبري قوي (112 نبضة/د)',
          neuro: 'Fully awake and alert',
          neuroAr: 'واعي تماماً ومتيقظ',
          visual: 'Deep forearm laceration with non-spurting venous dark blood, closed radius fracture',
          visualAr: 'جرح قطعي عميق بالساعد مع نزف وريدي داكن غير نابض، كسر مغلق بعظم الساعد',
          audio: 'Shouting: "Turn off the motor switch! My arm is broken and cut!"',
          audioAr: 'يصرخ: "افصلوا قاطع المحرك! ذراعي انكسرت وتنزف!"',
          vitals: { hr: 112, rr: 24, bp: '132/84 (Normal)', avpu: 'Fully awake', avpuAr: 'واعي تماماً' }
        },
        correctTag: 'YEL',
        isVocal: true,
        justification: 'Closed fracture and laceration with venous oozing. Shouting clearly, airway open, vitals preserved.',
        justificationAr: 'كسر مغلق وجرح وريدي، يصرخ بصوت قوي ومجرى الهواء مفتوح ومؤشراته الحيوية مستقرة.'
      },
      {
        id: 'C',
        name: 'Person C (Archive Helper)',
        nameAr: 'الشخص (ج) - مساعد قسم الأرشيف',
        telemetry: {
          airway: 'Clear, speaking coherently',
          airwayAr: 'مجرى الهواء سليم، يتحدث بانتظام',
          resp: '18 breaths/min (Normal)',
          respAr: '18 نفس/دقيقة (طبيعي)',
          circ: 'Normal radial pulse (80 bpm)',
          circAr: 'نبض كعبري طبيعي (80 نبضة/د)',
          neuro: 'Mildly bewildered, repeats: "What happened? Did the shelf roll?"',
          neuroAr: 'مشوش خفيف، يكرر: "ماذا حدث؟ هل تحركت الرفوف؟"',
          visual: 'Small contusion on forehead from falling document folder, sitting upright',
          visualAr: 'كدمة سطحية صغيرة في الجبهة نتيجة سقوط ملف كرتوني، جالس معتدلاً',
          audio: 'Confused tone, repeating questions',
          audioAr: 'نبرة ارتباك وتكرار للأسئلة',
          vitals: { hr: 80, rr: 18, bp: '120/78 (Normal)', avpu: 'Confused', avpuAr: 'مشوش خفيف' }
        },
        correctTag: 'YEL',
        isVocal: false,
        justification: 'Minor head contusion with mild concussive disorientation. Requires neuro checks, but hemodynamically stable.',
        justificationAr: 'كدمة رأس خفيفة مع تشوش بسيط يتطلب مراقبة عصبية، ولكن المؤشرات الحيوية طبيعية تماماً.'
      }
    ],
    interventions: [
      {
        label: 'Apply makeshift pelvic circumferential binder (coat/sheet), maintain thermal blankets to fight shock, and call priority medical dispatch immediately',
        labelAr: 'تثبيت حزام ضاغط مؤقت حول الحوض (بسترة أو ملاءة)، وتدفئة المصاب ببطانية لمنع الصدمة، واستدعاء الإسعاف فوراً',
        isCorrect: true
      },
      {
        label: 'Bandage Person C\'s small forehead scratch and let them walk up the stairs unattended',
        labelAr: 'تضميد كدمة الشخص (ج) في الجبهة والسماح له بصعود الدرج بمفرده',
        isCorrect: false
      },
      {
        label: 'Elevate Person A\'s legs vertically without stabilizing their crushed pelvis',
        labelAr: 'رفع ساقي الشخص (أ) عمودياً للأعلى دون تثبيت حوضه المهروس',
        isCorrect: false
      },
      {
        label: 'Lead Person B to restroom to wash the deep forearm laceration under sink tap',
        labelAr: 'اصطحاب الشخص (ب) إلى دورة المياه لغسل الجرح الغائر بالصابون',
        isCorrect: false
      }
    ]
  }
];
