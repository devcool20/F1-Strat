"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InitScreenProps {
  onComplete: () => void;
}

// Log lines that tick in one at a time
const coreProcesses = [
  { tag: 'OK', text: 'LOAD_AERO_MAP... 4.2ms', color: '#B9D164' },
  { tag: 'OK', text: 'SYNC_WIND_TUNNEL_DATA... SUCCESS', color: '#B9D164' },
  { tag: 'RETRY', text: 'FETCHING_TYRE_THERMAL_PROFILES...', color: '#FFB4AA' },
  { tag: 'OK', text: 'THERMALS_STABILIZED', color: '#B9D164' },
  { tag: 'OK', text: 'ERS_MAPPING_INITIALIZED', color: '#B9D164' },
  { tag: '>>', text: 'ATTACHING_DEBUGGER_PORT: 8080', color: '#59413E' },
];

const encryptionLogs = [
  { tag: 'ACTIVE', text: 'RSA_4096_HANDSHAKE', color: '#92CDFA' },
  { tag: 'OK', text: 'COMMS_ENCRYPTED_AES_256', color: '#92CDFA' },
  { tag: 'OK', text: 'PIT_WALL_UPLINK_ESTABLISHED', color: '#92CDFA' },
  { tag: 'OK', text: 'BIOMETRIC_BYPASS_VERIFIED', color: '#B9D164' },
  { tag: 'WAIT', text: 'SYNCING_RACE_ENGINEER_VOICE', color: '#92CDFA' },
  { tag: '>>', text: 'KEY_ROTATION_IN_14400S', color: '#59413E' },
];

const statusMessages = [
  'CALIBRATING_SENSORS...',
  'LOADING_AERO_MAP...',
  'SYNCING_TELEMETRY...',
  'ESTABLISHING_UPLINK...',
  'INITIALIZING_COMMS...',
  'FINALIZING_PROTOCOLS...',
];

export default function InitScreen({ onComplete }: InitScreenProps) {
  const [progress, setProgress] = useState(0);
  const [visibleCoreLogs, setVisibleCoreLogs] = useState(0);
  const [visibleEncLogs, setVisibleEncLogs] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const completedRef = useRef(false);

  // Progress bar: 0 to 100 over ~5.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Non-linear — slow start, fast mid, slow end  
        const increment = prev < 30 ? 1.5 : prev < 70 ? 2.8 : prev < 90 ? 1.8 : 0.8;
        return Math.min(100, prev + increment);
      });
    }, 60);
    return () => clearInterval(interval);
  }, []);

  // Reveal log lines progressively
  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleCoreLogs(prev => Math.min(prev + 1, coreProcesses.length));
    }, 500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleEncLogs(prev => Math.min(prev + 1, encryptionLogs.length));
      }, 450);
      return () => clearInterval(interval);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Status text rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setStatusIdx(prev => (prev + 1) % statusMessages.length);
    }, 900);
    return () => clearInterval(timer);
  }, []);

  // Show skip button after 2s
  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Auto-complete when progress hits 100
  useEffect(() => {
    if (progress >= 100 && !completedRef.current) {
      completedRef.current = true;
      setTimeout(() => onComplete(), 800);
    }
  }, [progress, onComplete]);

  const handleSkip = () => {
    if (!completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] bg-[#0D0405] text-[#F5DDDE] font-mono overflow-hidden select-none"
    >
      {/* Ambient dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: 'radial-gradient(#403133 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Scanline sweep */}
      <div className="absolute inset-0 pointer-events-none scanline-sweep" />

      {/* Hidden giant "TELEMETRY" watermark */}
      <div className="fixed top-1/4 -left-20 opacity-[0.03] pointer-events-none rotate-90 origin-center">
        <span className="text-[120px] font-black tracking-tighter text-[#A88A85]">TELEMETRY</span>
      </div>

      <main className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8">

        {/* Header metadata — fades in */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-between items-start"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#B9D164] animate-pulse" />
              <span className="text-[10px] tracking-widest text-[#B9D164]">SYSTEM_STATUS: INITIALIZING</span>
            </div>
            <p className="text-[10px] text-[#A88A85] opacity-60">KERNEL_MODE: TACTICAL_OVERLAY_V1.0.4</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[#A88A85]">LOC: MONACO_STREET_CIRCUIT</p>
            <p className="text-[10px] text-[#A88A85] opacity-60">LAT: 43.7347° N | LON: 7.4206° E</p>
          </div>
        </motion.div>

        {/* Central HUD */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-10">

          {/* Logo — dramatic reveal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
            className="text-center space-y-4"
          >
            <div className="relative inline-block">
              <h1
                className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter text-[#AE2C23] glow-red glitch-text"
                data-text="PITWALL AI"
              >
                PITWALL AI
              </h1>
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: 12 }}
                transition={{ delay: 1.2, duration: 0.4, type: 'spring' }}
                className="absolute -top-5 -right-6 md:-top-6 md:-right-8 bg-[#AE2C23] text-white px-2 py-1 text-[10px] font-bold"
              >
                v1.0
              </motion.div>
            </div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '16rem' }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="h-px mx-auto bg-gradient-to-r from-transparent via-[#AE2C23] to-transparent"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.5 }}
              className="text-[11px] tracking-[0.5em] text-[#59413E] uppercase"
            >
              Neural Strategy Engine
            </motion.p>
          </motion.div>

          {/* Loading section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="w-full max-w-xl space-y-6"
          >
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[10px] text-[#B9D164]">{statusMessages[statusIdx]}</span>
                <span className="text-xl font-bold text-[#FFB4AA]">{Math.floor(progress)}%</span>
              </div>
              <div className="h-4 w-full bg-[#170B0C] border border-[#59413E] p-[2px]">
                <div
                  className="h-full bg-gradient-to-r from-[#AE2C23] to-[#FFB4AA] relative overflow-hidden transition-all duration-100"
                  style={{ width: `${progress}%` }}
                >
                  {/* Carbon fibre stripe texture */}
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.5) 10px, rgba(0,0,0,0.5) 20px)',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Log panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Core Processes */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4, duration: 0.4 }}
                className="bg-[#25181A] border-l-2 border-[#AE2C23] p-4 h-32 overflow-hidden"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[12px] text-[#FFB4AA]">⊕</span>
                  <span className="text-[10px] font-bold text-[#E1BFBA]">CORE_PROCESSES</span>
                </div>
                <div className="text-[9px] space-y-1.5 leading-none">
                  {coreProcesses.slice(0, visibleCoreLogs).map((log, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: log.color === '#59413E' ? 0.4 : 0.8, x: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ color: log.color }}
                    >
                      [{log.tag}] {log.text}
                    </motion.p>
                  ))}
                </div>
              </motion.div>

              {/* Encryption Channel */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5, duration: 0.4 }}
                className="bg-[#25181A] border-l-2 border-[#92CDFA] p-4 h-32 overflow-hidden"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[12px] text-[#92CDFA]">⊗</span>
                  <span className="text-[10px] font-bold text-[#E1BFBA]">ENCRYPTION_CHANNEL</span>
                </div>
                <div className="text-[9px] space-y-1.5 leading-none">
                  {encryptionLogs.slice(0, visibleEncLogs).map((log, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: log.color === '#59413E' ? 0.4 : 0.8, x: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ color: log.color }}
                    >
                      [{log.tag}] {log.text}
                    </motion.p>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.4 }}
          className="flex justify-between items-end border-t border-[#59413E]/40 pt-4"
        >
          {/* Metric bars */}
          <div className="flex gap-8">
            <div className="space-y-1">
              <p className="text-[9px] text-[#A88A85] uppercase tracking-tighter">Engine Load</p>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className={`w-1.5 h-3 ${i <= 4 ? 'bg-[#B9D164]' : 'bg-[#403133]'}`} />
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] text-[#A88A85] uppercase tracking-tighter">Signal Strength</p>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className={`w-1.5 h-3 ${i <= 3 ? 'bg-[#92CDFA]' : 'bg-[#403133]'}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Right — status + spinner */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-bold text-[#FFB4AA] tracking-widest uppercase">
                {progress >= 100 ? 'TACTICAL HUD READY' : 'Initializing Tactical HUD'}
              </p>
              <p className="text-[9px] text-[#A88A85] opacity-50">DO NOT DISCONNECT POWER</p>
            </div>
            <div className="w-10 h-10 border-2 border-[#AE2C23] rounded-full flex items-center justify-center animate-spin">
              <div className={`w-6 h-6 border-2 rounded-full ${
                progress >= 100 ? 'border-[#B9D164]' : 'border-[#B9D164] animate-ping'
              }`} />
            </div>
          </div>
        </motion.div>
      </main>

      {/* Skip / Manual Override button */}
      <AnimatePresence>
        {showSkip && progress < 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-14 right-8 md:bottom-12 md:right-12 z-[110]"
          >
            <button
              onClick={handleSkip}
              className="bg-[#AE2C23] text-white px-5 py-2 flex items-center gap-2 border border-[#FFB4AA]/40 hover:bg-[#FFB4AA] hover:text-[#0D0405] transition-all active:scale-95 text-[10px] font-bold tracking-[0.2em] uppercase"
            >
              Manual Override
              <span className="text-sm">⚡</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
