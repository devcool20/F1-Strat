"use client";

import { useRaceContext } from '@/context/TelemetryContext';

const teamColors: Record<string, string> = {
  LEC: '#AE2C23',
  YOU: '#FFFFFF',
  VER: '#3671C6',
  NOR: '#FF8000',
  HAM: '#27F4D2',
  RUS: '#27F4D2',
  PIA: '#FF8000',
  SAI: '#AE2C23',
};

export default function LeftSidebar() {
  const { leaderboard, sectorTimes, lap, totalLaps } = useRaceContext();
  const bestLap = (sectorTimes.s1 + sectorTimes.s2 + sectorTimes.s3).toFixed(3);

  return (
    <aside className="hidden lg:flex flex-col w-80 bg-[#1C1012] border-r border-[#403133] overflow-y-auto shrink-0 font-mono text-[11px] uppercase">
      
      {/* Race Leaderboard */}
      <div className="p-5 border-b border-[#403133]">
        <h3 className="text-[10px] text-[#A88A85] tracking-widest mb-4 font-bold">RACE LEADERBOARD</h3>
        <div className="space-y-1">
          {leaderboard.map((d) => (
            <div 
              key={d.code}
              className={`flex items-center gap-3 px-2 py-2 transition-all ${
                d.code === 'YOU' 
                  ? 'bg-[#AE2C23]/15 border-l-2 border-[#AE2C23]'
                  : 'bg-[#403133]/10 hover:bg-[#403133]/30 border-l-2 border-transparent'
              }`}
            >
              <span className="text-xs text-white font-bold w-5">{String(d.pos).padStart(2, '0')}</span>
              <div className="w-1 h-4" style={{ backgroundColor: teamColors[d.code] ?? '#888' }}></div>
              <span className={`text-xs font-bold ${d.code === 'YOU' ? 'text-white' : 'text-[#E1BFBA]'}`}>
                {d.code}
              </span>
              <span className={`ml-auto text-[10px] font-mono ${
                d.gap === 'LEADER' ? 'text-[#B9D164]' : d.code === 'YOU' ? 'text-white' : 'text-[#A88A85]'
              }`}>
                {d.gap}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sector Times */}
      <div className="p-5 border-b border-[#403133]">
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-[10px] text-[#A88A85] tracking-widest font-bold">SECTOR BREAKDOWN</h3>
          <span className="text-white text-[10px]">LIVE</span>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-[9px] mb-1">
              <span className="text-[#E1BFBA]">SECTOR 1</span>
              <span className="text-[#B9D164] font-bold">{sectorTimes.s1.toFixed(3)}s</span>
            </div>
            <div className="h-1.5 bg-[#403133] w-full overflow-hidden">
              <div className="h-full bg-[#B9D164] transition-all duration-1000" style={{ width: `${(sectorTimes.s1 / 35) * 100}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[9px] mb-1">
              <span className="text-[#E1BFBA]">SECTOR 2</span>
              <span className="text-[#FFB4AA] font-bold">{sectorTimes.s2.toFixed(3)}s</span>
            </div>
            <div className="h-1.5 bg-[#403133] w-full overflow-hidden">
              <div className="h-full bg-[#FFB4AA] transition-all duration-1000" style={{ width: `${(sectorTimes.s2 / 35) * 100}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[9px] mb-1">
              <span className="text-[#E1BFBA]">SECTOR 3</span>
              <span className="text-[#92CDFA] font-bold">{sectorTimes.s3.toFixed(3)}s</span>
            </div>
            <div className="h-1.5 bg-[#403133] w-full overflow-hidden">
              <div className="h-full bg-[#92CDFA] transition-all duration-1000" style={{ width: `${(sectorTimes.s3 / 35) * 100}%` }}></div>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-[#352628] flex justify-between">
          <span className="text-[9px] text-[#A88A85]">BEST LAP</span>
          <span className="text-[#B9D164] font-bold text-sm">{bestLap}s</span>
        </div>
      </div>

      {/* Pit Strategy */}
      <div className="p-5 flex-1">
        <h3 className="text-[10px] text-[#A88A85] tracking-widest mb-4 font-bold">PIT STRATEGY</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-2 bg-[#403133]/20">
            <div className="w-6 h-6 bg-[#B9D164]/20 border border-[#B9D164]/40 flex items-center justify-center text-[#B9D164] text-[9px] font-bold">1</div>
            <div>
              <div className="text-[10px] text-[#E1BFBA]">STINT 1 — HARD</div>
              <div className="text-[9px] text-[#A88A85]">LAP 1-22 (CURRENT)</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 bg-[#403133]/10 opacity-60">
            <div className="w-6 h-6 bg-[#FFD700]/20 border border-[#FFD700]/40 flex items-center justify-center text-[#FFD700] text-[9px] font-bold">2</div>
            <div>
              <div className="text-[10px] text-[#E1BFBA]">STINT 2 — MEDIUM</div>
              <div className="text-[9px] text-[#A88A85]">LAP 23-45 (PLANNED)</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 bg-[#403133]/10 opacity-40">
            <div className="w-6 h-6 bg-[#FF4444]/20 border border-[#FF4444]/40 flex items-center justify-center text-[#FF4444] text-[9px] font-bold">3</div>
            <div>
              <div className="text-[10px] text-[#E1BFBA]">STINT 3 — SOFT</div>
              <div className="text-[9px] text-[#A88A85]">LAP 46-57 (PLANNED)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom action */}
      <div className="p-5 mt-auto">
        <button className="w-full py-3 bg-gradient-to-br from-[#FFB4AA] to-[#AE2C23] text-white font-bold tracking-[0.2em] text-[10px] hover:brightness-110 active:scale-[0.98] transition-all">
          INITIATE OVERTAKE
        </button>
      </div>
    </aside>
  );
}
