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
  FileText,
  Palmtree,
  HeartPulse,
  Send,
  RotateCcw,
  Plus,
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

interface LeaveRequestItem {
  id: string;
  type: "Vacation Leave" | "Sick Leave" | "Personal Leave" | "Emergency Leave";
  dateRange: string;
  totalDays: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
}

const INITIAL_REQUESTS: LeaveRequestItem[] = [
  {
    id: "leave-1",
    type: "Vacation Leave",
    dateRange: "July 21 - 24, 2026",
    totalDays: "4 days",
    reason: "Family vacation",
    status: "Pending",
  },
  {
    id: "leave-2",
    type: "Sick Leave",
    dateRange: "June 12, 2026",
    totalDays: "1 day",
    reason: "Not feeling well",
    status: "Approved",
  },
  {
    id: "leave-3",
    type: "Personal Leave",
    dateRange: "May 15, 2026",
    totalDays: "1 day",
    reason: "Personal matters",
    status: "Rejected",
  },
];

function LeaveRequestsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Employee details
  const [employee, setEmployee] = useState<EmployeeInfo>({
    name: "Aaron Tumaliuan",
    role: "Graphic Designer",
    email: "aaron.tumaliuan@gmail.com",
    id: "EMP-2026-904",
    avatar: "/assets/avatar-aaron.png",
  });

  const [requests, setRequests] = useState<LeaveRequestItem[]>(INITIAL_REQUESTS);
  const [statusFilter, setStatusFilter] = useState("All");

  // Form fields
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalDays, setTotalDays] = useState(0);
  const [reason, setReason] = useState("");
  const [toastMessage, setToastMessage] = useState("");

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

  // Auto-calculate days when start and end dates are selected
  useEffect(() => {
    if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      const diffTime = e.getTime() - s.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setTotalDays(diffDays > 0 ? diffDays : 0);
    } else if (startDate) {
      setTotalDays(1);
    } else {
      setTotalDays(0);
    }
  }, [startDate, endDate]);

  const handleResetForm = () => {
    setLeaveType("");
    setStartDate("");
    setEndDate("");
    setTotalDays(0);
    setReason("");
  };

  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveType) {
      alert("Please select a leave type.");
      return;
    }
    if (!startDate) {
      alert("Please choose a start date.");
      return;
    }

    const formatDateRange = () => {
      if (!endDate || startDate === endDate) {
        return startDate;
      }
      return `${startDate} - ${endDate}`;
    };

    const newReq: LeaveRequestItem = {
      id: `leave-${Date.now()}`,
      type: (leaveType as any) || "Vacation Leave",
      dateRange: formatDateRange(),
      totalDays: `${totalDays || 1} day${totalDays > 1 ? "s" : ""}`,
      reason: reason.trim() || "Personal request",
      status: "Pending",
    };

    setRequests((prev) => [newReq, ...prev]);
    setToastMessage("Leave request submitted successfully!");
    setTimeout(() => setToastMessage(""), 3500);
    handleResetForm();
  };

  const filteredRequests = requests.filter((r) => {
    if (statusFilter === "All") return true;
    return r.status === statusFilter;
  });

  const getLeaveIcon = (type: string) => {
    switch (type) {
      case "Vacation Leave":
        return <Palmtree className="w-4 h-4 text-neutral-800" />;
      case "Sick Leave":
        return <HeartPulse className="w-4 h-4 text-neutral-800" />;
      default:
        return <UserCircle className="w-4 h-4 text-neutral-800" />;
    }
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Leave Requests", href: "/leave-requests", icon: CalendarX, active: true },
    { name: "My Tasks", href: "/tasks", icon: ClipboardList },
    { name: "Attendance", href: "/attendance", icon: CalendarDays },
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
                  Leave Request Status
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
                        <p className="font-semibold text-emerald-800">Leave Approved</p>
                        <p className="text-[11px] text-emerald-700">Sick leave for June 12 was approved.</p>
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

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 pt-2 space-y-6">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed top-6 right-6 z-50 p-3.5 rounded-2xl bg-emerald-600 text-white text-xs font-semibold shadow-xl flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* TOP CARD: CREATE LEAVE REQUEST                           */}
          {/* ======================================================== */}
          <div className="bg-white rounded-[24px] sm:rounded-[28px] p-6 shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-neutral-200/80">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700">
                  <FileText className="w-4 h-4 stroke-[2]" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-neutral-900">
                    Create Leave Request
                  </h2>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Fill out the form below to submit a new leave request
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetForm}
                className="self-start sm:self-auto px-3.5 py-1.5 bg-[#9ca3af] hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Leave Request</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitLeave} className="mt-5 space-y-4">
              {/* Row 1: Leave Type | Start Date | End Date */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Leave Type */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                    Leave Type
                  </label>
                  <div className="relative">
                    <select
                      value={leaveType}
                      onChange={(e) => setLeaveType(e.target.value)}
                      required
                      className="w-full text-xs rounded-xl border border-neutral-300 bg-white p-2.5 pr-8 text-neutral-800 outline-none hover:border-neutral-400 appearance-none cursor-pointer"
                    >
                      <option value="">Select leave type</option>
                      <option value="Vacation Leave">Vacation Leave</option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Personal Leave">Personal Leave</option>
                      <option value="Emergency Leave">Emergency Leave</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-3 top-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                    Start Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="w-full text-xs rounded-xl border border-neutral-300 bg-white p-2.5 pr-8 text-neutral-800 outline-none hover:border-neutral-400 cursor-pointer"
                    />
                    <CalendarIcon className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                    End Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full text-xs rounded-xl border border-neutral-300 bg-white p-2.5 pr-8 text-neutral-800 outline-none hover:border-neutral-400 cursor-pointer"
                    />
                    <CalendarIcon className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-3.5 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 2: Total Days | Reason */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                    Total Days
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={`${totalDays} Day(s)`}
                      className="w-full text-xs rounded-xl border border-neutral-300 bg-neutral-50 p-2.5 text-neutral-800 font-semibold outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="md:col-span-9">
                  <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                    Reason
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    placeholder="Enter reason for leave request"
                    className="w-full text-xs rounded-xl border border-neutral-300 bg-white p-2.5 text-neutral-800 focus:border-black outline-none transition resize-none"
                  />
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs font-semibold rounded-xl hover:bg-neutral-50 transition cursor-pointer"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#9ca3af] hover:bg-neutral-800 hover:text-white text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5 stroke-[2]" />
                  <span>Submit Request</span>
                </button>
              </div>
            </form>
          </div>

          {/* ======================================================== */}
          {/* BOTTOM CARD: MY LEAVE REQUEST                            */}
          {/* ======================================================== */}
          <div className="bg-white rounded-[24px] sm:rounded-[28px] p-6 shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-neutral-200/80">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700">
                  <CalendarX className="w-4 h-4 stroke-[2]" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-neutral-900">
                    My Leave Request
                  </h2>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    View the status of your leave requests
                  </p>
                </div>
              </div>

              {/* Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded-xl px-3 py-1.5 pr-7 outline-none appearance-none hover:border-neutral-400 cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Table Header Bar */}
            <div className="mt-4 bg-[#f1f3f6] rounded-xl px-4 py-2.5 grid grid-cols-12 text-[11px] font-bold text-neutral-600 tracking-wider">
              <span className="col-span-3">Leave Type</span>
              <span className="col-span-3">Date Range</span>
              <span className="col-span-2">Total Days</span>
              <span className="col-span-2">Reason</span>
              <span className="col-span-2 text-right sm:text-center">Status</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-neutral-100 text-xs">
              {filteredRequests.map((req) => (
                <div
                  key={req.id}
                  className="py-3.5 px-4 grid grid-cols-12 items-center hover:bg-neutral-50/70 transition"
                >
                  {/* Leave Type */}
                  <div className="col-span-3 flex items-center gap-2 font-bold text-neutral-900">
                    {getLeaveIcon(req.type)}
                    <span>{req.type}</span>
                  </div>

                  {/* Date Range */}
                  <span className="col-span-3 text-neutral-700 font-medium">{req.dateRange}</span>

                  {/* Total Days */}
                  <span className="col-span-2 text-neutral-600">{req.totalDays}</span>

                  {/* Reason */}
                  <span className="col-span-2 text-neutral-600 truncate pr-2">{req.reason}</span>

                  {/* Status Badge */}
                  <div className="col-span-2 text-right sm:text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-md text-[11px] font-semibold ${
                        req.status === "Pending"
                          ? "bg-[#fef08a] text-[#854d0e]"
                          : req.status === "Approved"
                          ? "bg-[#22c55e] text-white"
                          : "bg-[#ef4444] text-white"
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Table Footer with Pagination */}
            <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500 mt-4">
              <p>Showing 1 to {filteredRequests.length} of {requests.length} requests</p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
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
                  className="p-1 rounded-lg border border-neutral-200 text-neutral-400 hover:text-black hover:border-neutral-300 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function LeaveRequestsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white p-6">Loading Leave Requests...</div>}>
      <LeaveRequestsPageContent />
    </Suspense>
  );
}
