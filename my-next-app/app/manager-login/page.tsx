"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  BadgeCheck,
  Briefcase,
  Shield,
  ArrowLeft,
  Building2,
  UserCheck
} from "lucide-react";

import { supabase } from "@/lib/supabase";

interface ManagerDetails {
  manager_id: string;
  name: string;
  role: string;
  department_name: string;
  email: string;
  phone?: string;
}

const SEEDED_MANAGERS: ManagerDetails[] = [
  {
    manager_id: "MGR-2026-101",
    name: "Aaron Tumaliuan",
    role: "Creative Director & Design Department Manager",
    department_name: "Creative & Design",
    email: "aaron.tumaliuan@gmail.com",
    phone: "+63 920 444 9904",
  },
  {
    manager_id: "MGR-2026-102",
    name: "Marcus Vance",
    role: "Head of Product Management",
    department_name: "Product & Specialist",
    email: "marcus.vance@strideon.com",
    phone: "+63 918 987 6543",
  },
];

function ManagerLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [managerId, setManagerId] = useState("");
  const [managerDetails, setManagerDetails] = useState<ManagerDetails | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResolvingManager, setIsResolvingManager] = useState(true);
  const [errorDetails, setErrorDetails] = useState<{ title: string; subtitle: string } | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Modal / switcher state if manager wants to change ID
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [switchIdInput, setSwitchIdInput] = useState("");
  const [switchError, setSwitchError] = useState("");

  // Resolve manager details from query params or database
  useEffect(() => {
    const paramId = searchParams.get("managerId") || "";
    const paramName = searchParams.get("name") || "";
    const paramRole = searchParams.get("role") || "";
    const paramDept = searchParams.get("dept") || "";
    const paramEmail = searchParams.get("email") || "";

    const resolveManager = async () => {
      setIsResolvingManager(true);
      const cleanId = (paramId || "MGR-2026-101").trim().toUpperCase();
      setManagerId(cleanId);

      // Check if details provided via URL
      if (paramName && paramRole) {
        setManagerDetails({
          manager_id: cleanId,
          name: paramName,
          role: paramRole,
          department_name: paramDept || "Department Leadership",
          email: paramEmail || `${cleanId.toLowerCase()}@strideon.com`,
        });
        setIsResolvingManager(false);
        return;
      }

      // Query Supabase for the manager record
      try {
        const { data, error } = await supabase
          .from("department_managers")
          .select("*")
          .ilike("manager_id", cleanId)
          .maybeSingle();

        if (data) {
          setManagerDetails({
            manager_id: data.manager_id,
            name: data.name,
            role: data.role || "Department Manager",
            department_name: data.department_name || "Department Leadership",
            email: data.email,
            phone: data.phone,
          });
          setIsResolvingManager(false);
          return;
        }
      } catch {
        // network or supabase fallback
      }

      // Fallback to seeded managers list
      const fallback = SEEDED_MANAGERS.find((m) => m.manager_id.toUpperCase() === cleanId) || SEEDED_MANAGERS[0];
      setManagerDetails(fallback);
      setManagerId(fallback.manager_id);
      setIsResolvingManager(false);
    };

    resolveManager();
  }, [searchParams]);

  const handleManagerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorDetails(null);
    setSuccessMessage("");

    const trimmedPass = password.trim();

    if (!trimmedPass) {
      setErrorDetails({
        title: "Password Required",
        subtitle: "Please enter your Department Manager password to continue.",
      });
      return;
    }

    setIsLoading(true);

    // Accepted manager passwords
    const acceptedPasswords = [
      "Strideon#Permanent2026!",
      "Strideon#Excellence26",
      "Strideon#Manager2026!",
      typeof window !== "undefined" ? localStorage.getItem("userPassword") : null,
      typeof window !== "undefined" ? localStorage.getItem(`mgr_pass_${managerId}`) : null,
    ].filter((p): p is string => Boolean(p));

    const isValid = acceptedPasswords.some((p) => p === trimmedPass);

    if (!isValid) {
      setIsLoading(false);
      setErrorDetails({
        title: "Authentication Failed",
        subtitle: "The manager password entered does not match executive records. Try again.",
      });
      return;
    }

    // Success! Save manager session
    const resolvedName = managerDetails?.name || "Department Manager";
    const resolvedRole = managerDetails?.role || "Department Manager";
    const resolvedEmail = managerDetails?.email || "manager@strideon.com";

    if (typeof window !== "undefined") {
      localStorage.setItem("accountActivated", "true");
      localStorage.setItem("isManager", "true");
      localStorage.setItem("currentUserEmpId", managerId);
      localStorage.setItem("currentUserName", resolvedName);
      localStorage.setItem("currentUserRole", resolvedRole);
      localStorage.setItem("currentUserEmail", resolvedEmail);
      localStorage.setItem("activatedEmployeeId", managerId);
      localStorage.setItem(`accountActivated_${managerId.toUpperCase()}`, "true");
    }

    setIsLoading(false);
    setSuccessMessage(`Welcome back, ${resolvedName}! Authorizing executive portal...`);

    setTimeout(() => {
      router.push(`/manager/dashboard?managerId=${encodeURIComponent(managerId)}&name=${encodeURIComponent(resolvedName)}`);
    }, 700);
  };

  const handleSwitchManager = (chosen: ManagerDetails) => {
    setManagerId(chosen.manager_id);
    setManagerDetails(chosen);
    setShowSwitchModal(false);
    setPassword("");
    setErrorDetails(null);
    setSuccessMessage("");
  };

  const handleCustomSwitch = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = switchIdInput.trim().toUpperCase();
    if (!clean) {
      setSwitchError("Please enter a Manager ID.");
      return;
    }

    const seeded = SEEDED_MANAGERS.find((m) => m.manager_id.toUpperCase() === clean);
    if (seeded) {
      handleSwitchManager(seeded);
      return;
    }

    try {
      const { data } = await supabase
        .from("department_managers")
        .select("*")
        .ilike("manager_id", clean)
        .maybeSingle();

      if (data) {
        handleSwitchManager({
          manager_id: data.manager_id,
          name: data.name,
          role: data.role || "Department Manager",
          department_name: data.department_name || "Department Leadership",
          email: data.email,
        });
        return;
      }
    } catch {
      // ignore
    }

    setSwitchError("Manager ID not found in records. Try MGR-2026-101 or MGR-2026-102.");
  };

  return (
    <main className="min-h-screen w-full flex flex-col lg:flex-row bg-black text-white font-sans antialiased overflow-x-hidden selection:bg-neutral-800 selection:text-white">
      {/* ======================================================== */}
      {/* LEFT SECTION (EXECUTIVE BRANDING & VISION)                */}
      {/* ======================================================== */}
      <section className="relative w-full lg:w-[48%] xl:w-[50%] bg-black flex flex-col justify-between p-8 sm:p-12 lg:p-16 min-h-[580px] lg:min-h-screen z-10 border-b lg:border-b-0 lg:border-r border-neutral-900 overflow-hidden">
        {/* Amber & White ambient lighting behind Jordan logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[460px] h-[340px] sm:h-[460px] bg-gradient-to-tr from-amber-500/15 via-white/[0.04] to-transparent rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

        {/* Top: Strideon Brand Logo & Back to Employee Login */}
        <header className="relative z-10 flex items-center justify-between">
          <Link
            href="/"
            className="transition-transform duration-300 hover:scale-105 inline-block"
            title="Return to Employee Login"
          >
            <Image
              src="/assets/strideon-transparent.png"
              alt="Strideon - Step In To Excellence"
              width={210}
              height={70}
              priority
              className="h-auto w-[180px] sm:w-[210px] object-contain drop-shadow-[0_2px_10px_rgba(255,255,255,0.08)]"
            />
          </Link>

          {/* Return link */}
          <Link
            href="/"
            className="text-xs font-medium text-neutral-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-800 bg-neutral-950/70 hover:border-neutral-700 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Employee Login</span>
          </Link>
        </header>

        {/* Middle: Welcome message & Jordan Jumpman Centerpiece */}
        <div className="relative z-10 my-8 lg:my-auto flex flex-col items-center justify-center text-center w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3 mx-auto">
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            <span>Executive & Leadership Portal</span>
          </div>

          <div className="max-w-md flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              Department Manager Access
            </h1>
            <p className="mt-3 text-neutral-400 text-sm sm:text-[15px] leading-relaxed max-w-sm">
              Welcome to the Strideon management suite. Oversee departmental operations, staff performance, and strategic goals.
            </p>
          </div>

          {/* Jordan Jumpman Centerpiece */}
          <div className="w-full flex items-center justify-center my-6 sm:my-10 lg:my-12">
            <div className="relative group cursor-pointer transition-transform duration-500 ease-out hover:scale-105 animate-float-slow">
              <div className="absolute inset-0 bg-amber-500/10 rounded-full filter blur-2xl group-hover:bg-amber-500/20 transition duration-500" />
              <Image
                src="/assets/jordan-transparent.png"
                alt="Air Jordan Logo"
                width={260}
                height={240}
                priority
                className="relative z-10 w-[200px] sm:w-[240px] lg:w-[270px] h-auto object-contain filter drop-shadow-[0_15px_30px_rgba(255,255,255,0.15)] select-none"
              />
            </div>
          </div>
        </div>

        {/* Bottom: 3 Leadership Pillars */}
        <footer className="relative z-10 w-full pt-4 border-t border-neutral-900/80">
          <div className="grid grid-cols-3 items-center text-center divide-x divide-neutral-800/90">
            {/* LEADERSHIP */}
            <div className="flex flex-col items-center justify-center px-2 group">
              <div className="h-9 flex items-center justify-center mb-1.5">
                <ShieldCheck className="w-6 h-6 text-amber-400 group-hover:text-amber-300 transition stroke-[1.8]" />
              </div>
              <h2 className="text-[11px] sm:text-xs font-bold tracking-wider text-white uppercase">
                LEADERSHIP
              </h2>
              <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-0.5 leading-tight">
                Guiding team vision
              </p>
            </div>

            {/* STRATEGY */}
            <div className="flex flex-col items-center justify-center px-2 group">
              <div className="h-9 flex items-center justify-center mb-1.5">
                <Building2 className="w-6 h-6 text-neutral-300 group-hover:text-white transition stroke-[1.8]" />
              </div>
              <h2 className="text-[11px] sm:text-xs font-bold tracking-wider text-white uppercase">
                STRATEGY
              </h2>
              <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-0.5 leading-tight">
                Operational excellence
              </p>
            </div>

            {/* TEAMWORK */}
            <div className="flex flex-col items-center justify-center px-2 group">
              <div className="h-9 flex items-center justify-center mb-1.5">
                <UserCheck className="w-6 h-6 text-neutral-300 group-hover:text-white transition stroke-[1.8]" />
              </div>
              <h2 className="text-[11px] sm:text-xs font-bold tracking-wider text-white uppercase">
                OVERSIGHT
              </h2>
              <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-0.5 leading-tight">
                Empowering staff growth
              </p>
            </div>
          </div>
        </footer>
      </section>

      {/* ======================================================== */}
      {/* RIGHT SECTION (MANAGER LOGIN CARD)                       */}
      {/* ======================================================== */}
      <section className="w-full lg:w-[52%] xl:w-[50%] bg-[#f4f5f8] text-neutral-900 flex flex-col justify-between items-center min-h-[640px] lg:min-h-screen p-6 sm:p-10 lg:p-12">
        {/* Top bar info */}
        <div className="w-full flex justify-between items-center">
          <Link
            href="/"
            className="text-xs font-medium text-neutral-500 hover:text-neutral-900 flex items-center gap-1 transition group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Employee Login</span>
          </Link>

          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full tracking-wider uppercase flex items-center gap-1">
            <Shield className="w-3 h-3 text-amber-600" />
            Executive Tier
          </span>
        </div>

        {/* Central Card */}
        <div className="w-full max-w-[460px] bg-white rounded-[28px] sm:rounded-[32px] p-7 sm:p-9 shadow-[0_25px_65px_-12px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.02)] border border-neutral-100 my-auto transition-all">
          {/* Card Top: Strideon Shoe Icon Emblem */}
          <div className="flex justify-center mb-2">
            <Image
              src="/assets/strideon-shoe-black.png"
              alt="Strideon Shoe Mark"
              width={54}
              height={44}
              priority
              className="w-12 h-auto object-contain filter drop-shadow-sm select-none"
            />
          </div>

          {/* Heading */}
          <div className="text-center mb-5">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
              Department Manager Login
            </h2>
            <p className="text-xs sm:text-[13px] text-neutral-500 mt-1.5 leading-relaxed">
              Verify your credentials to open the department administration console.
            </p>
          </div>

          {/* Verified Manager Profile Badge Card */}
          <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-neutral-50 to-amber-50/40 border border-neutral-200/90 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-neutral-900 text-amber-400 flex items-center justify-center shrink-0 font-bold shadow-sm">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                    {managerDetails?.name || "Aaron Tumaliuan"}
                  </h3>
                  <span className="text-[10px] font-mono bg-neutral-200/80 px-1.5 py-0.5 rounded text-neutral-700 font-semibold">
                    {managerId}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-600 truncate mt-0.5">
                  {managerDetails?.role || "Creative Director & Design Manager"}
                </p>
                <p className="text-[10px] text-amber-800 font-medium">
                  {managerDetails?.department_name || "Creative & Design"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowSwitchModal(true);
                setSwitchIdInput(managerId);
                setSwitchError("");
              }}
              className="shrink-0 text-[11px] font-medium text-neutral-600 hover:text-black hover:bg-white px-2.5 py-1.5 rounded-lg border border-neutral-200 transition cursor-pointer"
            >
              Change ID
            </button>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Banner */}
          {errorDetails && (
            <div className="mb-4 rounded-xl bg-[#ff7b87] border border-[#ff616f] p-3 flex items-start gap-3 shadow-md animate-fadeIn">
              <div className="w-7 h-7 rounded-full bg-[#d60000] flex items-center justify-center shrink-0 text-white shadow-sm font-bold text-sm mt-0.5">
                !
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white leading-snug">
                  {errorDetails.title}
                </p>
                <p className="text-[11px] text-white/95 mt-0.5 leading-tight">
                  {errorDetails.subtitle}
                </p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleManagerLogin} className="space-y-4">
            {/* Manager ID Display (Readonly) */}
            <div>
              <label className="block text-xs sm:text-[13px] font-medium text-neutral-700 mb-1.5">
                Verified Manager ID
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-neutral-400">
                  <CreditCard className="w-4 h-4 stroke-[1.8]" />
                </div>
                <input
                  type="text"
                  value={managerId}
                  readOnly
                  className="w-full rounded-xl bg-neutral-100 pl-10 pr-4 py-2.5 text-xs sm:text-sm font-mono text-neutral-800 font-semibold cursor-not-allowed outline-none border border-neutral-200"
                />
                <BadgeCheck className="w-4 h-4 text-emerald-600 absolute right-3.5" />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs sm:text-[13px] font-medium text-neutral-700">
                  Manager Password
                </label>
                <button
                  type="button"
                  onClick={() => setPassword("Strideon#Permanent2026!")}
                  className="text-[11px] text-amber-700 hover:text-amber-900 font-medium cursor-pointer"
                >
                  Autofill Default
                </button>
              </div>

              <div className="relative flex items-center">
                <div className="absolute left-3.5 pointer-events-none text-neutral-400">
                  <Lock className="w-4 h-4 stroke-[1.8]" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorDetails) setErrorDetails(null);
                  }}
                  placeholder="Enter your permanent manager password"
                  autoFocus
                  className="w-full rounded-xl bg-white pl-10 pr-10 py-2.5 text-xs sm:text-sm placeholder:text-neutral-400 outline-none border border-neutral-300 text-neutral-900 focus:border-black focus:ring-1 focus:ring-black transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 p-1 text-neutral-400 hover:text-neutral-700 transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password notice */}
            <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-2.5 text-[11px] text-neutral-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Default executive password: <code className="bg-white px-1.5 py-0.5 rounded border border-neutral-200 font-mono text-[10px] text-neutral-900 font-bold">Strideon#Permanent2026!</code>
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isResolvingManager}
              className="w-full font-medium text-sm py-3 sm:py-3.5 rounded-xl sm:rounded-full transition duration-150 shadow-md flex items-center justify-center gap-2 cursor-pointer bg-black hover:bg-neutral-800 text-white active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed mt-3"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Log in to Management Console</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Links & Sub-actions */}
          <div className="mt-5 space-y-2 text-center">
            <div>
              <Link
                href="/"
                className="text-xs text-neutral-500 hover:text-neutral-900 transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Not a Department Manager? Back to Employee Login</span>
              </Link>
            </div>

            <div className="pt-2 text-[11px] text-neutral-400 leading-normal">
              Need manager credential assistance? Contact Executive IT
              <br />
              <a
                href="mailto:support@strideon.com"
                className="font-semibold text-neutral-800 hover:underline"
              >
                support@strideon.com
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full text-center py-4 text-xs text-neutral-400 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <span>&copy; 2026 Strideon. Executive Portal.</span>
          <span className="text-neutral-300">|</span>
          <Link href="/" className="hover:text-neutral-700 transition">
            Employee Login
          </Link>
          <span className="text-neutral-300">|</span>
          <Link href="/activate" className="hover:text-neutral-700 transition">
            Account Activation
          </Link>
        </footer>
      </section>

      {/* ======================================================== */}
      {/* SWITCH MANAGER MODAL                                     */}
      {/* ======================================================== */}
      {showSwitchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white text-neutral-900 rounded-2xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative border border-neutral-100">
            <h3 className="text-base font-bold text-neutral-900 mb-1">
              Select Department Manager
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Enter your assigned Department Manager ID to switch account:
            </p>

            {/* Custom input */}
            <form onSubmit={handleCustomSwitch} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                  Manager ID:
                </label>
                <input
                  type="text"
                  value={switchIdInput}
                  onChange={(e) => {
                    setSwitchIdInput(e.target.value.toUpperCase());
                    if (switchError) setSwitchError("");
                  }}
                  placeholder="e.g. MGR-2026-103"
                  className="w-full rounded-xl bg-neutral-50 border border-neutral-300 px-3.5 py-2 text-xs font-mono uppercase text-neutral-900 outline-none focus:bg-white focus:border-black"
                />
              </div>

              {switchError && (
                <p className="text-xs text-red-600 font-medium">{switchError}</p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSwitchModal(false)}
                  className="px-4 py-2 text-xs rounded-lg text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-black text-white hover:bg-neutral-800 cursor-pointer"
                >
                  Confirm ID
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default function ManagerLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center text-white">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      }
    >
      <ManagerLoginContent />
    </Suspense>
  );
}
