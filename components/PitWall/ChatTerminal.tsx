"use client";

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef, useState } from 'react';
import F1Message from './F1Message';
import { CornerDownLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRaceContext } from '@/context/TelemetryContext';

export default function ChatTerminal() {
  const [input, setInput] = useState('');
  const { telemetry, leaderboard, sectorTimes, lap, totalLaps } = useRaceContext();

  // Build a snapshot ref so handleSubmit always uses the latest values at send time
  const raceRef = useRef({ telemetry, leaderboard, sectorTimes, lap, totalLaps });
  useEffect(() => {
    raceRef.current = { telemetry, leaderboard, sectorTimes, lap, totalLaps };
  }, [telemetry, leaderboard, sectorTimes, lap, totalLaps]);

  const chatHook = useChat() as any;

  const messages = chatHook.messages ?? [];
  const status = chatHook.status ?? 'ready';
  const sendMessage = chatHook.sendMessage;
  const isLoading = status === 'submitted' || status === 'streaming';

  const scrollRef = useRef<HTMLDivElement>(null);
  const [sessionTime, setSessionTime] = useState<Date | null>(null);
  useEffect(() => { setSessionTime(new Date()); }, []);

  const formatTime = (offset: number) => {
    if (!sessionTime) return "00:00:00";
    const t = new Date(sessionTime.getTime() + offset * 1000 * 60);
    return t.toTimeString().split(' ')[0];
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Snapshot the current race state at the moment of sending
    const snap = raceRef.current;
    const lbEntry = snap.leaderboard.find(d => d.code === 'YOU');
    const gapToLeader = lbEntry?.gap ?? 'unknown';
    const gapBehind = (() => {
      const idx = snap.leaderboard.findIndex(d => d.code === 'YOU');
      return idx >= 0 && idx < snap.leaderboard.length - 1
        ? snap.leaderboard[idx + 1].gap
        : 'unknown';
    })();
    const compound = snap.telemetry.tireWear > 70 ? 'HARD' : snap.telemetry.tireWear > 40 ? 'MEDIUM' : 'SOFT';
    const bestLap = (snap.sectorTimes.s1 + snap.sectorTimes.s2 + snap.sectorTimes.s3).toFixed(3);

    // Telemetry context injected as a hidden system-style prefix in the message body
    const telemetryContext = {
      speed: snap.telemetry.speed,
      gear: snap.telemetry.gear,
      rpm: Math.round(snap.telemetry.rpm),
      throttle: snap.telemetry.throttle,
      brakePressure: snap.telemetry.brakePressure,
      tireWear: parseFloat(snap.telemetry.tireWear.toFixed(1)),
      compound,
      gForceX: snap.telemetry.gForceX,
      gForceY: snap.telemetry.gForceY,
      lap: snap.lap,
      totalLaps: snap.totalLaps,
      gapToLeader,
      gapBehind,
      sectorTimes: snap.sectorTimes,
      bestLap,
      leaderboard: snap.leaderboard.slice(0, 6).map(d => ({
        pos: d.pos, code: d.code, gap: d.gap
      })),
    };

    sendMessage(
      { text: input },
      { body: { telemetrySnapshot: telemetryContext } }
    );
    setInput('');
  };

  const getContent = (m: any): string => {
    if (typeof m.content === 'string' && m.content) return m.content;
    if (m.parts && Array.isArray(m.parts)) {
      return m.parts
        .filter((p: any) => p.type === 'text')
        .map((p: any) => p.text)
        .join('');
    }
    return '';
  };

  // Quick prompts — also populate input so sendMessage picks up latest telemetry
  const sendQuick = (q: string) => {
    setInput(q);
    // Small delay to let setInput flush, then submit
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      // We directly call with current values
      const snap = raceRef.current;
      const lbEntry = snap.leaderboard.find(d => d.code === 'YOU');
      const gapToLeader = lbEntry?.gap ?? 'unknown';
      const gapBehind = (() => {
        const idx = snap.leaderboard.findIndex(d => d.code === 'YOU');
        return idx >= 0 && idx < snap.leaderboard.length - 1
          ? snap.leaderboard[idx + 1].gap
          : 'unknown';
      })();
      const compound = snap.telemetry.tireWear > 70 ? 'HARD' : snap.telemetry.tireWear > 40 ? 'MEDIUM' : 'SOFT';
      const bestLap = (snap.sectorTimes.s1 + snap.sectorTimes.s2 + snap.sectorTimes.s3).toFixed(3);

      const telemetryContext = {
        speed: snap.telemetry.speed,
        gear: snap.telemetry.gear,
        rpm: Math.round(snap.telemetry.rpm),
        throttle: snap.telemetry.throttle,
        brakePressure: snap.telemetry.brakePressure,
        tireWear: parseFloat(snap.telemetry.tireWear.toFixed(1)),
        compound,
        gForceX: snap.telemetry.gForceX,
        gForceY: snap.telemetry.gForceY,
        lap: snap.lap,
        totalLaps: snap.totalLaps,
        gapToLeader,
        gapBehind,
        sectorTimes: snap.sectorTimes,
        bestLap,
        leaderboard: snap.leaderboard.slice(0, 6).map(d => ({
          pos: d.pos, code: d.code, gap: d.gap
        })),
      };

      sendMessage(
        { text: q },
        { body: { telemetrySnapshot: telemetryContext } }
      );
      setInput('');
    }, 10);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#170B0C] relative overflow-hidden h-full">
      
      {/* Background scanlines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          background: "linear-gradient(to bottom, transparent 50%, rgba(174, 44, 35, 1) 50%)",
          backgroundSize: "100% 4px"
        }}
      />
      
      {/* Live context strip */}
      <div className="relative z-10 border-b border-[#403133] bg-[#0D0405]/80 px-6 py-2 flex items-center gap-6 text-[9px] font-mono uppercase tracking-widest shrink-0">
        <span className="text-[#A88A85]">LIVE DATA</span>
        <span className="text-[#B9D164]">LAP {lap}/{totalLaps}</span>
        <span className="text-[#FFB4AA]">
          P1 GAP: {leaderboard.find(d => d.code === 'YOU')?.gap ?? '—'}
        </span>
        <span className="text-[#92CDFA]">
          TIRES: {telemetry.tireWear > 70 ? 'HARD' : telemetry.tireWear > 40 ? 'MEDIUM' : 'SOFT'} {telemetry.tireWear.toFixed(0)}%
        </span>
        <span className={`${telemetry.speed > 280 ? 'text-[#B9D164]' : 'text-[#A88A85]'}`}>
          {telemetry.speed} KM/H G{telemetry.gear}
        </span>
        <span className="ml-auto flex items-center gap-1.5 text-[#AE2C23]">
          <span className="w-1.5 h-1.5 bg-[#AE2C23] rounded-full animate-pulse"></span>
          SYNCED
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 font-mono scroll-smooth z-10" ref={scrollRef}>
        
        {/* Empty state */}
        {messages.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full text-center space-y-6"
          >
            <div className="w-20 h-20 border-2 border-[#59413E] flex items-center justify-center rotating-square">
               <span className="text-[#AE2C23] font-bold text-sm">INIT</span>
            </div>
            <div className="space-y-2">
              <div className="text-[#FFB4AA] font-mono text-sm tracking-widest uppercase animate-pulse">
                Awaiting Driver Comms...
              </div>
              <div className="text-[#A88A85] font-mono text-[10px] tracking-wider max-w-xs mx-auto">
                All telemetry synced. Engineer will reference your real data.
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {[
                "What's the gap to P1?",
                "How are my tires?",
                "Should I box now?",
                "What's my best lap?",
              ].map((q) => (
                <button 
                  key={q}
                  onClick={() => sendQuick(q)}
                  className="px-3 py-1.5 border border-[#59413E] text-[10px] font-mono text-[#A88A85] hover:text-[#FFB4AA] hover:border-[#AE2C23] transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Messages */}
        {messages.map((m: any, i: number) => {
          const content = getContent(m);
          if (!content) return null;
          return (
            <F1Message 
              key={m.id} 
              role={m.role} 
              content={content} 
              time={formatTime(i * 1.5)} 
            />
          );
        })}

        {/* Loading */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-3 p-4 bg-[#403133]/20 border-l-2 border-[#AE2C23] text-[#F5DDDE] max-w-sm ml-auto"
            >
              <Loader2 className="w-4 h-4 animate-spin text-[#AE2C23]" />
              <span className="text-[10px] uppercase font-mono tracking-widest">
                Computing Delta Strategy...
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Terminal Input */}
      <div className="p-4 bg-[#0D0405] border-t-2 border-[#403133] z-20 shrink-0">
        <form 
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto flex items-center gap-3 relative group"
        >
          <span className="font-mono text-[#FFB4AA] text-sm font-bold shrink-0 hidden sm:inline-block">
            ENGINEER@PITWALL:~$
          </span>
          <span className="font-mono text-[#FFB4AA] text-sm font-bold shrink-0 sm:hidden">
            ~$
          </span>
          
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Awaiting manual strategy override..." 
            className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-[#B9D164] font-mono text-sm placeholder:text-[#59413E]"
            disabled={isLoading}
          />
          
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex items-center justify-center p-2 text-[#FFB4AA] hover:text-white disabled:opacity-30 transition-all hover:drop-shadow-[0_0_8px_rgba(255,180,170,0.6)]"
          >
            <CornerDownLeft className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
