"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface TelemetryData {
  speed: number;
  gear: number;
  rpm: number;
  brakePressure: number;
  throttle: number;
  tireWear: number;
  gForceX: number;
  gForceY: number;
}

export interface RaceContext {
  telemetry: TelemetryData;
  leaderboard: { pos: number; code: string; gap: string }[];
  sectorTimes: { s1: number; s2: number; s3: number };
  lap: number;
  totalLaps: number;
}

const defaultTelemetry: TelemetryData = {
  speed: 0,
  gear: 1,
  rpm: 4000,
  brakePressure: 0,
  throttle: 0,
  tireWear: 85.0,
  gForceX: 0,
  gForceY: 0,
};

const TelemetryCtx = createContext<RaceContext>({
  telemetry: defaultTelemetry,
  leaderboard: [],
  sectorTimes: { s1: 28.412, s2: 32.109, s3: 24.551 },
  lap: 1,
  totalLaps: 57,
});

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
  const [telemetry, setTelemetry] = useState<TelemetryData>(defaultTelemetry);
  const [sectorTimes, setSectorTimes] = useState({ s1: 28.412, s2: 32.109, s3: 24.551 });
  const [lap, setLap] = useState(22);

  // Leaderboard gaps update slightly every 5s based on our position
  const [leaderGap, setLeaderGap] = useState(1.242);
  const [behindGap, setBehindGap] = useState(3.649);

  // Single telemetry loop — feeds everything
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => {
        const isBraking = Math.random() > 0.8;
        const targetSpeed = isBraking
          ? Math.max(80, prev.speed - 40)
          : Math.min(340, prev.speed + 15);
        const newSpeed = prev.speed + (targetSpeed - prev.speed) * 0.5;

        let newGear = prev.gear;
        if (newSpeed < 100) newGear = Math.max(1, Math.min(3, prev.gear));
        else if (newSpeed < 180) newGear = Math.max(3, Math.min(5, prev.gear));
        else if (newSpeed < 250) newGear = Math.max(5, Math.min(7, prev.gear));
        else newGear = 8;

        const throttleVal = isBraking ? 0 : Math.random() * 0.5 + 0.5;
        const brakeVal = isBraking ? Math.random() * 0.8 + 0.2 : 0;
        const gX = isBraking ? -Math.random() * 4 : Math.random() * 1.5;
        const gY = Math.random() > 0.5 ? Math.random() * 3 : -Math.random() * 3;

        return {
          speed: Math.round(newSpeed),
          gear: newGear,
          rpm: isBraking ? 6000 + Math.random() * 2000 : 10000 + Math.random() * 2500,
          brakePressure: Math.floor(brakeVal * 100),
          throttle: Math.floor(throttleVal * 100),
          tireWear: Math.max(0, prev.tireWear - 0.01),
          gForceX: parseFloat(gX.toFixed(1)),
          gForceY: parseFloat(gY.toFixed(1)),
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Sector times drift every 5s
  useEffect(() => {
    const t = setInterval(() => {
      setSectorTimes({
        s1: parseFloat((28 + Math.random() * 1.2).toFixed(3)),
        s2: parseFloat((31.5 + Math.random() * 1.5).toFixed(3)),
        s3: parseFloat((24 + Math.random() * 1.0).toFixed(3)),
      });
    }, 5000);
    return () => clearInterval(t);
  }, []);

  // Gap to leader drifts: closing if we gain, opening if losing
  useEffect(() => {
    const t = setInterval(() => {
      setLeaderGap((g) => Math.max(0.1, parseFloat((g + (Math.random() * 0.6 - 0.3)).toFixed(3))));
      setBehindGap((g) => Math.max(0.5, parseFloat((g + (Math.random() * 0.8 - 0.4)).toFixed(3))));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  // Lap counter increments every 90s (realistic race pace)
  useEffect(() => {
    const t = setInterval(() => {
      setLap((l) => Math.min(57, l + 1));
    }, 90000);
    return () => clearInterval(t);
  }, []);

  const leaderboard = [
    { pos: 1, code: 'LEC', gap: 'LEADER' },
    { pos: 2, code: 'YOU', gap: `+${leaderGap.toFixed(3)}` },
    { pos: 3, code: 'VER', gap: `+${(leaderGap + 3.649).toFixed(3)}` },
    { pos: 4, code: 'NOR', gap: `+${(leaderGap + 6.860).toFixed(3)}` },
    { pos: 5, code: 'HAM', gap: `+${(leaderGap + 11.092).toFixed(3)}` },
    { pos: 6, code: 'RUS', gap: `+${(leaderGap + 12.979).toFixed(3)}` },
    { pos: 7, code: 'PIA', gap: `+${(leaderGap + 15.312).toFixed(3)}` },
    { pos: 8, code: 'SAI', gap: `+${(leaderGap + 17.760).toFixed(3)}` },
  ];

  return (
    <TelemetryCtx.Provider value={{ telemetry, leaderboard, sectorTimes, lap, totalLaps: 57 }}>
      {children}
    </TelemetryCtx.Provider>
  );
}

export function useRaceContext() {
  return useContext(TelemetryCtx);
}
