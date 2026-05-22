"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Zap, Gift, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { name: "Home", href: "/", icon: Home },
    { name: "Map", href: "/map", icon: Map },
    { name: "Charging", href: "/charging", icon: Zap },
    { name: "Rewards", href: "/rewards", icon: Gift },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-zinc-100 pb-safe pb-4 pt-2 px-6 z-50 rounded-t-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
      <ul className="flex justify-between items-center">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <li key={tab.name}>
              <Link
                href={tab.href}
                className={`flex flex-col items-center gap-1 p-2 transition-colors ${
                  isActive ? "text-[#126b34]" : "text-zinc-400 hover:text-zinc-600"
                }`}
              >
                <div
                  className={`p-1.5 rounded-full transition-colors ${
                    isActive ? "bg-[#d1f2d9]" : "bg-transparent"
                  }`}
                >
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] font-bold ${isActive ? "text-[#126b34]" : ""}`}>
                  {tab.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
