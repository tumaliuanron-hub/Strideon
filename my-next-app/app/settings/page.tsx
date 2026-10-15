"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Menu,
  Check
} from "lucide-react";

function SettingsPageContent() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Requirements checks
  const hasMinLength = newPassword.length >= 8;
  const hasUpperLower = /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const allRequirementsMet = hasMinLength && hasUpperLower && hasNumber && hasSpecial;

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!currentPassword) {
      setFeedback({ type: "error", message: "Please enter your current password." });
      return;
    }

    if (!allRequirementsMet) {
      setFeedback({ type: "error", message: "Please meet all password requirements before saving." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setFeedback({ type: "error", message: "New password and confirmation do not match." });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (typeof window !== "undefined") {
        localStorage.setItem("userPassword", newPassword);
      }
      setFeedback({ type: "success", message: "Your password has been changed successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 800);
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Leave Requests", href: "/leave-requests", icon: CalendarX },
    { name: "My Tasks", href: "/tasks", icon: ClipboardList },
    { name: "Attendance", href: "/attendance", icon: CalendarDays },
    { name: "Profile", href: "/profile", icon: UserCircle },
    { name: "Announcements", href: "/announcements", icon: Megaphone },
    { name: "Settings", href: "/settings", icon: Settings, active: true },
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
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-white bg-neutral-900/80 rounded-xl transition"
          >
            <Settings className="w-4 h-4 text-white" />
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
                  Settings &gt; Change password
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
                        <p className="font-semibold text-neutral-900">Security Alert</p>
                        <p className="text-[11px] text-neutral-500">Ensure to use a strong password.</p>
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

        {/* Central Card Area (Matches Image 1) */}
        <main className="flex-1 p-4 sm:p-6 flex items-center justify-center">
          <div className="w-full max-w-[460px] bg-white rounded-[32px] p-7 sm:p-9 shadow-[0_25px_65px_-12px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.02)] border border-neutral-100 animate-fadeIn">
            {/* Top Brand Shoe Emblem */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-auto mb-2">
                <Image
                  src="/assets/strideon-shoe-black.png"
                  alt="Strideon Emblem"
                  width={60}
                  height={45}
                  priority
                  className="w-full h-auto object-contain filter drop-shadow-sm select-none"
                />
              </div>
              <h2 className="text-sm font-extrabold tracking-[0.35em] text-neutral-900 uppercase">
                STRIDEON
              </h2>
              <p className="text-[9.5px] font-semibold tracking-[0.2em] text-neutral-400 uppercase mt-0.5">
                STEP IN TO EXCELLENCE
              </p>
            </div>

            {/* Feedback notification */}
            {feedback && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 animate-fadeIn ${
                  feedback.type === "success"
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                    : "bg-red-50 border border-red-200 text-red-800"
                }`}
              >
                {feedback.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSavePassword} className="space-y-4 text-xs">
              {/* Current Password */}
              <div>
                <label className="block font-semibold text-neutral-800 mb-1.5">
                  Current Password
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-neutral-400 pointer-events-none">
                    <Lock className="w-4 h-4 stroke-[1.8]" />
                  </div>
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full rounded-xl border border-neutral-300 bg-white pl-10 pr-10 py-2.5 text-neutral-800 placeholder:text-neutral-400 outline-none focus:border-black transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3.5 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block font-semibold text-neutral-800 mb-1.5">
                  New Password
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-neutral-400 pointer-events-none">
                    <Lock className="w-4 h-4 stroke-[1.8]" />
                  </div>
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full rounded-xl border border-neutral-300 bg-white pl-10 pr-10 py-2.5 text-neutral-800 placeholder:text-neutral-400 outline-none focus:border-black transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3.5 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block font-semibold text-neutral-800 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-neutral-400 pointer-events-none">
                    <Lock className="w-4 h-4 stroke-[1.8]" />
                  </div>
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full rounded-xl border border-neutral-300 bg-white pl-10 pr-10 py-2.5 text-neutral-800 placeholder:text-neutral-400 outline-none focus:border-black transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements Box (Matches image: black card with shield check) */}
              <div className="bg-black text-white p-4 rounded-2xl mt-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-white stroke-[2]" />
                  <p className="text-xs font-bold tracking-tight">Password Requirements</p>
                </div>

                <ul className="text-[11px] text-neutral-300 space-y-1.5 pl-1">
                  <li className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-400" : ""}`}>
                    <span className="w-1 h-1 rounded-full bg-neutral-400" />
                    <span>At least 8 characters long</span>
                  </li>
                  <li className={`flex items-center gap-1.5 ${hasUpperLower ? "text-emerald-400" : ""}`}>
                    <span className="w-1 h-1 rounded-full bg-neutral-400" />
                    <span>Include uppercase and lowercase letters</span>
                  </li>
                  <li className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-400" : ""}`}>
                    <span className="w-1 h-1 rounded-full bg-neutral-400" />
                    <span>Include at least one number</span>
                  </li>
                  <li className={`flex items-center gap-1.5 ${hasSpecial ? "text-emerald-400" : ""}`}>
                    <span className="w-1 h-1 rounded-full bg-neutral-400" />
                    <span>Include at least one special character</span>
                  </li>
                </ul>
              </div>

              {/* Save Changes Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-5 py-3 rounded-xl bg-black hover:bg-neutral-800 text-white font-semibold text-xs tracking-wide transition cursor-pointer shadow-md disabled:opacity-75"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white p-6">Loading Settings...</div>}>
      <SettingsPageContent />
    </Suspense>
  );
}
