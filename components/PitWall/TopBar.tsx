"use client";

import { useTelemetry } from '@/hooks/useTelemetry';
import { Settings, Timer, Radio } from 'lucide-react';
import { useState, useEffect } from 'react';

interface TopBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TopBar({ activeTab, onTabChange }: TopBarProps) {
  const telemetry = useTelemetry();
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const tabs = [
    { id: 'live', label: 'LIVE FEED' },
    { id: 'strategy', label: 'STRATEGY' },
    { id: 'telemetry', label: 'TELEMETRY' },
  ];

  return (
    <header className="bg-[#0D0405] text-[#AE2C23] font-sans uppercase tracking-[0.15em] text-xs flex justify-between items-center w-full px-6 h-14 border-b-2 border-[#403133] z-50 fixed top-0">
      <div className="flex items-center gap-8">
        <span className="text-xl font-black text-[#AE2C23] tracking-tighter cursor-pointer" onClick={() => onTabChange('live')}>
          PitWall AI
        </span>
        <nav className="hidden md:flex gap-6 items-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`transition-all pb-1 ${
                activeTab === tab.id
                  ? 'text-[#AE2C23] border-b-2 border-[#AE2C23]'
                  : 'text-slate-400 hover:text-white border-b-2 border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4 md:gap-6 font-mono text-[10px] tracking-normal">
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-[#25181A] border border-[#59413E]/20">
          <span className="w-2 h-2 rounded-full bg-[#B9D164] animate-pulse-dot"></span>
          <span className="text-[#B9D164]">TRACK STATUS: GREEN</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-slate-500 hidden sm:inline">SESSION CLOCK:</span>
          <span className="text-white font-bold">{formatTime(sessionTime + 42 * 60 + 15)}</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1 border border-[#AE2C23]/40 bg-[#AE2C23]/10">
          <span className={telemetry.speed > 300 ? "text-white font-bold animate-pulse" : "text-[#FFB4AA]"}>
            DRS {telemetry.speed > 300 ? 'ACTIVE' : 'READY'}
          </span>
          <div className="w-8 h-4 relative bg-[#AE2C23]/20 border border-[#AE2C23]/40">
            <div className={`absolute top-0.5 w-3 h-3 transition-all duration-300 ${
              telemetry.speed > 300 ? 'right-0.5 bg-[#B9D164]' : 'left-0.5 bg-[#59413E]'
            }`}></div>
          </div>
        </div>

        <div className="flex gap-3 ml-2 border-l border-[#403133] pl-3">
          <Timer className="w-4 h-4 text-slate-400 hover:text-[#FFB4AA] cursor-pointer transition-colors" />
          <Radio className="w-4 h-4 text-[#B9D164] animate-pulse cursor-pointer" />
          <Settings className="w-4 h-4 text-slate-400 hover:text-[#FFB4AA] cursor-pointer transition-colors" />
        </div>
      </div>
    </header>
  );
}
