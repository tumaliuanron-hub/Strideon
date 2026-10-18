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
  Sparkles,
  CheckCircle2,
  Calendar as CalendarIcon,
  ListTodo,
  ExternalLink,
  ShieldCheck,
  Check,
  Menu,
  X
} from "lucide-react";

interface EmployeeInfo {
  name: string;
  role: string;
  email: string;
  id: string;
  avatar: string;
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Determine which employee is logged in
  const [employee, setEmployee] = useState<EmployeeInfo>({
    name: "Aaron Tumaliuan",
    role: "Graphic Designer",
    email: "aaron.tumaliuan@gmail.com",
    id: "EMP-2026-904",
    avatar: "/assets/avatar-aaron.png",
  });

  const [activeNav, setActiveNav] = useState("Dashboard");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Attendance Clock In / Out state
  const [timedIn, setTimedIn] = useState(true);
  const [timeOutVal, setTimeOutVal] = useState("--");

  // Task Status Update form state
  const [selectedTask, setSelectedTask] = useState("Design new landing page");
  const [taskStatus, setTaskStatus] = useState("In Progress");
  const [taskProgress, setTaskProgress] = useState(40);
  const [taskPriority, setTaskPriority] = useState("High");
  const [taskNotes, setTaskNotes] = useState("");
  const [taskUpdateFeedback, setTaskUpdateFeedback] = useState("");

  // Calendar month state
  const [currentMonth, setCurrentMonth] = useState("July 2026");

  useEffect(() => {
    const empParam = searchParams.get("empId") || "";
    const nameParam = searchParams.get("name") || "";
    const isRed =
      empParam.includes("815") ||
      empParam.toLowerCase().includes("red") ||
      nameParam.toLowerCase().includes("red") ||
      (typeof window !== "undefined" &&
        (localStorage.getItem("currentUserName")?.toLowerCase().includes("red") ||
          localStorage.getItem("activationName")?.toLowerCase().includes("red")));

    if (isRed) {
      // Guard: Red Reyes must be activated and verified before accessing the dashboard
      const isRedActivated =
        typeof window !== "undefined" &&
        localStorage.getItem("accountActivated_EMP-2026-815") === "true";

      if (!isRedActivated) {
        router.push(
          "/activate?empId=EMP-2026-815&name=Red%20Reyes&email=tumaliuanron@gmail.com&template=second"
        );
        return;
      }

      setEmployee({
        name: "Red Reyes",
        role: "Product Specialist",
        email: "tumaliuanron@gmail.com",
        id: empParam || "EMP-2026-815",
        avatar: "/assets/avatar-aaron.png",
      });
    } else {
      const storedName =
        nameParam ||
        (typeof window !== "undefined" &&
          (localStorage.getItem("currentUserName") || localStorage.getItem("activationName"))) ||
        "Aaron Tumaliuan";
      const storedRole =
        (typeof window !== "undefined" && localStorage.getItem("currentUserRole")) || "Graphic Designer";
      setEmployee({
        name: storedName,
        role: storedRole,
        email:
          (typeof window !== "undefined" && localStorage.getItem("currentUserEmail")) ||
          "aaron.tumaliuan@gmail.com",
        id: empParam || (typeof window !== "undefined" && localStorage.getItem("currentUserEmpId")) || "EMP-2026-904",
        avatar: "/assets/avatar-aaron.png",
      });
    }
  }, [searchParams, router]);

  const handleClockOut = () => {
    if (timeOutVal === "--") {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setTimeOutVal(timeStr);
    } else {
      setTimeOutVal("--");
    }
  };

  const handleUpdateTask = (e: React.FormEvent) => {
    e.preventDefault();
    setTaskUpdateFeedback("Task updated successfully!");
    setTimeout(() => setTaskUpdateFeedback(""), 3000);
  };

  const handleLogout = () => {
    router.push("/");
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Leave Requests", href: "/leave-requests", icon: CalendarX },
    { name: "My Tasks", href: "/tasks", icon: ClipboardList },
    { name: "Attendance", href: "/attendance", icon: CalendarDays },
    { name: "Profile", href: "/profile", icon: UserCircle },
    { name: "Announcements", href: "/announcements", icon: Megaphone },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  // Calendar matrix for July 2026
  // July 1, 2026 starts on Wednesday
  const calendarDays = [
    { day: 28, isCurrentMonth: false, status: "off" },
    { day: 29, isCurrentMonth: false, status: "present" },
    { day: 30, isCurrentMonth: false, status: "present" },
    { day: 1, isCurrentMonth: true, status: "present" },
    { day: 2, isCurrentMonth: true, status: "present" },
    { day: 3, isCurrentMonth: true, status: "late" },
    { day: 4, isCurrentMonth: true, status: "off" },
    { day: 5, isCurrentMonth: true, status: "off" },
    { day: 6, isCurrentMonth: true, status: "present" },
    { day: 7, isCurrentMonth: true, status: "present" },
    { day: 8, isCurrentMonth: true, status: "present" },
    { day: 9, isCurrentMonth: true, status: "absent" },
    { day: 10, isCurrentMonth: true, status: "present", isToday: true },
    { day: 11, isCurrentMonth: true, status: "off" },
    { day: 12, isCurrentMonth: true, status: "off" },
    { day: 13, isCurrentMonth: true, status: "present" },
    { day: 14, isCurrentMonth: true, status: "present" },
    { day: 15, isCurrentMonth: true, status: "present" },
    { day: 16, isCurrentMonth: true, status: "present" },
    { day: 17, isCurrentMonth: true, status: "present" },
    { day: 18, isCurrentMonth: true, status: "off" },
    { day: 19, isCurrentMonth: true, status: "off" },
    { day: 20, isCurrentMonth: true, status: "present" },
    { day: 21, isCurrentMonth: true, status: "present" },
    { day: 22, isCurrentMonth: true, status: "present" },
    { day: 23, isCurrentMonth: true, status: "present" },
    { day: 24, isCurrentMonth: true, status: "present" },
    { day: 25, isCurrentMonth: true, status: "off" },
    { day: 26, isCurrentMonth: true, status: "off" },
    { day: 27, isCurrentMonth: true, status: "present" },
    { day: 28, isCurrentMonth: true, status: "present" },
    { day: 29, isCurrentMonth: true, status: "present" },
    { day: 30, isCurrentMonth: true, status: "present" },
    { day: 31, isCurrentMonth: true, status: "present" },
    { day: 1, isCurrentMonth: false, status: "off" },
  ];

  return (
    <div className="min-h-screen w-full flex bg-[#f4f5f8] text-neutral-900 font-sans antialiased selection:bg-neutral-800 selection:text-white">
      {/* ======================================================== */}
      {/* LEFT SIDEBAR (PURE BLACK WITH STRIDEON BRANDING)         */}
      {/* ======================================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 sm:w-64 bg-black text-white flex flex-col justify-between py-6 px-4 transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Top: Strideon Brand Logo */}
          <div className="flex flex-col items-center pt-2 pb-8 border-b border-neutral-900">
            <div className="relative group cursor-pointer transition hover:scale-105">
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
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.name;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    setActiveNav(item.name);
                    setMobileMenuOpen(false);
                  }}
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

        {/* Sidebar Footer / Quick Logout */}
        <div className="pt-4 border-t border-neutral-900">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-400 hover:text-red-400 hover:bg-neutral-900/60 rounded-xl transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ======================================================== */}
      {/* MAIN VIEW AREA                                           */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* Top Header Card */}
        <header className="p-4 sm:p-6 pb-2">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-neutral-200/70 flex items-center justify-between">
            {/* Left: Title & Subtitle */}
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
                  Dashboard
                </p>
              </div>
            </div>

            {/* Right: Notifications & User Profile */}
            <div className="flex items-center gap-3 sm:gap-5">
              {/* Notification Bell */}
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
                    <p className="font-bold text-neutral-900 pb-2 border-b border-neutral-100">
                      Notifications
                    </p>
                    <div className="py-2 space-y-2">
                      <div className="p-2 bg-neutral-50 rounded-lg">
                        <p className="font-semibold text-neutral-900">Task Assigned</p>
                        <p className="text-[11px] text-neutral-500">Design new banner for promo due July 10.</p>
                      </div>
                      <div className="p-2 bg-emerald-50 rounded-lg">
                        <p className="font-semibold text-emerald-800">Leave Approved</p>
                        <p className="text-[11px] text-emerald-700">Sick leave for June 12 was approved.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2.5 p-1 sm:pr-2.5 rounded-full hover:bg-neutral-100 transition cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-neutral-200 shrink-0 bg-neutral-200">
                    <Image
                      src={employee.avatar}
                      alt={employee.name}
                      width={36}
                      height={36}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="hidden sm:block text-left leading-tight">
                    <p className="text-xs font-bold text-neutral-900">{employee.name}</p>
                    <p className="text-[10px] text-neutral-400 font-medium">{employee.role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400 hidden sm:block" />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-neutral-200 py-1.5 z-50 text-xs animate-fadeIn">
                    <div className="px-3.5 py-2.5 border-b border-neutral-100 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-neutral-200 shrink-0 bg-neutral-100">
                        <Image
                          src={employee.avatar}
                          alt={employee.name}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="leading-tight overflow-hidden">
                        <p className="font-bold text-neutral-900 truncate">{employee.name}</p>
                        <p className="text-[11px] text-neutral-400 truncate">{employee.email}</p>
                        <p className="text-[10px] font-mono text-neutral-400 mt-0.5">{employee.id}</p>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-3.5 py-2 text-neutral-700 hover:bg-neutral-50"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-3.5 py-2 text-neutral-700 hover:bg-neutral-50"
                    >
                      Account Settings
                    </Link>
                    <div className="border-t border-neutral-100 my-1" />
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-3.5 py-2 text-red-600 hover:bg-red-50 flex items-center gap-1.5 font-medium"
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

        {/* Dashboard Grid Content */}
        <main className="flex-1 p-4 sm:p-6 pt-2 space-y-6">
          {/* ======================================================== */}
          {/* ROW 1: LEAVE REQUESTS | ASSIGNED TASK | ANNOUNCEMENT     */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. LEAVE REQUESTS CARD */}
            <div className="bg-white rounded-[24px] sm:rounded-[28px] p-5 shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-neutral-200/80 flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-600">
                      <CalendarX className="w-3.5 h-3.5" />
                    </div>
                    <h2 className="text-xs sm:text-[13px] font-bold text-neutral-800">
                      Leave Requests
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveNav("Leave Requests")}
                    className="text-[11px] font-medium text-neutral-500 hover:text-black hover:underline cursor-pointer"
                  >
                    View all
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 text-center py-4 border-b border-neutral-100">
                  <div>
                    <p className="text-2xl font-bold text-[#0284c7]">2</p>
                    <p className="text-[11px] font-medium text-neutral-500 mt-0.5">Pending</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#16a34a]">1</p>
                    <p className="text-[11px] font-medium text-neutral-500 mt-0.5">Approved</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#dc2626]">1</p>
                    <p className="text-[11px] font-medium text-neutral-500 mt-0.5">Rejected</p>
                  </div>
                </div>

                {/* Items List */}
                <div className="py-3.5 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xs sm:text-[13px] text-neutral-900">
                        July 21 - 24, 2026
                      </p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Vacation Leave</p>
                    </div>
                    <span className="px-3 py-1 rounded-lg text-xs font-medium bg-[#fff3cd] text-[#997404] border border-[#ffeeba] shadow-sm">
                      Pending
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xs sm:text-[13px] text-neutral-900">
                        June 12, 2026
                      </p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Sick Leave</p>
                    </div>
                    <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#22c55e] text-white shadow-sm shadow-emerald-500/20">
                      Approved
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Button */}
              <Link
                href="/leave-requests"
                className="w-full mt-3 py-2.5 px-3 bg-[#e2e8f0]/70 hover:bg-[#cbd5e1] text-neutral-700 text-xs font-medium rounded-xl flex items-center justify-between transition cursor-pointer"
              >
                <span className="mx-auto pl-4">Go to Leave Requests</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
              </Link>
            </div>

            {/* 2. ASSIGNED TASK CARD */}
            <div className="bg-white rounded-[24px] sm:rounded-[28px] p-5 shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-neutral-200/80 flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-600">
                      <ClipboardList className="w-3.5 h-3.5" />
                    </div>
                    <h2 className="text-xs sm:text-[13px] font-bold text-neutral-800">
                      Assigned Task
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveNav("My Tasks")}
                    className="text-[11px] font-medium text-neutral-500 hover:text-black hover:underline cursor-pointer"
                  >
                    View all
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 text-center py-4 border-b border-neutral-100">
                  <div>
                    <p className="text-2xl font-bold text-[#0284c7]">13</p>
                    <p className="text-[11px] font-medium text-neutral-500 mt-0.5">Total Task</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#d97706]">5</p>
                    <p className="text-[11px] font-medium text-neutral-500 mt-0.5">In Progress</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#16a34a]">8</p>
                    <p className="text-[11px] font-medium text-neutral-500 mt-0.5">To Do</p>
                  </div>
                </div>

                {/* Task Items */}
                <div className="py-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xs text-neutral-900">
                        Design new banner for promo
                      </p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Due July 10, 2026</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#fef3c7] text-[#92400e] border border-[#fde68a] shadow-sm">
                      In Progress
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xs text-neutral-900">
                        Create mock up for shirt design
                      </p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Due July 12, 2026</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#e2e8f0] text-neutral-600">
                      To do
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xs text-neutral-900">
                        Update product photo on website
                      </p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Due July 15, 2026</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#e2e8f0] text-neutral-600">
                      To do
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Button */}
              <Link
                href="/tasks"
                className="w-full mt-3 py-2.5 px-3 bg-[#e2e8f0]/70 hover:bg-[#cbd5e1] text-neutral-700 text-xs font-medium rounded-xl flex items-center justify-between transition cursor-pointer"
              >
                <span className="mx-auto pl-4">Go to My Tasks</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
              </Link>
            </div>

            {/* 3. ANNOUNCEMENT CARD */}
            <div className="bg-white rounded-[24px] sm:rounded-[28px] p-5 shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-neutral-200/80 flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-600">
                      <Megaphone className="w-3.5 h-3.5" />
                    </div>
                    <h2 className="text-xs sm:text-[13px] font-bold text-neutral-800">
                      Announcement
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveNav("Announcements")}
                    className="text-[11px] font-medium text-neutral-500 hover:text-black hover:underline cursor-pointer"
                  >
                    View all
                  </button>
                </div>

                {/* Announcement Items */}
                <div className="py-2.5 space-y-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                      <h3 className="font-bold text-xs text-neutral-900">
                        Company Team Building
                      </h3>
                    </div>
                    <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed pl-3">
                      Join us for our Team Building Activity on July 20, 2026 at Camp Harmony.
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-1 pl-3 font-medium">
                      June 30, 2026
                    </p>
                  </div>

                  <div className="border-t border-neutral-100 pt-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                      <h3 className="font-bold text-xs text-neutral-900">
                        New Office Hours
                      </h3>
                    </div>
                    <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed pl-3">
                      Starting August 1, our new office hours will be 9:00 AM - 6:00 PM, Monday to Friday.
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-1 pl-3 font-medium">
                      July 7, 2026
                    </p>
                  </div>

                  <div className="border-t border-neutral-100 pt-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                      <h3 className="font-bold text-xs text-neutral-900">
                        Design Contest
                      </h3>
                    </div>
                    <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed pl-3">
                      We&apos;re having a design contest! Submit your entries by August 9, 2026.
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-1 pl-3 font-medium">
                      June 29, 2026
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Button */}
              <Link
                href="/announcements"
                className="w-full mt-3 py-2.5 px-3 bg-[#e2e8f0]/70 hover:bg-[#cbd5e1] text-neutral-700 text-xs font-medium rounded-xl flex items-center justify-between transition cursor-pointer"
              >
                <span className="mx-auto pl-4">Go to Announcements</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
              </Link>
            </div>
          </div>

          {/* ======================================================== */}
          {/* ROW 2: ATTENDANCE (WIDE) | TASK STATUS UPDATE            */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* 4. ATTENDANCE CARD (SPANS 2 COLUMNS ON DESKTOP) */}
            <div className="lg:col-span-2 bg-white rounded-[24px] sm:rounded-[28px] p-5 shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-neutral-200/80 flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-600">
                      <CalendarDays className="w-3.5 h-3.5" />
                    </div>
                    <h2 className="text-xs sm:text-[13px] font-bold text-neutral-800">
                      Attendance
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveNav("Attendance")}
                    className="text-[11px] font-medium text-neutral-500 hover:text-black hover:underline cursor-pointer"
                  >
                    View all
                  </button>
                </div>

                {/* Split Content: Calendar on left, Today's details on right */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  {/* Left: Mini Calendar */}
                  <div className="bg-neutral-50/70 p-3 sm:p-4 rounded-2xl border border-neutral-200/60">
                    {/* Month Header with controls */}
                    <div className="flex items-center justify-between mb-3 px-1">
                      <button
                        type="button"
                        onClick={() => setCurrentMonth("June 2026")}
                        className="p-1 hover:bg-neutral-200 rounded-md transition cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4 text-neutral-600" />
                      </button>
                      <span className="font-bold text-xs sm:text-sm text-neutral-800">
                        {currentMonth}
                      </span>
                      <button
                        type="button"
                        onClick={() => setCurrentMonth("August 2026")}
                        className="p-1 hover:bg-neutral-200 rounded-md transition cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4 text-neutral-600" />
                      </button>
                    </div>

                    {/* Weekday Labels */}
                    <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-neutral-400 mb-1.5">
                      <span>Sun</span>
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 text-center text-xs gap-y-1.5">
                      {calendarDays.slice(0, 35).map((d, idx) => (
                        <div key={idx} className="flex justify-center items-center">
                          <span
                            className={`w-6 h-6 flex items-center justify-center rounded-full text-[11px] font-medium ${
                              d.isToday
                                ? "bg-[#0284c7] text-white font-bold shadow-sm"
                                : d.isCurrentMonth
                                ? "text-neutral-800"
                                : "text-neutral-300"
                            }`}
                          >
                            {d.day}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-4 pt-3 border-t border-neutral-200/60 text-[10px] text-neutral-600">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                        <span>Present</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                        <span>Late</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
                        <span>Absent</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-neutral-400" />
                        <span>Weekly Off</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Today's Time In / Out details */}
                  <div className="bg-neutral-50/70 p-4 rounded-2xl border border-neutral-200/60 flex flex-col justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                        TODAY JULY, 10 2026
                      </p>

                      <div className="mt-4">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-neutral-500 font-medium">Time In</p>
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#22c55e] text-white shadow-sm">
                            On Time
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2 mt-1">
                          <p className="text-xl sm:text-2xl font-extrabold text-neutral-900">
                            8:00 AM
                          </p>
                          <span className="text-xs text-[#22c55e] font-semibold">On Time</span>
                        </div>
                      </div>

                      <div className="border-t border-neutral-200/60 my-4 pt-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-neutral-500 font-medium">Time Out</p>
                          <button
                            type="button"
                            onClick={handleClockOut}
                            className="text-[11px] font-medium text-sky-600 hover:underline cursor-pointer"
                          >
                            {timeOutVal === "--" ? "Clock Out Now" : "Reset"}
                          </button>
                        </div>
                        <p className="text-xl sm:text-2xl font-extrabold text-neutral-900 mt-1">
                          {timeOutVal}
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/attendance"
                      className="w-full py-2.5 px-3 bg-[#e2e8f0]/80 hover:bg-[#cbd5e1] text-neutral-700 text-xs font-medium rounded-xl flex items-center justify-between transition cursor-pointer mt-3"
                    >
                      <span className="mx-auto pl-4">View attendance record</span>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. TASK STATUS UPDATE CARD */}
            <div className="bg-white rounded-[24px] sm:rounded-[28px] p-5 shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-neutral-200/80 flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                  <div className="w-6 h-6 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-600">
                    <ListTodo className="w-3.5 h-3.5" />
                  </div>
                  <h2 className="text-xs sm:text-[13px] font-bold text-neutral-800">
                    Task Status Update
                  </h2>
                </div>

                {taskUpdateFeedback && (
                  <div className="mt-2.5 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-1.5 animate-fadeIn">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{taskUpdateFeedback}</span>
                  </div>
                )}

                {/* Form Fields */}
                <form onSubmit={handleUpdateTask} className="py-3 space-y-3">
                  {/* Task Dropdown */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Task
                    </label>
                    <select
                      value={selectedTask}
                      onChange={(e) => setSelectedTask(e.target.value)}
                      className="w-full text-xs rounded-xl border border-neutral-300 bg-white p-2.5 text-neutral-800 focus:border-black outline-none transition"
                    >
                      <option value="Design new landing page">Design new landing page</option>
                      <option value="Design new banner for promo">Design new banner for promo</option>
                      <option value="Create mock up for shirt design">Create mock up for shirt design</option>
                      <option value="Update product photo on website">Update product photo on website</option>
                    </select>
                  </div>

                  {/* Status Dropdown */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Status
                    </label>
                    <select
                      value={taskStatus}
                      onChange={(e) => setTaskStatus(e.target.value)}
                      className="w-full text-xs rounded-xl border border-neutral-300 bg-white p-2.5 text-neutral-800 focus:border-black outline-none transition"
                    >
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="To Do">To Do</option>
                    </select>
                  </div>

                  {/* Progress Slider / Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-neutral-700">Progress</label>
                      <span className="text-xs font-bold text-neutral-800">{taskProgress}%</span>
                    </div>
                    <div className="w-full bg-neutral-100 rounded-full h-2.5 overflow-hidden border border-neutral-200">
                      <div
                        className="bg-[#f59e0b] h-full rounded-full transition-all duration-300"
                        style={{ width: `${taskProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Priority Tag */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="text-xs font-semibold text-neutral-700">Priority</label>
                    <button
                      type="button"
                      onClick={() =>
                        setTaskPriority((prev) =>
                          prev === "High" ? "Medium" : prev === "Medium" ? "Low" : "High"
                        )
                      }
                      className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#ff5a66] text-white shadow-sm hover:opacity-90 transition cursor-pointer"
                    >
                      {taskPriority}
                    </button>
                  </div>

                  {/* Notes Field */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={taskNotes}
                      onChange={(e) => setTaskNotes(e.target.value)}
                      rows={2}
                      placeholder="Add brief task note..."
                      className="w-full text-xs rounded-xl border border-neutral-300 bg-white p-2 text-neutral-800 focus:border-black outline-none transition resize-none"
                    />
                  </div>

                  {/* Update Button */}
                  <button
                    type="submit"
                    className="w-full py-2.5 px-3 bg-[#e2e8f0]/90 hover:bg-neutral-800 hover:text-white text-neutral-700 text-xs font-medium rounded-xl transition duration-150 cursor-pointer mt-1"
                  >
                    Go to Update Tasks
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center text-white text-sm">
          Loading Strideon Dashboard...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
