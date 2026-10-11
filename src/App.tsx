/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShieldAlert, 
  Clock, 
  Activity, 
  ChevronRight, 
  FileText, 
  RefreshCcw,
  CheckCircle2,
  Lock,
  Download,
  Zap,
  Navigation,
  MessageSquare,
  BadgeCheck,
  UserCheck,
  Award,
  AlertCircle,
  Sparkles,
  Volume2,
  Shield,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import { scenarios, Scenario, TriageTag } from './data/scenarios';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { StudentSplashScreen, StudentInfo } from './components/StudentSplashScreen';
import { ScenarioIllustration } from './components/ScenarioIllustration';
import { Language, translations } from './translations';

type AppPhase = 'SPLASH' | 'LOBBY' | 'BRIEFING' | 'TERMINAL' | 'RESULT';

interface CampaignProgress {
  unlockedStage: number; // 1 to 5
  scores: Record<number, number>; // highest score per stage { 1: 85, 2: 90, ... }
  passedStages: number[]; // array of stage numbers passed with >= 80
}

const PASS_SCORE = 80;

export default function App() {
  // Language State (en or ar)
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('ksia_app_lang');
      return (saved === 'ar' || saved === 'en') ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  const t = translations[lang];

  // Set document direction whenever language changes
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    try {
      localStorage.setItem('ksia_app_lang', lang);
    } catch {
      // ignore
    }
  }, [lang]);

  // Student Credential State (Individual Officer)
  const [student, setStudent] = useState<StudentInfo | null>(() => {
    try {
      const saved = localStorage.getItem('ksia_student_credentials_v2') || localStorage.getItem('ksia_student_credentials');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // App Phase State
  const [phase, setPhase] = useState<AppPhase>(() => {
    try {
      const saved = localStorage.getItem('ksia_student_credentials_v2') || localStorage.getItem('ksia_student_credentials');
      return saved ? 'LOBBY' : 'SPLASH';
    } catch {
      return 'SPLASH';
    }
  });

  // Campaign Progress State
  const [campaign, setCampaign] = useState<CampaignProgress>(() => {
    try {
      const saved = localStorage.getItem('ksia_drill_campaign_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      unlockedStage: 1,
      scores: {},
      passedStages: []
    };
  });

  // Selected Drill State
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(scenarios[0]);

  // Simulation State
  const [timeLeft, setTimeLeft] = useState(90);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [userTags, setUserTags] = useState<Record<string, TriageTag>>({});
  const [selectedIntervention, setSelectedIntervention] = useState<number | null>(null);
  const [justification, setJustification] = useState('');
  const [firstClickId, setFirstClickId] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  // Active Casualty Tab for phone screens ('A' | 'B' | 'C' | 'ALL')
  const [activeCasualtyTab, setActiveCasualtyTab] = useState<string>('A');

  // Scoring
  const [score, setScore] = useState(0);
  const [scoreBreakdown, setScoreBreakdown] = useState({
    precision: 0,
    distressBias: 0,
    intervention: 0,
    time: 0,
    justification: 0
  });

  // Teacher Injects / Distractions
  const [isFrozen, setIsFrozen] = useState(false);
  const [distressSurge, setDistressSurge] = useState(false);
  const [decompensation, setDecompensation] = useState(false);

  // Save campaign updates
  const saveCampaignProgress = useCallback((newCampaign: CampaignProgress) => {
    setCampaign(newCampaign);
    try {
      localStorage.setItem('ksia_drill_campaign_v2', JSON.stringify(newCampaign));
    } catch {
      // ignore
    }
  }, []);

  // Keyboard Shortcuts (F1, F2, F3)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== 'TERMINAL') return;
      
      switch(e.key) {
        case 'F1':
          e.preventDefault();
          setDistressSurge(prev => !prev);
          break;
        case 'F2':
          e.preventDefault();
          setDecompensation(prev => !prev);
          break;
        case 'F3':
          e.preventDefault();
          setIsFrozen(prev => !prev);
          setIsTimerActive(prev => !prev);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, isTimerActive]);

  const handleStudentAuthenticated = (info: StudentInfo) => {
    setStudent(info);
    setPhase('LOBBY');
  };

  const handleSelectScenario = (scenario: Scenario) => {
    if (scenario.stageNumber > campaign.unlockedStage) {
      return;
    }
    setSelectedScenario(scenario);
    setActiveCasualtyTab('A');
    setPhase('BRIEFING');
  };

  const handleStartDrill = () => {
    setPhase('TERMINAL');
    setIsTimerActive(true);
    setTimeLeft(90);
    setUserTags({});
    setSelectedIntervention(null);
    setJustification('');
    setFirstClickId(null);
    setIsLocked(false);
    setActiveCasualtyTab('A');
  };

  const handleTagCasualty = (casualtyId: string, tag: TriageTag) => {
    if (isLocked) return;
    if (!firstClickId) setFirstClickId(casualtyId);
    setUserTags(prev => ({ ...prev, [casualtyId]: tag }));

    // Auto-advance to the next untagged casualty on phone screens
    const casualtyKeys = selectedScenario.casualties.map(c => c.id);
    const currentIndex = casualtyKeys.indexOf(casualtyId);
    if (currentIndex >= 0 && currentIndex < casualtyKeys.length - 1) {
      const nextKey = casualtyKeys[currentIndex + 1];
      if (!userTags[nextKey]) {
        setActiveCasualtyTab(nextKey);
      }
    }
  };

  const calculateScore = useCallback(() => {
    if (!selectedScenario) return;

    let precision = 0;
    selectedScenario.casualties.forEach(c => {
      if (userTags[c.id] === c.correctTag) precision += (35 / selectedScenario.casualties.length);
    });

    let distressBias = 25;
    // Penalty if first click was on a loud vocal person while a quiet dying person exists
    const redCasualties = selectedScenario.casualties.filter(c => c.correctTag === 'RED');
    const firstClickedCasualty = selectedScenario.casualties.find(c => c.id === firstClickId);
    if (redCasualties.length > 0 && firstClickedCasualty && firstClickedCasualty.isVocal) {
      distressBias = 10; // -15 points penalty for getting distracted by screams
    }

    let interventionScore = 0;
    if (selectedIntervention !== null && selectedScenario.interventions[selectedIntervention].isCorrect) {
      interventionScore = 20;
    }

    const timeScore = timeLeft > 0 ? 10 : 0;
    const justificationScore = justification.trim().length > 10 ? 10 : 0;

    const total = Math.min(100, Math.round(precision + distressBias + interventionScore + timeScore + justificationScore));
    setScore(total);
    setScoreBreakdown({
      precision: Math.round(precision),
      distressBias,
      intervention: interventionScore,
      time: timeScore,
      justification: justificationScore
    });

    // Update campaign progress
    const stageNum = selectedScenario.stageNumber;
    const isPassed = total >= PASS_SCORE;
    
    const updatedScores = {
      ...campaign.scores,
      [stageNum]: Math.max(campaign.scores[stageNum] || 0, total)
    };

    const newPassedStages = isPassed && !campaign.passedStages.includes(stageNum)
      ? [...campaign.passedStages, stageNum]
      : campaign.passedStages;

    const newUnlockedStage = isPassed 
      ? Math.max(campaign.unlockedStage, Math.min(scenarios.length, stageNum + 1))
      : campaign.unlockedStage;

    saveCampaignProgress({
      unlockedStage: newUnlockedStage,
      scores: updatedScores,
      passedStages: newPassedStages
    });

    if (total >= PASS_SCORE) {
      confetti({
        particleCount: 140,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#38bdf8', '#fbbf24']
      });
    }
  }, [selectedScenario, userTags, firstClickId, selectedIntervention, timeLeft, justification, campaign, saveCampaignProgress]);

  const handleLockSubmission = () => {
    setIsLocked(true);
    setIsTimerActive(false);
    calculateScore();
    setPhase('RESULT');
  };

  // Timer Effect
  useEffect(() => {
    let interval: number;
    if (isTimerActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      handleLockSubmission();
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  // Proceed to Next Drill or Retry
  const handleProceedToNextDrill = () => {
    const nextStageNum = selectedScenario.stageNumber + 1;
    const nextScenario = scenarios.find(s => s.stageNumber === nextStageNum);
    if (nextScenario) {
      setSelectedScenario(nextScenario);
      setActiveCasualtyTab('A');
      setPhase('BRIEFING');
    } else {
      setPhase('LOBBY');
    }
  };

  const handleRedoStage = () => {
    handleStartDrill();
  };

  const resetToLobby = () => {
    setPhase('LOBBY');
    setTimeLeft(90);
    setIsTimerActive(false);
    setUserTags({});
    setSelectedIntervention(null);
    setJustification('');
    setFirstClickId(null);
    setIsLocked(false);
  };

  // Calculate average score across passed stages
  const calculateAverageScore = useCallback(() => {
    if (campaign.passedStages.length === 0) return 0;
    const total = campaign.passedStages.reduce((sum, stageNum) => sum + (campaign.scores[stageNum] || 0), 0);
    return Math.round(total / campaign.passedStages.length);
  }, [campaign.passedStages, campaign.scores]);

  const allDrillsFinished = campaign.passedStages.length === scenarios.length;

  // Export Master PDF Certificate (Only when all 5 drills are fully passed!)
  const handleExportPDF = () => {
    if (!allDrillsFinished) return;
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();
    const avg = calculateAverageScore();

    // Top banner
    doc.setFillColor(10, 15, 26);
    doc.rect(0, 0, 210, 38, 'F');

    doc.setTextColor(16, 185, 129);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('KING SALMAN INTERNATIONAL AIRPORT', 12, 16);

    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('Office Emergency Response Team (ERT) - Official Master Certification', 12, 24);

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('Official 90-Second Tactical Prioritization Standard • All 5 Drills Completed & Verified', 12, 31);

    // Individual Officer Information
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('CERTIFIED OFFICER CREDENTIALS', 12, 48);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Certified Officer: ${student?.name || 'Unassigned'}`, 12, 56);
    doc.text(`Badge / Employee ID: ${student?.badgeNumber || 'N/A'}`, 12, 63);
    doc.text(`Certification Date: ${timestamp}`, 12, 70);
    doc.text(`Accreditation Status: Full Airport Office ERT Qualified First Responder`, 12, 77);

    // Score Summary
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('COMPREHENSIVE PERFORMANCE EVALUATION', 12, 90);

    doc.setFillColor(241, 245, 249);
    doc.rect(12, 95, 186, 22, 'F');
    doc.setFontSize(12);
    doc.setTextColor(16, 185, 129);
    doc.text(`OVERALL AVERAGE SCORE: ${avg}% / 100 (QUALIFIED WITH DISTINCTION)`, 16, 105);
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(`Standard Achieved: All 5 drills passed with individual scores >= 80% under standard 90s time limit`, 16, 112);

    // All 5 Drills Performance Breakdown
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('DRILL-BY-DRILL OFFICIAL RECORD', 12, 128);

    let yPos = 137;
    scenarios.forEach((s) => {
      const sScore = campaign.scores[s.stageNumber] || 0;
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`${s.group}: ${s.title}`, 16, yPos);

      doc.setTextColor(16, 185, 129);
      doc.text(`Score: ${sScore}% [PASSED]`, 155, yPos);

      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      doc.text(`Sector: ${s.facilitySector} | Location: ${s.location}`, 20, yPos + 4.5);

      yPos += 12;
    });

    // Verification Seal
    doc.setFillColor(248, 250, 252);
    doc.rect(12, yPos + 5, 186, 30, 'F');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.text('OFFICIAL SAFETY DIRECTORATE VALIDATION', 16, yPos + 13);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('This credential certifies that the officer demonstrated accurate triage tag decision making, resisted audible screaming distractions, and delivered rapid, lifesaving immediate first-aid in office emergency drills.', 16, yPos + 19, { maxWidth: 178 });

    const safeName = (student?.name || 'Trainee').replace(/\s+/g, '_');
    const safeBadge = (student?.badgeNumber || 'CADET').replace(/[^a-zA-Z0-9_-]/g, '');
    doc.save(`KSIA_ERT_Master_Certification_${safeBadge}_${safeName}.pdf`);
  };

  // WhatsApp Share (Only allowed when all 5 drills are fully finished!)
  const handleSendToWhatsApp = () => {
    if (!allDrillsFinished) return;
    const avg = calculateAverageScore();

    const drillBreakdown = scenarios
      .map(s => `• ${s.group}: ${campaign.scores[s.stageNumber] || 0}%`)
      .join('%0A');
    
    const message = `*KING SALMAN INTERNATIONAL AIRPORT*%0A` +
      `*OFFICE ERT MASTER CERTIFICATION REPORT*%0A%0A` +
      `*Officer:* ${student?.name || 'Trainee'} (#${student?.badgeNumber || 'N/A'})%0A` +
      `*Status:* FULLY COMPLETED (All 5 Drills Passed >= 80%)%0A` +
      `*Cumulative Average Score:* ${avg}/100%0A%0A` +
      `*Drills Breakdown:*%0A${drillBreakdown}%0A%0A` +
      `_Certified under KSIA 90-Second Emergency Prioritization Standard._`;
    
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#05080f] text-slate-200 font-sans selection:bg-emerald-500/30 flex flex-col justify-between">
      <OfflineIndicator />
      
      {/* Top Header with Language Switcher on Top Right Corner */}
      <header className="border-b border-white/10 bg-[#0a0f1a]/95 backdrop-blur-md sticky top-0 z-50 px-3 sm:px-6 py-2.5 sm:py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2 sm:gap-4">
          {/* Logo & Return button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                if (phase !== 'TERMINAL' || confirm(lang === 'ar' ? 'هل تريد العودة إلى القائمة الرئيسية؟ سيتم إعادة تشغيل المؤقت.' : 'Return to main drills map? Current drill timer will reset.')) {
                  resetToLobby();
                }
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/25 hover:border-emerald-500/50 transition-colors shrink-0 cursor-pointer"
              title="Return to drill map"
            >
              <ShieldAlert className="w-5 h-5 text-emerald-400" />
            </button>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-xs sm:text-sm font-bold text-white truncate max-w-[160px] sm:max-w-none">
                  {t.appName}
                </h1>
                <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold whitespace-nowrap">
                  {t.badgeTag}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden md:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Countdown Timer during Terminal Drill */}
          {phase === 'TERMINAL' && (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`px-2.5 sm:px-3 py-1 rounded-xl border font-mono text-sm sm:text-base font-bold tabular-nums flex items-center gap-1.5 ${
                timeLeft < 20 
                  ? 'border-rose-500/50 bg-rose-500/15 text-rose-400 animate-pulse' 
                  : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>
          )}

          {/* Top Right Corner Controls: Language Toggle & Status */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Officer ID Chip */}
            {student && phase !== 'SPLASH' && (
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-black/50 border border-white/10 rounded-xl text-xs">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-slate-200 truncate max-w-[100px]">{student.name}</span>
                <span className="text-slate-500">|</span>
                <span className="text-emerald-400 font-mono font-bold">#{student.badgeNumber}</span>
              </div>
            )}

            {/* Language Selector in Top Right Corner */}
            <div className="flex items-center rounded-xl bg-black/60 border border-white/15 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  lang === 'en' 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Switch to English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('ar')}
                className={`px-2 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  lang === 'ar' 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
                title="التبديل إلى العربية"
              >
                عربي
              </button>
            </div>

            <PWAInstallButton />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 flex-1 w-full">
        <AnimatePresence mode="wait">
          {/* 1. STUDENT SPLASH / SIGN-IN (Individual) */}
          {phase === 'SPLASH' && (
            <StudentSplashScreen
              key="splash"
              initialInfo={student}
              lang={lang}
              onAuthenticate={handleStudentAuthenticated}
            />
          )}

          {/* 2. LOBBY - SEQUENTIAL DRILL PROGRESSION MAP */}
          {phase === 'LOBBY' && (
            <motion.div 
              key="lobby"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6 py-2 sm:py-4"
            >
              {/* Individual Officer Card */}
              {student && (
                <div className="bg-gradient-to-r from-emerald-950/40 via-[#0a0f1a] to-black border border-emerald-500/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                      <BadgeCheck className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-white">{student.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          #{student.badgeNumber}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        <span>{t.passMarkNotice}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPhase('SPLASH')}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-colors cursor-pointer"
                    >
                      {lang === 'ar' ? 'تعديل البيانات' : 'Change Info'}
                    </button>
                  </div>
                </div>
              )}

              {/* Campaign Header & Status Tracker */}
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{t.campaignTitle}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {lang === 'ar' ? 'مراحل تدريب طوارئ مكاتب المطار' : 'Sequential 5-Drill Certification Path'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {t.campaignSubtitle}
                </p>
              </div>

              {/* Campaign Progress Stepper */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0a0f1a] border border-white/10 shadow-xl space-y-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span>{t.overallProgress}</span>
                  </span>
                  <span className="text-emerald-400 font-mono">
                    {campaign.passedStages.length} / {scenarios.length} {lang === 'ar' ? 'مراحل مكتملة' : 'Passed'}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {scenarios.map((s) => {
                    const isPassed = campaign.passedStages.includes(s.stageNumber);
                    const isUnlocked = s.stageNumber <= campaign.unlockedStage;
                    const stageScore = campaign.scores[s.stageNumber];

                    return (
                      <div 
                        key={s.id} 
                        className={`p-2 rounded-xl border text-center transition-all ${
                          isPassed 
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' 
                            : isUnlocked 
                            ? 'bg-blue-500/10 border-blue-500/40 text-blue-300 ring-1 ring-blue-500/30' 
                            : 'bg-black/30 border-white/5 text-slate-600'
                        }`}
                      >
                        <div className="text-[10px] font-mono font-bold">
                          {t.stageLabel} {s.stageNumber}
                        </div>
                        <div className="text-xs font-black mt-0.5">
                          {isPassed ? (
                            <span className="text-emerald-400">{stageScore}%</span>
                          ) : isUnlocked ? (
                            <span className="text-blue-400 text-[10px]">{t.inProgressBadge}</span>
                          ) : (
                            <span className="text-slate-500 text-[10px]">🔒</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* All Drills Completed Banner */}
                {campaign.passedStages.length === scenarios.length && (
                  <div className="mt-3 p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/70 via-[#0a0f1a] to-teal-950/70 border border-emerald-500/50 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                    <div className="flex items-center gap-2 text-xs">
                      <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <div className="font-bold text-white text-sm">{t.allDrillsCompletedBanner}</div>
                        <div className="text-[11px] text-slate-300">
                          {t.averageScoreLabel}: <strong className="text-emerald-400 font-mono">{calculateAverageScore()}%</strong> (5/5 Drills Passed)
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={handleExportPDF}
                        className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{t.downloadMasterCert}</span>
                      </button>

                      <button
                        onClick={handleSendToWhatsApp}
                        className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-emerald-500/40 shadow-md shrink-0 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{t.shareWhatsApp}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 4 Color Tags Legend */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-black/40 border border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> {t.redTagTitle}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-tight">{t.redTagDesc}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> {t.yellowTagTitle}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-tight">{t.yellowTagDesc}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> {t.greenTagTitle}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-tight">{t.greenTagDesc}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-300 font-bold text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> {t.blackTagTitle}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">{t.blackTagDesc}</p>
                </div>
              </div>

              {/* Real Photo Scenario Cards */}
              <div className="space-y-4 pt-1">
                {scenarios.map((s) => {
                  const isPassed = campaign.passedStages.includes(s.stageNumber);
                  const isUnlocked = s.stageNumber <= campaign.unlockedStage;
                  const isCurrentActive = isUnlocked && !isPassed;
                  const stageScore = campaign.scores[s.stageNumber];

                  return (
                    <div
                      key={s.id}
                      className={`rounded-2xl border transition-all overflow-hidden flex flex-col md:flex-row gap-4 p-4 sm:p-5 ${
                        isCurrentActive
                          ? 'bg-[#0d1627] border-blue-500/60 ring-2 ring-blue-500/30 shadow-2xl'
                          : isPassed
                          ? 'bg-[#0a0f1a] border-emerald-500/40'
                          : 'bg-[#060a12]/80 border-white/5 opacity-60'
                      }`}
                    >
                      {/* Real Scene Photo */}
                      <div className="w-full md:w-64 h-40 md:h-auto rounded-xl overflow-hidden shrink-0 relative">
                        <ScenarioIllustration illustrationKey={s.illustrationKey} className="h-full" />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/85 backdrop-blur-md text-[10px] font-mono font-bold text-emerald-400 border border-white/10">
                          {lang === 'ar' ? s.groupAr : s.group}
                        </div>
                      </div>

                      {/* Drill Details */}
                      <div className="flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                              {lang === 'ar' ? s.facilitySectorAr : s.facilitySector}
                            </span>
                            
                            {isPassed ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{t.passedBadge}: {stageScore}%</span>
                              </span>
                            ) : isCurrentActive ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-bold flex items-center gap-1 animate-pulse">
                                <Activity className="w-3.5 h-3.5" />
                                <span>{t.inProgressBadge}</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-medium flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                <span>{t.lockedBadge}</span>
                              </span>
                            )}
                          </div>

                          <h3 className="text-lg font-bold text-white">
                            {lang === 'ar' ? s.titleAr : s.title}
                          </h3>

                          <p className="text-xs text-slate-300 leading-relaxed">
                            {lang === 'ar' ? s.summaryAr : s.summary}
                          </p>
                        </div>

                        {/* Location and Launch Action */}
                        <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <span className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Navigation className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{lang === 'ar' ? s.locationAr : s.location}</span>
                          </span>

                          <div>
                            {isUnlocked ? (
                              <button
                                onClick={() => handleSelectScenario(s)}
                                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
                                  isPassed
                                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/50'
                                }`}
                              >
                                <span>{isPassed ? t.redoStageButton : isCurrentActive ? t.startDrillButton : t.resumeDrillButton}</span>
                                <ChevronRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                              </button>
                            ) : (
                              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                                <Lock className="w-3.5 h-3.5" />
                                <span>{t.stageMustPassNotice}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Priority Secret Advice */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>{t.proTipTitle}</strong>
                  <span className="ml-1 text-slate-300">
                    {t.proTipDesc}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* 3. INDIVIDUAL BRIEFING & REAL PHOTO INSPECTION (No other names required!) */}
          {phase === 'BRIEFING' && selectedScenario && (
            <motion.div 
              key="briefing"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="max-w-3xl mx-auto space-y-4 py-2 sm:py-4"
            >
              <div className="bg-[#0a0f1a] border border-white/15 rounded-3xl p-4 sm:p-6 space-y-5 shadow-2xl overflow-hidden">
                {/* Real Scenario Photo with Magnify Badge */}
                <div className="space-y-3">
                  <div className="h-56 sm:h-72 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                    <ScenarioIllustration illustrationKey={selectedScenario.illustrationKey} className="h-full" />
                  </div>

                  <div className="flex items-start justify-between pb-3 border-b border-white/10">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-emerald-400 uppercase">
                        {lang === 'ar' ? selectedScenario.groupAr : selectedScenario.group} • {lang === 'ar' ? selectedScenario.facilitySectorAr : selectedScenario.facilitySector}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                        {lang === 'ar' ? selectedScenario.titleAr : selectedScenario.title}
                      </h2>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-0.5">
                        <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                        {lang === 'ar' ? selectedScenario.locationAr : selectedScenario.location}
                      </p>
                    </div>

                    <button
                      onClick={() => setPhase('LOBBY')}
                      className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 cursor-pointer shrink-0"
                    >
                      {t.backToList}
                    </button>
                  </div>
                </div>

                {/* Individual Officer Status & Goal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-1">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t.officerOnDuty}</span>
                    </div>
                    <div className="text-sm font-bold text-white">
                      {student?.name || 'Trainee Officer'}
                    </div>
                    <div className="text-xs font-mono text-emerald-400">
                      ID: #{student?.badgeNumber || 'CADET'}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-1">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t.individualMissionGoal}</span>
                    </div>
                    <div className="text-xs text-slate-200 leading-relaxed">
                      {t.individualMissionGoalDesc}
                    </div>
                  </div>
                </div>

                {/* Direct Launch Button */}
                <div className="pt-2 space-y-2">
                  <button
                    onClick={handleStartDrill}
                    className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all rounded-xl font-bold text-white text-base flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/50 active:scale-[0.99]"
                  >
                    <span>{t.start90sDrillNow}</span>
                    <ChevronRight className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                  </button>
                  <p className="text-xs text-center text-slate-400">
                    {t.startCountdownNotice}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* 4. TACTICAL TERMINAL (Individual, Phone-Optimized) */}
          {phase === 'TERMINAL' && selectedScenario && (
            <motion.div 
              key="terminal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4 pb-16"
            >
              {/* Scene Brief with Compact Real Photo Header */}
              <div className="bg-[#0a0f1a] border border-white/10 rounded-2xl overflow-hidden shadow-lg">
                <div className="h-32 sm:h-44 w-full relative">
                  <ScenarioIllustration illustrationKey={selectedScenario.illustrationKey} className="h-full rounded-none border-none" />
                </div>

                <div className="p-3.5 sm:p-4 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-400 uppercase">
                        {lang === 'ar' ? selectedScenario.groupAr : selectedScenario.group} • {lang === 'ar' ? selectedScenario.facilitySectorAr : selectedScenario.facilitySector}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {lang === 'ar' ? selectedScenario.titleAr : selectedScenario.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-300">
                      <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'ar' ? selectedScenario.locationAr : selectedScenario.location}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {lang === 'ar' ? selectedScenario.summaryAr : selectedScenario.summary}
                  </p>
                </div>
              </div>

              {/* Mobile Casualty Selector Tabs */}
              <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-xl border border-white/10">
                {selectedScenario.casualties.map((c) => {
                  const tag = userTags[c.id];
                  const isSelected = activeCasualtyTab === c.id;

                  return (
                    <button
                      key={c.id}
                      onClick={() => setActiveCasualtyTab(c.id)}
                      className={`flex-1 py-2.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isSelected 
                          ? 'bg-emerald-600 text-white shadow-md' 
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <span>{t.casualtyTabLabel} {c.id}</span>
                      {tag ? (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                          tag === 'RED' ? 'bg-rose-500 text-white' :
                          tag === 'YEL' ? 'bg-amber-400 text-black' :
                          tag === 'GRN' ? 'bg-emerald-400 text-black' : 'bg-slate-700 text-white'
                        }`}>
                          {tag}
                        </span>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-500" />
                      )}
                    </button>
                  );
                })}

                <button
                  onClick={() => setActiveCasualtyTab('ALL')}
                  className={`py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeCasualtyTab === 'ALL'
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === 'ar' ? 'الكل' : 'All'}
                </button>
              </div>

              {/* Casualties Card Rendering */}
              <div className={`grid gap-4 ${activeCasualtyTab === 'ALL' ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {selectedScenario.casualties
                  .filter(c => activeCasualtyTab === 'ALL' || activeCasualtyTab === c.id)
                  .map((c) => {
                    const tag = userTags[c.id];

                    return (
                      <div 
                        key={c.id} 
                        className={`bg-[#0a0f1a] border rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between ${
                          tag 
                            ? 'border-emerald-500/50 shadow-lg' 
                            : 'border-white/10 hover:border-white/20'
                        } ${
                          distressSurge && c.isVocal 
                            ? 'ring-2 ring-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.25)]' 
                            : ''
                        }`}
                      >
                        {/* Casualty Top Bar */}
                        <div className="bg-black/60 px-4 py-2.5 flex justify-between items-center border-b border-white/10">
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-bold text-white uppercase">
                              {lang === 'ar' ? c.nameAr : c.name}
                            </span>
                          </div>
                          {c.isVocal && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold flex items-center gap-1">
                              <Volume2 className="w-3 h-3 animate-pulse" />
                              <span>{t.screamingAlert}</span>
                            </span>
                          )}
                        </div>

                        {/* Vitals & Telemetry */}
                        <div className="p-3.5 sm:p-4 space-y-3 flex-1">
                          {/* Quick Vitals Ribbon */}
                          <div className="grid grid-cols-4 gap-1.5 p-2 rounded-xl bg-black/40 border border-white/5 text-center">
                            <div>
                              <div className="text-[9px] text-slate-500 font-mono">HR / النبض</div>
                              <div className="text-xs font-bold text-white font-mono">{c.telemetry.vitals.hr}</div>
                            </div>
                            <div>
                              <div className="text-[9px] text-slate-500 font-mono">RR / التنفس</div>
                              <div className="text-xs font-bold text-white font-mono">{c.telemetry.vitals.rr}</div>
                            </div>
                            <div>
                              <div className="text-[9px] text-slate-500 font-mono">BP / الضغط</div>
                              <div className="text-[11px] font-bold text-white font-mono">{c.telemetry.vitals.bp.split(' ')[0]}</div>
                            </div>
                            <div>
                              <div className="text-[9px] text-slate-500 font-mono">AVPU / الوعي</div>
                              <div className={`text-[10px] font-bold ${
                                c.telemetry.vitals.avpu.includes('pain') || c.telemetry.vitals.avpu.includes('Unresponsive')
                                  ? 'text-rose-400'
                                  : 'text-emerald-400'
                              }`}>
                                {lang === 'ar' ? c.telemetry.vitals.avpuAr : c.telemetry.vitals.avpu}
                              </div>
                            </div>
                          </div>

                          {/* Clinical details */}
                          <div className="space-y-2 text-xs">
                            <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                              <div className="text-[10px] text-slate-400 font-medium">{t.breathingLabel}</div>
                              <div className="font-semibold text-slate-100 mt-0.5">
                                {lang === 'ar' ? c.telemetry.respAr : c.telemetry.resp}
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                {lang === 'ar' ? c.telemetry.airwayAr : c.telemetry.airway}
                              </div>
                            </div>

                            <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                              <div className="text-[10px] text-slate-400 font-medium">{t.bleedingLabel}</div>
                              <div className="font-semibold text-slate-100 mt-0.5">
                                {lang === 'ar' ? c.telemetry.circAr : c.telemetry.circ}
                              </div>
                              <div className="text-[11px] text-slate-300 mt-0.5">
                                {lang === 'ar' ? c.telemetry.visualAr : c.telemetry.visual}
                              </div>
                            </div>

                            <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                              <div className="text-[10px] text-slate-400 font-medium">{t.whatYouHearLabel}</div>
                              <div className="font-medium text-slate-200 mt-0.5 italic">
                                "{lang === 'ar' ? c.telemetry.audioAr : c.telemetry.audio}"
                              </div>
                            </div>
                          </div>

                          {/* 4 Large Color Buttons for Mobile Phones */}
                          <div className="pt-1 space-y-1.5">
                            <div className="text-[11px] text-slate-300 text-center font-semibold">
                              {t.choosePriorityColor}
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                              {(['RED', 'YEL', 'GRN', 'BLK'] as TriageTag[]).map((tagChoice) => (
                                <button
                                  key={tagChoice}
                                  onClick={() => handleTagCasualty(c.id, tagChoice)}
                                  className={`py-3 sm:py-3.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 active:scale-95 ${
                                    tag === tagChoice
                                      ? tagChoice === 'RED' ? 'bg-rose-600 border-rose-400 text-white shadow-lg ring-2 ring-rose-400/40'
                                        : tagChoice === 'YEL' ? 'bg-amber-400 border-amber-300 text-black font-extrabold shadow-lg ring-2 ring-amber-300/40'
                                        : tagChoice === 'GRN' ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg ring-2 ring-emerald-400/40'
                                        : 'bg-slate-800 border-slate-600 text-white ring-2 ring-slate-500/40'
                                      : 'bg-black/50 border-white/10 text-slate-400 hover:border-white/30 hover:text-white'
                                  }`}
                                >
                                  <span className="text-sm">
                                    {tagChoice === 'RED' ? '🔴' : tagChoice === 'YEL' ? '🟡' : tagChoice === 'GRN' ? '🟢' : '⚫'}
                                  </span>
                                  <span>{tagChoice}</span>
                                </button>
                              ))}
                            </div>

                            <div className="text-[10px] text-slate-400 text-center pt-0.5">
                              {tag === 'RED' && t.redHelpText}
                              {tag === 'YEL' && t.yellowHelpText}
                              {tag === 'GRN' && t.greenHelpText}
                              {tag === 'BLK' && t.blackHelpText}
                              {!tag && t.untaggedHelpText}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Immediate Action & Justification */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
                {/* Immediate Action Selection */}
                <div className="bg-[#0a0f1a] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                    <Zap className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h4 className="font-bold text-white text-xs sm:text-sm">{t.actionQuestionTitle}</h4>
                      <p className="text-[11px] text-slate-400">{t.actionQuestionSubtitle}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {selectedScenario.interventions.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedIntervention(idx)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                          selectedIntervention === idx 
                            ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-200' 
                            : 'bg-black/40 border-white/10 text-slate-300 hover:border-white/20'
                        } ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                      >
                        <span className="text-xs sm:text-sm font-medium leading-snug">
                          {lang === 'ar' ? opt.labelAr : opt.label}
                        </span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          selectedIntervention === idx ? 'border-emerald-500 bg-emerald-500 text-black' : 'border-white/20'
                        }`}>
                          {selectedIntervention === idx && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Justification Input & Submission */}
                <div className="bg-[#0a0f1a] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                      <FileText className="w-5 h-5 text-emerald-400" />
                      <div>
                        <h4 className="font-bold text-white text-xs sm:text-sm">{t.explanationTitle}</h4>
                        <p className="text-[11px] text-slate-400">{t.explanationSubtitle}</p>
                      </div>
                    </div>

                    <textarea
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                      placeholder={t.explanationPlaceholder}
                      className="w-full h-24 bg-black/60 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500/50 transition-colors resize-none placeholder:text-slate-600"
                    />
                  </div>

                  <button
                    onClick={handleLockSubmission}
                    className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 cursor-pointer active:scale-[0.99]"
                  >
                    <Lock className="w-4 h-4" /> 
                    <span>{t.submitDrillButton}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 5. RESULTS & SCORES (Enforces individual >= 80% progression rule) */}
          {phase === 'RESULT' && selectedScenario && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-3xl mx-auto py-3 space-y-4"
            >
              <div className="bg-[#0a0f1a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                {/* Result Header */}
                <div className={`p-6 sm:p-8 text-center space-y-3 border-b ${
                  score >= PASS_SCORE 
                    ? 'bg-gradient-to-b from-emerald-500/20 via-[#0a0f1a] to-[#0a0f1a] border-emerald-500/30' 
                    : 'bg-gradient-to-b from-rose-500/20 via-[#0a0f1a] to-[#0a0f1a] border-rose-500/30'
                }`}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-1 border ${
                    score >= PASS_SCORE 
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                      : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                  }`}>
                    {score >= PASS_SCORE ? <Award className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                  </div>
                  
                  <div className="space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-black text-white">
                      {score >= PASS_SCORE ? t.stagePassedTitle : t.stageFailedTitle}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300">
                      {score >= PASS_SCORE ? t.stagePassedDesc : t.stageFailedDesc}
                    </p>
                  </div>

                  {/* Big Score Numbers */}
                  <div className="flex justify-center items-center gap-8 sm:gap-14 pt-2">
                    <div className="text-center">
                      <div className={`text-5xl font-black tabular-nums ${
                        score >= PASS_SCORE ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {score}
                      </div>
                      <div className="text-xs text-slate-400 font-semibold mt-1">
                        {t.totalScoreLabel}
                      </div>
                    </div>
                    <div className="h-14 w-px bg-white/10" />
                    <div className="text-center">
                      <div className="text-3xl font-bold text-slate-300 tabular-nums">
                        {90 - timeLeft}s
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {t.timeTakenLabel}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-7 space-y-6">
                  {/* Score Breakdown */}
                  <div className="space-y-2.5">
                    <h3 className="text-xs text-slate-400 uppercase tracking-wider text-center font-bold">
                      {t.scoreBreakdownTitle}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {[
                        { label: t.scoreCorrectColors, val: scoreBreakdown.precision, max: 35 },
                        { label: t.scoreIgnoredScreams, val: scoreBreakdown.distressBias, max: 25 },
                        { label: t.scoreBestFirstAid, val: scoreBreakdown.intervention, max: 20 },
                        { label: t.scoreGoodSpeed, val: scoreBreakdown.time, max: 10 },
                        { label: t.scoreClearExplanation, val: scoreBreakdown.justification, max: 10 }
                      ].map((item) => (
                        <div key={item.label} className="bg-black/40 border border-white/5 rounded-xl p-2.5 text-center">
                          <div className="text-base font-bold text-white">
                            {item.val}<span className="text-xs text-slate-500">/{item.max}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Answers Clinical Review */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs text-slate-400 uppercase tracking-wider font-bold">
                        {t.answersReviewTitle}
                      </h3>
                      <span className="text-xs text-slate-400">
                        {lang === 'ar' ? selectedScenario.facilitySectorAr : selectedScenario.facilitySector}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {selectedScenario.casualties.map((c) => {
                        const tag = userTags[c.id];
                        const isCorrect = tag === c.correctTag;
                        return (
                          <div key={c.id} className="flex gap-3 items-start bg-black/40 p-3 rounded-xl border border-white/5">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                              isCorrect 
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            }`}>
                              {c.id}
                            </div>
                            <div className="space-y-1 flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="text-xs font-bold text-white">
                                  {lang === 'ar' ? c.nameAr : c.name}
                                </span>
                                <div className="flex items-center gap-1.5 text-xs">
                                  <span className="text-slate-400">{t.yourChoiceWas}</span>
                                  <span className={`px-2 py-0.5 rounded font-bold ${
                                    isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                                  }`}>
                                    {tag || 'None'}
                                  </span>
                                  <span className="text-slate-500">• {t.correctChoiceWas}</span>
                                  <span className="px-2 py-0.5 rounded bg-white/10 text-white font-bold">
                                    {c.correctTag}
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-slate-300">
                                {lang === 'ar' ? c.justificationAr : c.justification}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Individual Progression Choice based on Score */}
                  <div className="pt-3 border-t border-white/10 space-y-3">
                    {score >= PASS_SCORE ? (
                      /* PASSED: Choice to Proceed to Next Drill OR Retry for Higher Score */
                      <div className="space-y-2.5">
                        <div className="flex flex-col sm:flex-row gap-2.5">
                          {selectedScenario.stageNumber < scenarios.length ? (
                            <button
                              onClick={handleProceedToNextDrill}
                              className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer active:scale-[0.99]"
                            >
                              <span>{t.proceedToNextDrill} (Drill {selectedScenario.stageNumber + 1})</span>
                              <ChevronRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                            </button>
                          ) : (
                            <button
                              onClick={() => setPhase('LOBBY')}
                              className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer active:scale-[0.99]"
                            >
                              <Award className="w-4 h-4" />
                              <span>{t.allDrillsCompletedBanner}</span>
                            </button>
                          )}

                          <button
                            onClick={handleRedoStage}
                            className="py-3 px-5 bg-white/5 hover:bg-white/10 border border-white/10 transition-all rounded-xl font-bold text-slate-200 text-xs flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <RefreshCcw className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{t.redoForHigherScore}</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* FAILED (< 80): MUST REDO THE STAGE! */
                      <div className="space-y-2 text-center">
                        <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
                          {t.stageFailedDesc}
                        </div>
                        <button
                          onClick={handleRedoStage}
                          className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white transition-all rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50 cursor-pointer active:scale-[0.99]"
                        >
                          <RefreshCcw className="w-4 h-4" />
                          <span>{t.mustRedoStageButton}</span>
                        </button>
                      </div>
                    )}

                    {/* Certificate & Results Sharing: ONLY ALLOWED WHEN ALL DRILLS ARE FULLY FINISHED! */}
                    {allDrillsFinished ? (
                      <div className="pt-2 space-y-3">
                        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-[#0a0f1a] to-teal-950/70 border border-emerald-500/50 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                          <div className="flex items-center gap-2.5 text-xs">
                            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
                            <div>
                              <div className="font-bold text-white text-sm">{t.certificateUnlocked}</div>
                              <div className="text-[11px] text-slate-300">
                                {t.allDrillsPassedSuccess}
                              </div>
                            </div>
                          </div>

                          <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-emerald-500/30 font-mono text-xs font-bold text-emerald-400 whitespace-nowrap">
                            {t.averageScoreLabel}: {calculateAverageScore()}%
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={handleExportPDF}
                            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 transition-all rounded-xl font-bold text-white text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 cursor-pointer"
                          >
                            <Download className="w-4 h-4" /> 
                            <span>{t.savePdfCertificate}</span>
                          </button>
                          <button
                            onClick={handleSendToWhatsApp}
                            className="flex-1 py-3 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 transition-all rounded-xl font-bold text-xs border border-emerald-500/40 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                          >
                            <MessageSquare className="w-4 h-4" /> 
                            <span>{t.shareWhatsApp}</span>
                          </button>
                          <button
                            onClick={resetToLobby}
                            className="py-3 px-4 bg-slate-800 hover:bg-slate-700 transition-all rounded-xl font-medium text-slate-300 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>{t.backToLobby}</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* LOCKED: Tell user they can only share after finishing all 5 drills */
                      <div className="pt-2 space-y-2.5">
                        <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                              <Lock className="w-4 h-4 text-slate-400" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white flex items-center gap-1.5 justify-center sm:justify-start">
                                <span>{t.sharingLockedTitle}</span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {t.sharingLockedNotice}
                              </p>
                            </div>
                          </div>

                          <div className="px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono font-bold whitespace-nowrap">
                            {campaign.passedStages.length} / {scenarios.length} {lang === 'ar' ? 'مراحل مكتملة' : 'Drills Passed'}
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={resetToLobby}
                            className="w-full sm:w-auto py-2.5 px-5 bg-slate-800 hover:bg-slate-700 transition-all rounded-xl font-medium text-slate-300 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>{t.backToLobby}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-black/90 border-t border-white/10 px-4 py-2 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-slate-400">{t.appName}</span>
          <span className="text-slate-600">|</span>
          <span>{lang === 'ar' ? 'معيار الاستجابة لطوارئ مكاتب المطار' : 'King Salman International Airport Standard'}</span>
        </div>
        <div className="text-slate-500 font-mono">
          ID: {student?.badgeNumber || 'CADET'}
        </div>
      </footer>
    </div>
  );
}
