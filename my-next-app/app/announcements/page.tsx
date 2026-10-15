"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  CalendarX,
  ClipboardList,
  CalendarDays,
  UserCircle,
  Megaphone,
  Settings,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Clock,
  CheckCircle2,
  Calendar as CalendarIcon,
  Search,
  Users,
  Palette,
  Wrench,
  Award,
  AlertCircle,
  ListFilter,
  Check,
  User,
  Menu,
  X
} from "lucide-react";

interface AnnouncementItem {
  id: string;
  title: string;
  body: string;
  date: string;
  author: string;
  category: "Event" | "Policy" | "Contest" | "System" | "Recognition";
  important?: boolean;
}

const ALL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: "ann-1",
    title: "Company Team Building",
    body: "Join us for our Team Building Activity on July 20, 2026 at Camp Harmony. This annual event aims to strengthen collaboration, team spirit, and organizational excellence.",
    date: "June 30, 2026",
    author: "Admin",
    category: "Event",
    important: true,
  },
  {
    id: "ann-2",
    title: "New Office Hours",
    body: "Starting August 1, 2026, our new office hours will be 9:00 AM - 6:00 PM, Monday to Friday. Please adjust your schedules accordingly and reach out to HR for questions.",
    date: "July 07, 2026",
    author: "Admin",
    category: "Policy",
    important: true,
  },
  {
    id: "ann-3",
    title: "Design Contest",
    body: "We're having a design contest! Submit your entries by August 9, 2026. Winners will receive exciting prizes and recognition from executive leadership.",
    date: "June 29, 2026",
    author: "Admin",
    category: "Contest",
  },
  {
    id: "ann-4",
    title: "Upcoming System Maintenance",
    body: "The Strideon system will undergo schedule maintenance on July 15, 2026 from 10:00 PM - 12:00 AM. Access may be temporarily degraded during this service window.",
    date: "June 25, 2026",
    author: "IT Department",
    category: "System",
    important: true,
  },
  {
    id: "ann-5",
    title: "Employee Recognition Program",
    body: "Nominate outstanding team members for our monthly recognition program. Nominations close on July 10, 2026. Let's celebrate our hard-working teammates!",
    date: "June 20, 2026",
    author: "HR Department",
    category: "Recognition",
    important: true,
  },
  {
    id: "ann-6",
    title: "Strideon Summer Footwear Showcase",
    body: "Catch our design team showcasing new prototypes next Friday in the main auditorium. Snacks and refreshments provided.",
    date: "June 15, 2026",
    author: "Admin",
    category: "Event",
  },
  {
    id: "ann-7",
    title: "Quarterly Performance Reviews",
    body: "Q2 performance reviews commence next week. Please complete your self-evaluation form before July 20.",
    date: "June 10, 2026",
    author: "HR Department",
    category: "Policy",
  },
];

function AnnouncementsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Announcements");
  const [selectedSort, setSelectedSort] = useState("Most Recent");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    { name: "All Announcements", count: 12 },
    { name: "Event", count: 3 },
    { name: "Policy", count: 2 },
    { name: "System", count: 2 },
    { name: "Contest", count: 2 },
    { name: "Recognition", count: 3 },
  ];

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "Event":
        return <Users className="w-6 h-6 text-neutral-800 stroke-[1.8]" />;
      case "Policy":
        return <Clock className="w-6 h-6 text-neutral-800 stroke-[1.8]" />;
      case "Contest":
        return <Palette className="w-6 h-6 text-neutral-800 stroke-[1.8]" />;
      case "System":
        return <Wrench className="w-6 h-6 text-neutral-800 stroke-[1.8]" />;
      case "Recognition":
        return <Award className="w-6 h-6 text-neutral-800 stroke-[1.8]" />;
      default:
        return <Megaphone className="w-6 h-6 text-neutral-800 stroke-[1.8]" />;
    }
  };

  const filteredAnnouncements = ALL_ANNOUNCEMENTS.filter((item) => {
    const matchesCat =
      selectedCategory === "All Announcements" || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Leave Requests", href: "/leave-requests", icon: CalendarX },
    { name: "My Tasks", href: "/tasks", icon: ClipboardList },
    { name: "Attendance", href: "/attendance", icon: CalendarDays },
    { name: "Profile", href: "/profile", icon: UserCircle },
    { name: "Announcements", href: "/announcements", icon: Megaphone, active: true },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen w-full flex bg-[#f4f5f8] text-neutral-900 font-sans antialiased selection:bg-neutral-800 selection:text-white">
      {/* ======================================================== */}
      {/* LEFT SIDEBAR                                             */}
      {/* ======================================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 sm:w-64 bg-black text-white flex flex-col justify-between py-6 px-4 transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Logo */}
          <Link href="/dashboard" className="flex flex-col items-center pt-2 pb-8 border-b border-neutral-900 group">
            <div className="transition hover:scale-105">
              <Image
                src="/assets/strideon-shoe-white.png"
                alt="Strideon Emblem"
                width={70}
                height={55}
                priority
                className="w-14 h-auto object-contain filter drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)] select-none"
              />
            </div>
            <h1 className="mt-2.5 text-xs font-bold tracking-[0.25em] text-white uppercase font-sans">
              STRIDEON
            </h1>
          </Link>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.active;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-[13px] font-medium transition cursor-pointer text-left ${
                    isActive
                      ? "bg-neutral-800/90 text-white shadow-sm border border-neutral-700/50"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-900/80"
                  }`}
                >
                  <Icon className={`w-4 h-4 stroke-[1.8] ${isActive ? "text-white" : "text-neutral-400"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-neutral-900 space-y-1">
          <Link
            href="/settings"
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-400 hover:text-white hover:bg-neutral-900/60 rounded-xl transition"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-400 hover:text-red-400 hover:bg-neutral-900/60 rounded-xl transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* ======================================================== */}
      {/* MAIN VIEW AREA                                           */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* Top Header */}
        <header className="p-4 sm:p-6 pb-2">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-neutral-200/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -ml-1 text-neutral-600 hover:text-black rounded-lg lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900 leading-none">
                  Strideon
                </h1>
                <p className="text-xs text-neutral-500 font-medium tracking-wide mt-1">
                  Announcements
                </p>
              </div>
            </div>

            {/* Right: Notifications & User Profile */}
            <div className="flex items-center gap-3 sm:gap-5">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-full text-neutral-700 hover:text-black hover:bg-neutral-100 transition cursor-pointer"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-neutral-200 p-3 z-50 text-xs">
                    <p className="font-bold text-neutral-900 pb-2 border-b border-neutral-100">Notifications</p>
                    <div className="py-2 space-y-2">
                      <div className="p-2 bg-neutral-50 rounded-lg">
                        <p className="font-semibold text-neutral-900">New Announcement</p>
                        <p className="text-[11px] text-neutral-500">Company Team Building on July 20.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2.5 p-1 sm:pr-2.5 rounded-full hover:bg-neutral-100 transition cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-neutral-200 shrink-0 bg-neutral-200">
                    <Image
                      src="/assets/avatar-aaron.png"
                      alt="Aaron Tumaliuan"
                      width={36}
                      height={36}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="hidden sm:block text-left leading-tight">
                    <p className="text-xs font-bold text-neutral-900">Aaron Tumaliuan</p>
                    <p className="text-[10px] text-neutral-400 font-medium">Graphic Designer</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400 hidden sm:block" />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-neutral-200 py-1.5 z-50 text-xs animate-fadeIn">
                    <div className="px-3.5 py-2.5 border-b border-neutral-100 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-neutral-200 shrink-0 bg-neutral-100">
                        <Image
                          src="/assets/avatar-aaron.png"
                          alt="Aaron Tumaliuan"
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="leading-tight overflow-hidden">
                        <p className="font-bold text-neutral-900 truncate">Aaron Tumaliuan</p>
                        <p className="text-[11px] text-neutral-400 truncate">aarondanieltumaliuan@gmail.com</p>
                        <p className="text-[10px] font-mono text-neutral-400 mt-0.5">2024 - 0567</p>
                      </div>
                    </div>
                    <Link href="/dashboard" className="block px-3.5 py-2 text-neutral-700 hover:bg-neutral-50">
                      Dashboard
                    </Link>
                    <Link href="/profile" className="block px-3.5 py-2 text-neutral-700 hover:bg-neutral-50">
                      My Profile
                    </Link>
                    <Link href="/settings" className="block px-3.5 py-2 text-neutral-700 hover:bg-neutral-50">
                      Settings
                    </Link>
                    <div className="border-t border-neutral-100 my-1" />
                    <button
                      type="button"
                      onClick={() => router.push("/")}
                      className="w-full text-left px-3.5 py-2 text-red-600 hover:bg-red-50 flex items-center gap-1.5 font-medium cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 pt-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* LEFT COLUMN: Announcements Feed (8 cols on lg) */}
            <div className="lg:col-span-8 bg-white rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-neutral-200/80 flex flex-col justify-between">
              <div>
                {/* Search & Filter Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-neutral-100">
                  {/* Search Input */}
                  <div className="relative flex-1 max-w-xs">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search announcements"
                      className="w-full text-xs bg-white border border-neutral-300 rounded-xl pl-8 pr-3 py-2 outline-none focus:border-black transition"
                    />
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5 pointer-events-none" />
                  </div>

                  {/* Dropdowns */}
                  <div className="flex items-center gap-2">
                    {/* Category Filter */}
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded-xl px-3 py-2 pr-7 outline-none appearance-none hover:border-neutral-400 cursor-pointer"
                      >
                        <option value="All Announcements">All Announcements</option>
                        <option value="Event">Event</option>
                        <option value="Policy">Policy</option>
                        <option value="System">System</option>
                        <option value="Contest">Contest</option>
                        <option value="Recognition">Recognition</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2 top-3 pointer-events-none" />
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowSortDropdown(!showSortDropdown)}
                        className="text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded-xl px-3 py-2 pr-7 outline-none hover:border-neutral-400 cursor-pointer flex items-center gap-1"
                      >
                        <span>{selectedSort}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2 top-3" />
                      </button>

                      {showSortDropdown && (
                        <div className="absolute right-0 mt-1 w-40 bg-white border border-neutral-200 rounded-xl shadow-lg py-1 z-30 text-xs">
                          {["Most Recent", "Oldest", "Newest", "Most Important"].map((sortOpt) => (
                            <button
                              key={sortOpt}
                              type="button"
                              onClick={() => {
                                setSelectedSort(sortOpt);
                                setShowSortDropdown(false);
                              }}
                              className="w-full px-3 py-1.5 text-left text-neutral-700 hover:bg-neutral-50 flex items-center justify-between"
                            >
                              <span>{sortOpt}</span>
                              {selectedSort === sortOpt && <Check className="w-3.5 h-3.5 text-black" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Announcements Feed Items */}
                <div className="divide-y divide-neutral-100">
                  {filteredAnnouncements.map((ann) => (
                    <div
                      key={ann.id}
                      className="py-5 flex items-start gap-4 hover:bg-neutral-50/50 p-2 rounded-2xl transition"
                    >
                      {/* Big Icon */}
                      <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center shrink-0 mt-0.5">
                        {getCategoryIcon(ann.category)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pr-2">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-bold text-neutral-900 leading-snug">
                            {ann.title}
                          </h3>
                          <span className="px-3 py-0.5 rounded-lg text-[11px] font-semibold bg-[#e2e8f0] text-neutral-700 shrink-0">
                            {ann.category}
                          </span>
                        </div>

                        <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                          {ann.body}
                        </p>

                        <div className="flex items-center gap-4 mt-2.5 text-[11px] text-neutral-400 font-medium">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-3.5 h-3.5" />
                            <span>{ann.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            <span>{ann.author}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Pagination */}
              <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500 mt-4">
                <p>Showing 1 to {filteredAnnouncements.length} of 12 announcements</p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-1 rounded-lg border border-neutral-200 text-neutral-400 hover:text-black hover:border-neutral-300 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="w-7 h-7 rounded-lg bg-neutral-300 text-neutral-900 font-bold text-xs"
                  >
                    1
                  </button>
                  <button
                    type="button"
                    className="w-7 h-7 rounded-lg hover:bg-neutral-100 text-neutral-600 font-medium text-xs cursor-pointer"
                  >
                    2
                  </button>
                  <button
                    type="button"
                    className="w-7 h-7 rounded-lg hover:bg-neutral-100 text-neutral-600 font-medium text-xs cursor-pointer"
                  >
                    3
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
                    className="p-1 rounded-lg border border-neutral-200 text-neutral-400 hover:text-black hover:border-neutral-300 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Announcement Overview & Categories (4 cols on lg) */}
            <div className="lg:col-span-4 space-y-5">
              {/* Card 1: Announcement Overview */}
              <div className="bg-white rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-neutral-200/80">
                <h3 className="text-xs sm:text-[13px] font-bold text-neutral-900 pb-3 border-b border-neutral-100">
                  Announcement Overview
                </h3>

                <div className="grid grid-cols-3 text-center py-4 divide-x divide-neutral-100">
                  <div>
                    <div className="flex items-center justify-center gap-1 text-[#0284c7]">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-2xl font-extrabold text-neutral-900">12</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-medium mt-1">Total</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-center gap-1 text-[#22c55e]">
                      <ListFilter className="w-4 h-4" />
                      <span className="text-2xl font-extrabold text-neutral-900">5</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-medium mt-1">Important</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-center gap-1 text-[#f59e0b]">
                      <Clock className="w-4 h-4" />
                      <span className="text-2xl font-extrabold text-neutral-900">3</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-medium mt-1">This Month</p>
                  </div>
                </div>
              </div>

              {/* Card 2: Categories */}
              <div className="bg-white rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-neutral-200/80">
                <h3 className="text-xs sm:text-[13px] font-bold text-neutral-900 pb-3 border-b border-neutral-100">
                  Categories
                </h3>

                <div className="py-2 space-y-1">
                  {categories.map((c) => {
                    const isSelected = selectedCategory === c.name;
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedCategory(c.name)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          isSelected
                            ? "bg-[#38bdf8] text-white shadow-sm"
                            : "text-neutral-800 hover:bg-neutral-50"
                        }`}
                      >
                        <span>{c.name}</span>
                        <span
                          className={`text-xs font-semibold ${
                            isSelected ? "text-white" : "text-neutral-500"
                          }`}
                        >
                          {c.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AnnouncementsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white p-6">Loading Announcements...</div>}>
      <AnnouncementsPageContent />
    </Suspense>
  );
}
