"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const email_verification_dto_1 = require("./dto/email-verification.dto");
const login_dto_1 = require("./dto/login.dto");
const register_dto_1 = require("./dto/register.dto");
const resend_email_verification_dto_1 = require("./dto/resend-email-verification.dto");
const request_password_reset_dto_1 = require("./dto/request-password-reset.dto");
const confirm_password_reset_dto_1 = require("./dto/confirm-password-reset.dto");
const local_auth_guard_1 = require("./guards/local-auth.guard");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    login(request) {
        return this.authService.login(request.user);
    }
    register(registerDto) {
        return this.authService.register(registerDto);
    }
    async verifyEmail(emailVerificationDto) {
        return await this.authService.verifyEmail(emailVerificationDto);
    }
    async resendVerificationEmail(resendEmailVerificationDto) {
        return await this.authService.resendVerificationEmail(resendEmailVerificationDto.email);
    }
    async forgotPassword(requestPasswordResetDto) {
        return await this.authService.forgotPassword(requestPasswordResetDto);
    }
    resetPassword(confirmPasswordResetDto) {
        return this.authService.resetPassword(confirmPasswordResetDto);
    }
    refresh(refreshToken) {
        return this.authService.refresh(refreshToken);
    }
    logout() {
        return { message: "User logged out successfully" };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)("login"),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: "Login user" }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "User successfully logged in and received tokens",
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Invalid credentials" }),
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)("register"),
    (0, swagger_1.ApiOperation)({ summary: "register" }),
    (0, swagger_1.ApiBody)({ type: register_dto_1.RegisterDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "User successfully registered and waiting for email verification",
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Bad Request" }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: "User with this email or username already exists",
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)("verify-email"),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: "Verify email" }),
    (0, swagger_1.ApiBody)({ type: email_verification_dto_1.EmailVerificationDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Email successfully verified",
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: "Invalid or expired verification token",
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_verification_dto_1.EmailVerificationDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Post)("resend-verification"),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: "Resend verification email" }),
    (0, swagger_1.ApiBody)({ type: resend_email_verification_dto_1.ResendEmailVerificationDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "If this email is registered and not verified, a verification email has been sent. Please check your inbox or spam folder.",
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: "Email already verified",
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [resend_email_verification_dto_1.ResendEmailVerificationDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendVerificationEmail", null);
__decorate([
    (0, common_1.Post)("forgot-password"),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: "Forgot password" }),
    (0, swagger_1.ApiBody)({ type: request_password_reset_dto_1.RequestPasswordResetDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "If this email is registered, a password reset email has been sent. Please check your inbox or spam folder.",
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_password_reset_dto_1.RequestPasswordResetDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)("reset-password"),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: "Reset password" }),
    (0, swagger_1.ApiBody)({ type: confirm_password_reset_dto_1.ConfirmPasswordResetDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Password successfully reset",
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: "Invalid or expired reset token",
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [confirm_password_reset_dto_1.ConfirmPasswordResetDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)("refresh"),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: "Refresh access token" }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                refreshToken: { type: "string", example: "refresh-token-here" },
            },
            required: ["refreshToken"],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Access token successfully refreshed",
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: "Invalid refresh token",
    }),
    __param(0, (0, common_1.Body)("refreshToken")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)("logout"),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: "Logout user" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "User successfully logged out",
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)("auth"),
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
