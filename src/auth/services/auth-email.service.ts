import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthEmailService {
  async sendVerificationEmail(email: string, token: string) {
    const link = this.buildLink("/verify-email", token);
    console.info(`[AuthEmailService] Verification email to ${email}: ${link}`);
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const link = this.buildLink("/reset-password", token);
    console.info(`[AuthEmailService] Password reset email to ${email}: ${link}`);
  }

  private buildLink(pathname: string, token: string) {
    const baseUrl =
      process.env.FRONTEND_URL ??
      process.env.APP_BASE_URL ??
      "http://localhost:8083";
    const normalizedBase = baseUrl.endsWith("/")
      ? baseUrl.slice(0, -1)
      : baseUrl;
    const normalizedPath = pathname.startsWith("/")
      ? pathname
      : `/${pathname}`;
    return `${normalizedBase}${normalizedPath}?token=${encodeURIComponent(
      token,
    )}`;
  }
}
