"use client"

import React from 'react'
import { Rocket, ShieldAlert, Cpu, Globe, Settings, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'

const SidebarItem = ({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) => (
  <div className={cn(
    "flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-not-allowed group transition-all duration-200",
    active ? "bg-white/10 text-white shadow-sm ring-1 ring-white/10" : "text-white/40 hover:text-white/70"
  )}>
    <Icon className={cn("w-5 h-5", active ? "text-mars-accent" : "text-white/20")} />
    <span className="font-medium text-sm tracking-tight">{label}</span>
  </div>
)

const Sidebar = () => {
  return (
    <div className="w-72 h-full flex flex-col bg-[#000] border-r border-white/5 p-6 select-none">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-8 h-8 rounded-lg bg-mars-accent flex items-center justify-center shadow-[0_0_15px_rgba(255,95,31,0.4)]">
          <Rocket className="w-5 h-5 text-black" fill="currentColor" />
        </div>
        <div>
          <h1 className="text-white font-bold tracking-tighter text-lg leading-none italic">ARES ONE</h1>
          <p className="text-[10px] text-mars-accent font-mono uppercase tracking-[0.2em] mt-1 opacity-80 leading-none">Terminal Protocol 1.0</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.15em] mb-2 px-2 mt-4">Mission Systems</p>
        <SidebarItem icon={Globe} label="Mars Surface Data" active />
        <SidebarItem icon={ShieldAlert} label="Life Support Status" />
        <SidebarItem icon={Cpu} label="Habitat Engineering" />
        
        <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.15em] mb-2 px-2 mt-8">Configuration</p>
        <SidebarItem icon={Settings} label="System Parameters" />
      </div>

      <div className="mt-auto px-4 py-4 rounded-2xl bg-gradient-to-br from-mars-accent/10 to-transparent border border-mars-accent/10">
        <h4 className="text-white/90 font-semibold text-xs mb-1">MARS ATMOSPHERE</h4>
        <div className="flex justify-between items-end">
          <span className="text-3xl font-light text-white tracking-tighter">-65<span className="text-sm">°C</span></span>
          <div className="text-[10px] font-mono text-white/40 text-right leading-tight">
            PRESSURE: 610 PA<br/>
            AR: 1.9% | CO2: 95%
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
