"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Eye,
  EyeOff,
  Mail,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Users,
  ChevronRight,
  BadgeCheck
} from "lucide-react";

import { supabase } from "@/lib/supabase";

interface EmployeeAccount {
  id: string;
  aliases: string[];
  name: string;
  email: string;
  validPasswords: string[];
  template: "second" | "primary";
}

const REGISTERED_EMPLOYEES: EmployeeAccount[] = [
  {
    id: "EMP-2026-815",
    aliases: ["EMP-2026-815", "EMP-815", "815264", "RED", "RED REYES"],
    name: "Red Reyes",
    email: "tumaliuanron@gmail.com",
    validPasswords: ["Strideon#Red2026!", "Strideon#Permanent2026!", "Strideon#Excellence26"],
    template: "second",
  },
  {
    id: "EMP-2026-904",
    aliases: ["EMP-2026-904", "EMP-904", "904261", "AARON", "AARON TUMALIUAN"],
    name: "Aaron Tumaliuan",
    email: "aaron.tumaliuan@gmail.com",
    validPasswords: ["Strideon#TempPass26", "Strideon#Permanent2026!", "Strideon#Excellence26"],
    template: "primary",
  },
];

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isAccountActivated, setIsAccountActivated] = useState(false);

  // Error state for field-level highlighting & red banners
  const [errorField, setErrorField] = useState<"employeeId" | "password" | null>(null);
  const [errorDetails, setErrorDetails] = useState<{ title: string; subtitle: string } | null>(null);

  // Modals
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // Helper to determine if an employee account has been activated & verified
  const checkEmployeeActivation = async (emp: EmployeeAccount): Promise<boolean> => {
    if (typeof window === "undefined") return false;

    const empKey = emp.id.toUpperCase();
    const localFlag = localStorage.getItem(`accountActivated_${empKey}`);

    // If explicitly verified in localStorage, return true
    if (localFlag === "true") return true;

    // Check Supabase employees and users table for this employee's email
    try {
      const { data: empData } = await supabase
        .from("employees")
        .select("status")
        .eq("email", emp.email.trim().toLowerCase())
        .maybeSingle();

      if (empData) {
        if (empData.status === "active") {
          localStorage.setItem(`accountActivated_${empKey}`, "true");
          return true;
        } else if (empData.status === "pending") {
          localStorage.setItem(`accountActivated_${empKey}`, "false");
          return false;
        }
      }

      const { data: userData } = await supabase
        .from("users")
        .select("status")
        .eq("email", emp.email.trim().toLowerCase())
        .maybeSingle();

      if (userData) {
        if (userData.status === "active") {
          localStorage.setItem(`accountActivated_${empKey}`, "true");
          return true;
        } else if (userData.status === "pending") {
          localStorage.setItem(`accountActivated_${empKey}`, "false");
          return false;
        }
      }
    } catch {
      // Supabase offline / network error handling
    }

    // Explicitly unactivated if set to false
    if (localFlag === "false") return false;

    // Red Reyes requires activation & verification before accessing the dashboard
    if (empKey.includes("815") || emp.name.toLowerCase().includes("red")) {
      return false;
    }

    // Fallback for Aaron Tumaliuan
    return localStorage.getItem("accountActivated") === "true";
  };

  // Check if returning from activation/verification
  useEffect(() => {
    const activatedParam = searchParams.get("activated") === "true";
    const empParam = searchParams.get("empId");

    if (activatedParam) {
      setIsAccountActivated(true);
      if (empParam) {
        setEmployeeId(empParam);
        if (typeof window !== "undefined") {
          localStorage.setItem(`accountActivated_${empParam.toUpperCase()}`, "true");
        }
      } else if (typeof window !== "undefined") {
        const storedEmpId =
          localStorage.getItem("activatedEmployeeId") || localStorage.getItem("activationEmployeeId");
        if (storedEmpId) setEmployeeId(storedEmpId);
      }
      setSuccessMessage("Account successfully verified and activated! Please log in with your permanent password.");
    } else {
      if (typeof window !== "undefined") {
        // Red Reyes is unactivated by default unless explicitly verified
        if (!localStorage.getItem("accountActivated_EMP-2026-815")) {
          localStorage.setItem("accountActivated_EMP-2026-815", "false");
        }
      }
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorField(null);
    setErrorDetails(null);
    setSuccessMessage("");

    const trimmedId = employeeId.trim();
    const trimmedPass = password.trim();

    // 1. Check if Employee ID is empty
    if (!trimmedId) {
      setErrorField("employeeId");
      setErrorDetails({
        title: "Employee is not existed",
        subtitle: "Please enter your Employee ID. Try again.",
      });
      return;
    }

    // 2. Check if Password is empty
    if (!trimmedPass) {
      setErrorField("password");
      setErrorDetails({
        title: "Incorrect id or password",
        subtitle: "Please enter your password. Try again.",
      });
      return;
    }

    setIsLoading(true);

    const upperId = trimmedId.toUpperCase();
    const storedActivatedId =
      typeof window !== "undefined"
        ? (localStorage.getItem("activatedEmployeeId") || localStorage.getItem("activationEmployeeId"))?.toUpperCase()
        : null;
    const storedPassword =
      typeof window !== "undefined" ? localStorage.getItem("userPassword") : null;

    const matchedEmployee = REGISTERED_EMPLOYEES.find(
      (emp) =>
        emp.id.toUpperCase() === upperId ||
        emp.aliases.some((alias) => alias.toUpperCase() === upperId) ||
        storedActivatedId === upperId
    );

    // Condition A: Employee ID does not exist in any account
    if (!matchedEmployee && storedActivatedId !== upperId) {
      setIsLoading(false);
      setErrorField("employeeId");
      setErrorDetails({
        title: "Employee is not existed",
        subtitle: "Employee ID was not found in our system. Try again.",
      });
      return;
    }

    // Condition B: Employee exists, verify password
    const acceptedPasswords: string[] = [
      ...(matchedEmployee?.validPasswords || []),
      storedPassword,
      "Strideon#Permanent2026!",
      "Strideon#Excellence26",
    ].filter((p): p is string => Boolean(p));

    const isPasswordValid = acceptedPasswords.some((p) => p === trimmedPass);

    if (!isPasswordValid) {
      setIsLoading(false);
      setErrorField("password");
      setErrorDetails({
        title: "Incorrect id or password",
        subtitle: "The password you entered does not match our records. Try again.",
      });
      return;
    }

    // Build the resolved employee info
    const resolvedEmployee: EmployeeAccount = matchedEmployee || {
      id: trimmedId,
      aliases: [trimmedId],
      name: upperId.includes("815") ? "Red Reyes" : "Aaron Tumaliuan",
      email: upperId.includes("815") ? "tumaliuanron@gmail.com" : "aaron.tumaliuan@gmail.com",
      validPasswords: acceptedPasswords,
      template: upperId.includes("815") ? "second" : "primary",
    };

    // Condition C: Verify if employee has activated & verified their account
    const isActivated = await checkEmployeeActivation(resolvedEmployee);

    if (!isActivated) {
      // Employee has NOT activated & verified yet!
      setIsLoading(false);
      setErrorField("employeeId");
      setErrorDetails({
        title: "Account Not Activated",
        subtitle: `${resolvedEmployee.name}'s account has not been activated and verified yet. Redirecting to activate your account...`,
      });
      setSuccessMessage(
        `Account pending activation. Redirecting ${resolvedEmployee.name} to the activation page...`
      );

      setTimeout(() => {
        router.push(
          `/activate?empId=${encodeURIComponent(resolvedEmployee.id)}&name=${encodeURIComponent(resolvedEmployee.name)}&email=${encodeURIComponent(resolvedEmployee.email)}&template=${resolvedEmployee.template}`
        );
      }, 1500);
      return;
    }

    // Condition D: Verified & Activated Employee -> Proceed to Dashboard
    setIsLoading(false);
    setErrorField(null);
    setErrorDetails(null);

    const targetName = resolvedEmployee.name;
    const targetRole = upperId.includes("815") ? "Product Specialist" : "Graphic Designer";

    if (typeof window !== "undefined") {
      localStorage.setItem("accountActivated", "true");
      localStorage.setItem(`accountActivated_${resolvedEmployee.id.toUpperCase()}`, "true");
      localStorage.setItem("currentUserEmpId", trimmedId);
      localStorage.setItem("currentUserName", targetName);
      localStorage.setItem("currentUserRole", targetRole);
      localStorage.setItem("activatedEmployeeId", trimmedId);
    }

    setSuccessMessage(`Welcome back, ${targetName}! Redirecting to dashboard...`);
    setTimeout(() => {
      router.push(
        `/dashboard?empId=${encodeURIComponent(trimmedId)}&name=${encodeURIComponent(targetName)}`
      );
    }, 500);
  };

  const handleAutofillDemo = (who: "red" | "aaron" = "red") => {
    setErrorField(null);
    setErrorDetails(null);
    setSuccessMessage("");
    if (who === "red") {
      const isRedActive =
        typeof window !== "undefined" &&
        localStorage.getItem("accountActivated_EMP-2026-815") === "true";
      setEmployeeId("EMP-2026-815");
      setIsAccountActivated(isRedActive);
      setPassword(isRedActive ? "Strideon#Permanent2026!" : "Strideon#Red2026!");
    } else {
      const isAaronActive =
        typeof window !== "undefined" &&
        (localStorage.getItem("accountActivated_EMP-2026-904") === "true" ||
          (localStorage.getItem("accountActivated") === "true" &&
            !localStorage.getItem("activatedEmployeeId")?.includes("815")));
      setEmployeeId("EMP-2026-904");
      setIsAccountActivated(isAaronActive);
      setPassword(isAaronActive ? "Strideon#Permanent2026!" : "Strideon#TempPass26");
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSent(true);
    setTimeout(() => {
      setForgotSent(false);
      setShowForgotModal(false);
      setForgotEmail("");
      setSuccessMessage("Password reset instructions dispatched to your company email.");
    }, 1800);
  };

  return (
    <main className="min-h-screen w-full flex flex-col lg:flex-row bg-black text-white font-sans antialiased overflow-x-hidden selection:bg-neutral-800 selection:text-white">
      {/* ======================================================== */}
      {/* LEFT SECTION (BRAND & VISION / SHOWCASE)                 */}
      {/* ======================================================== */}
      <section className="relative w-full lg:w-[48%] xl:w-[50%] bg-black flex flex-col justify-between p-8 sm:p-12 lg:p-16 min-h-[580px] lg:min-h-screen z-10 border-b lg:border-b-0 lg:border-r border-neutral-900 overflow-hidden">
        {/* Subtle ambient lighting behind Jordan logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[460px] h-[340px] sm:h-[460px] bg-gradient-to-tr from-neutral-800/20 via-white/[0.04] to-transparent rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

        {/* Top: Strideon Brand Logo */}
        <header className="relative z-10 flex items-center justify-between">
          <div className="transition-transform duration-300 hover:scale-105 inline-block">
            <Image
              src="/assets/strideon-transparent.png"
              alt="Strideon - Step In To Excellence"
              width={210}
              height={70}
              priority
              className="h-auto w-[180px] sm:w-[210px] object-contain drop-shadow-[0_2px_10px_rgba(255,255,255,0.08)]"
            />
          </div>

          {/* Quick Demo Helper badges */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => handleAutofillDemo("red")}
              className={`text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-full border transition flex items-center gap-1 cursor-pointer ${
                employeeId === "EMP-2026-815"
                  ? "border-emerald-500/70 bg-emerald-950/70 text-emerald-300 shadow-sm"
                  : "border-neutral-800 bg-neutral-950/80 text-neutral-400 hover:text-white hover:border-neutral-700"
              }`}
              title="Test with Red Reyes (Template 2: io88mhe)"
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Red Reyes</span>
            </button>

            <button
              type="button"
              onClick={() => handleAutofillDemo("aaron")}
              className={`text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-full border transition flex items-center gap-1 cursor-pointer ${
                employeeId === "EMP-2026-904"
                  ? "border-sky-500/70 bg-sky-950/70 text-sky-300 shadow-sm"
                  : "border-neutral-800 bg-neutral-950/80 text-neutral-400 hover:text-white hover:border-neutral-700"
              }`}
              title="Test with Aaron Tumaliuan (Template 1: wyb7b2p)"
            >
              <span>Aaron T.</span>
            </button>
          </div>
        </header>

        {/* Middle: Welcome message & Jordan Jumpman Centerpiece */}
        <div className="relative z-10 my-8 lg:my-auto flex flex-col items-start w-full">
          {/* Welcome Text */}
          <div className="max-w-md">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              Welcome Back!
            </h1>
            <p className="mt-3 text-neutral-400 text-sm sm:text-[15px] leading-relaxed">
              Log into your Strideon account to continue your journey with us.
            </p>
          </div>

          {/* Jordan Jumpman Centerpiece */}
          <div className="w-full flex items-center justify-center my-6 sm:my-10 lg:my-12">
            <div className="relative group cursor-pointer transition-transform duration-500 ease-out hover:scale-105 animate-float-slow">
              <div className="absolute inset-0 bg-white/5 rounded-full filter blur-2xl group-hover:bg-white/10 transition duration-500" />
              <Image
                src="/assets/jordan-transparent.png"
                alt="Air Jordan Logo"
                width={260}
                height={240}
                priority
                className="relative z-10 w-[200px] sm:w-[240px] lg:w-[270px] h-auto object-contain filter drop-shadow-[0_15px_30px_rgba(255,255,255,0.12)] select-none"
              />
            </div>
          </div>
        </div>

        {/* Bottom: 3 Pillars (QUALITY, INNOVATION, TEAMWORK) */}
        <footer className="relative z-10 w-full pt-4 border-t border-neutral-900/80">
          <div className="grid grid-cols-3 items-center text-center divide-x divide-neutral-800/90">
            {/* QUALITY */}
            <div className="flex flex-col items-center justify-center px-2 group">
              <div className="h-9 flex items-center justify-center mb-1.5">
                <Image
                  src="/assets/icon-quality.png"
                  alt="Quality Sneaker"
                  width={34}
                  height={30}
                  className="w-7 h-auto object-contain filter brightness-90 group-hover:brightness-110 transition"
                />
              </div>
              <h2 className="text-[11px] sm:text-xs font-bold tracking-wider text-white uppercase">
                QUALITY
              </h2>
              <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-0.5 leading-tight">
                Crafted for performance
              </p>
            </div>

            {/* INNOVATION (with ShieldCheck icon) */}
            <div className="flex flex-col items-center justify-center px-2 group">
              <div className="h-9 flex items-center justify-center mb-1.5">
                <ShieldCheck className="w-6 h-6 text-neutral-300 group-hover:text-sky-400 transition stroke-[1.8]" />
              </div>
              <h2 className="text-[11px] sm:text-xs font-bold tracking-wider text-white uppercase">
                INNOVATION
              </h2>
              <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-0.5 leading-tight">
                Designed for every step
              </p>
            </div>

            {/* TEAMWORK */}
            <div className="flex flex-col items-center justify-center px-2 group">
              <div className="h-9 flex items-center justify-center mb-1.5">
                <Image
                  src="/assets/icon-teamwork.png"
                  alt="Teamwork Group"
                  width={34}
                  height={30}
                  className="w-7 h-auto object-contain filter brightness-90 group-hover:brightness-110 transition"
                />
              </div>
              <h2 className="text-[11px] sm:text-xs font-bold tracking-wider text-white uppercase">
                TEAMWORK
              </h2>
              <p className="text-[10px] sm:text-[11px] text-neutral-400 mt-0.5 leading-tight">
                Stride together, grow together
              </p>
            </div>
          </div>
        </footer>
      </section>

      {/* ======================================================== */}
      {/* RIGHT SECTION (SLEEK LIGHT LOGIN FORM CONTAINER)         */}
      {/* ======================================================== */}
      <section className="w-full lg:w-[52%] xl:w-[50%] bg-[#f4f5f8] text-neutral-900 flex flex-col justify-between items-center min-h-[640px] lg:min-h-screen p-6 sm:p-10 lg:p-12">
        {/* Top bar info with direct link to activation */}
        <div className="w-full flex justify-between items-center">
          <Link
            href="/activate"
            className="text-xs font-medium text-neutral-500 hover:text-neutral-900 flex items-center gap-1 transition group"
          >
            <span>First time? Activate Account</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <span className="text-[11px] font-semibold text-neutral-400 tracking-wider uppercase">
            Portal v2.6
          </span>
        </div>

        {/* Central Floating Card (matches mockup exactly) */}
        <div className="w-full max-w-[440px] bg-white rounded-[28px] sm:rounded-[32px] p-7 sm:p-9 shadow-[0_25px_65px_-12px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.02)] border border-neutral-100 my-auto transition-all">
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

          {/* Heading & Subtitle */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
              Log in to Strideon
            </h2>
            <p className="text-xs sm:text-[13px] text-neutral-500 mt-1.5 leading-relaxed">
              {isAccountActivated
                ? "Your account is verified. Enter your password to access your dashboard."
                : "Access your account using your Employee ID and password."}
            </p>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* The Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Employee ID */}
            <div>
              <label
                htmlFor="employeeId"
                className={`block text-xs sm:text-[13px] mb-1.5 transition-colors ${
                  errorField === "employeeId"
                    ? "text-[#d60000] font-semibold"
                    : "text-neutral-800 font-medium"
                }`}
              >
                Employee ID
              </label>
              <div className="relative flex items-center">
                <div
                  className={`absolute left-3.5 pointer-events-none transition-colors ${
                    errorField === "employeeId" ? "text-[#d60000]" : "text-neutral-400"
                  }`}
                >
                  <CreditCard className="w-4 h-4 stroke-[1.8]" />
                </div>
                <input
                  id="employeeId"
                  name="employeeId"
                  type="text"
                  value={employeeId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEmployeeId(val);
                    if (errorField === "employeeId") {
                      setErrorField(null);
                      setErrorDetails(null);
                    }
                    if (typeof window !== "undefined") {
                      const clean = val.trim().toUpperCase();
                      const isAct = localStorage.getItem(`accountActivated_${clean}`) === "true";
                      setIsAccountActivated(isAct);
                    }
                  }}
                  placeholder="Enter your Employee ID"
                  className={`w-full rounded-xl bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm placeholder:text-neutral-400 outline-none transition duration-150 ${
                    errorField === "employeeId"
                      ? "border-2 border-[#d60000] text-[#d60000] focus:border-[#d60000] focus:ring-1 focus:ring-[#d60000]"
                      : "border border-neutral-300 text-neutral-900 focus:border-black focus:ring-1 focus:ring-black"
                  }`}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className={`block text-xs sm:text-[13px] mb-1.5 transition-colors ${
                  errorField === "password"
                    ? "text-[#d60000] font-semibold"
                    : "text-neutral-800 font-medium"
                }`}
              >
                Password
              </label>
              <div className="relative flex items-center">
                <div
                  className={`absolute left-3.5 pointer-events-none transition-colors ${
                    errorField === "password" ? "text-[#d60000]" : "text-neutral-400"
                  }`}
                >
                  <Lock className="w-4 h-4 stroke-[1.8]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorField === "password") {
                      setErrorField(null);
                      setErrorDetails(null);
                    }
                  }}
                  placeholder={isAccountActivated ? "Enter your permanent password" : "Enter your password"}
                  className={`w-full rounded-xl bg-white pl-10 pr-10 py-2.5 text-xs sm:text-sm placeholder:text-neutral-400 outline-none transition duration-150 ${
                    errorField === "password"
                      ? "border-2 border-[#d60000] text-[#d60000] focus:border-[#d60000] focus:ring-1 focus:ring-[#d60000]"
                      : "border border-neutral-300 text-neutral-900 focus:border-black focus:ring-1 focus:ring-black"
                  }`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className={`absolute right-3 p-1 transition cursor-pointer ${
                    errorField === "password"
                      ? "text-[#d60000] hover:text-red-700"
                      : "text-neutral-400 hover:text-neutral-700"
                  }`}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Notification Banner (matches mockups) */}
            {errorDetails && (
              <div className="rounded-xl sm:rounded-2xl bg-[#ff7b87] border border-[#ff616f] p-3 sm:p-3.5 flex items-start gap-3 shadow-md animate-fadeIn">
                <div className="w-8 h-8 rounded-full bg-[#d60000] flex items-center justify-center shrink-0 text-white shadow-sm font-bold text-base mt-0.5">
                  !
                </div>
                <div className="text-left">
                  <p className="text-[12.5px] font-bold text-white leading-snug">
                    {errorDetails.title}
                  </p>
                  <p className="text-[11px] text-white/95 mt-0.5 leading-tight">
                    {errorDetails.subtitle}
                  </p>
                </div>
              </div>
            )}

            {/* Cyan Info Notice Banner (shown when no error and first-time login) */}
            {!errorDetails && !isAccountActivated && (
              <div className="rounded-xl sm:rounded-2xl bg-[#daf6fe] border border-[#b8f0fd] p-3 sm:p-3.5 flex items-start gap-3 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#38ccf6] flex items-center justify-center shrink-0 text-white shadow-sm mt-0.5">
                  <Mail className="w-4 h-4 fill-white/20 stroke-[2.2]" />
                </div>
                <div className="text-left">
                  <p className="text-[12.5px] font-bold text-neutral-900 leading-snug">
                    Default password will be sent to your email
                  </p>
                  <p className="text-[11px] text-neutral-600 mt-0.5 leading-tight">
                    Your default password has been sent to your company email. Please check your inbox.
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button (Turns Red when error is active, as in mockups) */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full font-medium text-sm py-3 sm:py-3.5 rounded-xl sm:rounded-full transition duration-150 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed mt-2 ${
                errorField
                  ? "bg-[#cf0000] hover:bg-[#b00000] text-white shadow-red-900/20 active:scale-[0.99]"
                  : "bg-black hover:bg-neutral-800 text-white shadow-black/10 active:scale-[0.99]"
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Log in</span>
              )}
            </button>
          </form>

          {/* Links & Sub-actions */}
          <div className="mt-4 space-y-2.5 text-center">
            <div>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs text-neutral-500 hover:text-neutral-900 transition font-normal cursor-pointer"
              >
                Forgot your password?
              </button>
            </div>

            <div className="text-xs text-neutral-500">
              <span>Don&apos;t have an Account yet? </span>
              <Link
                href="/activate"
                className="font-bold text-neutral-900 hover:underline cursor-pointer"
              >
                Create one
              </Link>
            </div>

            <div className="pt-2 text-[11px] text-neutral-400 leading-normal">
              Need help? Contact our HR department
              <br />
              or email{" "}
              <a
                href="mailto:support@strideon.com"
                className="font-semibold text-neutral-800 hover:underline"
              >
                support@strideon.com
              </a>
            </div>
          </div>
        </div>

        {/* Page Bottom Footer */}
        <footer className="w-full text-center py-4 text-xs text-neutral-400 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <span>&copy; 2026 Strideon. All rights reserved.</span>
          <span className="text-neutral-300">|</span>
          <button
            type="button"
            onClick={() => alert("Strideon Privacy Policy is available in company handbook.")}
            className="hover:text-neutral-700 transition cursor-pointer"
          >
            Private Policy
          </button>
          <span className="text-neutral-300">|</span>
          <button
            type="button"
            onClick={() => alert("Strideon Terms of Use & Employee Acceptable Use Policy.")}
            className="hover:text-neutral-700 transition cursor-pointer"
          >
            Term of Use
          </button>
        </footer>
      </section>

      {/* ======================================================== */}
      {/* FORGOT PASSWORD MODAL                                    */}
      {/* ======================================================== */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white text-neutral-900 rounded-2xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative border border-neutral-100">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 p-1 rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900">Reset Password</h3>
                <p className="text-xs text-neutral-500">
                  Receive recovery instructions at your company email
                </p>
              </div>
            </div>

            {forgotSent ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="font-semibold text-sm">Recovery Link Sent!</h4>
                <p className="text-xs text-neutral-500">
                  Check your company email for instructions to reset your password.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Company Email or Employee ID
                  </label>
                  <input
                    type="text"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="e.g. employee@strideon.com or EMP-102"
                    className="w-full text-xs sm:text-sm rounded-xl border border-neutral-300 p-2.5 focus:border-black focus:ring-1 focus:ring-black outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="text-xs px-4 py-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-xs px-4 py-2 rounded-lg bg-black text-white hover:bg-neutral-800 font-medium cursor-pointer"
                  >
                    Send Instructions
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center text-white text-sm">
          Loading Strideon Login...
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
