import { useState, useEffect } from 'react';

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

export function useTelemetry(isActive: boolean = true) {
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    speed: 0,
    gear: 1,
    rpm: 4000,
    brakePressure: 0,
    throttle: 0,
    tireWear: 85.0,
    gForceX: 0,
    gForceY: 0,
  });

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTelemetry((prev) => {
        // Simulate an F1 lap telemetry changes
        const isBraking = Math.random() > 0.8;
        const targetSpeed = isBraking ? Math.max(80, prev.speed - 40) : Math.min(340, prev.speed + 15);
        const newSpeed = prev.speed + (targetSpeed - prev.speed) * 0.5;

        let newGear = prev.gear;
        if (newSpeed < 100) newGear = Math.max(1, Math.min(3, prev.gear));
        else if (newSpeed < 180) newGear = Math.max(3, Math.min(5, prev.gear));
        else if (newSpeed < 250) newGear = Math.max(5, Math.min(7, prev.gear));
        else newGear = 8;
        
        const throttleVal = isBraking ? 0 : Math.random() * 0.5 + 0.5;
        const brakeVal = isBraking ? Math.random() * 0.8 + 0.2 : 0;
        
        // Random G-forces based on speed/accel
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
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  return telemetry;
}
