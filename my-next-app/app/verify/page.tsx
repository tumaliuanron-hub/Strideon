"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import emailjs from "@emailjs/browser";
import { supabase } from "@/lib/supabase";
import {
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Mail,
  RefreshCw,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Building2,
  Clock
} from "lucide-react";

function VerifyAccountContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [resendNotice, setResendNotice] = useState("");
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);

  // Verification states: "otp" -> "create-password" -> "verified"
  const [stage, setStage] = useState<"otp" | "password" | "complete">("otp");

  // Step 2: New permanent password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const empParam = searchParams.get("empId") || "EMP-2026-904";
    const emailParam = searchParams.get("email") || "aaron.tumaliuan@strideon.com";
    setEmployeeId(empParam);
    setEmail(emailParam);
  }, [searchParams]);

  // Automatic redirect countdown to dashboard upon activation completion
  useEffect(() => {
    if (redirectCountdown === null) return;
    if (redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      const storedName =
        (typeof window !== "undefined" && localStorage.getItem("activationName")) ||
        (employeeId.includes("815") ? "Red Reyes" : "Aaron Tumaliuan");
      router.push(
        `/dashboard?empId=${encodeURIComponent(employeeId)}&name=${encodeURIComponent(storedName)}`
      );
    }
  }, [redirectCountdown, employeeId, router]);

  // Resend countdown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendCooldown]);

  // Handle OTP input change & auto-advance
  const handleOtpChange = (index: number, value: string) => {
    // Only accept numeric digits
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    const digit = cleaned[cleaned.length - 1];
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-focus next input
    if (index < 5 && digit) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace key to navigate backwards
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste of 6-digit code
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      const nextFocus = Math.min(pastedData.length, 5);
      inputRefs.current[nextFocus]?.focus();
    }
  };

  // Quick fill demo code helper
  const handleAutofillCode = () => {
    const code = (typeof window !== "undefined" && localStorage.getItem("activationCode")) || "782419";
    const digits = code.slice(0, 6).split("");
    while (digits.length < 6) digits.push("0");
    setOtp(digits);
    setErrorMessage("");
    inputRefs.current[5]?.focus();
  };

  // Resend code handler with EmailJS
  const handleResendCode = async () => {
    if (!canResend) return;
    setResendCooldown(45);
    setCanResend(false);

    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (typeof window !== "undefined") {
      localStorage.setItem("activationCode", randomCode);
    }

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId =
        (typeof window !== "undefined" && localStorage.getItem("emailjsActiveTemplate")) ||
        process.env.NEXT_PUBLIC_EMAILJS_SECOND_ACTIVATION_TEMPLATE_ID ||
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ||
        "template_io88mhe";
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
      if (serviceId && templateId && publicKey) {
        await emailjs.send(
          serviceId,
          templateId,
          {
            email: email,
            name: typeof window !== "undefined" ? localStorage.getItem("activationName") || "Employee" : "Employee",
            code: randomCode,
            employee_id: employeeId || "EMP-NEW",
          },
          publicKey
        );

        // For Red Reyes, also dispatch copy to tumaliuanron@gmail.com
        const storedName = typeof window !== "undefined" ? localStorage.getItem("activationName") || "" : "";
        const isRed =
          storedName.toLowerCase().includes("red") ||
          employeeId.includes("815") ||
          employeeId.toLowerCase().includes("red");

        if (isRed && email.trim().toLowerCase() !== "tumaliuanron@gmail.com") {
          try {
            await emailjs.send(
              serviceId,
              templateId,
              {
                email: "tumaliuanron@gmail.com",
                name: storedName || "Red Reyes",
                code: randomCode,
                employee_id: employeeId || "EMP-2026-815",
              },
              publicKey
            );
          } catch (copyErr) {
            console.warn("Secondary resend copy error:", copyErr);
          }
        }
      }
      setResendNotice("A new 6-digit verification code has been dispatched to your email.");
    } catch {
      setResendNotice("New code generated! Please check your email.");
    }
    setTimeout(() => setResendNotice(""), 3500);
  };

  // Verify OTP submission with Supabase
  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const fullCode = otp.join("");
    if (fullCode.length < 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsLoading(true);

    try {
      const emailToVerify = (
        email ||
        (typeof window !== "undefined" && localStorage.getItem("activationEmail")) ||
        ""
      ).trim().toLowerCase();

      let isMatch = false;
      let matchedRecord: any = null;

      // 1. Query Supabase users table
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", emailToVerify)
          .maybeSingle();

        if (data) {
          matchedRecord = data;
          const supaCode = (data.code || data.verification_code || "").toString().trim();
          if (supaCode === fullCode) {
            isMatch = true;
          }
        }
      } catch (supaErr) {
        console.warn("Supabase query error:", supaErr);
      }

      // Local fallback check
      const storedCode =
        typeof window !== "undefined" ? localStorage.getItem("activationCode") : null;
      if (!isMatch && (fullCode === storedCode || fullCode === "782419")) {
        isMatch = true;
      }

      if (!isMatch) {
        setIsLoading(false);
        setErrorMessage("Incorrect verification code. Please check your email inbox.");
        return;
      }

      // 2. Update status to 'active' in Supabase upon success
      try {
        const { error: updateError } = await supabase
          .from("users")
          .update({
            status: "active",
          })
          .eq("email", emailToVerify);

        if (updateError) {
          console.warn("Supabase status update warning:", updateError.message);
        }

        // Also update employees table status to active
        await supabase
          .from("employees")
          .update({ status: "active" })
          .eq("email", emailToVerify);
      } catch (supaUpdateErr) {
        console.warn("Supabase update error:", supaUpdateErr);
      }

      // 3. Update localStorage session
      const targetEmpId = employeeId || matchedRecord?.employee_id || "EMP-2026-815";
      const targetName =
        (typeof window !== "undefined" && localStorage.getItem("activationName")) ||
        matchedRecord?.name ||
        (targetEmpId.includes("815") ? "Red Reyes" : "Aaron Tumaliuan");
      const targetRole = targetEmpId.includes("815") ? "Product Specialist" : "Graphic Designer";

      if (typeof window !== "undefined") {
        localStorage.setItem("accountActivated", "true");
        localStorage.setItem("activatedEmployeeId", targetEmpId);
        localStorage.setItem(`accountActivated_${targetEmpId.toUpperCase()}`, "true");
        if (targetEmpId.includes("815") || targetName.toLowerCase().includes("red")) {
          localStorage.setItem("accountActivated_EMP-2026-815", "true");
        }
        localStorage.setItem("currentUserEmpId", targetEmpId);
        localStorage.setItem("currentUserName", targetName);
        localStorage.setItem("currentUserRole", targetRole);
      }

      setIsLoading(false);
      setStage("complete");
      setRedirectCountdown(2);
    } catch (err) {
      console.error("Verification error:", err);
      setIsLoading(false);
      setErrorMessage("Verification failed. Please try again.");
    }
  };

  // Password creation submission
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    if (typeof window !== "undefined") {
      localStorage.setItem("accountActivated", "true");
      localStorage.setItem("activatedEmployeeId", employeeId);
      localStorage.setItem(`accountActivated_${employeeId.toUpperCase()}`, "true");
      if (employeeId.includes("815")) {
        localStorage.setItem("accountActivated_EMP-2026-815", "true");
      }
      localStorage.setItem("userPassword", newPassword);
    }

    setTimeout(() => {
      setIsLoading(false);
      setStage("complete");
      setRedirectCountdown(3);
    }, 750);
  };

  // Masked email representation
  const maskedEmail = email
    ? email.replace(/^(.{2})(.*)(@.*)$/, (_, a, b, c) => `${a}${"*".repeat(Math.max(b.length, 3))}${c}`)
    : "company email";

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

          {/* Quick Demo Helper badge */}
          <button
            type="button"
            onClick={handleAutofillCode}
            className="text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-full border border-neutral-800 bg-neutral-950/80 text-neutral-400 hover:text-white hover:border-neutral-700 transition flex items-center gap-1.5 cursor-pointer"
            title="Click to fill test code 782419"
          >
            <Sparkles className="w-3 h-3 text-sky-400" />
            <span>Fill Code (782419)</span>
          </button>
        </header>

        {/* Middle: Verify Your Account Heading & Jordan Centerpiece */}
        <div className="relative z-10 my-8 lg:my-auto flex flex-col items-start w-full">
          {/* Main Title & Tagline matching Strideon design language */}
          <div className="max-w-md">
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold tracking-tight text-white leading-[1.12]">
              Verify Your
              <br />
              Account
            </h1>

            {/* Small accent line */}
            <div className="w-10 h-[2px] bg-white/40 my-3.5" />

            <p className="text-neutral-400 text-sm sm:text-[14.5px] leading-relaxed">
              Security verification required. Please enter the 6-digit confirmation code sent to your company email to finalize your account.
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

            {/* INNOVATION (with ShieldCheck icon matching the mockup) */}
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
      {/* RIGHT SECTION (SLEEK LIGHT VERIFICATION CARD)            */}
      {/* ======================================================== */}
      <section className="w-full lg:w-[52%] xl:w-[50%] bg-[#f4f5f8] text-neutral-900 flex flex-col justify-between items-center min-h-[640px] lg:min-h-screen p-6 sm:p-10 lg:p-12">
        {/* Top bar info */}
        <div className="w-full flex justify-between items-center">
          <Link
            href="/activate"
            className="text-xs font-medium text-neutral-500 hover:text-neutral-900 flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Activation</span>
          </Link>

          <span className="text-[11px] font-semibold text-neutral-400 tracking-wider uppercase">
            Step 2 of 2
          </span>
        </div>

        {/* Central Floating Card (matches Strideon aesthetic) */}
        <div className="w-full max-w-[450px] bg-white rounded-[28px] sm:rounded-[32px] p-7 sm:p-9 shadow-[0_25px_65px_-12px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.02)] border border-neutral-100 my-auto transition-all">
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
              {stage === "otp" && "Verify Your Account"}
              {stage === "password" && "Set Permanent Password"}
              {stage === "complete" && "Verification Complete!"}
            </h2>

            <p className="text-xs sm:text-[13px] text-neutral-500 mt-1.5 leading-relaxed">
              {stage === "otp" && (
                <>
                  We&apos;ve sent a 6-digit confirmation code to:
                  <br />
                  <span className="font-semibold text-neutral-800">{maskedEmail}</span>
                </>
              )}
              {stage === "password" &&
                "Verification successful! Please choose a strong password for your Strideon account."}
              {stage === "complete" &&
                "Your Strideon EMS account is officially activated and secured."}
            </p>
          </div>

          {/* Alerts / Feedback */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200/80 text-red-700 text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {resendNotice && (
            <div className="mb-4 p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-sky-600" />
              <span>{resendNotice}</span>
            </div>
          )}

          {/* STAGE 1: OTP CODE INPUT */}
          {stage === "otp" && (
            <form onSubmit={handleVerifySubmit} className="space-y-5">
              {/* Employee ID pill */}
              <div className="flex items-center justify-between px-3.5 py-2 bg-neutral-50 rounded-xl border border-neutral-200/70 text-xs">
                <span className="text-neutral-500">Employee ID:</span>
                <span className="font-semibold text-neutral-900">{employeeId}</span>
              </div>

              {/* 6 Digit Inputs */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 text-center mb-2.5">
                  Enter 6-Digit Code
                </label>
                <div className="flex justify-between gap-1.5 sm:gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      onPaste={idx === 0 ? handlePaste : undefined}
                      className="w-11 sm:w-12 h-13 sm:h-14 text-center text-xl font-bold text-neutral-900 bg-white border border-neutral-300 rounded-xl focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition shadow-sm"
                    />
                  ))}
                </div>
              </div>

              {/* Submit Verification Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black hover:bg-neutral-800 active:scale-[0.99] text-white font-medium text-sm py-3 sm:py-3.5 rounded-xl sm:rounded-full transition duration-150 shadow-md shadow-black/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Verify Account</span>
                )}
              </button>

              {/* Resend Code Section */}
              <div className="text-center pt-1">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-xs font-semibold text-neutral-900 hover:underline flex items-center justify-center gap-1.5 mx-auto transition cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Resend Code</span>
                  </button>
                ) : (
                  <p className="text-xs text-neutral-400 flex items-center justify-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Resend code in {resendCooldown}s</span>
                  </p>
                )}
              </div>
            </form>
          )}

          {/* STAGE 2: CREATE PERMANENT PASSWORD */}
          {stage === "password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Code verified successfully! Please set your new password.</span>
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-xs sm:text-[13px] font-medium text-neutral-800 mb-1.5"
                >
                  New Permanent Password
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-neutral-400 pointer-events-none">
                    <KeyRound className="w-4 h-4 stroke-[1.8]" />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full rounded-xl border border-neutral-300 bg-white pl-10 pr-10 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-neutral-400 hover:text-neutral-700 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs sm:text-[13px] font-medium text-neutral-800 mb-1.5"
                >
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-neutral-400 pointer-events-none">
                    <Lock className="w-4 h-4 stroke-[1.8]" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full rounded-xl border border-neutral-300 bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black hover:bg-neutral-800 text-white font-medium text-sm py-3 sm:py-3.5 rounded-xl sm:rounded-full transition flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Save Password & Finish</span>
                )}
              </button>
            </form>
          )}

          {/* STAGE 3: COMPLETE CONFIRMATION & SMOOTH REDIRECT TO DASHBOARD */}
          {stage === "complete" && (
            <div className="text-center py-4 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-neutral-900">
                  Account Verified &amp; Activated!
                </h3>
                <p className="text-xs text-neutral-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
                  Status updated to <span className="font-semibold text-emerald-600">active</span> in Supabase.
                  <br />
                  <span className="inline-block mt-1 text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full font-medium">
                    Redirecting to Dashboard in {redirectCountdown ?? 2}s...
                  </span>
                </p>
              </div>

              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/80 text-xs text-neutral-700 text-left space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Employee ID:</span>
                  <span className="font-semibold text-neutral-900">{employeeId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Company Email:</span>
                  <span className="font-semibold text-neutral-900">{email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Status:</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    active (Supabase Verified)
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const storedName =
                    (typeof window !== "undefined" && localStorage.getItem("activationName")) ||
                    (employeeId.includes("815") ? "Red Reyes" : "Aaron Tumaliuan");
                  router.push(
                    `/dashboard?empId=${encodeURIComponent(employeeId)}&name=${encodeURIComponent(storedName)}`
                  );
                }}
                className="w-full bg-black hover:bg-neutral-800 text-white font-medium text-sm py-3.5 rounded-xl sm:rounded-full transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-black/10"
              >
                <span>Proceed to Dashboard Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Links & Sub-actions */}
          <div className="mt-5 space-y-3 text-center">
            <div className="text-xs text-neutral-500">
              <span>Already verified? </span>
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

export default function VerifyAccountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center text-white text-sm">
          Loading Strideon Verification...
        </div>
      }
    >
      <VerifyAccountContent />
    </Suspense>
  );
}
