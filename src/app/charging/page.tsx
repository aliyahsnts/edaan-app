"use client";

import type { SVGProps } from "react";
import TopHeader from "@/components/TopHeader";
import EDaanMap from "@/components/EDaanMap";
import { Search, SlidersHorizontal, BatteryCharging, Navigation } from "lucide-react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export default function Charging() {
  return (
    <main className="min-h-screen relative flex flex-col h-screen">
      {/* Map Background Simulation */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-[60%] bg-[#b8cfb8] relative overflow-hidden">
          <EDaanMap className="w-full h-full opacity-80 mix-blend-multiply filter sepia-[0.3] hue-rotate-[90deg] saturate-[0.8]" />
        </div>
      </div>

      <div className="z-10 relative">
        <TopHeader rightAction="avatar" />
        
        {/* Search & Filters Overlay */}
        <div className="px-5 mt-2">
          <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white/40 flex items-center px-4 py-3 gap-3">
            <Search size={20} className="text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search hubs in Iloilo..." 
              className="bg-transparent border-none outline-none text-zinc-900 w-full text-sm font-medium"
            />
            <div className="w-8 h-8 rounded-lg bg-[#126b34] text-white flex items-center justify-center">
              <SlidersHorizontal size={16} />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar mt-3 pb-2">
            <button className="bg-[#bbedcc] text-[#126b34] text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap flex items-center gap-1.5 shadow-sm border border-[#a2e8bb]">
              <BatteryCharging size={14} /> CCS 2
            </button>
            <button className="bg-white text-zinc-700 text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap flex items-center gap-1.5 shadow-sm">
              <ZapIcon size={14} /> Type 2
            </button>
            <button className="bg-white text-zinc-700 text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap flex items-center gap-1.5 shadow-sm">
              <CheckCircle size={14} /> Available
            </button>
            <button className="bg-[#fdf2f4] text-[#c22141] text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap flex items-center gap-1.5 shadow-sm">
              Free
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Sheet Modal */}
      <div className="z-20 mt-auto bg-[#f4f9f6] rounded-t-3xl pt-2 px-5 pb-24 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] flex-1 h-[65vh] flex flex-col">
        <div className="w-16 h-1.5 bg-zinc-300 rounded-full mx-auto mb-5"></div>
        
        <div className="overflow-y-auto no-scrollbar pb-6 flex-1">
          {/* Active Hub Selection */}
          <div className="edaan-card bg-white p-4 flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#bbedcc] text-[#126b34] flex items-center justify-center flex-shrink-0">
                <BatteryCharging size={24} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Festive Walk Mall Hub</h3>
                <p className="text-xs text-zinc-500">Mandurriao, Iloilo City</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="bg-[#bbedcc] text-[#0e5428] text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">AVAILABLE</span>
                  <span className="text-[10px] font-bold text-[#126b34]">2.4km away</span>
                </div>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#2bc18b] text-white flex items-center justify-center shadow-md">
              <Navigation size={18} />
            </div>
          </div>

          {/* Connected Vehicle */}
          <div className="rounded-2xl bg-[#1c2c26] text-white p-5 mb-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 scale-150 translate-x-4 -translate-y-4">
              <BatteryCharging size={120} />
            </div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-[10px] text-zinc-400 font-bold tracking-wider uppercase mb-1">CONNECTED VEHICLE</p>
                <h3 className="text-lg font-bold">Iloilo-BYD Atto 3</h3>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-[#2bc18b]">82%</div>
                <div className="text-[10px] text-zinc-400">Charging (Fast)</div>
              </div>
            </div>
            
            <div className="mt-5 flex justify-between items-end relative z-10">
              <div className="w-1/2">
                <div className="flex justify-between text-[10px] font-bold mb-1">
                  <span className="text-zinc-400 uppercase tracking-wider">BATTERY HEALTH</span>
                  <span className="text-[#2bc18b]">OPTIMAL</span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#2bc18b] w-[82%] h-full rounded-full"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Est. Range</div>
                <div className="text-lg font-bold">342 km</div>
              </div>
            </div>
          </div>

          {/* Charging Hubs List */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-[#126b34]">Charging Hubs</h3>
            <span className="text-xs font-bold text-zinc-600">24 Stations Live</span>
          </div>

          <div className="flex flex-col gap-3">
            {/* Item 1 */}
            <div className="edaan-card bg-[#eef7f1] p-3 flex gap-3 border border-[#d1f2d9]">
              <div className="w-16 h-16 rounded-xl bg-zinc-300 overflow-hidden flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1593941707882-a5bba14938cb?w=150" alt="EV charging" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between py-0.5">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 leading-tight">BYD Atria Charging</h4>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Donato Pison Ave</p>
                  </div>
                  <span className="bg-[#bbedcc] text-[#0e5428] text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">AVAILABLE</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-zinc-900">
                  <div className="flex items-center gap-1 text-[#126b34]"><ZapIcon size={12} /> 60kW Fast</div>
                  <div>₱18.50/kWh</div>
                </div>
              </div>
            </div>
            
            {/* Item 2 */}
            <div className="edaan-card bg-white p-3 flex gap-3">
              <div className="w-16 h-16 rounded-xl bg-zinc-300 overflow-hidden flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1660236822651-4263beb35fa8?w=150" alt="EV charging" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between py-0.5">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 leading-tight">SM City Iloilo North</h4>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Mandurriao, Iloilo</p>
                  </div>
                  <span className="bg-[#facfd7] text-[#c22141] text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">BUSY</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-zinc-900">
                  <div className="flex items-center gap-1 text-[#126b34]"><ZapIcon size={12} /> 22kW AC</div>
                  <div>₱15.00/kWh</div>
                </div>
              </div>
            </div>
            
             {/* Item 3 */}
             <div className="edaan-card bg-white p-3 flex gap-3">
              <div className="w-16 h-16 rounded-xl bg-zinc-300 overflow-hidden flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1647427017056-11f8e137f81f?w=150" alt="EV charging" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between py-0.5">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 leading-tight">Shell Recharge</h4>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Diversion Road</p>
                  </div>
                  <span className="bg-zinc-100 text-zinc-600 text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">MAINTENANCE</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-zinc-900">
                  <div className="flex items-center gap-1 text-[#126b34]"><ZapIcon size={12} /> 120kW Fast</div>
                  <div className="text-zinc-400">Offline</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function ZapIcon({ size = 24, ...props }: IconProps) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>
}

function CheckCircle({ size = 24, ...props }: IconProps) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
}
