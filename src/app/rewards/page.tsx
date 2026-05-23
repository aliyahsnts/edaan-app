import TopHeader from "@/components/TopHeader";
import { BadgeCheck, Leaf, Bike, CheckCircle, Footprints } from "lucide-react";

export default function Rewards() {
  return (
    <main className="min-h-screen pb-24">
      <TopHeader rightAction="search-avatar" />
      
      <div className="px-5 pt-2 flex flex-col gap-5">
        
        {/* Points Header */}
        <div className="bg-[#126b34] rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <p className="text-[10px] font-bold tracking-widest text-[#d1f2d9] uppercase mb-1">Your Eco-Points</p>
          <div className="flex items-baseline gap-2 mb-4">
            <h1 className="text-5xl font-black tracking-tighter">2,450</h1>
            <span className="text-xl font-bold text-[#bbedcc]">pts</span>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-[#0e5428] px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
            <Leaf size={12} className="text-[#2bc18b]" /> 12.5 kg CO2 saved
          </div>
        </div>

        {/* Current Tier */}
        <div className="edaan-card bg-[#eef7f1] border border-[#d1f2d9] p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#bbedcc] text-[#126b34] flex items-center justify-center flex-shrink-0 shadow-sm border border-white">
            <BadgeCheck size={28} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Current Tier</p>
            <h3 className="text-lg font-black text-[#126b34] leading-tight">Green Guardian</h3>
            <p className="text-[10px] font-bold text-zinc-600 mt-1 mb-1">550 pts to &apos;Eco Champion&apos;</p>
            <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#126b34] w-[80%] h-full rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Marketplace */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-zinc-900">Marketplace</h3>
            <button className="text-[10px] font-bold text-[#126b34] uppercase tracking-wider">View All</button>
          </div>

          <div className="flex flex-col gap-4">
            {/* Item 1 */}
            <div className="edaan-card p-0 overflow-hidden border border-zinc-100">
              <div className="h-28 bg-zinc-200 relative">
                <img src="https://images.unsplash.com/photo-1593941707882-a5bba14938cb?w=400" alt="Charging" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-[#126b34] text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                  <Leaf size={10} /> 1000 pts
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-base font-bold text-zinc-900">50% Off Charging</h4>
                  <span className="bg-[#facfd7] text-[#c22141] text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Local Partner</span>
                </div>
                <p className="text-xs text-zinc-500 mb-4">Festive Walk Mall</p>
                <button className="w-full edaan-btn-primary h-9 text-sm">Redeem</button>
              </div>
            </div>

            {/* Item 2 */}
            <div className="edaan-card p-0 overflow-hidden border border-zinc-100">
              <div className="h-28 bg-zinc-200 relative">
                <img src="https://images.unsplash.com/photo-1597881665675-5d9c22ebf01d?w=400" alt="Bike Shop" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-[#126b34] text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                  <Leaf size={10} /> 800 pts
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-base font-bold text-zinc-900">Free Bike Tune-up</h4>
                  <span className="bg-[#facfd7] text-[#c22141] text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Local Partner</span>
                </div>
                <p className="text-xs text-zinc-500 mb-4">Iloilo City Bike Shop</p>
                <button className="w-full edaan-btn-primary h-9 text-sm">Redeem</button>
              </div>
            </div>

            {/* Item 3 */}
            <div className="edaan-card p-0 overflow-hidden border border-zinc-100">
              <div className="h-28 bg-zinc-200 relative">
                <img src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400" alt="Eco Store" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-[#126b34] text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                  <Leaf size={10} /> 500 pts
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-base font-bold text-zinc-900">Eco-Store Voucher</h4>
                  <span className="bg-[#bbedcc] text-[#126b34] text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Retail</span>
                </div>
                <p className="text-xs text-zinc-500 mb-4">₱200 off any purchase</p>
                <button className="w-full edaan-btn-primary h-9 text-sm">Redeem</button>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Challenges */}
        <div className="edaan-card bg-white mt-2 p-5 border border-zinc-100">
          <div className="flex items-center gap-2 font-bold text-zinc-900 mb-5 text-base">
            <CheckCircle size={18} className="text-[#126b34]" />
            Daily Challenges
          </div>
          
          <div className="flex flex-col gap-5">
            {/* Challenge 1 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#eef7f1] text-[#126b34] flex items-center justify-center flex-shrink-0">
                <Bike size={18} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-zinc-900">Ride 5km on Bike Lanes</h4>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-[10px] text-zinc-500">2.5km / 5km completed</p>
                </div>
                <div className="w-full bg-zinc-100 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-[#126b34] w-[50%] h-full rounded-full"></div>
                </div>
              </div>
              <div className="bg-[#d1f2d9] text-[#126b34] text-[10px] font-bold px-2 py-1.5 rounded-md text-center">
                +100<br/>pts
              </div>
            </div>
            
            {/* Challenge 2 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#eef7f1] text-[#126b34] flex items-center justify-center flex-shrink-0">
                <Footprints size={18} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-zinc-900">Walk 10,000 steps</h4>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-[10px] text-zinc-500">8,400 / 10,000 completed</p>
                </div>
                <div className="w-full bg-zinc-100 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-[#126b34] w-[84%] h-full rounded-full"></div>
                </div>
              </div>
              <div className="bg-[#d1f2d9] text-[#126b34] text-[10px] font-bold px-2 py-1.5 rounded-md text-center">
                +50 pts
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
