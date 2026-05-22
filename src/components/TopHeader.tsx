"use client";

import { Menu, Search, Settings } from "lucide-react";
import Link from "next/link";

interface TopHeaderProps {
  rightAction?: "avatar" | "settings" | "search-avatar";
}

export default function TopHeader({ rightAction = "avatar" }: TopHeaderProps) {
  return (
    <header className="flex items-center justify-between px-5 py-4 bg-transparent z-40 relative">
      <button className="p-2 -ml-2 text-zinc-700 hover:text-zinc-900 transition-colors">
        <Menu size={24} strokeWidth={2.5} className="text-[#126b34]" />
      </button>

      <div className="flex items-center justify-center font-bold text-xl tracking-tight text-[#126b34]">
        {/* Placeholder for logo, using styled text to match e-Daan brand */}
        <div className="flex items-center">
          <span className="text-[#e75f78] mr-1 italic text-2xl font-black">e</span>
          <span>-Daan</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {rightAction === "search-avatar" && (
          <button className="p-2 text-zinc-600 hover:text-zinc-900 transition-colors">
            <Search size={20} strokeWidth={2.5} />
          </button>
        )}
        
        {rightAction === "settings" ? (
          <button className="p-2 text-[#126b34] hover:text-[#0e5428] transition-colors">
            <Settings size={24} strokeWidth={2} />
          </button>
        ) : (
          <button className="w-8 h-8 rounded-full border-2 border-[#126b34] overflow-hidden bg-zinc-100">
            <img 
              src="https://api.dicebear.com/9.x/avataaars/svg?seed=Aliyah&backgroundColor=e0f5e4" 
              alt="User Avatar" 
              className="w-full h-full object-cover"
            />
          </button>
        )}
      </div>
    </header>
  );
}
