"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
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
  Check,
  X as XIcon,
  LineChart,
  ArrowUp,
  ArrowDown,
  Search,
  Menu,
  Timer
} from "lucide-react";

interface EmployeeInfo {
  name: string;
  role: string;
  email: string;
  id: string;
  avatar: string;
}

interface AttendanceRecord {
  id: string;
  date: string;
  day: string;
  timeIn: string;
  timeOut: string;
  workingHours: string;
  breakTime: string;
  status: "Present" | "Late (15mins)" | "Late (10mins)" | "Late (5mins)" | "Absent" | string;
}

const ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id: "rec-1",
    date: "July 10, 2026",
    day: "Friday",
    timeIn: "8:00 AM",
    timeOut: "5:00 PM",
    workingHours: "9 hrs",
    breakTime: "1 hr",
    status: "Present",
  },
  {
    id: "rec-2",
    date: "July 9, 2026",
    day: "Thursday",
    timeIn: "8:15 AM",
    timeOut: "5:05 PM",
    workingHours: "8 hrs 50 mins",
    breakTime: "1 hr",
    status: "Late (15mins)",
  },
  {
    id: "rec-3",
    date: "July 8, 2026",
    day: "Wednesday",
    timeIn: "8:00 AM",
    timeOut: "5:00 PM",
    workingHours: "9 hrs",
    breakTime: "1 hr",
    status: "Present",
  },
  {
    id: "rec-4",
    date: "July 7, 2026",
    day: "Tuesday",
    timeIn: "8:05 AM",
    timeOut: "5:00 PM",
    workingHours: "8 hrs 55 mins",
    breakTime: "1 hr",
    status: "Late (5mins)",
  },
  {
    id: "rec-5",
    date: "July 6, 2026",
    day: "Monday",
    timeIn: "8:00 AM",
    timeOut: "5:00 PM",
    workingHours: "9 hrs",
    breakTime: "1 hr",
    status: "Present",
  },
  {
    id: "rec-6",
    date: "July 3, 2026",
    day: "Friday",
    timeIn: "8:01 AM",
    timeOut: "5:00 PM",
    workingHours: "8 hrs 59 mins",
    breakTime: "1 hr",
    status: "Present",
  },
  {
    id: "rec-7",
    date: "July 2, 2026",
    day: "Thursday",
    timeIn: "8:10 AM",
    timeOut: "5:00 PM",
    workingHours: "8 hrs 50 mins",
    breakTime: "1 hr",
    status: "Late (10mins)",
  },
  {
    id: "rec-8",
    date: "July 1, 2026",
    day: "Wednesday",
    timeIn: "---",
    timeOut: "---",
    workingHours: "No record",
    breakTime: "---",
    status: "Absent",
  },
  {
    id: "rec-9",
    date: "July 13, 2026",
    day: "Monday",
    timeIn: "7:59 AM",
    timeOut: "5:00 PM",
    workingHours: "9 hrs 1 min",
    breakTime: "1 hr",
    status: "Present",
  },
  {
    id: "rec-10",
    date: "July 14, 2026",
    day: "Tuesday",
    timeIn: "8:00 AM",
    timeOut: "5:04 PM",
    workingHours: "9 hrs 4 mins",
    breakTime: "1 hr",
    status: "Present",
  },
  {
    id: "rec-11",
    date: "July 15, 2026",
    day: "Wednesday",
    timeIn: "7:58 AM",
    timeOut: "5:00 PM",
    workingHours: "9 hrs 2 mins",
    breakTime: "1 hr",
    status: "Present",
  },
];

function AttendancePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // User details
  const [employee, setEmployee] = useState<EmployeeInfo>({
    name: "Aaron Tumaliuan",
    role: "Graphic Designer",
    email: "aaron.tumaliuan@gmail.com",
    id: "EMP-2026-904",
    avatar: "/assets/avatar-aaron.png",
  });

  const [records, setRecords] = useState<AttendanceRecord[]>(ATTENDANCE_RECORDS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Dynamic Calendar Navigation & Selection States
  const [calDate, setCalDate] = useState<Date>(new Date(2026, 6, 10)); // July 10, 2026
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedMonthRecord, setSelectedMonthRecord] = useState("July 2026");

  // Pagination for Attendance Records table
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        email: "aaron.tumaliuan@gmail.com",
        id: empParam || (typeof window !== "undefined" && localStorage.getItem("currentUserEmpId")) || "EMP-2026-904",
        avatar: "/assets/avatar-aaron.png",
      });
    }
  }, [searchParams]);

  // Dynamic Calendar Calculation
  const calendarMonthLabel = useMemo(() => {
    return calDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }, [calDate]);

  const handlePrevMonth = () => {
    setCalDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleGoToToday = () => {
    const today = new Date(2026, 6, 10);
    setCalDate(today);
    setSelectedDate("July 10, 2026");
    setCurrentPage(1);
  };

  interface CalendarCell {
    day: number;
    month: number;
    year: number;
    dateStr: string;
    isCurrentMonth: boolean;
    isToday: boolean;
    record?: AttendanceRecord;
  }

  const calendarGrid = useMemo<CalendarCell[]>(() => {
    const year = calDate.getFullYear();
    const month = calDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const cells: CalendarCell[] = [];

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i;
      const prevDate = new Date(year, month - 1, dayNum);
      const dateStr = prevDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      const record = records.find((r) => r.date === dateStr);
      cells.push({
        day: dayNum,
        month: prevDate.getMonth(),
        year: prevDate.getFullYear(),
        dateStr,
        isCurrentMonth: false,
        isToday: false,
        record,
      });
    }

    // Current month days
    for (let i = 1; i <= lastDayOfMonth; i++) {
      const curDate = new Date(year, month, i);
      const dateStr = curDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      const record = records.find((r) => r.date === dateStr);
      const isToday = year === 2026 && month === 6 && i === 10;
      cells.push({
        day: i,
        month,
        year,
        dateStr,
        isCurrentMonth: true,
        isToday,
        record,
      });
    }

    // Next month padding to reach 35 or 42 cells
    const remainingCells = (7 - (cells.length % 7)) % 7;
    const targetTotal = cells.length + remainingCells < 35 ? 35 : cells.length + remainingCells;
    const nextDaysNeeded = targetTotal - cells.length;

    for (let i = 1; i <= nextDaysNeeded; i++) {
      const nextDate = new Date(year, month + 1, i);
      const dateStr = nextDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      const record = records.find((r) => r.date === dateStr);
      cells.push({
        day: i,
        month: nextDate.getMonth(),
        year: nextDate.getFullYear(),
        dateStr,
        isCurrentMonth: false,
        isToday: false,
        record,
      });
    }

    return cells;
  }, [calDate, records]);

  // Selected day record info
  const selectedDayRecord = useMemo(() => {
    if (!selectedDate) return null;
    return records.find((r) => r.date === selectedDate) || null;
  }, [selectedDate, records]);

  // Filtered records based on selected date, status, search, and month
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // 1. If calendar date is selected, prioritize it
      if (selectedDate && r.date !== selectedDate) {
        return false;
      }
      // 2. Month dropdown filter (only if specific day not selected)
      if (!selectedDate && selectedMonthRecord && selectedMonthRecord !== "All") {
        if (!r.date.includes(selectedMonthRecord)) {
          return false;
        }
      }
      // 3. Status filter
      if (statusFilter !== "All" && !r.status.toLowerCase().includes(statusFilter.toLowerCase())) {
        return false;
      }
      // 4. Search input
      if (searchTerm.trim() !== "") {
        const query = searchTerm.toLowerCase();
        const matches =
          r.date.toLowerCase().includes(query) ||
          r.day.toLowerCase().includes(query) ||
          r.status.toLowerCase().includes(query) ||
          r.timeIn.toLowerCase().includes(query) ||
          r.timeOut.toLowerCase().includes(query);
        if (!matches) return false;
      }
      return true;
    });
  }, [records, selectedDate, selectedMonthRecord, statusFilter, searchTerm]);

  // Table pagination
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / itemsPerPage));
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage, itemsPerPage]);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Leave Requests", href: "/leave-requests", icon: CalendarX },
    { name: "My Tasks", href: "/tasks", icon: ClipboardList },
    { name: "Attendance", href: "/attendance", icon: CalendarDays, active: true },
    { name: "Profile", href: "/profile", icon: UserCircle },
    { name: "Announcements", href: "/announcements", icon: Megaphone },
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
                  Attendance
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
                      <div className="p-2 bg-emerald-50 rounded-lg">
                        <p className="font-semibold text-emerald-800">Attendance Logged</p>
                        <p className="text-[11px] text-emerald-700">Clocked in at 8:00 AM on time.</p>
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

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 pt-2 space-y-6">
          {/* ======================================================== */}
          {/* ROW 1: 4 STATS CARDS                                     */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Present Days */}
            <div className="bg-white rounded-[24px] sm:rounded-[28px] p-5 shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-neutral-200/80 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#22c55e] flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
                <Check className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900">7</span>
                  <span className="text-xs font-semibold text-neutral-500">Days</span>
                </div>
                <p className="text-xs font-bold text-neutral-800 mt-0.5">Present Days</p>
                <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5 mt-0.5">
                  <ArrowUp className="w-3 h-3" />
                  <span>2 from last month</span>
                </p>
              </div>
            </div>

            {/* 2. Late Days */}
            <div className="bg-white rounded-[24px] sm:rounded-[28px] p-5 shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-neutral-200/80 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#f59e0b] flex items-center justify-center text-white shadow-md shadow-amber-500/20 shrink-0">
                <Clock className="w-7 h-7 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900">3</span>
                  <span className="text-xs font-semibold text-neutral-500">Days</span>
                </div>
                <p className="text-xs font-bold text-neutral-800 mt-0.5">Late Days</p>
                <p className="text-[11px] text-red-500 font-medium flex items-center gap-0.5 mt-0.5">
                  <ArrowDown className="w-3 h-3" />
                  <span>1 from last month</span>
                </p>
              </div>
            </div>

            {/* 3. Absent Days */}
            <div className="bg-white rounded-[24px] sm:rounded-[28px] p-5 shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-neutral-200/80 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#ef4444] flex items-center justify-center text-white shadow-md shadow-red-500/20 shrink-0">
                <XIcon className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900">1</span>
                  <span className="text-xs font-semibold text-neutral-500">Day</span>
                </div>
                <p className="text-xs font-bold text-neutral-800 mt-0.5">Absent Days</p>
                <p className="text-[11px] text-neutral-400 font-medium mt-0.5">No change</p>
              </div>
            </div>

            {/* 4. Attendance Rate */}
            <div className="bg-white rounded-[24px] sm:rounded-[28px] p-5 shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-neutral-200/80 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#3b82f6] flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
                <LineChart className="w-7 h-7 stroke-[2]" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900">96%</p>
                <p className="text-xs font-bold text-neutral-800 mt-0.5">Attendance Rate</p>
                <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5 mt-0.5">
                  <ArrowUp className="w-3 h-3" />
                  <span>4% from last month</span>
                </p>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* ROW 2: TODAY'S ATTENDANCE | CALENDAR | TODAY'S SCHEDULE  */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. Today's Attendance */}
            <div className="bg-white rounded-[24px] sm:rounded-[28px] p-5 shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-neutral-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <h3 className="text-xs sm:text-[13px] font-bold text-neutral-900">
                    Today&apos;s Attendance
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#22c55e] text-white">
                      Present
                    </span>
                    <span className="text-[11px] text-neutral-400 font-medium">
                      July 10, 2026 (Friday)
                    </span>
                  </div>
                </div>

                {/* 2x2 metrics grid with distinct colored icons */}
                <div className="grid grid-cols-2 gap-4 py-5">
                  {/* Time In */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ffedd5] flex items-center justify-center text-[#f97316]">
                      <Clock className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div>
                      <p className="text-[11px] text-neutral-400 font-medium">Time In</p>
                      <p className="text-sm sm:text-base font-extrabold text-neutral-900">8:00 Am</p>
                    </div>
                  </div>

                  {/* Time Out */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#ffedd5] flex items-center justify-center text-[#f97316]">
                      <Clock className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div>
                      <p className="text-[11px] text-neutral-400 font-medium">Time Out</p>
                      <p className="text-sm sm:text-base font-extrabold text-neutral-900">5:00 Pm</p>
                    </div>
                  </div>

                  {/* Working hours */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#cffafe] flex items-center justify-center text-[#06b6d4]">
                      <Timer className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div>
                      <p className="text-[11px] text-neutral-400 font-medium">Working hours</p>
                      <p className="text-sm sm:text-base font-extrabold text-neutral-900">9 hours</p>
                    </div>
                  </div>

                  {/* Break time */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#fef9c3] flex items-center justify-center text-[#ca8a04]">
                      <Clock className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div>
                      <p className="text-[11px] text-neutral-400 font-medium">Break time</p>
                      <p className="text-sm sm:text-base font-extrabold text-neutral-900">1 hour</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Attendance Calendar */}
            <div className="bg-white rounded-[24px] sm:rounded-[28px] p-5 shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-neutral-200/80">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-[13px] font-bold text-neutral-900">
                    Attendance Calendar
                  </h3>
                  {selectedDate && (
                    <span className="text-[10px] font-semibold bg-sky-50 text-[#0284c7] px-2 py-0.5 rounded-full border border-sky-200">
                      Day Selected
                    </span>
                  )}
                </div>
                {selectedDate && (
                  <button
                    type="button"
                    onClick={() => setSelectedDate(null)}
                    className="text-[11px] font-medium text-neutral-500 hover:text-black cursor-pointer underline"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Month Header */}
              <div className="flex items-center justify-between mt-3 mb-2 px-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  aria-label="Previous month"
                  className="p-1 hover:bg-neutral-100 rounded-md transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-neutral-600" />
                </button>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-neutral-800">{calendarMonthLabel}</span>
                  <button
                    type="button"
                    onClick={handleGoToToday}
                    title="Jump to July 2026"
                    className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold cursor-pointer transition"
                  >
                    Today
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  aria-label="Next month"
                  className="p-1 hover:bg-neutral-100 rounded-md transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 text-neutral-600" />
                </button>
              </div>

              {/* Weekdays */}
              <div className="grid grid-cols-7 text-center text-[10px] font-semibold text-neutral-400 mb-1.5">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-7 text-center text-xs gap-y-1">
                {calendarGrid.map((cell, idx) => {
                  const isSelected = selectedDate === cell.dateStr;
                  const hasRecord = !!cell.record;
                  const status = cell.record?.status;

                  return (
                    <div key={idx} className="flex flex-col justify-center items-center py-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedDate === cell.dateStr) {
                            setSelectedDate(null);
                          } else {
                            setSelectedDate(cell.dateStr);
                            setCurrentPage(1);
                          }
                        }}
                        className={`w-7 h-7 flex flex-col items-center justify-center rounded-full text-[11px] font-medium transition cursor-pointer relative ${
                          cell.isToday
                            ? "bg-[#0284c7] text-white font-bold shadow-sm"
                            : isSelected
                            ? "ring-2 ring-neutral-900 bg-neutral-100 font-bold text-neutral-900"
                            : cell.isCurrentMonth
                            ? "text-neutral-800 hover:bg-neutral-100"
                            : "text-neutral-300 hover:text-neutral-500"
                        }`}
                        title={`${cell.dateStr}${
                          cell.record
                            ? ` - ${cell.record.status} (${cell.record.timeIn} - ${cell.record.timeOut})`
                            : " (No record)"
                        }`}
                      >
                        <span className="leading-none">{cell.day}</span>
                        {/* Attendance status dot */}
                        {hasRecord && (
                          <span
                            className={`w-1 h-1 rounded-full absolute bottom-0.5 ${
                              cell.isToday
                                ? "bg-white"
                                : status === "Present"
                                ? "bg-emerald-500"
                                : status?.includes("Late")
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                          />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Status Legend */}
              <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-500">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Present</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Late</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>Absent</span>
                </div>
              </div>

              {/* Selected Day Inspector Card */}
              {selectedDate && (
                <div className="mt-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-200/80 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900">{selectedDate}</span>
                    {selectedDayRecord ? (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          selectedDayRecord.status === "Present"
                            ? "bg-emerald-100 text-emerald-800"
                            : selectedDayRecord.status.includes("Late")
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {selectedDayRecord.status}
                      </span>
                    ) : (
                      <span className="text-[10px] text-neutral-400 font-medium bg-neutral-200/70 px-2 py-0.5 rounded-full">
                        No record
                      </span>
                    )}
                  </div>
                  {selectedDayRecord ? (
                    <div className="grid grid-cols-3 gap-1 mt-2.5 text-[11px] text-neutral-600 bg-white p-2 rounded-xl border border-neutral-100">
                      <div>
                        <span className="text-[10px] text-neutral-400 block">Time In</span>
                        <span className="font-semibold text-neutral-800">{selectedDayRecord.timeIn}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 block">Time Out</span>
                        <span className="font-semibold text-neutral-800">{selectedDayRecord.timeOut}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 block">Hours</span>
                        <span className="font-semibold text-neutral-800">{selectedDayRecord.workingHours}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-neutral-500 mt-1.5">
                      No attendance record logged for this day (weekend or non-working day).
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 3. Today's Schedule */}
            <div className="bg-white rounded-[24px] sm:rounded-[28px] p-5 shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-neutral-200/80">
              <h3 className="text-xs sm:text-[13px] font-bold text-neutral-900 pb-3 border-b border-neutral-100">
                Today&apos;s Schedule
              </h3>

              {/* Stepper timeline */}
              <div className="py-4 pl-1 space-y-4 relative">
                {/* Connecting line */}
                <div className="absolute left-[78px] top-6 bottom-6 w-0.5 bg-neutral-200" />

                {/* 1. Time In */}
                <div className="flex items-center gap-4 relative z-10">
                  <span className="w-14 text-[11px] font-semibold text-neutral-500">08:00 AM</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] ring-4 ring-emerald-50" />
                  <div className="pl-1">
                    <p className="text-xs font-bold text-neutral-900 leading-tight">Time In</p>
                    <p className="text-[10px] text-neutral-400">8:00 AM</p>
                  </div>
                </div>

                {/* 2. Lunch Break */}
                <div className="flex items-center gap-4 relative z-10">
                  <span className="w-14 text-[11px] font-semibold text-neutral-500">12:00 PM</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] ring-4 ring-amber-50" />
                  <div className="pl-1">
                    <p className="text-xs font-bold text-neutral-900 leading-tight">Lunch Break</p>
                    <p className="text-[10px] text-neutral-400">12:00 PM</p>
                  </div>
                </div>

                {/* 3. Back to Work */}
                <div className="flex items-center gap-4 relative z-10">
                  <span className="w-14 text-[11px] font-semibold text-neutral-500">01:00 PM</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] ring-4 ring-amber-50" />
                  <div className="pl-1">
                    <p className="text-xs font-bold text-neutral-900 leading-tight">Back to Work</p>
                    <p className="text-[10px] text-neutral-400">1:00 PM</p>
                  </div>
                </div>

                {/* 4. Time Out */}
                <div className="flex items-center gap-4 relative z-10">
                  <span className="w-14 text-[11px] font-semibold text-neutral-500">05:00 PM</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] ring-4 ring-emerald-50" />
                  <div className="pl-1">
                    <p className="text-xs font-bold text-neutral-900 leading-tight">Time Out</p>
                    <p className="text-[10px] text-neutral-400">5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* ROW 3: ATTENDANCE RECORDS TABLE | THIS MONTH SUMMARY     */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* LEFT: Attendance Records (8 cols on lg) */}
            <div className="lg:col-span-8 bg-white rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-neutral-200/80 flex flex-col justify-between">
              <div>
                {/* Header & Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-base font-bold text-neutral-900">Attendance Records</h3>
                    {selectedDate && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 border border-sky-200 text-[#0284c7] text-xs font-semibold rounded-lg">
                        <span>Day: {selectedDate}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedDate(null)}
                          className="hover:text-black transition cursor-pointer"
                          title="Clear date filter"
                        >
                          <XIcon className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Month Picker */}
                    <div className="relative">
                      <select
                        value={selectedMonthRecord}
                        onChange={(e) => {
                          setSelectedMonthRecord(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded-xl px-3 py-1.5 pr-7 outline-none appearance-none hover:border-neutral-400 cursor-pointer"
                      >
                        <option value="All">All Months</option>
                        <option value="July 2026">July 2026</option>
                        <option value="June 2026">June 2026</option>
                        <option value="May 2026">May 2026</option>
                      </select>
                      <CalendarIcon className="w-3.5 h-3.5 text-neutral-500 absolute right-2 top-2.5 pointer-events-none" />
                    </div>

                    {/* Status filter */}
                    <div className="relative">
                      <select
                        value={statusFilter}
                        onChange={(e) => {
                          setStatusFilter(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded-xl px-3 py-1.5 pr-7 outline-none appearance-none hover:border-neutral-400 cursor-pointer"
                      >
                        <option value="All">All Status</option>
                        <option value="Present">Present</option>
                        <option value="Late">Late</option>
                        <option value="Absent">Absent</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2 top-2.5 pointer-events-none" />
                    </div>

                    {/* Search Input */}
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                        placeholder="Search records"
                        className="text-xs bg-white border border-neutral-300 rounded-xl pl-8 pr-3 py-1.5 outline-none focus:border-black w-36 sm:w-44"
                      />
                      <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Table Header Bar */}
                <div className="mt-4 bg-[#f1f3f6] rounded-xl px-4 py-2.5 grid grid-cols-12 text-[11px] font-bold text-neutral-600 tracking-wider">
                  <span className="col-span-2">Date</span>
                  <span className="col-span-2">Day</span>
                  <span className="col-span-2 text-center">Time In</span>
                  <span className="col-span-2 text-center">Time Out</span>
                  <span className="col-span-2 text-center">Working Hours</span>
                  <span className="col-span-1 text-center">Break</span>
                  <span className="col-span-1 text-right">Status</span>
                </div>

                {/* Table Records */}
                <div className="divide-y divide-neutral-100 text-xs">
                  {paginatedRecords.length > 0 ? (
                    paginatedRecords.map((r) => (
                      <div
                        key={r.id}
                        className="py-3 px-4 grid grid-cols-12 items-center hover:bg-neutral-50/70 transition"
                      >
                        <span className="col-span-2 font-medium text-neutral-900">{r.date}</span>
                        <span className="col-span-2 text-neutral-500">{r.day}</span>
                        <span className="col-span-2 text-center text-neutral-700">{r.timeIn}</span>
                        <span className="col-span-2 text-center text-neutral-700">{r.timeOut}</span>
                        <span className="col-span-2 text-center text-neutral-700">{r.workingHours}</span>
                        <span className="col-span-1 text-center text-neutral-500">{r.breakTime}</span>
                        <span className="col-span-1 text-right">
                          <span
                            className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              r.status === "Present"
                                ? "bg-emerald-100 text-emerald-800"
                                : r.status.includes("Late")
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {r.status}
                          </span>
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-neutral-400">
                      <p className="text-sm font-medium text-neutral-600">No attendance records found</p>
                      <p className="text-xs text-neutral-400 mt-1">
                        Try adjusting your search or clearing the active filters.
                      </p>
                      {(selectedDate || statusFilter !== "All" || searchTerm.trim() !== "") && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDate(null);
                            setStatusFilter("All");
                            setSearchTerm("");
                            setCurrentPage(1);
                          }}
                          className="mt-3 inline-flex items-center gap-1 text-xs text-[#0284c7] font-semibold hover:underline cursor-pointer"
                        >
                          Reset Filters
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Table Footer */}
              <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500 mt-4">
                <p>
                  Showing {filteredRecords.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredRecords.length)} of {filteredRecords.length}{" "}
                  attendance records
                </p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    aria-label="Previous page"
                    className="p-1 rounded-lg border border-neutral-200 text-neutral-400 hover:text-black hover:border-neutral-300 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 rounded-lg text-xs font-semibold cursor-pointer transition ${
                        currentPage === page
                          ? "bg-neutral-900 text-white"
                          : "hover:bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    aria-label="Next page"
                    className="p-1 rounded-lg border border-neutral-200 text-neutral-400 hover:text-black hover:border-neutral-300 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT: This Month Summary (4 cols on lg) */}
            <div className="lg:col-span-4 bg-white rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-neutral-200/80 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900 pb-3 border-b border-neutral-100">
                  This Month
                </h3>

                <div className="py-4 space-y-3.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 font-medium">Present Days</span>
                    <span className="font-bold text-neutral-900 text-sm">22</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 font-medium">Late Days</span>
                    <span className="font-bold text-neutral-900 text-sm">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 font-medium">Absent Days</span>
                    <span className="font-bold text-neutral-900 text-sm">1</span>
                  </div>
                </div>

                <div className="border-t border-neutral-100 pt-4 space-y-3.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 font-medium">Total Working Days</span>
                    <span className="font-bold text-neutral-900 text-sm">26</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 font-medium">Attendance Rate</span>
                    <span className="font-bold text-neutral-900 text-sm">96%</span>
                  </div>

                  {/* Green Progress bar */}
                  <div className="w-full bg-neutral-100 rounded-full h-3 overflow-hidden border border-neutral-200 mt-2">
                    <div
                      className="bg-[#22c55e] h-full rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: "96%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AttendancePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white p-6">Loading Attendance...</div>}>
      <AttendancePageContent />
    </Suspense>
  );
}
