import TopHeader from "@/components/TopHeader";
import { Leaf, Plus, Bike, Wind, Droplets, History, Settings2, Bell, Zap, Route } from "lucide-react";

export default function Profile() {
  return (
    <main className="min-h-screen pb-20">
      <TopHeader rightAction="settings" />
      
      <div className="px-5 pt-2 flex flex-col gap-6">
        
        {/* Profile Header */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-zinc-200 mb-3">
            <img 
              src="https://api.dicebear.com/9.x/avataaars/svg?seed=Ilonggo&backgroundColor=e0f5e4" 
              alt="Ilonggo Rider" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Ilonggo Rider</h1>
          <p className="text-sm text-zinc-500 mt-1 mb-4 flex items-center gap-1">
            Joined March 2023
          </p>
          <button className="edaan-btn-primary h-10 px-6 text-sm font-bold flex items-center gap-2">
            <Settings2 size={16} /> Edit Profile
          </button>
        </div>

        {/* Sustainability Impact */}
        <div>
          <div className="flex items-center gap-2 font-bold text-zinc-900 mb-4 text-lg">
            <Leaf size={20} className="text-[#126b34]" />
            Sustainability Impact
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="edaan-card bg-white p-4 flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#bbedcc] text-[#126b34] flex items-center justify-center">
                <Route size={18} />
              </div>
              <div className="text-xs text-zinc-500 mt-1">Total Green km</div>
              <div className="text-xl font-black text-[#126b34]">1,245</div>
            </div>
            <div className="edaan-card bg-white p-4 flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#bbedcc] text-[#126b34] flex items-center justify-center">
                <Wind size={18} />
              </div>
              <div className="text-xs text-zinc-500 mt-1">CO2 Offset (kg)</div>
              <div className="text-xl font-black text-[#126b34]">312</div>
            </div>
            <div className="edaan-card bg-white p-4 flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#bbedcc] text-[#126b34] flex items-center justify-center">
                <Droplets size={18} />
              </div>
              <div className="text-xs text-zinc-500 mt-1">Fuel Saved (L)</div>
              <div className="text-xl font-black text-[#126b34]">145</div>
            </div>
            <div className="edaan-card bg-[#fdf2f4] border-none p-4 flex flex-col items-center text-center justify-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#facfd7] text-[#c22141] flex items-center justify-center">
                <History size={18} />
              </div>
              <div className="text-[10px] font-bold text-[#c22141] uppercase tracking-wider mt-1">Records</div>
              <div className="text-sm font-bold text-[#c22141]">Trip History</div>
            </div>
          </div>
        </div>

        {/* My Vehicles */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 font-bold text-zinc-900 text-lg">
              <Bike size={20} className="text-[#126b34]" />
              My Vehicles
            </div>
            <button className="text-[#126b34]">
              <Plus size={24} />
            </button>
          </div>
          <div className="edaan-card bg-white p-0 overflow-hidden">
            <div className="flex items-center gap-4 p-4 border-b border-zinc-100">
              <div className="w-10 h-10 rounded-lg bg-[#eef7f1] text-[#126b34] flex items-center justify-center flex-shrink-0">
                <Bike size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900">LEV - Electric Kickscooter</h4>
                <p className="text-xs text-zinc-500">Primary - manual battery entry</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 rounded-lg bg-[#f4f4f5] text-zinc-500 flex items-center justify-center flex-shrink-0">
                <Bike size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900">Mountain Bike</h4>
                <p className="text-xs text-zinc-500">Secondary</p>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div>
          <div className="flex items-center gap-2 font-bold text-zinc-900 mb-4 text-lg">
            <Settings2 size={20} className="text-[#126b34]" />
            Preferences
          </div>
          <div className="edaan-card bg-white p-0 overflow-hidden">
            {/* Safety Notifications */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-100 gap-4">
              <div>
                <h4 className="text-sm font-bold text-zinc-900">Safety Notifications</h4>
                <p className="text-xs text-zinc-500 mt-1">Alerts for hazard zones and poor road conditions.</p>
              </div>
              <div className="w-12 h-6 bg-[#126b34] rounded-full relative flex-shrink-0">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
              </div>
            </div>
            {/* Battery Alerts */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-100 gap-4">
              <div>
                <h4 className="text-sm font-bold text-zinc-900">Battery Alerts</h4>
                <p className="text-xs text-zinc-500 mt-1">Low battery warnings and charging station suggestions.</p>
              </div>
              <div className="w-12 h-6 bg-[#126b34] rounded-full relative flex-shrink-0">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
              </div>
            </div>
            {/* Route Optimization */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-100 gap-4">
              <div>
                <h4 className="text-sm font-bold text-zinc-900">Route Optimization</h4>
                <p className="text-xs text-zinc-500 mt-1">Preference for navigation.</p>
              </div>
              <div className="bg-[#eef7f1] text-[#126b34] px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap">
                Safety First
              </div>
            </div>
            {/* LGU Data Contribution */}
            <div className="flex items-center justify-between p-4 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-zinc-900">LGU Data Contribution</h4>
                  <span className="bg-[#facfd7] text-[#c22141] text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Beta</span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">Share anonymized safety reporting to help improve local infrastructure.</p>
              </div>
              <div className="w-12 h-6 bg-zinc-200 rounded-full relative flex-shrink-0">
                <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
