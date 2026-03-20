"use client";

import { useRaceContext } from '@/context/TelemetryContext';
import { motion } from 'framer-motion';
import { Activity, Target } from 'lucide-react';

export default function WidgetDock() {
  const { telemetry } = useRaceContext();

  // Tire gauge config
  const tireRadius = 52;
  const tireCircumference = 2 * Math.PI * tireRadius;
  const tireArcStart = 0.75; // Start at 75% of the circle (bottom-left)
  const tireArcLength = 0.5;  // Cover half the circle (bottom-left to bottom-right via top)
  const tireOffset = tireCircumference * tireArcStart;
  const tireFill = tireCircumference * tireArcLength * (telemetry.tireWear / 100);
  const tireGap = tireCircumference * tireArcLength - tireFill;

  // Tire color based on wear
  const tireColor = telemetry.tireWear > 50 ? '#B9D164' : telemetry.tireWear > 25 ? '#FFB4AA' : '#AE2C23';

  // Compound type based on wear
  const compound = telemetry.tireWear > 70 ? 'HARD' : telemetry.tireWear > 40 ? 'MEDIUM' : 'SOFT';
  const compoundColor = compound === 'HARD' ? '#F5DDDE' : compound === 'MEDIUM' ? '#FFD700' : '#FF4444';

  return (
    <aside className="hidden xl:flex flex-col w-80 bg-[#0D0405] border-l border-[#352628] overflow-y-auto shrink-0 z-10 text-[#AE2C23] font-mono text-[11px] uppercase p-6 space-y-6">
      
      {/* Engine Status */}
      <div className="border-b border-[#352628] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#352628] flex items-center justify-center border border-[#AE2C23]/30">
            <Activity className="w-5 h-5 text-[#AE2C23]" />
          </div>
          <div>
            <div className="font-bold text-base leading-none tracking-tighter">ENGINE BAY</div>
            <div className="text-[9px] text-[#A88A85] mt-0.5">V6 TURBO HYBRID | MAP {telemetry.gear > 5 ? '1' : '2'}</div>
          </div>
        </div>
      </div>

      {/* Tire Integrity — Proper SVG arc gauge */}
      <section>
        <div className="flex justify-between items-end mb-3">
          <span className="text-[#E1BFBA] font-bold">TIRE INTEGRITY</span>
          <span className="text-lg" style={{ color: tireColor }}>{telemetry.tireWear.toFixed(1)}%</span>
        </div>
        <div className="relative flex items-center justify-center" style={{ height: '140px' }}>
          <svg viewBox="0 0 140 140" className="w-full h-full">
            {/* Background track */}
            <circle 
              cx="70" cy="70" r={tireRadius}
              fill="none" 
              stroke="#352628" 
              strokeWidth="10"
              strokeDasharray={`${tireCircumference * tireArcLength} ${tireCircumference * (1 - tireArcLength)}`}
              strokeDashoffset={-tireOffset}
              strokeLinecap="round"
              transform="rotate(0, 70, 70)"
            />
            {/* Filled arc */}
            <circle 
              cx="70" cy="70" r={tireRadius}
              fill="none" 
              stroke={tireColor}
              strokeWidth="10"
              strokeDasharray={`${tireFill} ${tireCircumference - tireFill}`}
              strokeDashoffset={-tireOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
              style={{ filter: `drop-shadow(0 0 6px ${tireColor}40)` }}
            />
          </svg>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-[#0D0405] border border-[#352628] flex flex-col items-center justify-center">
              <span className="text-[18px] font-bold" style={{ color: compoundColor }}>
                {compound[0]}
              </span>
              <span className="text-[8px] text-[#A88A85] tracking-widest">{compound}</span>
            </div>
          </div>
        </div>
      </section>

      {/* G-Force Vector */}
      <section>
        <div className="flex justify-between items-end mb-3">
          <span className="text-[#E1BFBA] font-bold">G-FORCE VECTOR</span>
          <span className="text-[#92CDFA]">
            {Math.sqrt(telemetry.gForceX ** 2 + telemetry.gForceY ** 2).toFixed(1)}G
          </span>
        </div>
        <div className="aspect-square bg-[#170B0C] relative border border-[#59413E]/30 overflow-hidden">
          {/* Grid lines */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-px bg-[#59413E]/30"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-full w-px bg-[#59413E]/30"></div>
          </div>
          {/* Concentric circles */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[33%] h-[33%] border border-[#59413E]/15 rounded-full"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[66%] h-[66%] border border-[#59413E]/15 rounded-full"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[100%] h-[100%] border border-[#59413E]/10 rounded-full"></div>
          </div>
          
          {/* Center marker */}
          <div className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-[#AE2C23]/20 border border-[#AE2C23]/40 -translate-x-1/2 -translate-y-1/2" />
          
          {/* Moving G-force dot */}
          <motion.div 
            animate={{ 
              x: telemetry.gForceX * 18, 
              y: telemetry.gForceY * 18 
            }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="absolute top-1/2 left-1/2 w-2.5 h-2.5 bg-[#FFB4AA] shadow-[0_0_12px_rgba(255,180,170,0.8)] rounded-full -translate-x-1/2 -translate-y-1/2"
          />

          {/* Labels */}
          <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[8px] text-[#59413E]">ACCEL</span>
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-[#59413E]">BRAKE</span>
          <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[8px] text-[#59413E]">L</span>
          <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[8px] text-[#59413E]">R</span>
        </div>
      </section>

      {/* Live Telemetry Bars */}
      <section>
        <div className="flex justify-between items-end mb-3">
          <span className="text-[#E1BFBA] font-bold">LIVE TELEMETRY</span>
          <span className="animate-pulse text-[#FFB4AA] flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#AE2C23] rounded-full"></span>
            REC
          </span>
        </div>
        <div className="space-y-4">
          {/* Speed */}
          <div>
            <div className="flex justify-between text-[9px] mb-1">
              <span className="text-[#F5DDDE]">SPEED (KM/H)</span>
              <span className="text-[#B9D164] font-mono font-bold">{telemetry.speed}</span>
            </div>
            <div className="h-2 bg-[#403133] w-full overflow-hidden">
              <motion.div 
                animate={{ width: `${(telemetry.speed / 350) * 100}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-[#B9D164] to-[#8FA53E]" 
              />
            </div>
          </div>
          {/* RPM */}
          <div>
            <div className="flex justify-between text-[9px] mb-1">
              <span className="text-[#F5DDDE]">RPM</span>
              <span className="text-[#FFB4AA] font-mono font-bold">{Math.floor(telemetry.rpm)}</span>
            </div>
            <div className="h-2 bg-[#403133] w-full overflow-hidden">
              <motion.div 
                animate={{ width: `${(telemetry.rpm / 15000) * 100}%` }}
                transition={{ duration: 0.5 }}
                className={`h-full ${telemetry.rpm > 12000 ? 'bg-gradient-to-r from-[#FFB4AA] to-[#AE2C23]' : 'bg-[#FFB4AA]'}`}
              />
            </div>
          </div>
          {/* Throttle */}
          <div>
            <div className="flex justify-between text-[9px] mb-1">
              <span className="text-[#F5DDDE]">THROTTLE</span>
              <span className="text-[#B9D164] font-mono font-bold">{telemetry.throttle}%</span>
            </div>
            <div className="h-2 bg-[#403133] w-full overflow-hidden">
              <motion.div 
                animate={{ width: `${telemetry.throttle}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-[#B9D164]" 
              />
            </div>
          </div>
          {/* Brake Pressure */}
          <div>
            <div className="flex justify-between text-[9px] mb-1">
              <span className="text-[#F5DDDE]">BRAKE PRESS</span>
              <span className="text-[#92CDFA] font-mono font-bold">{telemetry.brakePressure}%</span>
            </div>
            <div className="h-2 bg-[#403133] w-full overflow-hidden">
              <motion.div 
                animate={{ width: `${telemetry.brakePressure}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-[#92CDFA]" 
              />
            </div>
          </div>
          {/* Gear */}
          <div className="flex items-center justify-between pt-2 border-t border-[#352628]">
            <span className="text-[9px] text-[#F5DDDE]">GEAR</span>
            <div className="flex gap-1">
              {[1,2,3,4,5,6,7,8].map(g => (
                <div key={g} className={`w-5 h-5 flex items-center justify-center text-[9px] font-bold transition-all duration-200 ${
                  telemetry.gear === g 
                    ? 'bg-[#B9D164] text-[#0D0405]' 
                    : telemetry.gear > g 
                      ? 'bg-[#352628] text-[#A88A85]' 
                      : 'bg-[#25181A] text-[#59413E]'
                }`}>
                  {g}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* DRS Override Button */}
      <div className="mt-auto pt-4">
        <button className="w-full py-3 bg-gradient-to-br from-[#AE2C23] to-[#690005] text-white font-bold tracking-[0.2em] text-[10px] hover:brightness-125 hover:shadow-[0_0_20px_rgba(174,44,35,0.4)] active:scale-[0.98] transition-all">
            DRS OVERRIDE
        </button>
      </div>
    </aside>
  );
}
