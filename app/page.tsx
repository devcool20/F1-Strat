"use client";

import { useState, useEffect } from 'react';
import TopBar from '@/components/PitWall/TopBar';
import WidgetDock from '@/components/PitWall/WidgetDock';
import ChatTerminal from '@/components/PitWall/ChatTerminal';
import LeftSidebar from '@/components/PitWall/LeftSidebar';
import StrategyView from '@/components/PitWall/StrategyView';
import TelemetryView from '@/components/PitWall/TelemetryView';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('live');

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="h-screen bg-[#0D0405]" />;

  return (
    <main className="flex flex-col h-screen bg-[#0D0405] text-[#F5DDDE] overflow-hidden selection:bg-[#AE2C23] selection:text-white">
      
      <TopBar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex flex-1 pt-14 pb-16 md:pb-0 overflow-hidden">
        {/* Left: Leaderboard & Strategy sidebar */}
        <LeftSidebar />
        
        {/* Center: Changes based on active tab */}
        {activeTab === 'live' && <ChatTerminal />}
        {activeTab === 'strategy' && <StrategyView />}
        {activeTab === 'telemetry' && <TelemetryView />}

        {/* Right: Widget Dock (only on live feed) */}
        {activeTab === 'live' && <WidgetDock />}
      </div>

      {/* Mobile bottom nav */}
      <footer className="md:hidden bg-[#0D0405]/95 backdrop-blur-xl text-[#AE2C23] font-mono text-[10px] fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 px-4 border-t-2 border-[#403133]">
        {[
          { id: 'live', label: 'CONSOLE', icon: '⌘' },
          { id: 'strategy', label: 'STRATEGY', icon: '◈' },
          { id: 'telemetry', label: 'DATA', icon: '◉' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center h-full px-4 transition-all ${
              activeTab === item.id
                ? 'text-[#AE2C23] border-t-2 border-[#AE2C23] -mt-[2px]'
                : 'text-slate-500 hover:text-white'
            }`}
          >
            <span className="text-base mb-0.5">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </footer>
    </main>
  );
}
