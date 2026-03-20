"use client";

import { useTelemetry } from '@/hooks/useTelemetry';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function TelemetryView() {
  const telemetry = useTelemetry();
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    setHistory(prev => {
      const next = [...prev, telemetry.speed];
      if (next.length > 40) next.shift();
      return next;
    });
  }, [telemetry.speed]);

  const maxSpeed = Math.max(...history, 1);

  return (
    <div className="flex-1 flex flex-col bg-[#170B0C] overflow-y-auto p-8 font-mono text-[11px] uppercase">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <div>
          <h2 className="text-lg font-bold text-[#FFB4AA] tracking-tighter mb-1">TELEMETRY DATA</h2>
          <p className="text-[10px] text-[#A88A85] tracking-wider">Live vehicle performance metrics & sensor readouts</p>
        </div>

        {/* Speed Trace */}
        <section>
          <div className="flex justify-between items-end mb-3">
            <h3 className="text-[#E1BFBA] font-bold tracking-widest text-[10px]">SPEED TRACE</h3>
            <span className="text-[#B9D164] text-sm font-bold">{telemetry.speed} KM/H</span>
          </div>
          <div className="h-32 bg-[#403133]/10 border border-[#403133] p-2 flex items-end gap-px">
            {history.map((s, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${(s / 350) * 100}%` }}
                className="flex-1 bg-gradient-to-t from-[#B9D164]/60 to-[#B9D164] min-w-0"
                style={{ minHeight: '2px' }}
              />
            ))}
          </div>
          <div className="flex justify-between text-[8px] text-[#59413E] mt-1">
            <span>-40s</span>
            <span>NOW</span>
          </div>
        </section>

        {/* Big Numbers Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'SPEED', value: `${telemetry.speed}`, unit: 'KM/H', color: '#B9D164' },
            { label: 'RPM', value: `${Math.floor(telemetry.rpm)}`, unit: 'REV', color: '#FFB4AA' },
            { label: 'GEAR', value: `${telemetry.gear}`, unit: 'OF 8', color: '#92CDFA' },
            { label: 'THROTTLE', value: `${telemetry.throttle}`, unit: '%', color: '#B9D164' },
            { label: 'BRAKE', value: `${telemetry.brakePressure}`, unit: '%', color: '#92CDFA' },
            { label: 'TIRE WEAR', value: `${telemetry.tireWear.toFixed(1)}`, unit: '%', color: telemetry.tireWear > 50 ? '#B9D164' : '#AE2C23' },
            { label: 'LAT G', value: `${telemetry.gForceY.toFixed(1)}`, unit: 'G', color: '#FFB4AA' },
            { label: 'LONG G', value: `${telemetry.gForceX.toFixed(1)}`, unit: 'G', color: '#FFB4AA' },
          ].map((item, i) => (
            <motion.div 
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 bg-[#403133]/15 border border-[#403133] hover:border-[#59413E] transition-all"
            >
              <div className="text-[9px] text-[#A88A85] mb-2">{item.label}</div>
              <div className="text-2xl font-bold leading-none" style={{ color: item.color }}>
                {item.value}
              </div>
              <div className="text-[8px] text-[#59413E] mt-1">{item.unit}</div>
            </motion.div>
          ))}
        </section>

        {/* Engine Vitals */}
        <section>
          <h3 className="text-[#E1BFBA] font-bold tracking-widest text-[10px] mb-4">ENGINE VITALS</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'OIL TEMP', value: `${(105 + Math.random() * 5).toFixed(0)}°C`, status: 'NOMINAL' },
              { label: 'WATER TEMP', value: `${(88 + Math.random() * 4).toFixed(0)}°C`, status: 'NOMINAL' },
              { label: 'ERS DEPLOY', value: `${(60 + Math.random() * 30).toFixed(0)}%`, status: 'HARVESTING' },
            ].map((v) => (
              <div key={v.label} className="p-3 bg-[#403133]/15 border border-[#403133]">
                <div className="text-[9px] text-[#A88A85] mb-1">{v.label}</div>
                <div className="text-sm font-bold text-[#E1BFBA]">{v.value}</div>
                <div className="text-[8px] text-[#B9D164] mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-[#B9D164] rounded-full"></span>
                  {v.status}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
