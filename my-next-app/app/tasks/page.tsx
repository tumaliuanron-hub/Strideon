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
  FolderKanban,
  CheckSquare,
  FileText,
  Download,
  Plus,
  Filter,
  Search,
  Menu,
  X,
  UploadCloud,
  Check
} from "lucide-react";

interface EmployeeInfo {
  name: string;
  role: string;
  email: string;
  id: string;
  avatar: string;
}

interface TaskItem {
  id: string;
  title: string;
  subtitle: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  status: "In Progress" | "To Do" | "Completed";
  description: string;
  attachmentName?: string;
  attachmentSize?: string;
}

const INITIAL_TASKS: TaskItem[] = [
  {
    id: "task-1",
    title: "Design new landing page",
    subtitle: "Create a new landing page for the Summer Collection campaign.",
    dueDate: "August 10, 2026",
    priority: "High",
    status: "In Progress",
    description:
      "The landing page page should be modern, responsive and aligned with the brand identity. Include sections for new arrivals, best sellers and customer reviews",
    attachmentName: "Landing Page Brief.pdf",
    attachmentSize: "3.2 MB",
  },
  {
    id: "task-2",
    title: "Create email newsletter",
    subtitle: "Design and send newsletter for new arrivals.",
    dueDate: "July 29, 2026",
    priority: "Medium",
    status: "In Progress",
    description:
      "Prepare dynamic email templates showcasing our latest Strideon running shoes with high click-through CTA banners.",
    attachmentName: "Newsletter_Assets.zip",
    attachmentSize: "14.8 MB",
  },
  {
    id: "task-3",
    title: "Update product photo",
    subtitle: "Precise manufacturer colorway matching.",
    dueDate: "July 15, 2026",
    priority: "Low",
    status: "To Do",
    description:
      "Touch up catalog photographs to accurately represent the metallic shoe lace eyelets and reflective heel accents.",
    attachmentName: "Photo_Guidelines.pdf",
    attachmentSize: "1.8 MB",
  },
  {
    id: "task-4",
    title: "Update shoe size guide",
    subtitle: "Review and update the size guide on all product pages.",
    dueDate: "July 24, 2026",
    priority: "High",
    status: "To Do",
    description:
      "Update regional conversion tables for US, UK, EU, and CM sizing for the new 2026 athletic footwear collection.",
    attachmentName: "Size_Chart_v2.xlsx",
    attachmentSize: "450 KB",
  },
  {
    id: "task-5",
    title: "Design Banner",
    subtitle: "Optimized files for print or web.",
    dueDate: "July 10, 2026",
    priority: "Medium",
    status: "In Progress",
    description:
      "Export high-resolution vectors for retail store billboard promotions and responsive digital social assets.",
    attachmentName: "Banner_Specs_2026.pdf",
    attachmentSize: "5.4 MB",
  },
];

function TasksPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // User state
  const [employee, setEmployee] = useState<EmployeeInfo>({
    name: "Aaron Tumaliuan",
    role: "Graphic Designer",
    email: "aaron.tumaliuan@gmail.com",
    id: "EMP-2026-904",
    avatar: "/assets/avatar-aaron.png",
  });

  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("task-1");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Active task form fields
  const activeTask = tasks.find((t) => t.id === selectedTaskId) || tasks[0];
  const [formDueDate, setFormDueDate] = useState("July 15, 2026");
  const [formPriority, setFormPriority] = useState<"High" | "Medium" | "Low">("High");
  const [formStatus, setFormStatus] = useState<"In Progress" | "To Do" | "Completed">("In Progress");
  const [formDescription, setFormDescription] = useState("");
  const [toastMessage, setToastMessage] = useState<string>("");

  // Modals & Navigation
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskSubtitle, setNewTaskSubtitle] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("August 15, 2026");
  const [newTaskPriority, setNewTaskPriority] = useState<"High" | "Medium" | "Low">("Medium");

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

  // Sync selected task to form
  useEffect(() => {
    if (activeTask) {
      setFormDueDate(activeTask.dueDate);
      setFormPriority(activeTask.priority);
      setFormStatus(activeTask.status);
      setFormDescription(activeTask.description);
    }
  }, [selectedTaskId]);

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTasks((prev) =>
      prev.map((t) =>
        t.id === selectedTaskId
          ? {
              ...t,
              dueDate: formDueDate,
              priority: formPriority,
              status: formStatus,
              description: formDescription,
            }
          : t
      )
    );
    setToastMessage("Task updated successfully!");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleCreateNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      subtitle: newTaskSubtitle.trim() || "Assigned task",
      dueDate: newTaskDueDate,
      priority: newTaskPriority,
      status: "To Do",
      description: "Initial task description for Strideon workflow.",
      attachmentName: "Design_Brief.pdf",
      attachmentSize: "1.2 MB",
    };
    setTasks((prev) => [newTask, ...prev]);
    setSelectedTaskId(newTask.id);
    setShowNewTaskModal(false);
    setNewTaskTitle("");
    setNewTaskSubtitle("");
    setToastMessage("New task created!");
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Filtered tasks
  const filteredTasks = tasks.filter((t) => {
    const matchStatus = statusFilter === "All" || t.status === statusFilter;
    const matchPriority = priorityFilter === "All" || t.priority === priorityFilter;
    return matchStatus && matchPriority;
  });

  const totalTasksCount = 13;
  const inProgressCount = 5;
  const toDoCount = 8;

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Leave Requests", href: "/leave-requests", icon: CalendarX },
    { name: "My Tasks", href: "/tasks", icon: ClipboardList, active: true },
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
                  My Tasks
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
                        <p className="font-semibold text-neutral-900">Task Assigned</p>
                        <p className="text-[11px] text-neutral-500">Design new banner for promo due July 10.</p>
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

        {/* Tasks View Content */}
        <main className="flex-1 p-4 sm:p-6 pt-2 space-y-6">
          {/* Toast message */}
          {toastMessage && (
            <div className="fixed top-6 right-6 z-50 p-3 rounded-2xl bg-emerald-600 text-white text-xs font-semibold shadow-xl flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* ROW 1: STATS CARDS (Total Tasks | In Progress | To Do)   */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Total Tasks */}
            <div className="bg-white rounded-[24px] sm:rounded-[28px] p-5 shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-neutral-200/80 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#38bdf8] flex items-center justify-center text-white shadow-md shadow-sky-500/20 shrink-0">
                <FolderKanban className="w-7 h-7 stroke-[1.8]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-600">Total Tasks</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900 leading-tight">
                  {totalTasksCount}
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">All tasks assigned to you</p>
              </div>
            </div>

            {/* 2. In Progress */}
            <div className="bg-white rounded-[24px] sm:rounded-[28px] p-5 shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-neutral-200/80 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#eab308] flex items-center justify-center text-white shadow-md shadow-yellow-500/20 shrink-0">
                <Clock className="w-7 h-7 stroke-[1.8]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-600">In Progress</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900 leading-tight">
                  {inProgressCount}
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">Tasks currently in progress</p>
              </div>
            </div>

            {/* 3. To Do */}
            <div className="bg-white rounded-[24px] sm:rounded-[28px] p-5 shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-neutral-200/80 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#06b6d4] flex items-center justify-center text-white shadow-md shadow-cyan-500/20 shrink-0">
                <CheckSquare className="w-7 h-7 stroke-[1.8]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-600">To Do</p>
                <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900 leading-tight">
                  {toDoCount}
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">Tasks waiting to be started</p>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* ROW 2: ALL TASKS TABLE & UPDATE TASK CARD                */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* LEFT: All Tasks (7 cols on lg, 8 on xl) */}
            <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-neutral-200/80 flex flex-col justify-between">
              <div>
                {/* Header & Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
                  <h2 className="text-lg font-bold text-neutral-900">All Tasks</h2>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Status filter */}
                    <div className="relative">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded-xl px-3 py-1.5 pr-7 outline-none appearance-none hover:border-neutral-400 cursor-pointer"
                      >
                        <option value="All">All Status</option>
                        <option value="In Progress">In Progress</option>
                        <option value="To Do">To Do</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2 top-2.5 pointer-events-none" />
                    </div>

                    {/* Priority filter */}
                    <div className="relative">
                      <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded-xl px-3 py-1.5 pr-7 outline-none appearance-none hover:border-neutral-400 cursor-pointer"
                      >
                        <option value="All">All Priority</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2 top-2.5 pointer-events-none" />
                    </div>

                    {/* New Task Button */}
                    <button
                      type="button"
                      onClick={() => setShowNewTaskModal(true)}
                      className="px-3.5 py-1.5 bg-[#9ca3af] hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Task</span>
                    </button>
                  </div>
                </div>

                {/* Table Header Bar */}
                <div className="mt-4 bg-[#f1f3f6] rounded-xl px-4 py-2.5 grid grid-cols-12 text-[11px] font-bold text-neutral-600 tracking-wider">
                  <span className="col-span-5 sm:col-span-5">Task</span>
                  <span className="col-span-3 sm:col-span-3 text-center sm:text-left">Due Date</span>
                  <span className="col-span-2 sm:col-span-2 text-center">Priority</span>
                  <span className="col-span-2 sm:col-span-2 text-right sm:text-center">Status</span>
                </div>

                {/* Tasks List */}
                <div className="divide-y divide-neutral-100">
                  {filteredTasks.map((t) => {
                    const isSelected = t.id === selectedTaskId;
                    return (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTaskId(t.id)}
                        className={`py-3.5 px-3 rounded-xl grid grid-cols-12 items-center transition cursor-pointer ${
                          isSelected ? "bg-neutral-50 border border-neutral-200/80 shadow-sm" : "hover:bg-neutral-50/70"
                        }`}
                      >
                        {/* Task Title & Subtitle */}
                        <div className="col-span-5 sm:col-span-5 pr-2">
                          <p className="font-bold text-xs sm:text-[13px] text-neutral-900 leading-snug">
                            {t.title}
                          </p>
                          <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                            {t.subtitle}
                          </p>
                        </div>

                        {/* Due Date */}
                        <div className="col-span-3 sm:col-span-3 flex items-center gap-1.5 text-xs text-neutral-600">
                          <CalendarIcon className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          <span className="text-[11px] sm:text-xs font-medium">{t.dueDate}</span>
                        </div>

                        {/* Priority Badge */}
                        <div className="col-span-2 sm:col-span-2 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold text-white ${
                              t.priority === "High"
                                ? "bg-[#ff5a66]"
                                : t.priority === "Medium"
                                ? "bg-[#f59e0b]"
                                : "bg-[#22c55e]"
                            }`}
                          >
                            {t.priority}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <div className="col-span-2 sm:col-span-2 text-right sm:text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold text-white ${
                              t.status === "In Progress"
                                ? "bg-[#38bdf8]"
                                : t.status === "To Do"
                                ? "bg-[#38bdf8]"
                                : "bg-[#22c55e]"
                            }`}
                          >
                            {t.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Table Footer with Pagination */}
              <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500 mt-4">
                <p>Showing 1 to {filteredTasks.length} of {totalTasksCount} tasks</p>
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

            {/* RIGHT: Update Task Card (5 cols on lg, 4 on xl) */}
            <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-neutral-200/80 flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="pb-3 border-b border-neutral-100">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-900">
                    Update Task
                  </p>
                  <h3 className="text-base sm:text-lg font-extrabold text-neutral-900 mt-1">
                    {activeTask.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                    {activeTask.subtitle}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleUpdateSubmit} className="py-4 space-y-4">
                  {/* Due Date & Priority row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 mb-1">
                        Due Date
                      </label>
                      <div className="relative">
                        <select
                          value={formDueDate}
                          onChange={(e) => setFormDueDate(e.target.value)}
                          className="w-full text-xs rounded-xl border border-neutral-300 bg-white p-2.5 pr-7 text-neutral-800 outline-none hover:border-neutral-400 cursor-pointer appearance-none"
                        >
                          <option value="August 10, 2026">August 10, 2026</option>
                          <option value="July 29, 2026">July 29, 2026</option>
                          <option value="July 24, 2026">July 24, 2026</option>
                          <option value="July 15, 2026">July 15, 2026</option>
                          <option value="July 10, 2026">July 10, 2026</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2 top-3 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 mb-1">
                        Priority
                      </label>
                      <div className="relative">
                        <select
                          value={formPriority}
                          onChange={(e) => setFormPriority(e.target.value as any)}
                          className="w-full text-xs rounded-xl border border-neutral-300 bg-white p-2.5 pr-7 text-neutral-800 outline-none hover:border-neutral-400 cursor-pointer appearance-none"
                        >
                          <option value="High">● High</option>
                          <option value="Medium">● Medium</option>
                          <option value="Low">● Low</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2 top-3 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 mb-1">
                      Status
                    </label>
                    <div className="relative">
                      <select
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value as any)}
                        className="w-full text-xs rounded-xl border border-neutral-300 bg-white p-2.5 pr-7 text-neutral-800 outline-none hover:border-neutral-400 cursor-pointer appearance-none"
                      >
                        <option value="In Progress">● In Progress</option>
                        <option value="To Do">● To Do</option>
                        <option value="Completed">● Completed</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      rows={4}
                      className="w-full text-xs rounded-xl border border-neutral-300 bg-white p-2.5 text-neutral-800 focus:border-black outline-none transition resize-none leading-relaxed"
                    />
                  </div>

                  {/* Attachments */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 mb-1">
                      Attachments
                    </label>
                    <div className="p-2.5 bg-neutral-100/90 rounded-xl flex items-center justify-between border border-neutral-200/60">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center text-red-600 font-bold text-[10px] shrink-0">
                          PDF
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-neutral-800">
                            {activeTask.attachmentName || "Landing Page Brief.pdf"}
                          </p>
                          <p className="text-[10px] text-neutral-400">
                            {activeTask.attachmentSize || "3.2 MB"}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => alert(`Downloading ${activeTask.attachmentName || "attachment"}`)}
                        className="p-1.5 hover:bg-neutral-200 rounded-lg transition text-neutral-600 cursor-pointer"
                        title="Download Attachment"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setFormDueDate(activeTask.dueDate);
                        setFormPriority(activeTask.priority);
                        setFormStatus(activeTask.status);
                        setFormDescription(activeTask.description);
                      }}
                      className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs font-semibold rounded-xl hover:bg-neutral-50 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#9ca3af] hover:bg-neutral-800 hover:text-white text-white text-xs font-semibold rounded-xl transition cursor-pointer shadow-sm"
                    >
                      Submit Task
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-neutral-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-base text-neutral-900">Create New Task</h3>
              <button
                type="button"
                onClick={() => setShowNewTaskModal(false)}
                className="p-1 text-neutral-400 hover:text-black rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateNewTask} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-neutral-800 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g., Update Fall catalog assets"
                  className="w-full p-2.5 rounded-xl border border-neutral-300 outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block font-semibold text-neutral-800 mb-1">Subtitle / Summary</label>
                <input
                  type="text"
                  value={newTaskSubtitle}
                  onChange={(e) => setNewTaskSubtitle(e.target.value)}
                  placeholder="e.g., High-resolution photography for website"
                  className="w-full p-2.5 rounded-xl border border-neutral-300 outline-none focus:border-black"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Due Date</label>
                  <input
                    type="text"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 outline-none focus:border-black bg-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-xl text-neutral-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black text-white font-semibold rounded-xl hover:bg-neutral-800"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TasksPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white p-6">Loading Tasks...</div>}>
      <TasksPageContent />
    </Suspense>
  );
}
