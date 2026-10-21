import { NextRequest, NextResponse } from "next/server";
import { EmailVerificationSystem } from "@/lib/emailVerificationSystem";

/**
 * ============================================================================
 * TUMALIUAN EMS - API ROUTE: /api/auth/email-verification
 * ============================================================================
 * Handles server-side OTP requests, diagnostic status checks, and code verifications.
 * ============================================================================
 */

// GET: Health Check & System Status
export async function GET() {
  try {
    const health = await EmailVerificationSystem.checkHealth();
    return NextResponse.json({
      status: "ONLINE",
      system: "Tumaliuan EMS Email Verification Engine",
      health,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "ERROR",
        message: error?.message || "Health check failed.",
      },
      { status: 500 }
    );
  }
}

// POST: Action Dispatch (send | verify)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, code, name, employeeId } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    // Action 1: Send / Resend OTP
    if (action === "send" || action === "resend") {
      const result = await EmailVerificationSystem.sendVerificationCode({
        email,
        name,
        employeeId,
      });

      return NextResponse.json(result, {
        status: result.success ? 200 : 400,
      });
    }

    // Action 2: Verify Code
    if (action === "verify") {
      if (!code) {
        return NextResponse.json(
          { success: false, message: "Verification code is required." },
          { status: 400 }
        );
      }

      const result = await EmailVerificationSystem.verifyCode(code, email);
      return NextResponse.json(result, {
        status: result.success ? 200 : 400,
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action. Supported: 'send', 'resend', 'verify'" },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Internal server error occurred.",
      },
      { status: 500 }
    );
  }
}
