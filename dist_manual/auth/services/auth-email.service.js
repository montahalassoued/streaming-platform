"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthEmailService = void 0;
const common_1 = require("@nestjs/common");
let AuthEmailService = class AuthEmailService {
    async sendVerificationEmail(email, token) {
        const link = this.buildLink("/verify-email", token);
        console.info(`[AuthEmailService] Verification email to ${email}: ${link}`);
    }
    async sendPasswordResetEmail(email, token) {
        const link = this.buildLink("/reset-password", token);
        console.info(`[AuthEmailService] Password reset email to ${email}: ${link}`);
    }
    buildLink(pathname, token) {
        const baseUrl = process.env.FRONTEND_URL ??
            process.env.APP_BASE_URL ??
            "http://localhost:8083";
        const normalizedBase = baseUrl.endsWith("/")
            ? baseUrl.slice(0, -1)
            : baseUrl;
        const normalizedPath = pathname.startsWith("/")
            ? pathname
            : `/${pathname}`;
        return `${normalizedBase}${normalizedPath}?token=${encodeURIComponent(token)}`;
    }
};
exports.AuthEmailService = AuthEmailService;
exports.AuthEmailService = AuthEmailService = __decorate([
    (0, common_1.Injectable)()
], AuthEmailService);
