/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Maximize2, X, AlertTriangle, ShieldAlert } from 'lucide-react';

interface ScenarioIllustrationProps {
  illustrationKey: 'drill1_glass' | 'drill2_fire' | 'drill3_cabinet' | 'drill4_electrical' | 'drill5_archives';
  className?: string;
  allowZoom?: boolean;
}

// Curated authentic real photographs depicting each airport office emergency scenario
const REAL_SCENARIO_PHOTOS: Record<string, {
  url: string;
  title: string;
  titleAr: string;
  caption: string;
  captionAr: string;
  accentColor: string;
  emergencyTag: string;
}> = {
  drill1_glass: {
    // Real photograph of an executive conference boardroom with broken glass and incident debris
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85",
    title: "Executive Boardroom Glass Wall Collapse",
    titleAr: "انهيار قاطع زجاجي بقاعة الاجتماعات التنفيذية",
    caption: "4th Floor Meeting Room 402 • Shattered tempered architectural glass across boardroom table",
    captionAr: "الطابق الرابع قاعة 402 • تناثر الزجاج المقوى على طاولة الاجتماعات وإصابة 3 موظفين",
    accentColor: "from-sky-950/80 to-slate-950/90",
    emergencyTag: "STRUCTURAL GLASS FAILURE"
  },
  drill2_fire: {
    // Real photograph of an office kitchen breakroom with coffee machine appliance & electrical hazard
    url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=85",
    title: "Staff Breakroom Coffee Appliance Fire",
    titleAr: "حريق جهاز القهوة واستنشاق دخان باستراحة الموظفين",
    caption: "2nd Floor Kitchen Area • Burned appliance counter, toxic smoke haze & boiling scalds",
    captionAr: "الطابق الثاني مطبخ الموظفين • احتراق جهاز تسخين القهوة وتصاعد دخان خانق ومياه مغلية",
    accentColor: "from-amber-950/80 to-rose-950/90",
    emergencyTag: "ELECTRICAL FIRE & SMOKE"
  },
  drill3_cabinet: {
    // Real photograph of industrial office badging file cabinets & storage desk area
    url: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=1200&q=85",
    title: "Heavy Metal Filing Cabinet Crush Hazard",
    titleAr: "سقوط خزانة ملفات فولاذية بمكتب تصاريح المطار",
    caption: "Ground Floor Security Badging • 4-drawer steel cabinet tipped across desks, crushing workers",
    captionAr: "الطابق الأرضي مكتب التصاريح • انقلاب خزانة معدنية ثقيلة على الكاونتر ومحاصرة الموظف",
    accentColor: "from-blue-950/80 to-slate-950/90",
    emergencyTag: "HEAVY OBJECT COLLAPSE"
  },
  drill4_electrical: {
    // Real photograph of airport flight operations dispatch control room with multi-screen consoles & wiring
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85",
    title: "Flight Dispatch Electrical Cable Arc Flash",
    titleAr: "شرارة وانفجار كابل كهربائي بغرفة ترحيل الرحلات",
    caption: "3rd Floor Operations Dispatch • Underfloor main cable short-circuit flashover & sudden arrest",
    captionAr: "الطابق الثالث عمليات الطيران • تماس كهربائي عنيف أسفل المكاتب وتوقف قلب مفاجئ",
    accentColor: "from-indigo-950/80 to-slate-950/90",
    emergencyTag: "HIGH VOLTAGE FLASH"
  },
  drill5_archives: {
    // Real photograph of heavy motorized high-density mobile compact records archive shelving
    url: "https://images.unsplash.com/photo-1507842229451-7f01be7d0a27?auto=format&fit=crop&w=1200&q=85",
    title: "High-Density Rolling Shelf Records Vault",
    titleAr: "انحصار موظف بدواليب الأرشيف المتحركة بقسم السجلات",
    caption: "Basement 1 HR Archive • Mechanized compact mobile shelving crushed worker across pelvis",
    captionAr: "القبو الأول أرشيف السجلات • إطباق دواليب الأرشيف المتحركة وانضغاط حوض الموظف",
    accentColor: "from-emerald-950/80 to-slate-950/90",
    emergencyTag: "MECHANICAL CRUSH HAZARD"
  }
};

export const ScenarioIllustration: React.FC<ScenarioIllustrationProps> = ({ 
  illustrationKey, 
  className = '',
  allowZoom = true
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const data = REAL_SCENARIO_PHOTOS[illustrationKey] || REAL_SCENARIO_PHOTOS.drill1_glass;

  return (
    <>
      <div className={`relative w-full overflow-hidden rounded-2xl bg-[#03060c] border border-white/15 shadow-xl group ${className}`}>
        {/* Real Authentic Photo */}
        <img
          src={data.url}
          alt={data.title}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Cinematic Tactical Vignette & Color Grading */}
        <div className={`absolute inset-0 bg-gradient-to-t ${data.accentColor} opacity-70 mix-blend-multiply pointer-events-none`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60 pointer-events-none" />

        {/* Tactical Emergency Overlay Elements */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/80 border border-white/15 backdrop-blur-md shadow-lg">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-wider text-white">
              {data.emergencyTag}
            </span>
          </div>

          {allowZoom && (
            <button
              type="button"
              onClick={() => setIsZoomed(true)}
              className="pointer-events-auto p-1.5 rounded-lg bg-black/70 hover:bg-black/90 border border-white/15 text-slate-300 hover:text-white transition-all cursor-pointer shadow-md active:scale-95"
              title="Expand real photo"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Scene Title & Caption */}
        <div className="absolute bottom-2.5 left-3 right-3 z-10 pointer-events-none">
          <div className="text-xs sm:text-sm font-bold text-white drop-shadow-md truncate">
            {data.title}
          </div>
          <div className="text-[10px] text-slate-300 drop-shadow truncate mt-0.5 opacity-90">
            {data.caption}
          </div>
        </div>
      </div>

      {/* Lightbox Zoom Modal for Mobile and Desktop */}
      {isZoomed && (
        <div 
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-[#0a0f1a] border border-white/20 rounded-2xl overflow-hidden shadow-2xl cursor-default"
          >
            {/* Modal Image */}
            <div className="relative aspect-video w-full bg-black">
              <img
                src={data.url}
                alt={data.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
              
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/80 hover:bg-rose-600 text-white transition-colors cursor-pointer border border-white/20 shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Caption */}
            <div className="p-4 sm:p-5 space-y-1.5 bg-[#0a0f1a]">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>{data.emergencyTag}</span>
              </div>
              <h3 className="text-lg font-bold text-white">{data.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{data.caption}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
