"use client";

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import TopBar from '@/components/PitWall/TopBar';
import WidgetDock from '@/components/PitWall/WidgetDock';
import ChatTerminal from '@/components/PitWall/ChatTerminal';
import LeftSidebar from '@/components/PitWall/LeftSidebar';
import StrategyView from '@/components/PitWall/StrategyView';
import TelemetryView from '@/components/PitWall/TelemetryView';
import InitScreen from '@/components/PitWall/InitScreen';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [initDone, setInitDone] = useState(false);
  const [activeTab, setActiveTab] = useState('live');

  useEffect(() => { setMounted(true); }, []);

  const handleInitComplete = useCallback(() => {
    setInitDone(true);
  }, []);

  if (!mounted) return <div className="h-screen bg-[#0D0405]" />;

  return (
    <>
      {/* Init animation overlay */}
      <AnimatePresence mode="wait">
        {!initDone && <InitScreen onComplete={handleInitComplete} />}
      </AnimatePresence>

      {/* Main app — renders underneath, becomes visible when init exits */}
      <main className={`flex flex-col h-screen bg-[#0D0405] text-[#F5DDDE] overflow-hidden selection:bg-[#AE2C23] selection:text-white transition-opacity duration-500 ${
        initDone ? 'opacity-100' : 'opacity-0'
      }`}>
        
        <TopBar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="flex flex-1 pt-14 pb-16 md:pb-0 overflow-hidden">
          <LeftSidebar />
          
          {activeTab === 'live' && <ChatTerminal />}
          {activeTab === 'strategy' && <StrategyView />}
          {activeTab === 'telemetry' && <TelemetryView />}

          {activeTab === 'live' && <WidgetDock />}
        </div>

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
    </>
  );
}
