"use client";

import Link from "next/link";
import TopHeader from "@/components/TopHeader";
import ManualBatteryInput from "@/components/ManualBatteryInput";
import { Bike, Car, Battery, Zap, Gift, Settings2 } from "lucide-react";
import {
  getSelectedVehicleModel,
  getVehicleCapacityPercent,
  getVehicleModelName,
  getVehicleModels,
  getVehicleType,
  vehicleTypes,
} from "@/lib/vehicle-profile";
import {
  updateVehicleProfile,
  useVehicleProfile,
} from "@/lib/use-vehicle-profile";

export default function SelectVehicle() {
  const vehicleProfile = useVehicleProfile();
  const { batteryPercentage, selectedTypeId } = vehicleProfile;
  const selectedType = getVehicleType(selectedTypeId);
  const selectedModels = getVehicleModels(selectedTypeId);
  const selectedModel = getSelectedVehicleModel(vehicleProfile);
  const selectedModelName = getVehicleModelName(selectedModel);
  const capacityPercent = getVehicleCapacityPercent(
    selectedTypeId,
    selectedModel,
  );
  const estimatedRangeKm = Math.round(
    (selectedModel.maxRangeKm * batteryPercentage) / 100,
  );

  return (
    <main className="min-h-screen pb-24">
      <TopHeader rightAction="avatar" />
      
      <div className="px-5 pt-2 flex flex-col gap-5">
        
        <div>
          <h1 className="text-2xl font-black text-[#126b34] tracking-tight">Select Your Vehicle</h1>
          <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
            Choose the vehicle class and brand model so battery capacity matches the ride.
          </p>
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-2 gap-3">
          {vehicleTypes.map((vehicleType) => {
            const Icon = vehicleType.iconKey === "bike" ? Bike : Car;
            const isSelected = vehicleType.id === selectedTypeId;

            return (
              <button
                aria-pressed={isSelected}
                className={`edaan-card bg-white p-4 flex flex-col items-center justify-center gap-2 text-center border transition-colors ${
                  isSelected
                    ? "border-[#126b34] ring-2 ring-[#126b34] shadow-sm"
                    : "border-zinc-100 hover:bg-zinc-50"
                }`}
                key={vehicleType.id}
                onClick={() =>
                  updateVehicleProfile((currentProfile) => ({
                    ...currentProfile,
                    selectedTypeId: vehicleType.id,
                  }))
                }
                type="button"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-1 ${
                    isSelected
                      ? "bg-[#126b34] text-white shadow-md shadow-[#126b34]/20"
                      : "bg-[#eef7f1] text-[#126b34]"
                  }`}
                >
                  <Icon size={24} />
                </div>
                <span className="text-sm font-bold text-zinc-900">
                  {vehicleType.label}
                </span>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    isSelected
                      ? "bg-[#eef7f1] text-[#126b34]"
                      : "bg-zinc-100 text-zinc-500"
                  }`}
                >
                  {vehicleType.category}
                </span>
              </button>
            );
          })}
        </div>

        {/* Brand Model Choices */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-100 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-sm font-black text-zinc-900">
                Choose brand / model
              </h2>
              <p className="text-[10px] text-zinc-500 mt-1">
                {selectedType.label} presets use different battery capacities.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[#eef7f1] px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[#126b34]">
              {selectedType.label}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {selectedModels.map((model) => {
              const isSelected = model.id === selectedModel.id;

              return (
                <button
                  aria-pressed={isSelected}
                  className={`rounded-xl border p-3 text-left transition-colors ${
                    isSelected
                      ? "border-[#126b34] bg-[#eef7f1] ring-1 ring-[#126b34]"
                      : "border-zinc-100 bg-white hover:bg-zinc-50"
                  }`}
                  key={model.id}
                  onClick={() =>
                    updateVehicleProfile((currentProfile) => ({
                      ...currentProfile,
                      selectedModelIdByType: {
                        ...currentProfile.selectedModelIdByType,
                        [selectedTypeId]: model.id,
                      },
                    }))
                  }
                  type="button"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-black text-zinc-900">
                        {model.brand} {model.name}
                      </div>
                      <div className="mt-1 text-[10px] text-zinc-500">
                        Battery {model.capacityLabel}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-sm font-black text-[#126b34]">
                        {model.maxRangeKm} km
                      </div>
                      <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                        max range
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Manual Battery Planning */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-100 shadow-sm mt-2">
          <div className="flex items-center gap-2 font-bold text-zinc-900 mb-5 text-base">
            <Battery size={18} className="text-[#126b34]" />
            Manual Battery Planning
          </div>

          <ManualBatteryInput
            helperText={`Enter the dashboard percentage for your ${selectedModelName}.`}
            maxRangeKm={selectedModel.maxRangeKm}
            onPercentageChange={(nextBatteryPercentage) =>
              updateVehicleProfile((currentProfile) => ({
                ...currentProfile,
                batteryPercentage: nextBatteryPercentage,
              }))
            }
            value={batteryPercentage}
          />
          
          <div className="flex justify-between items-center mb-2 mt-5">
            <div>
              <h4 className="text-sm font-bold text-zinc-900">Battery Capacity</h4>
              <p className="text-[10px] text-zinc-500">
                Selected model: {selectedModelName}
              </p>
            </div>
            <span className="text-sm font-bold text-[#126b34]">
              {selectedModel.capacityLabel}
            </span>
          </div>
          <div className="w-full bg-zinc-100 h-1.5 rounded-full mb-6 mt-3">
             <div
               className="bg-[#126b34] h-full rounded-full"
               style={{ width: `${capacityPercent}%` }}
             ></div>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="bg-[#eef7f1] rounded-xl p-3 flex justify-between items-center">
               <div>
                 <h4 className="text-xs font-bold text-zinc-900">Aggressive Driving</h4>
                 <p className="text-[9px] text-zinc-500 mt-0.5">Higher power consumption</p>
               </div>
               <div className="w-10 h-5 bg-zinc-300 rounded-full relative">
                 <div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
               </div>
            </div>
            <div className="bg-[#eef7f1] rounded-xl p-3 flex justify-between items-center">
               <div>
                 <h4 className="text-xs font-bold text-zinc-900">High Accessory Load</h4>
                 <p className="text-[9px] text-zinc-500 mt-0.5">Lights, cargo, or climate use</p>
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

        {/* Est. Range Card */}
        <div className="bg-[#126b34] rounded-2xl p-5 shadow-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 p-5">
             <Zap size={24} className="text-[#2bc18b]" />
           </div>
           <p className="text-[9px] font-bold text-[#bbedcc] uppercase tracking-wider mb-1">EST. RANGE FROM ENTRY</p>
           <div className="flex items-baseline gap-1 mb-3">
              <h2 className="text-5xl font-black text-white tracking-tighter">
                {estimatedRangeKm}
              </h2>
              <span className="text-lg font-medium text-[#d1f2d9]">km</span>
           </div>
           <p className="text-[10px] text-[#d1f2d9] leading-relaxed mb-6 opacity-90 max-w-[85%]">
             Based on your owner-entered {batteryPercentage}% battery, {selectedModelName} capacity, elevation profile, and driving habits.
           </p>
           
           <div className="bg-[#0e5428] rounded-xl p-4 mb-5 border border-[#1b8744]">
              <div className="flex items-center gap-2 text-white font-bold text-xs mb-1">
                <Gift size={14} className="text-[#2bc18b]" /> Eco-Reward Bonus
              </div>
              <p className="text-[9px] text-[#d1f2d9]">
                Complete this trip with &gt;15% battery to earn <span className="font-bold text-white">500 DAAN</span> tokens.
              </p>
           </div>
           
           <Link
             className="block w-full bg-white text-[#126b34] hover:bg-zinc-50 font-bold py-3.5 rounded-xl shadow-md transition-colors text-center text-sm"
             href="/map"
           >
             Start Journey
           </Link>
        </div>

        {/* Journey Settings */}
        <div className="bg-[#f0f6f2] rounded-2xl p-5 border-none mt-2">
           <div className="flex items-center gap-2 font-bold text-zinc-900 mb-4 text-sm">
             <Settings2 size={16} className="text-zinc-600" />
             Journey Settings
           </div>
           
           <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs text-zinc-700">
                <span>Avoid Tolls</span>
                <div className="w-4 h-4 rounded-sm border border-zinc-400 bg-white"></div>
              </div>
              <div className="flex justify-between items-center text-xs text-zinc-900 font-medium">
                <span>Prioritize Fast Chargers</span>
                <div className="w-4 h-4 rounded-sm bg-[#126b34] text-white flex items-center justify-center">
                   <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs text-zinc-900 font-medium">
                <span>Eco-Routing</span>
                <div className="w-4 h-4 rounded-sm bg-[#126b34] text-white flex items-center justify-center">
                   <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
           </div>
        </div>

      </div>
    </main>
  );
}
