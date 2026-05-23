"use client";

import TopHeader from "@/components/TopHeader";
import EDaanMap from "@/components/EDaanMap";
import { ShieldAlert, AlertTriangle, LightbulbOff, Camera, MapPin, Gift, Navigation, Send } from "lucide-react";

export default function Hazard() {
  return (
    <main className="min-h-screen pb-24">
      <TopHeader rightAction="avatar" />
      
      <div className="px-5 pt-2 flex flex-col gap-5">
        
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#d1f2d9] text-[#126b34] px-2 py-1 rounded-sm text-[9px] font-bold uppercase tracking-wider mb-2">
            <ShieldAlert size={12} /> Citizen Safety
          </div>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Report a Hazard</h1>
          <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
            Keep Iloilo&apos;s bike lanes safe. Every verified report earns you <span className="font-bold text-[#126b34]">20 Eco-Points</span> for local sustainable rewards.
          </p>
        </div>

        {/* 1. Select Hazard Type */}
        <div>
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3">1. Select Hazard Type</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="edaan-card bg-[#eef7f1] border border-[#d1f2d9] p-4 flex flex-col items-center justify-center gap-2 text-center">
              <ShieldAlert size={24} className="text-[#126b34]" />
              <span className="text-xs font-bold text-zinc-900">Blocked Bike Lane</span>
            </button>
            <button className="edaan-card bg-white p-4 flex flex-col items-center justify-center gap-2 text-center hover:bg-zinc-50">
              <AlertTriangle size={24} className="text-[#126b34]" />
              <span className="text-xs font-bold text-zinc-900">Pothole</span>
            </button>
            <button className="edaan-card bg-white p-4 flex flex-col items-center justify-center gap-2 text-center hover:bg-zinc-50">
              <Navigation size={24} className="text-[#126b34]" />
              <span className="text-xs font-bold text-zinc-900">Mixed Traffic Danger</span>
            </button>
            <button className="edaan-card bg-white p-4 flex flex-col items-center justify-center gap-2 text-center hover:bg-zinc-50">
              <LightbulbOff size={24} className="text-[#126b34]" />
              <span className="text-xs font-bold text-zinc-900">Poor Lighting</span>
            </button>
          </div>
        </div>

        {/* 2. Upload Photo */}
        <div>
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3">2. Upload Photo</h3>
          <button className="w-full h-32 rounded-xl border-2 border-dashed border-zinc-300 bg-white flex flex-col items-center justify-center gap-2 text-zinc-500 hover:bg-zinc-50 transition-colors">
            <Camera size={24} />
            <span className="text-xs font-medium">Tap to capture or upload</span>
          </button>
        </div>

        {/* 3. Description */}
        <div>
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3">3. Description</h3>
          <textarea 
            placeholder="Add a brief description of the issue..."
            className="w-full h-24 rounded-xl border border-zinc-200 p-4 text-sm resize-none focus:outline-none focus:border-[#2bc18b] focus:ring-1 focus:ring-[#2bc18b] bg-white"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button className="edaan-btn-primary w-full gap-2 mt-1">
          Submit Report <Send size={18} />
        </button>

        {/* Detected Location */}
        <div className="edaan-card p-0 overflow-hidden bg-zinc-200/50 border border-zinc-200 mt-2">
          <div className="flex items-center gap-2 px-4 py-3 bg-[#e8eae8]">
            <MapPin size={14} className="text-[#126b34]" />
            <h3 className="text-[10px] font-bold text-zinc-900 uppercase tracking-wider">Detected Location</h3>
            <div className="ml-auto w-2 h-2 rounded-full bg-[#126b34]"></div>
          </div>
          <div className="h-32 bg-zinc-200 relative overflow-hidden">
             <EDaanMap className="w-full h-full opacity-80 mix-blend-multiply pointer-events-none" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#126b34] rounded-full border-2 border-white shadow-md z-20"></div>
          </div>
          <div className="px-4 py-3 flex gap-2 items-start bg-[#e8eae8]">
            <ShieldAlert size={14} className="text-zinc-500 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-zinc-600 leading-tight">Location is automatically captured for verified reporting accuracy.</p>
          </div>
        </div>

        {/* Bonus Points Banner */}
        <div className="bg-[#bbedcc] rounded-xl p-5 border border-[#a2e8bb] relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
            <Gift size={100} />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center bg-[#126b34] text-white px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider mb-2">
              Bonus
            </div>
            <h3 className="text-lg font-black text-[#126b34]">+20 Eco-Points</h3>
            <p className="text-xs text-[#0e5428] mt-1 font-medium leading-relaxed max-w-[85%]">
              Your contribution helps the City Government prioritize infrastructure repairs.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <div className="flex -space-x-2">
                <div className="w-5 h-5 rounded-full bg-white border border-zinc-200 text-[8px] flex items-center justify-center font-bold text-zinc-700">JE</div>
                <div className="w-5 h-5 rounded-full bg-white border border-zinc-200 text-[8px] flex items-center justify-center font-bold text-zinc-700">MI</div>
                <div className="w-5 h-5 rounded-full bg-white border border-zinc-200 text-[8px] flex items-center justify-center font-bold text-zinc-700">AL</div>
              </div>
              <span className="text-[9px] font-bold text-[#0e5428]">14 reports nearby today</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
