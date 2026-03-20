"use client";

import { useRaceContext } from '@/context/TelemetryContext';
import { motion } from 'framer-motion';

export default function StrategyView() {
  const { telemetry, leaderboard, lap, totalLaps } = useRaceContext();
  const gapToLeader = leaderboard.find(d => d.code === 'YOU')?.gap ?? '—';
  const idx = leaderboard.findIndex(d => d.code === 'YOU');
  const gapBehind = idx >= 0 && idx < leaderboard.length - 1 ? leaderboard[idx + 1].gap : '—';

  const lapsRemaining = totalLaps - lap;
  const pitWindows = [
    { lap: `${lap + 1}-${lap + 4}`, type: 'UNDERCUT', risk: 'LOW', delta: '-1.2s', recommended: telemetry.tireWear < 60 },
    { lap: `${lap + 5}-${lap + 9}`, type: 'OVERCUT', risk: 'MEDIUM', delta: '+0.3s', recommended: false },
    { lap: `${lap + 10}-${lap + 15}`, type: 'STANDARD', risk: 'HIGH', delta: '+2.1s', recommended: false },
  ];
  // Stable per-corner wear offsets
  const cornerOffsets = [0, 1.5, 2.8, 4.1];

  return (
    <div className="flex-1 flex flex-col bg-[#170B0C] overflow-y-auto p-8 font-mono text-[11px] uppercase">
      <div className="max-w-3xl mx-auto w-full space-y-8">
        <div>
          <h2 className="text-lg font-bold text-[#FFB4AA] tracking-tighter mb-1">RACE STRATEGY</h2>
          <p className="text-[10px] text-[#A88A85] tracking-wider">Real-time strategic analysis & pit window projections</p>
        </div>

        {/* Pit Window Analysis */}
        <section>
          <h3 className="text-[#E1BFBA] font-bold mb-4 tracking-widest text-[10px]">PIT WINDOW ANALYSIS</h3>
          <div className="space-y-3">
            {pitWindows.map((pw, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-4 border transition-all ${
                  pw.recommended 
                    ? 'border-[#B9D164]/40 bg-[#B9D164]/5' 
                    : 'border-[#403133] bg-[#403133]/10'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 text-[9px] font-bold ${
                      pw.recommended ? 'bg-[#B9D164] text-[#0D0405]' : 'bg-[#403133] text-[#A88A85]'
                    }`}>
                      {pw.recommended ? 'RECOMMENDED' : pw.type}
                    </span>
                    <span className="text-[#E1BFBA]">LAP {pw.lap}</span>
                  </div>
                  <span className={`font-bold ${pw.delta.startsWith('-') ? 'text-[#B9D164]' : 'text-[#FFB4AA]'}`}>
                    {pw.delta}
                  </span>
                </div>
                <div className="flex gap-4 text-[9px]">
                  <span className="text-[#A88A85]">TYPE: <span className="text-[#E1BFBA]">{pw.type}</span></span>
                  <span className="text-[#A88A85]">RISK: <span className={`${
                    pw.risk === 'LOW' ? 'text-[#B9D164]' : pw.risk === 'MEDIUM' ? 'text-[#FFD700]' : 'text-[#AE2C23]'
                  }`}>{pw.risk}</span></span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tire Degradation Projection */}
        <section>
          <h3 className="text-[#E1BFBA] font-bold mb-4 tracking-widest text-[10px]">TIRE DEGRADATION MODEL</h3>
          <div className="grid grid-cols-4 gap-3">
            {['FL', 'FR', 'RL', 'RR'].map((corner, i) => {
              const wear = Math.max(0, telemetry.tireWear - cornerOffsets[i]);
              const color = wear > 50 ? '#B9D164' : wear > 25 ? '#FFD700' : '#AE2C23';
              return (
                <div key={corner} className="p-3 bg-[#403133]/20 border border-[#403133]">
                  <div className="text-[9px] text-[#A88A85] mb-2">{corner}</div>
                  <div className="text-lg font-bold" style={{ color }}>{wear.toFixed(1)}%</div>
                  <div className="h-1 bg-[#403133] mt-2 overflow-hidden">
                    <div className="h-full transition-all duration-1000" style={{ width: `${wear}%`, backgroundColor: color }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Gap Analysis */}
        <section>
          <h3 className="text-[#E1BFBA] font-bold mb-4 tracking-widest text-[10px]">GAP ANALYSIS</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#403133]/20 border border-[#403133]">
              <div className="text-[9px] text-[#A88A85] mb-1">GAP TO LEADER (LEC)</div>
              <div className="text-2xl font-bold text-[#FFB4AA]">{gapToLeader}</div>
              <div className="text-[9px] text-[#B9D164] mt-1">↓ MONITOR DELTA</div>
            </div>
            <div className="p-4 bg-[#403133]/20 border border-[#403133]">
              <div className="text-[9px] text-[#A88A85] mb-1">GAP BEHIND ({leaderboard[idx + 1]?.code ?? '—'})</div>
              <div className="text-2xl font-bold text-[#B9D164]">{gapBehind}</div>
              <div className="text-[9px] text-[#A88A85] mt-1">LAPS REMAINING: {lapsRemaining}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
