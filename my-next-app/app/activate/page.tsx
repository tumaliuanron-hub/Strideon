"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { sendVerificationCode } from "@/lib/emailService";
import { supabase } from "@/lib/supabase";
import {
  CreditCard,
  Mail,
  User,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  Building,
  KeyRound,
  Send,
  Clock
} from "lucide-react";

function ActivateAccountContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  // Load existing cooldown from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUntil = localStorage.getItem("ems_activation_cooldown_until");
      if (storedUntil) {
        const remaining = Math.ceil((parseInt(storedUntil, 10) - Date.now()) / 1000);
        if (remaining > 0) {
          setCooldownSeconds(remaining);
        } else {
          localStorage.removeItem("ems_activation_cooldown_until");
        }
      }
    }
  }, []);

  // Real-time 1-second countdown ticker
  useEffect(() => {
    if (cooldownSeconds <= 0) return;

    const timer = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (typeof window !== "undefined") {
            localStorage.removeItem("ems_activation_cooldown_until");
          }
          setErrorMessage("");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  // Pre-fill employee ID and name from query params or recent session
  // Email is intentionally NOT pre-filled so the employee enters it manually
  useEffect(() => {
    const idParam = searchParams.get("empId");
    const nameParam = searchParams.get("name");

    if (nameParam) {
      setName(nameParam);
    } else if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("activationName");
      if (storedName) setName(storedName);
    }

    if (idParam) {
      setEmployeeId(idParam);
    } else if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("activationEmployeeId");
      if (storedId) setEmployeeId(storedId);
    }

    // Keep email blank so the employee manually inputs their email address
    setCompanyEmail("");
  }, [searchParams]);


  const handleSendActivationCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Prevent submission while countdown cooldown is active
    if (cooldownSeconds > 0) {
      return;
    }

    if (!name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!companyEmail.trim() || !companyEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const result = await sendVerificationCode({
        email: companyEmail.trim(),
        name: name.trim(),
        employeeId: employeeId.trim() || "EMP-2026-815",
        companyName: "Tumaliuan EMS",
      });

      const isRedReyes =
        name.toLowerCase().includes("red") ||
        employeeId.includes("815") ||
        employeeId.toLowerCase().includes("red");

      const recipientText =
        isRedReyes && companyEmail.trim().toLowerCase() !== "tumaliuanron@gmail.com"
          ? `${companyEmail.trim()} and tumaliuanron@gmail.com`
          : companyEmail.trim();

      if (result.success) {
        setSuccessMessage(
          `Activation code dispatched to ${recipientText} and recorded in Supabase (status: pending)! Redirecting to verification...`
        );

        // Start 45s cooldown
        setCooldownSeconds(45);
        if (typeof window !== "undefined") {
          localStorage.setItem("ems_activation_cooldown_until", (Date.now() + 45 * 1000).toString());
        }

        // Proceed to /verify only when email sending succeeds
        setTimeout(() => {
          router.push(
            `/verify?empId=${encodeURIComponent(employeeId.trim())}&email=${encodeURIComponent(companyEmail.trim())}`
          );
        }, 1200);
      } else {
        // Cooldown or error returned - do NOT redirect!
        let waitSec = result.cooldownRemaining || 0;
        if (!waitSec && result.message) {
          const match = result.message.match(/wait (\d+) seconds/i);
          if (match && match[1]) {
            waitSec = parseInt(match[1], 10);
          }
        }

        if (waitSec > 0) {
          setCooldownSeconds(waitSec);
          if (typeof window !== "undefined") {
            localStorage.setItem("ems_activation_cooldown_until", (Date.now() + waitSec * 1000).toString());
          }
          setErrorMessage("");
        } else {
          setErrorMessage(result.message || "Failed to dispatch email. Please check your credentials.");
        }
      }
    } catch (error) {
      console.error("Failed to send verification email:", error);
      setErrorMessage("Could not send email directly. Please verify your connection.");
    } finally {
      setLoading(false);
    }
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
          <Link
            href="/"
            className="transition-transform duration-300 hover:scale-105 inline-block"
            title="Return to Login"
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

          {/* Header Status Badge */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[11px] font-medium tracking-wide uppercase px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-950/50 text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Employee Activation</span>
            </span>
          </div>
        </header>

        {/* Middle: Activate Your Account Title & Jordan Jumpman */}
        <div className="relative z-10 my-8 lg:my-auto flex flex-col items-center justify-center text-center w-full">
          {/* Main Title & Tagline matching mockup */}
          <div className="max-w-md flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold tracking-tight text-white leading-[1.12]">
              Activate Your Account
            </h1>

            {/* Small accent line centered */}
            <div className="w-10 h-[2px] bg-white/40 my-3.5 mx-auto" />

            <p className="text-neutral-400 text-sm sm:text-[14.5px] leading-relaxed max-w-sm">
              Welcome to Strideon! Please activate your account using your Employee ID and Company Email to continue.
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

            {/* INNOVATION (with ShieldCheck icon matching the new mockup) */}
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
      {/* RIGHT SECTION (SLEEK LIGHT ACTIVATION CARD)              */}
      {/* ======================================================== */}
      <section className="w-full lg:w-[52%] xl:w-[50%] bg-[#f4f5f8] text-neutral-900 flex flex-col justify-between items-center min-h-[640px] lg:min-h-screen p-6 sm:p-10 lg:p-12">
        {/* Top bar info */}
        <div className="w-full flex justify-between items-center">
          <Link
            href="/"
            className="text-xs font-medium text-neutral-500 hover:text-neutral-900 flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>

          <span className="text-[11px] font-semibold text-neutral-400 tracking-wider uppercase">
            Personnel Onboarding
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

          {/* Heading & Subtitle matching the mockup */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
              Activate Your Account
            </h2>
            <p className="text-xs sm:text-[13px] text-neutral-500 mt-1.5 leading-relaxed">
              Enter your Employee ID, Full Name, and Company Email to receive your 6-digit verification code.
            </p>
          </div>

          {/* Real-Time Cooldown / Error Feedback */}
          {(cooldownSeconds > 0 || errorMessage) && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200/80 text-red-700 text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>
                {cooldownSeconds > 0 ? (
                  <>
                    Please wait <strong className="font-semibold text-red-800">{cooldownSeconds} seconds</strong> before requesting a new verification code.
                  </>
                ) : (
                  errorMessage
                )}
              </span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Activation Form with EmailJS integration */}
          <form onSubmit={handleSendActivationCode} className="space-y-4">

            {/* Employee ID */}
            <div>
              <label
                htmlFor="employeeId"
                className="block text-xs sm:text-[13px] font-medium text-neutral-800 mb-1"
              >
                Employee ID
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-neutral-400 pointer-events-none">
                  <CreditCard className="w-4 h-4 stroke-[1.8]" />
                </div>
                <input
                  id="employeeId"
                  name="employeeId"
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="e.g. EMP-2026-904"
                  className="w-full rounded-xl border border-neutral-300 bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition duration-150"
                />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs sm:text-[13px] font-medium text-neutral-800 mb-1"
              >
                Full Name
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-neutral-400 pointer-events-none">
                  <User className="w-4 h-4 stroke-[1.8]" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your Full Name"
                  className="w-full rounded-xl border border-neutral-300 bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition duration-150"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="companyEmail"
                className="block text-xs sm:text-[13px] font-medium text-neutral-800 mb-1"
              >
                Email Address
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 text-neutral-400 pointer-events-none">
                  <Mail className="w-4 h-4 stroke-[1.8]" />
                </div>
                <input
                  id="companyEmail"
                  name="companyEmail"
                  type="email"
                  required
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  placeholder="Enter your Email Address"
                  className="w-full rounded-xl border border-neutral-300 bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition duration-150"
                />
              </div>
            </div>



            {/* Send Activation Code Button (Disabled while Cooldown is active) */}
            <button
              type="submit"
              disabled={loading || cooldownSeconds > 0}
              className={`w-full font-medium text-sm py-3 sm:py-3.5 rounded-xl sm:rounded-full transition duration-150 shadow-md flex items-center justify-center gap-2 mt-2 ${
                cooldownSeconds > 0
                  ? "bg-neutral-200 text-neutral-400 border border-neutral-300 cursor-not-allowed shadow-none"
                  : loading
                  ? "bg-neutral-800 text-white cursor-wait opacity-80"
                  : "bg-black hover:bg-neutral-800 active:scale-[0.99] text-white shadow-black/10 cursor-pointer"
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending Activation Code...</span>
                </div>
              ) : cooldownSeconds > 0 ? (
                <div className="flex items-center gap-2 font-mono">
                  <Clock className="w-4 h-4 text-neutral-400" />
                  <span>Please wait {cooldownSeconds}s</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Send Activation Code</span>
                  <Send className="w-3.5 h-3.5" />
                </div>
              )}
            </button>
          </form>

          {/* Links & Sub-actions */}
          <div className="mt-5 space-y-3 text-center">
            <div className="text-xs text-neutral-500">
              <span>Already have an account? </span>
              <Link
                href="/"
                className="font-bold text-neutral-900 hover:underline cursor-pointer"
              >
                Log in
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
    </main>
  );
}

export default function ActivatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center text-white text-sm">
          Loading Strideon Activation...
        </div>
      }
    >
      <ActivateAccountContent />
    </Suspense>
  );
}
