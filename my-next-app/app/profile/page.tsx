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
  LogOut,
  Edit3,
  Camera,
  Mail,
  Phone,
  Calendar as CalendarIcon,
  MapPin,
  Briefcase,
  AlertTriangle,
  Star,
  CheckCircle2,
  Menu,
  X,
  Lock
} from "lucide-react";

interface ProfileData {
  firstName: string;
  middleName: string;
  lastName: string;
  employeeId: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  religion: string;
  status: string;
  dateJoined: string;
  address: string;
  aboutMe: string;
  skills: { name: string; category: string }[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    altPhone: string;
    address: string;
  };
  employmentSummary: {
    type: string;
    schedule: string;
    branch: string;
    supervisor: string;
    yearsOfService: string;
  };
  leaveBalance: {
    vacationDays: string;
    vacationStatus: string;
    sickDays: string;
    sickStatus: string;
    emergencyDays: string;
    total: string;
  };
}

const DEFAULT_PROFILE: ProfileData = {
  firstName: "Aaron Daniel",
  middleName: "Nisperos",
  lastName: "Tumaliuan",
  employeeId: "2024 - 0567",
  position: "Graphic Designer",
  department: "Marketing",
  email: "aarondanieltumaliuan@gmail.com",
  phone: "+63 988 052 7806",
  dateOfBirth: "October 07, 2005",
  gender: "Male",
  religion: "Born Again",
  status: "Married",
  dateJoined: "March 01, 2026",
  address: "Arayat, Pampanga",
  aboutMe:
    "I'm a passionate graphic designer who creates clean, modern designs that bring ideas to life and help brands stand out.",
  skills: [
    { name: "Figma", category: "UI/UX Design" },
    { name: "Canva", category: "Branding & Logo Design" },
  ],
  emergencyContact: {
    name: "Rainer Vass",
    relationship: "Sibling",
    phone: "+63 981 765 1234",
    altPhone: "+63 908 761 8891",
    address: "Taguig City, Metro Manila",
  },
  employmentSummary: {
    type: "Full Time",
    schedule: "Monday - Friday\n8:20 AM - 5:00 PM",
    branch: "Quezon City Branch",
    supervisor: "Juan Dela Cruz",
    yearsOfService: "5 Months",
  },
  leaveBalance: {
    vacationDays: "3 Days",
    vacationStatus: "Pending",
    sickDays: "1 Day",
    sickStatus: "Approved",
    emergencyDays: "—",
    total: "4 Days",
  },
};

function ProfilePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mode: "view" or "edit"
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [toastMessage, setToastMessage] = useState("");

  // Edit form state
  const [form, setForm] = useState<ProfileData>(DEFAULT_PROFILE);

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("edit") === "true") {
      setIsEditing(true);
    }
  }, [searchParams]);

  const handleStartEdit = () => {
    setForm({ ...profile });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setForm({ ...profile });
    setIsEditing(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({ ...form });
    setIsEditing(false);
    setToastMessage("Profile updated successfully!");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Leave Requests", href: "/leave-requests", icon: CalendarX },
    { name: "My Tasks", href: "/tasks", icon: ClipboardList },
    { name: "Attendance", href: "/attendance", icon: CalendarDays },
    { name: "Profile", href: "/profile", icon: UserCircle, active: true },
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
                  {isEditing ? "Profile > Edit Profile" : "Profile"}
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
                        <p className="font-semibold text-neutral-900">Profile Updated</p>
                        <p className="text-[11px] text-neutral-500">Your profile details are synced.</p>
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
                      alt={profile.firstName}
                      width={36}
                      height={36}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="hidden sm:block text-left leading-tight">
                    <p className="text-xs font-bold text-neutral-900">
                      {profile.firstName} {profile.lastName}
                    </p>
                    <p className="text-[10px] text-neutral-400 font-medium">{profile.position}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400 hidden sm:block" />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-neutral-200 py-1.5 z-50 text-xs animate-fadeIn">
                    <div className="px-3.5 py-2.5 border-b border-neutral-100 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-neutral-200 shrink-0 bg-neutral-100">
                        <Image
                          src="/assets/avatar-aaron.png"
                          alt={profile.firstName}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="leading-tight overflow-hidden">
                        <p className="font-bold text-neutral-900 truncate">
                          {profile.firstName} {profile.lastName}
                        </p>
                        <p className="text-[11px] text-neutral-400 truncate">{profile.email}</p>
                        <p className="text-[10px] font-mono text-neutral-400 mt-0.5">{profile.employeeId}</p>
                      </div>
                    </div>
                    <Link href="/dashboard" className="block px-3.5 py-2 text-neutral-700 hover:bg-neutral-50">
                      Dashboard
                    </Link>
                    <Link href="/settings" className="block px-3.5 py-2 text-neutral-700 hover:bg-neutral-50">
                      Change Password
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
          {/* CASE A: EDIT PROFILE MODE (Matches Image 2)              */}
          {/* ======================================================== */}
          {isEditing ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: Personal Information Form (8 cols) */}
              <div className="lg:col-span-8 bg-white rounded-[24px] sm:rounded-[28px] p-6 shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-neutral-200/80">
                <h2 className="text-base sm:text-lg font-bold text-neutral-900 pb-4 border-b border-neutral-100">
                  Personal Information
                </h2>

                {/* Profile Photo Header */}
                <div className="flex items-center gap-5 py-5 border-b border-neutral-100">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-neutral-200 shrink-0">
                      <Image
                        src="/assets/avatar-aaron.png"
                        alt="Profile photo"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="absolute bottom-0 right-0 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center p-1 border-2 border-white">
                      <Camera className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-neutral-700">Profile Photo</h3>
                    <button
                      type="button"
                      onClick={() => alert("Upload photo prompt")}
                      className="mt-1.5 px-3 py-1 bg-[#9ca3af] hover:bg-neutral-700 text-white text-[11px] font-semibold rounded-lg transition cursor-pointer shadow-sm"
                    >
                      Change Photo
                    </button>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[11px] text-neutral-400 font-medium">Employee ID</span>
                      <span className="px-2.5 py-0.5 border border-neutral-200 rounded-md text-[11px] font-mono text-neutral-700 bg-neutral-50">
                        {form.employeeId}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Edit Form */}
                <form onSubmit={handleSaveEdit} className="mt-5 space-y-4 text-xs">
                  {/* Row 1: First | Middle | Last Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-neutral-800 mb-1">First Name</label>
                      <input
                        type="text"
                        value={form.firstName}
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-neutral-800 mb-1">Middle Name</label>
                      <input
                        type="text"
                        value={form.middleName}
                        onChange={(e) => setForm({ ...form, middleName: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-neutral-800 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={form.lastName}
                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full p-2.5 pr-8 rounded-xl border border-neutral-300 outline-none focus:border-black"
                      />
                      <Mail className="w-4 h-4 text-neutral-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Phone & Date of Birth */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-neutral-800 mb-1">Phone Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full p-2.5 pr-8 rounded-xl border border-neutral-300 outline-none focus:border-black"
                        />
                        <Phone className="w-4 h-4 text-neutral-400 absolute right-3 top-3 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold text-neutral-800 mb-1">Date of Birth</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={form.dateOfBirth}
                          onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                          className="w-full p-2.5 pr-8 rounded-xl border border-neutral-300 outline-none focus:border-black"
                        />
                        <CalendarIcon className="w-4 h-4 text-neutral-400 absolute right-3 top-3 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Gender & Religion */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-neutral-800 mb-1">Gender</label>
                      <div className="relative">
                        <select
                          value={form.gender}
                          onChange={(e) => setForm({ ...form, gender: e.target.value })}
                          className="w-full p-2.5 pr-8 rounded-xl border border-neutral-300 outline-none focus:border-black bg-white appearance-none cursor-pointer"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-3 top-3.5 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold text-neutral-800 mb-1">Religion</label>
                      <input
                        type="text"
                        value={form.religion}
                        onChange={(e) => setForm({ ...form, religion: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block font-semibold text-neutral-800 mb-1">Address</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        className="w-full p-2.5 pr-8 rounded-xl border border-neutral-300 outline-none focus:border-black"
                      />
                      <MapPin className="w-4 h-4 text-neutral-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Position & Department */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-neutral-800 mb-1">Position</label>
                      <input
                        type="text"
                        value={form.position}
                        onChange={(e) => setForm({ ...form, position: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-neutral-800 mb-1">Department</label>
                      <input
                        type="text"
                        value={form.department}
                        onChange={(e) => setForm({ ...form, department: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  {/* About Me & Skills side by side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-semibold text-neutral-800">About Me</label>
                        <Edit3 className="w-3.5 h-3.5 text-neutral-400" />
                      </div>
                      <textarea
                        value={form.aboutMe}
                        onChange={(e) => setForm({ ...form, aboutMe: e.target.value })}
                        rows={3}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 outline-none focus:border-black resize-none leading-relaxed"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-semibold text-neutral-800">Skills</label>
                        <Edit3 className="w-3.5 h-3.5 text-neutral-400" />
                      </div>
                      <div className="p-3 border border-neutral-300 rounded-xl space-y-2 bg-neutral-50/50">
                        {form.skills.map((s, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[11px]">
                            <span className="font-semibold text-neutral-800">{s.name}</span>
                            <span className="text-neutral-500">{s.category}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Buttons */}
                  <div className="pt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-4 py-2 border border-neutral-300 rounded-xl text-neutral-700 font-semibold hover:bg-neutral-50 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-neutral-900 hover:bg-black text-white font-semibold rounded-xl cursor-pointer shadow-sm"
                      >
                        Save Changes
                      </button>
                    </div>

                    <Link
                      href="/settings"
                      className="px-4 py-2 bg-neutral-800 hover:bg-black text-white font-semibold rounded-xl transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Change Password</span>
                    </Link>
                  </div>
                </form>
              </div>

              {/* Right Column: Emergency Contact Card (4 cols) */}
              <div className="lg:col-span-4 bg-white rounded-[24px] sm:rounded-[28px] p-6 shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-neutral-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                    <AlertTriangle className="w-5 h-5 text-neutral-800 stroke-[2]" />
                    <h3 className="text-base font-bold text-neutral-900">Emergency Contact</h3>
                  </div>

                  <div className="mt-4 space-y-3.5 text-xs">
                    <div>
                      <label className="block font-semibold text-neutral-800 mb-1">Name</label>
                      <input
                        type="text"
                        value={form.emergencyContact.name}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            emergencyContact: { ...form.emergencyContact, name: e.target.value },
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-neutral-300 outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-neutral-800 mb-1">Relationship</label>
                      <div className="relative">
                        <select
                          value={form.emergencyContact.relationship}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              emergencyContact: { ...form.emergencyContact, relationship: e.target.value },
                            })
                          }
                          className="w-full p-2.5 pr-8 rounded-xl border border-neutral-300 outline-none focus:border-black bg-white appearance-none cursor-pointer"
                        >
                          <option value="Sibling">Sibling</option>
                          <option value="Parent">Parent</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Friend">Friend</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-3 top-3.5 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-neutral-800 mb-1">Phone</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={form.emergencyContact.phone}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              emergencyContact: { ...form.emergencyContact, phone: e.target.value },
                            })
                          }
                          className="w-full p-2.5 pr-8 rounded-xl border border-neutral-300 outline-none focus:border-black"
                        />
                        <Phone className="w-4 h-4 text-neutral-400 absolute right-3 top-3 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-neutral-800 mb-1">Alternative Phone</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={form.emergencyContact.altPhone}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              emergencyContact: { ...form.emergencyContact, altPhone: e.target.value },
                            })
                          }
                          className="w-full p-2.5 pr-8 rounded-xl border border-neutral-300 outline-none focus:border-black"
                        />
                        <Phone className="w-4 h-4 text-neutral-400 absolute right-3 top-3 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-neutral-800 mb-1">Address</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={form.emergencyContact.address}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              emergencyContact: { ...form.emergencyContact, address: e.target.value },
                            })
                          }
                          className="w-full p-2.5 pr-8 rounded-xl border border-neutral-300 outline-none focus:border-black"
                        />
                        <MapPin className="w-4 h-4 text-neutral-400 absolute right-3 top-3 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ======================================================== */
            /* CASE B: VIEW PROFILE MODE (Matches Image 3)              */
            /* ======================================================== */
            <div className="space-y-6">
              {/* TOP BIG CARD: Personal Information */}
              <div className="bg-white rounded-[24px] sm:rounded-[28px] p-6 shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-neutral-200/80">
                <h2 className="text-base sm:text-lg font-bold text-neutral-900 pb-4 border-b border-neutral-100">
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-4 items-start">
                  {/* Left: Avatar Column (3 cols) */}
                  <div className="lg:col-span-3 flex flex-col items-center text-center pt-2">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-neutral-100 shadow-md">
                      <Image
                        src="/assets/avatar-aaron.png"
                        alt={profile.firstName}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="mt-4 px-4 py-1 bg-black text-white text-[11px] font-bold tracking-wider rounded-lg uppercase shadow-sm">
                      EMPLOYEE
                    </span>
                    <p className="text-xs text-neutral-500 font-medium mt-1.5">{profile.position}</p>
                  </div>

                  {/* Middle: Details Grid (6 cols) */}
                  <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 text-xs border-y lg:border-y-0 lg:border-x border-neutral-100 py-4 lg:py-0 lg:px-6">
                    <div>
                      <p className="text-neutral-400 font-medium">Full Name</p>
                      <p className="font-bold text-neutral-900 mt-0.5">
                        {profile.firstName} {profile.middleName} {profile.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-400 font-medium">Employee ID</p>
                      <p className="font-bold text-neutral-900 mt-0.5">{profile.employeeId}</p>
                    </div>

                    <div>
                      <p className="text-neutral-400 font-medium">Position</p>
                      <p className="font-bold text-neutral-900 mt-0.5">{profile.position}</p>
                    </div>
                    <div>
                      <p className="text-neutral-400 font-medium">Department</p>
                      <p className="font-bold text-neutral-900 mt-0.5">{profile.department}</p>
                    </div>

                    <div className="sm:col-span-2">
                      <p className="text-neutral-400 font-medium">Email</p>
                      <p className="font-bold text-neutral-900 mt-0.5">{profile.email}</p>
                    </div>

                    <div>
                      <p className="text-neutral-400 font-medium">Phone</p>
                      <p className="font-bold text-neutral-900 mt-0.5">{profile.phone}</p>
                    </div>
                    <div>
                      <p className="text-neutral-400 font-medium">Date of Birth</p>
                      <p className="font-bold text-neutral-900 mt-0.5">{profile.dateOfBirth}</p>
                    </div>

                    <div className="sm:col-span-2">
                      <p className="text-neutral-400 font-medium">Address</p>
                      <p className="font-bold text-neutral-900 mt-0.5">{profile.address}</p>
                    </div>

                    <div>
                      <p className="text-neutral-400 font-medium">Gender</p>
                      <p className="font-bold text-neutral-900 mt-0.5">{profile.gender}</p>
                    </div>
                    <div>
                      <p className="text-neutral-400 font-medium">Status</p>
                      <p className="font-bold text-neutral-900 mt-0.5">{profile.status}</p>
                    </div>

                    <div>
                      <p className="text-neutral-400 font-medium">Religion</p>
                      <p className="font-bold text-neutral-900 mt-0.5">{profile.religion}</p>
                    </div>
                    <div>
                      <p className="text-neutral-400 font-medium">Date Joined</p>
                      <p className="font-bold text-neutral-900 mt-0.5">{profile.dateJoined}</p>
                    </div>
                  </div>

                  {/* Right: About Me & Skills Cards (3 cols) */}
                  <div className="lg:col-span-3 space-y-4">
                    {/* About Me Card */}
                    <div className="p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200/60">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-neutral-200/80 flex items-center justify-center text-neutral-800">
                          <UserCircle className="w-4 h-4" />
                        </div>
                        <h3 className="text-xs font-bold text-neutral-900">About Me</h3>
                      </div>
                      <p className="text-[11px] text-neutral-600 leading-relaxed">{profile.aboutMe}</p>
                    </div>

                    {/* Skills Card */}
                    <div className="p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200/60">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-neutral-200/80 flex items-center justify-center text-neutral-800">
                          <Star className="w-3.5 h-3.5" />
                        </div>
                        <h3 className="text-xs font-bold text-neutral-900">Skills</h3>
                      </div>
                      <ul className="text-[11px] text-neutral-600 space-y-1">
                        <li>• Figma</li>
                        <li>• Canva</li>
                        <li>• UI/UX Design</li>
                        <li>• Branding &amp; Logo Design</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* BOTTOM ROW: 3 Equal Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Emergency Contact */}
                <div className="bg-white rounded-[24px] sm:rounded-[28px] p-5 shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-neutral-200/80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                      <AlertTriangle className="w-4 h-4 text-neutral-800 stroke-[2]" />
                      <h3 className="text-xs font-bold tracking-wider uppercase text-neutral-900">
                        Emergency Contact
                      </h3>
                    </div>

                    <div className="py-4 space-y-3 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-400">Name</span>
                        <span className="font-bold text-neutral-900">{profile.emergencyContact.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-400">Relationship</span>
                        <span className="font-bold text-neutral-900">
                          {profile.emergencyContact.relationship}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-400">Phone</span>
                        <span className="font-bold text-neutral-900">{profile.emergencyContact.phone}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-400">Alternative phone</span>
                        <span className="font-bold text-neutral-900">{profile.emergencyContact.altPhone}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-400">Address</span>
                        <span className="font-bold text-neutral-900 text-right">
                          {profile.emergencyContact.address}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Employment Summary */}
                <div className="bg-white rounded-[24px] sm:rounded-[28px] p-5 shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-neutral-200/80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                      <Briefcase className="w-4 h-4 text-neutral-800 stroke-[2]" />
                      <h3 className="text-xs font-bold tracking-wider uppercase text-neutral-900">
                        Employment Summary
                      </h3>
                    </div>

                    <div className="py-4 space-y-3 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-400">Employment Type</span>
                        <span className="font-bold text-neutral-900">
                          {profile.employmentSummary.type}
                        </span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-neutral-400">Work Schedule</span>
                        <span className="font-bold text-neutral-900 text-right whitespace-pre-line">
                          {profile.employmentSummary.schedule}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-400">Branch</span>
                        <span className="font-bold text-neutral-900">
                          {profile.employmentSummary.branch}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-400">Supervisor</span>
                        <span className="font-bold text-neutral-900">
                          {profile.employmentSummary.supervisor}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-400">Years of Service</span>
                        <span className="font-bold text-neutral-900">
                          {profile.employmentSummary.yearsOfService}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Leave Balance */}
                <div className="bg-white rounded-[24px] sm:rounded-[28px] p-5 shadow-[0_4px_18px_rgba(0,0,0,0.03)] border border-neutral-200/80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                      <CalendarX className="w-4 h-4 text-neutral-800 stroke-[2]" />
                      <h3 className="text-xs font-bold tracking-wider uppercase text-neutral-900">
                        Leave Balance
                      </h3>
                    </div>

                    <div className="py-4 space-y-3.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500 font-medium">Vacation Leave</span>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-[#f59e0b]">
                            {profile.leaveBalance.vacationDays}
                          </span>
                          <span className="text-[11px] text-[#f59e0b] font-semibold">
                            {profile.leaveBalance.vacationStatus}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500 font-medium">Sick Leave</span>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-[#22c55e]">
                            {profile.leaveBalance.sickDays}
                          </span>
                          <span className="text-[11px] text-[#22c55e] font-semibold">
                            {profile.leaveBalance.sickStatus}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500 font-medium">Emergency Leave</span>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-neutral-400">
                            {profile.leaveBalance.emergencyDays}
                          </span>
                          <span className="text-[11px] text-neutral-400">—</span>
                        </div>
                      </div>

                      <div className="border-t border-neutral-100 pt-3 flex items-center justify-between">
                        <span className="text-neutral-500 font-medium">Total</span>
                        <span className="font-bold text-neutral-900 text-sm">
                          {profile.leaveBalance.total}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action: Edit Profile Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="px-5 py-2.5 bg-neutral-800 hover:bg-black text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition cursor-pointer shadow-sm"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white p-6">Loading Profile...</div>}>
      <ProfilePageContent />
    </Suspense>
  );
}
