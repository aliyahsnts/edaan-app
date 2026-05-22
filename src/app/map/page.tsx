"use client";

import TopHeader from "@/components/TopHeader";
import EDaanMap from "@/components/EDaanMap";
import { CornerUpRight, ShieldCheck, Zap, AlertTriangle } from "lucide-react";

export default function MapNavigation() {
  return (
    <main className="min-h-screen relative flex flex-col h-screen">
      {/* Map Background Simulation */}
      <div className="absolute inset-0 z-0">
        <EDaanMap className="w-full h-full" />
        {/* SVG route path overlay (optional visual flair for now) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
           <svg width="100%" height="100%" className="absolute inset-0">
             <path d="M150 400 L250 500 L300 450 L350 200" stroke="#126b34" strokeWidth="6" fill="none" opacity="0.8" />
             <circle cx="150" cy="400" r="8" fill="#126b34" />
             <circle cx="350" cy="200" r="8" fill="#126b34" />
           </svg>
        </div>
      </div>

      <div className="z-10 relative flex flex-col h-full pointer-events-none">
        <div className="pointer-events-auto">
          <TopHeader rightAction="avatar" />
        </div>
        
        {/* Top Cards Overlay */}
        <div className="px-5 mt-2 flex flex-col gap-3 pointer-events-auto">
          {/* Turn-by-turn */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center gap-4 border border-white">
            <div className="w-14 h-14 rounded-xl bg-[#126b34] text-white flex items-center justify-center flex-shrink-0">
              <CornerUpRight size={28} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-500 mb-0.5">In 400 meters</p>
              <h2 className="text-lg font-black text-zinc-900 leading-tight">Turn Right onto Festive Walk</h2>
            </div>
          </div>

          {/* Safety Score */}
          <div className="self-start bg-white/95 backdrop-blur-md text-zinc-900 font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-md border border-zinc-100 text-sm">
            <ShieldCheck size={16} className="text-[#126b34]" /> 98 Safety Score
          </div>

          {/* Battery Status */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg w-56 border border-zinc-100 mt-2">
            <div className="flex justify-between items-start mb-2">
              <Zap size={16} className="text-[#2bc18b]" />
              <span className="bg-[#bbedcc] text-[#0e5428] text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">BEST-PATH</span>
            </div>
            <p className="text-[10px] text-zinc-500 font-bold">Arrival Battery</p>
            <div className="flex items-baseline gap-2 mb-2">
              <h3 className="text-3xl font-black text-zinc-900">64%</h3>
              <span className="text-xs font-bold text-[#126b34]">↓ 2%</span>
            </div>
            <div className="flex gap-1 h-1.5 w-full">
               <div className="bg-[#2bc18b] h-full flex-[0.64] rounded-l-full"></div>
               <div className="bg-zinc-200 h-full flex-[0.36] rounded-r-full"></div>
            </div>
          </div>
        </div>

        <div className="mt-auto mb-4 px-5 flex flex-col gap-4 pointer-events-auto">
          {/* Regulatory Alert */}
          <div className="bg-[#e75f78] text-white rounded-2xl p-4 shadow-lg ml-auto w-64 border-2 border-[#c22141]/20">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-2">
              <AlertTriangle size={14} /> REGULATORY ALERT
            </div>
            <p className="text-sm font-medium leading-snug">
              Ungka Flyover is <span className="underline font-bold decoration-2 underline-offset-2">RESTRICTED</span> for Light Electric Vehicles. Rerouting via service road.
            </p>
          </div>

          {/* Bottom Travel Info */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-6">
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">TRAVEL TIME</p>
                  <h3 className="text-2xl font-black text-[#126b34]">12 min</h3>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">DISTANCE</p>
                  <h3 className="text-2xl font-black text-zinc-900">3.8 km</h3>
                </div>
              </div>
              <button className="bg-[#9c2a41] hover:bg-[#822135] transition-colors text-white font-bold py-2.5 px-6 rounded-xl shadow-md">
                Exit
              </button>
            </div>
            
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-bold text-zinc-700">Diversion Rd</span>
               <div className="flex-1 h-2 bg-zinc-100 rounded-full flex items-center relative overflow-visible">
                 <div className="h-full bg-[#126b34] rounded-full absolute left-0 w-[60%]"></div>
                 <div className="w-3 h-3 bg-[#c22141] rounded-full absolute right-0 -mr-1"></div>
               </div>
               <span className="text-[10px] font-bold text-zinc-900">Festive Walk</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
