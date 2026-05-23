"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  Bike,
  Gift,
  Home,
  Map,
  Menu,
  Search,
  Settings,
  ShieldAlert,
  User,
  X,
  Zap,
} from "lucide-react";

interface TopHeaderProps {
  rightAction?: "avatar" | "settings" | "search-avatar";
}

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/map", icon: Map, label: "Map" },
  { href: "/journey", icon: Bike, label: "Journey" },
  { href: "/charging", icon: Zap, label: "Charging" },
  { href: "/rewards", icon: Gift, label: "Rewards" },
  { href: "/hazard", icon: ShieldAlert, label: "Report Hazard" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function TopHeader({ rightAction = "avatar" }: TopHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const searchResults = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return navItems.slice(0, 5);
    }

    return navItems.filter((item) => item.label.toLowerCase().includes(query));
  }, [searchTerm]);

  return (
    <>
      <header className="flex items-center justify-between px-5 py-4 bg-transparent z-40 relative">
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setIsMenuOpen(true)}
          className="p-2 -ml-2 text-zinc-700 hover:text-zinc-900 transition-colors"
        >
          <Menu size={24} strokeWidth={2.5} className="text-[#126b34]" />
        </button>

        <Link
          href="/"
          className="flex items-center justify-center"
          aria-label="e-Daan home"
        >
          <Image
            src="/edaan-logo.png"
            alt="e-Daan - The smarter way forward"
            width={114}
            height={38}
            priority
            className="h-9 w-auto"
          />
        </Link>

        <div className="flex items-center gap-3">
          {rightAction === "search-avatar" ? (
            <button
              type="button"
              aria-label="Open search"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              <Search size={20} strokeWidth={2.5} />
            </button>
          ) : null}

          {rightAction === "settings" ? (
            <button
              type="button"
              aria-label="Open settings"
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-[#126b34] hover:text-[#0e5428] transition-colors"
            >
              <Settings size={24} strokeWidth={2} />
            </button>
          ) : (
            <Link
              href="/profile"
              aria-label="Open profile"
              className="w-8 h-8 rounded-full border-2 border-[#126b34] overflow-hidden bg-zinc-100"
            >
              <img
                src="https://api.dicebear.com/9.x/avataaars/svg?seed=Aliyah&backgroundColor=e0f5e4"
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </Link>
          )}
        </div>
      </header>

      {isMenuOpen ? (
        <div className="fixed inset-0 z-[70] bg-zinc-950/35">
          <section className="mx-auto h-full w-full max-w-md bg-white shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
              <div className="font-black text-[#126b34]">Menu</div>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-zinc-600"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="px-3 py-3">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-zinc-800 hover:bg-[#eef7f1]"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eef7f1] text-[#126b34]">
                      <Icon size={18} />
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="px-5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsSettingsOpen(true);
                }}
                className="flex w-full items-center gap-3 rounded-xl bg-zinc-100 px-3 py-3 text-sm font-bold text-zinc-800"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#126b34]">
                  <Settings size={18} />
                </span>
                Settings
              </button>
            </div>
          </section>
        </div>
      ) : null}

      {isSearchOpen ? (
        <div className="fixed inset-0 z-[70] bg-zinc-950/35">
          <section className="mx-auto w-full max-w-md bg-white shadow-2xl">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-100">
              <Search size={20} className="text-[#126b34]" />
              <input
                autoFocus
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search pages or route tools"
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-zinc-900 outline-none placeholder:text-zinc-400"
              />
              <button
                type="button"
                aria-label="Close search"
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-zinc-600"
              >
                <X size={22} />
              </button>
            </div>

            <div className="px-3 py-3">
              {searchResults.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-zinc-800 hover:bg-[#eef7f1]"
                  >
                    <Icon size={18} className="text-[#126b34]" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      ) : null}

      {isSettingsOpen ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-zinc-950/35">
          <section className="mx-auto mt-auto flex min-h-[44vh] w-full max-w-md flex-col rounded-t-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
              <div className="font-black text-[#126b34]">Settings</div>
              <button
                type="button"
                aria-label="Close settings"
                onClick={() => setIsSettingsOpen(false)}
                className="p-2 text-zinc-600"
              >
                <X size={22} />
              </button>
            </div>

            <div className="grid gap-2 px-5 py-4">
              <SettingsRow icon={Bell} label="Safety alerts" enabled />
              <SettingsRow icon={Zap} label="Battery reminders" enabled />
              <SettingsRow icon={Map} label="Prefer safer routes" enabled />
              <SettingsRow icon={ShieldAlert} label="Share hazard reports" />
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

function SettingsRow({
  enabled = false,
  icon: Icon,
  label,
}: {
  enabled?: boolean;
  icon: typeof Bell;
  label: string;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xl bg-[#f4f9f6] px-4 py-3">
      <span className="flex items-center gap-3 text-sm font-bold text-zinc-800">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#126b34]">
          <Icon size={18} />
        </span>
        {label}
      </span>
      <input type="checkbox" defaultChecked={enabled} className="h-5 w-5 accent-[#126b34]" />
    </label>
  );
}
