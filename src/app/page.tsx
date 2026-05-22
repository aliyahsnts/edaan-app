import Link from "next/link";
import TopHeader from "@/components/TopHeader";
import { AlertCircle, BatteryCharging, Leaf, MapPin, Navigation, Map as MapIcon, Car, AlertTriangle, Zap, Gift } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      <TopHeader rightAction="search-avatar" />
      
      <div className="px-5 pt-2 pb-6 flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Magandang umaga, Aliyah</h1>
          <p className="text-sm text-zinc-500 mt-1">Your journey is making a difference today.</p>
        </div>

        {/* Vehicle Card */}
        <div className="edaan-card bg-[#eef7f1] border border-[#d1f2d9]">
          <div className="flex justify-between items-start mb-2">
            <span className="bg-[#bbedcc] text-[#0e5428] text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              Active Vehicle
            </span>
            <Car size={20} className="text-[#126b34]" />
          </div>
          <h2 className="text-lg font-bold text-zinc-900">Iloilo-BYD Atto 3</h2>
          <p className="text-xs text-zinc-500">Last synced 2m ago</p>
          
          <div className="flex items-end gap-2 mt-4">
            <span className="text-5xl font-black text-[#126b34] tracking-tighter">82%</span>
            <Zap size={24} className="text-[#2bc18b] mb-1" />
          </div>
          
          <div className="flex justify-between items-center mt-3 mb-4 text-sm font-medium">
            <span className="text-zinc-600">Estimated Range</span>
            <span className="text-zinc-900 font-bold">342km</span>
          </div>
          
          <button className="w-full edaan-btn-primary">
            Controls
          </button>
        </div>

        {/* Two metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="edaan-card bg-[#eef7f1] border border-[#d1f2d9] p-4">
            <div className="flex items-center gap-2 mb-2 text-[#126b34] text-xs font-bold uppercase tracking-wider">
              <span>Eco-Impact</span>
              <Leaf size={14} />
            </div>
            <div className="text-lg font-black text-zinc-900">12.5kg CO2</div>
            <div className="text-xs text-zinc-500">Saved</div>
          </div>
          <div className="edaan-card p-4 flex flex-col justify-center">
            <div className="text-xs text-zinc-500 mb-1">Eco-Points<br/>Balance</div>
            <div className="flex items-center gap-1.5 mt-auto">
              <div className="w-4 h-4 rounded-full bg-[#e75f78] flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
              <span className="text-xl font-black text-zinc-900">2,450</span>
            </div>
          </div>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/journey" className="edaan-card bg-white p-4 flex flex-col items-center text-center gap-3 active:scale-95 transition-transform">
            <div className="w-12 h-12 rounded-full bg-[#2bc18b] flex items-center justify-center text-white shadow-md shadow-[#2bc18b]/30">
              <Navigation size={24} />
            </div>
            <span className="text-xs font-bold text-zinc-800">Start Journey</span>
          </Link>
          <Link href="/hazard" className="edaan-card bg-white p-4 flex flex-col items-center text-center gap-3 active:scale-95 transition-transform">
            <div className="w-12 h-12 rounded-full bg-[#e75f78] flex items-center justify-center text-white shadow-md shadow-[#e75f78]/30">
              <AlertTriangle size={24} />
            </div>
            <span className="text-xs font-bold text-zinc-800">Report Hazard</span>
          </Link>
          <Link href="/charging" className="edaan-card bg-[#eef7f1] border-none p-4 flex flex-col items-center text-center gap-3 active:scale-95 transition-transform">
            <div className="w-12 h-12 rounded-full bg-[#bbedcc] flex items-center justify-center text-[#126b34]">
              <BatteryCharging size={24} />
            </div>
            <span className="text-xs font-bold text-zinc-800">Find Charging</span>
          </Link>
          <Link href="/rewards" className="edaan-card bg-[#fdf2f4] border-none p-4 flex flex-col items-center text-center gap-3 active:scale-95 transition-transform">
            <div className="w-12 h-12 rounded-full bg-[#facfd7] flex items-center justify-center text-[#c22141]">
              <Gift size={24} />
            </div>
            <span className="text-xs font-bold text-zinc-800">Redeem Rewards</span>
          </Link>
        </div>

        {/* Local Insights */}
        <div className="edaan-card p-4 mt-2">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 font-bold text-zinc-900">
              <AlertCircle size={18} className="text-[#126b34]" />
              Local Insights
            </div>
            <button className="text-[10px] font-bold text-[#126b34] uppercase tracking-wider">View All</button>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex gap-3 bg-white">
              <div className="w-10 h-10 rounded-full bg-[#fdf2f4] text-[#c22141] flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900">Jaro Chokepoint: Heavy Traffic</h4>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">Expect 15m delay near Cathedral. Rerouting suggested.</p>
              </div>
            </div>
            <div className="flex gap-3 bg-white">
              <div className="w-10 h-10 rounded-full bg-[#2bc18b] text-white flex items-center justify-center flex-shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900">New Hub: Atria Park Station Now Live</h4>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">3 fast chargers and 10 bike bays available now.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Preview */}
        <Link href="/map" className="relative h-[180px] rounded-[1rem] overflow-hidden mt-2 border border-zinc-200 block shadow-sm">
          <div className="absolute inset-0 bg-zinc-200">
             {/* Map Placeholder Image/Color since Mapbox requires token */}
             <div className="w-full h-full bg-[#e8eae8] flex items-center justify-center">
                {/* SVG lines for map roads */}
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 40 Q 50 20, 100 50 T 200 80 T 300 40 T 400 90" stroke="#d5dad7" strokeWidth="8" fill="none"/>
                  <path d="M0 120 Q 80 150, 150 100 T 300 130 T 450 100" stroke="#d5dad7" strokeWidth="12" fill="none"/>
                  <path d="M100 0 L 150 200 M 250 0 L 300 200 M 350 0 L 400 200" stroke="#d5dad7" strokeWidth="6" fill="none"/>
                </svg>
             </div>
             <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/40 to-transparent"></div>
          </div>
          <div className="absolute bottom-3 left-3 bg-white px-3 py-2 rounded-full text-xs font-bold text-zinc-900 flex items-center gap-2 shadow-md">
            <div className="w-2 h-2 bg-[#126b34] rounded-full"></div>
            Live in Iloilo City
          </div>
          <div className="absolute bottom-3 right-3 w-10 h-10 bg-[#126b34] rounded-full text-white flex items-center justify-center shadow-lg">
            <MapIcon size={18} />
          </div>
        </Link>
      </div>
    </main>
  );
}
