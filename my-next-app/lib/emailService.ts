/**
 * ============================================================================
 * TUMALIUAN EMS - HIGH-LEVEL EMAIL SERVICE INTERFACE
 * ============================================================================
 * Thin, backward-compatible service facade wrapping the core
 * EmailVerificationSystem engine.
 * ============================================================================
 */

import {
  EmailVerificationSystem,
  SendOTPOptions,
  VerificationResult,
} from "./emailVerificationSystem";

export interface SendVerificationCodeParams {
  email: string;
  name?: string;
  code?: string;
  employeeId?: string;
  templateId?: string;
  serviceId?: string;
  publicKey?: string;
  recordToSupabase?: boolean;
  sendSecondaryCopy?: boolean;
  companyName?: string;
}

export interface EmailServiceResult {
  success: boolean;
  code: string;
  message: string;
  error?: any;
  cooldownRemaining?: number;
}

/**
 * Generates a 6-digit cryptographically secure verification code
 */
export const generateVerificationCode = (digits = 6): string => {
  return EmailVerificationSystem.generateSecureOTP(digits);
};

/**
 * Checks email validity
 */
export const isValidEmail = (email: string): boolean => {
  return EmailVerificationSystem.isValidEmail(email);
};

/**
 * Returns EmailJS system configuration
 */
export const getEmailJSConfig = () => {
  const cfg = EmailVerificationSystem.getConfig();
  return {
    serviceId: cfg.serviceId,
    templateId: cfg.primaryTemplateId,
    secondTemplateId: cfg.fallbackTemplateId,
    publicKey: cfg.publicKey,
    isConfigured: cfg.isConfigured,
  };
};

/**
 * Main dispatch function for verification codes
 */
export const sendVerificationCode = async ({
  email,
  name,
  code,
  employeeId,
  companyName = "Tumaliuan EMS",
}: SendVerificationCodeParams): Promise<EmailServiceResult> => {
  // 1. Browser client: use internal API route first for guaranteed server-side dispatch
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/auth/email-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send",
          email,
          name,
          employeeId,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem("activationCode", data.code);
        localStorage.setItem("activationEmail", email);
        if (name) localStorage.setItem("activationName", name);
        if (employeeId) localStorage.setItem("activationEmployeeId", employeeId);

        return {
          success: true,
          code: data.code,
          message: data.message,
        };
      } else if (data && !data.success) {
        return {
          success: false,
          code: data.code || "",
          message: data.message || "Failed to dispatch email.",
          cooldownRemaining: data.cooldownRemaining,
        };
      }
    } catch (apiErr) {
      console.warn("[EmailService] API dispatch notice, falling back to direct engine:", apiErr);
    }
  }

  // 2. Direct engine fallback
  const options: SendOTPOptions = {
    email,
    name,
    customCode: code,
    employeeId,
    companyName,
  };

  const result = await EmailVerificationSystem.sendVerificationCode(options);

  return {
    success: result.success,
    code: result.code,
    message: result.message,
    cooldownRemaining: result.cooldownRemaining,
    error: result.error,
  };
};

/**
 * Resends a newly generated verification code
 */
export const resendVerificationCode = async (
  email: string,
  name?: string,
  employeeId?: string
): Promise<EmailServiceResult> => {
  return sendVerificationCode({
    email,
    name,
    employeeId,
  });
};

/**
 * Verifies submitted code with Supabase & session tracking
 */
export const verifySubmittedCode = async (
  inputCode: string,
  email: string
): Promise<{ success: boolean; message: string; status?: string }> => {
  const result: VerificationResult = await EmailVerificationSystem.verifyCode(inputCode, email);

  return {
    success: result.success,
    message: result.message,
    status: result.status,
  };
};

// Direct export of engine
export { EmailVerificationSystem };
