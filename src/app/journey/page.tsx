"use client";

import TopHeader from "@/components/TopHeader";
import { Bike, Car, Battery, Zap, Settings, CheckSquare, Gift, Settings2 } from "lucide-react";
import Link from "next/link";

export default function SelectVehicle() {
  return (
    <main className="min-h-screen pb-24">
      <TopHeader rightAction="avatar" />
      
      <div className="px-5 pt-2 flex flex-col gap-5">
        
        <div>
          <h1 className="text-2xl font-black text-[#126b34] tracking-tight">Select Your Vehicle</h1>
          <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
            Choose your electric vehicle class to optimize routing efficiency.
          </p>
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-2 gap-3">
          <button className="edaan-card bg-white p-4 flex flex-col items-center justify-center gap-2 text-center hover:bg-zinc-50 border border-zinc-100">
            <div className="w-12 h-12 rounded-full bg-[#eef7f1] text-[#126b34] flex items-center justify-center mb-1">
              <Bike size={24} />
            </div>
            <span className="text-sm font-bold text-zinc-900">E-Bike</span>
            <span className="bg-zinc-100 text-zinc-500 text-[9px] font-bold px-2 py-0.5 rounded-full">L1 Category</span>
          </button>
          <button className="edaan-card bg-white p-4 flex flex-col items-center justify-center gap-2 text-center hover:bg-zinc-50 border border-zinc-100">
             <div className="w-12 h-12 rounded-full bg-[#eef7f1] text-[#126b34] flex items-center justify-center mb-1">
              <Bike size={24} />
            </div>
            <span className="text-sm font-bold text-zinc-900">E-Scooter</span>
            <span className="bg-zinc-100 text-zinc-500 text-[9px] font-bold px-2 py-0.5 rounded-full">L2 Class</span>
          </button>
          <button className="edaan-card bg-white p-4 flex flex-col items-center justify-center gap-2 text-center border-2 border-[#126b34] shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#126b34] text-white flex items-center justify-center mb-1 shadow-md shadow-[#126b34]/20">
              <Car size={24} />
            </div>
            <span className="text-sm font-bold text-zinc-900">EV Car</span>
            <span className="bg-[#eef7f1] text-[#126b34] text-[9px] font-bold px-2 py-0.5 rounded-full">M1 Category</span>
          </button>
          <button className="edaan-card bg-white p-4 flex flex-col items-center justify-center gap-2 text-center hover:bg-zinc-50 border border-zinc-100">
             <div className="w-12 h-12 rounded-full bg-[#eef7f1] text-[#126b34] flex items-center justify-center mb-1">
              <Car size={24} />
            </div>
            <span className="text-sm font-bold text-zinc-900">LEV</span>
            <span className="bg-zinc-100 text-zinc-500 text-[9px] font-bold px-2 py-0.5 rounded-full">Micro-mobility</span>
          </button>
        </div>

        {/* Predictive Battery Engine */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-100 shadow-sm mt-2">
          <div className="flex items-center gap-2 font-bold text-zinc-900 mb-5 text-base">
            <Battery size={18} className="text-[#126b34]" />
            Predictive Battery Engine
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <div>
              <h4 className="text-sm font-bold text-zinc-900">Battery Capacity</h4>
              <p className="text-[10px] text-zinc-500">Adjust based on your hardware</p>
            </div>
            <span className="text-sm font-bold text-[#126b34]">75 kWh</span>
          </div>
          <div className="w-full bg-zinc-100 h-1.5 rounded-full mb-6 mt-3">
             <div className="bg-[#e2e8e4] w-[75%] h-full rounded-full"></div>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="bg-[#f4f9f6] rounded-xl p-3 flex justify-between items-center">
               <div>
                 <h4 className="text-xs font-bold text-zinc-900">Aggressive Driving</h4>
                 <p className="text-[9px] text-zinc-500 mt-0.5">Higher power consumption</p>
               </div>
               <div className="w-10 h-5 bg-zinc-300 rounded-full relative">
                 <div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
               </div>
            </div>
            <div className="bg-[#f4f9f6] rounded-xl p-3 flex justify-between items-center">
               <div>
                 <h4 className="text-xs font-bold text-zinc-900">Full AC/Heating</h4>
                 <p className="text-[9px] text-zinc-500 mt-0.5">Reduces range by ~12%</p>
               </div>
               <div className="w-10 h-5 bg-[#126b34] rounded-full relative">
                 <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
               </div>
            </div>
          </div>
        </div>

        {/* Elevation-Aware Routing Graphic */}
        <div className="bg-[#1a2123] rounded-2xl p-0 overflow-hidden relative shadow-lg h-40">
           <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600" alt="Topographic map" className="w-full h-full object-cover opacity-30 mix-blend-luminosity" />
           <div className="absolute inset-0 bg-gradient-to-t from-[#1a2123] to-transparent p-5 flex flex-col justify-end">
             <div className="bg-[#126b34] text-white text-[8px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest w-fit mb-2">Graphhopper Enabled</div>
             <h3 className="text-white text-sm font-bold mb-1">Elevation-Aware Routing</h3>
             <p className="text-zinc-400 text-[10px] leading-relaxed max-w-[90%]">Our logic calculates vertical gain to ensure you never run out of juice mid-climb.</p>
           </div>
        </div>

        {/* Est. Live Range Card */}
        <div className="bg-[#126b34] rounded-2xl p-5 shadow-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 p-5">
             <Zap size={24} className="text-[#2bc18b]" />
           </div>
           <p className="text-[9px] font-bold text-[#bbedcc] uppercase tracking-wider mb-1">EST. LIVE RANGE</p>
           <div className="flex items-baseline gap-1 mb-3">
              <h2 className="text-5xl font-black text-white tracking-tighter">342</h2>
              <span className="text-lg font-medium text-[#d1f2d9]">km</span>
           </div>
           <p className="text-[10px] text-[#d1f2d9] leading-relaxed mb-6 opacity-90 max-w-[85%]">
             Based on your EV Car configuration, current elevation profile, and driving habits.
           </p>
           
           <div className="bg-[#0e5428] rounded-xl p-4 mb-5 border border-[#1b8744]">
              <div className="flex items-center gap-2 text-white font-bold text-xs mb-1">
                <Gift size={14} className="text-[#2bc18b]" /> Eco-Reward Bonus
              </div>
              <p className="text-[9px] text-[#d1f2d9]">
                Complete this trip with &gt;15% battery to earn <span className="font-bold text-white">500 DAAN</span> tokens.
              </p>
           </div>
           
           <button className="w-full bg-white text-[#126b34] hover:bg-zinc-50 font-bold py-3.5 rounded-xl shadow-md transition-colors text-sm">
             Start Journey
           </button>
        </div>

        {/* Journey Settings */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-100 mt-2">
           <div className="flex items-center gap-2 font-bold text-zinc-900 mb-4 text-sm">
             <Settings2 size={16} className="text-zinc-500" />
             Journey Settings
           </div>
           
           <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs text-zinc-700">
                <span>Avoid Tolls</span>
                <div className="w-4 h-4 rounded border border-zinc-300"></div>
              </div>
              <div className="flex justify-between items-center text-xs text-zinc-900 font-medium">
                <span>Prioritize Fast Chargers</span>
                <div className="w-4 h-4 rounded bg-[#126b34] text-white flex items-center justify-center">
                   <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs text-zinc-900 font-medium">
                <span>Eco-Routing</span>
                <div className="w-4 h-4 rounded bg-[#126b34] text-white flex items-center justify-center">
                   <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
           </div>
        </div>

      </div>
    </main>
  );
}
