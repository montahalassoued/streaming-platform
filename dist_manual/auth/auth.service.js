"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const node_crypto_1 = require("node:crypto");
const bcrypt = __importStar(require("bcrypt"));
const typeorm_2 = require("typeorm");
const users_service_1 = require("../users/users.service");
const user_entity_1 = require("../users/entities/user.entity");
const email_verification_token_entity_1 = require("./entities/email-verification-token.entity");
const password_reset_token_entity_1 = require("./entities/password-reset-token.entity");
const auth_email_service_1 = require("./services/auth-email.service");
const DEFAULT_EMAIL_VERIFICATION_TTL_HOURS = 24;
const DEFAULT_PASSWORD_RESET_TTL_MINUTES = 60;
const DEFAULT_REFRESH_TTL_DAYS = 7;
const toNumber = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};
let AuthService = class AuthService {
    constructor(usersService, jwtService, authEmailService, usersRepo, emailVerificationTokens, passwordResetTokens) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.authEmailService = authEmailService;
        this.usersRepo = usersRepo;
        this.emailVerificationTokens = emailVerificationTokens;
        this.passwordResetTokens = passwordResetTokens;
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return null;
        }
        const passwordMatches = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatches) {
            return null;
        }
        const { passwordHash, refreshTokenHash, refreshTokenExpiresAt, ...safeUser } = user;
        return safeUser;
    }
    async login(user) {
        const tokens = await this.issueTokens(user);
        return {
            ...tokens,
            user,
        };
    }
    async register(registerDto) {
        const username = registerDto?.username?.trim();
        const email = registerDto?.email?.trim();
        const password = registerDto?.password;
        if (!username || !email || !password) {
            throw new common_1.BadRequestException("username, email and password are required");
        }
        const [existingByEmail, existingByUsername] = await Promise.all([
            this.usersService.findByEmail(email),
            this.usersService.findByUsername(username),
        ]);
        if (existingByEmail) {
            throw new common_1.ConflictException("User with this email already exists");
        }
        if (existingByUsername) {
            throw new common_1.ConflictException("User with this username already exists");
        }
        const passwordHash = await bcrypt.hash(password, 10);
        try {
            const user = await this.usersService.create({
                username,
                email,
                passwordHash,
            });
            if (!user.isEmailVerified) {
                await this.sendVerificationEmail(user);
            }
            return {
                message: "User registered successfully",
                ...(await this.login(user)),
            };
        }
        catch {
            throw new common_1.ConflictException("User already exists");
        }
    }
    async verifyEmail(emailVerificationDto) {
        const tokenHash = this.hashToken(emailVerificationDto.token);
        const tokenRecord = await this.emailVerificationTokens.findOne({
            where: { tokenHash },
        });
        if (!tokenRecord || tokenRecord.usedAt) {
            throw new common_1.ForbiddenException("Invalid or expired verification token");
        }
        if (tokenRecord.expiresAt.getTime() <= Date.now()) {
            throw new common_1.ForbiddenException("Invalid or expired verification token");
        }
        const user = await this.usersRepo.findOneBy({ id: tokenRecord.userId });
        if (!user) {
            throw new common_1.ForbiddenException("Invalid or expired verification token");
        }
        user.isEmailVerified = true;
        user.emailVerifiedAt = new Date();
        tokenRecord.usedAt = new Date();
        await Promise.all([
            this.usersRepo.save(user),
            this.emailVerificationTokens.save(tokenRecord),
        ]);
        return {
            message: "Email successfully verified",
        };
    }
    async resendVerificationEmail(email) {
        const normalizedEmail = email?.trim();
        if (!normalizedEmail) {
            throw new common_1.BadRequestException("email is required");
        }
        const user = await this.usersService.findByEmail(normalizedEmail);
        if (!user) {
            return {
                message: "If this email is registered and not verified, a verification email has been sent.",
            };
        }
        if (user.isEmailVerified) {
            throw new common_1.BadRequestException("Email already verified");
        }
        await this.sendVerificationEmail(user);
        return {
            message: "If this email is registered and not verified, a verification email has been sent.",
        };
    }
    async forgotPassword(requestPasswordResetDto) {
        const normalizedEmail = requestPasswordResetDto.email?.trim();
        if (!normalizedEmail) {
            throw new common_1.BadRequestException("email is required");
        }
        const user = await this.usersService.findByEmail(normalizedEmail);
        if (user) {
            await this.sendPasswordResetEmail(user);
        }
        return {
            message: "If this email is registered, a password reset email has been sent. Please check your inbox or spam folder.",
        };
    }
    async resetPassword(confirmPasswordResetDto) {
        const tokenHash = this.hashToken(confirmPasswordResetDto.token);
        const tokenRecord = await this.passwordResetTokens.findOne({
            where: { tokenHash },
        });
        if (!tokenRecord || tokenRecord.usedAt) {
            throw new common_1.ForbiddenException("Invalid or expired reset token");
        }
        if (tokenRecord.expiresAt.getTime() <= Date.now()) {
            throw new common_1.ForbiddenException("Invalid or expired reset token");
        }
        const user = await this.usersRepo.findOneBy({ id: tokenRecord.userId });
        if (!user) {
            throw new common_1.ForbiddenException("Invalid or expired reset token");
        }
        const passwordHash = await bcrypt.hash(confirmPasswordResetDto.password, 10);
        user.passwordHash = passwordHash;
        user.refreshTokenHash = null;
        user.refreshTokenExpiresAt = null;
        tokenRecord.usedAt = new Date();
        await Promise.all([
            this.usersRepo.save(user),
            this.passwordResetTokens.save(tokenRecord),
        ]);
        return {
            message: "Password successfully reset",
        };
    }
    async refresh(refreshToken) {
        if (!refreshToken) {
            throw new common_1.BadRequestException("refreshToken is required");
        }
        let payload;
        try {
            payload = this.jwtService.verify(refreshToken, {
                secret: this.getRefreshSecret(),
            });
        }
        catch {
            throw new common_1.UnauthorizedException("Invalid refresh token");
        }
        const user = await this.usersRepo.findOneBy({ id: payload.sub });
        if (!user || !user.refreshTokenHash || !user.refreshTokenExpiresAt) {
            throw new common_1.UnauthorizedException("Invalid refresh token");
        }
        if (user.refreshTokenExpiresAt.getTime() <= Date.now()) {
            await this.usersRepo.update({ id: user.id }, { refreshTokenHash: null, refreshTokenExpiresAt: null });
            throw new common_1.UnauthorizedException("Invalid refresh token");
        }
        const refreshTokenHash = this.hashToken(refreshToken);
        if (refreshTokenHash !== user.refreshTokenHash) {
            throw new common_1.UnauthorizedException("Invalid refresh token");
        }
        return this.issueTokens(user);
    }
    async sendVerificationEmail(user) {
        const token = await this.issueEmailVerificationToken(user);
        await this.authEmailService.sendVerificationEmail(user.email, token);
    }
    async sendPasswordResetEmail(user) {
        const token = await this.issuePasswordResetToken(user);
        await this.authEmailService.sendPasswordResetEmail(user.email, token);
    }
    async issueEmailVerificationToken(user) {
        const tokenValue = this.createTokenValue();
        const tokenHash = this.hashToken(tokenValue);
        const expiresAt = new Date(Date.now() +
            toNumber(process.env.EMAIL_VERIFICATION_TOKEN_TTL_HOURS, DEFAULT_EMAIL_VERIFICATION_TTL_HOURS) *
                60 *
                60 *
                1000);
        await this.emailVerificationTokens.update({ userId: user.id, usedAt: (0, typeorm_2.IsNull)() }, { usedAt: new Date() });
        const record = this.emailVerificationTokens.create({
            userId: user.id,
            tokenHash,
            expiresAt,
        });
        await this.emailVerificationTokens.save(record);
        return tokenValue;
    }
    async issuePasswordResetToken(user) {
        const tokenValue = this.createTokenValue();
        const tokenHash = this.hashToken(tokenValue);
        const expiresAt = new Date(Date.now() +
            toNumber(process.env.PASSWORD_RESET_TOKEN_TTL_MINUTES, DEFAULT_PASSWORD_RESET_TTL_MINUTES) *
                60 *
                1000);
        await this.passwordResetTokens.update({ userId: user.id, usedAt: (0, typeorm_2.IsNull)() }, { usedAt: new Date() });
        const record = this.passwordResetTokens.create({
            userId: user.id,
            tokenHash,
            expiresAt,
        });
        await this.passwordResetTokens.save(record);
        return tokenValue;
    }
    async issueTokens(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            username: user.username,
            isAdmin: user.isAdmin,
        };
        const refreshTtlDays = toNumber(process.env.JWT_REFRESH_TTL_DAYS, DEFAULT_REFRESH_TTL_DAYS);
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.getRefreshSecret(),
            expiresIn: `${refreshTtlDays}d`,
        });
        const refreshTokenHash = this.hashToken(refreshToken);
        const refreshTokenExpiresAt = new Date(Date.now() + refreshTtlDays * 24 * 60 * 60 * 1000);
        await this.usersRepo.update({ id: user.id }, { refreshTokenHash, refreshTokenExpiresAt });
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }
    createTokenValue() {
        return (0, node_crypto_1.randomBytes)(32).toString("hex");
    }
    hashToken(token) {
        return (0, node_crypto_1.createHash)("sha256").update(token).digest("hex");
    }
    getRefreshSecret() {
        return process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET ?? "dev-secret";
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(email_verification_token_entity_1.EmailVerificationTokenEntity)),
    __param(5, (0, typeorm_1.InjectRepository)(password_reset_token_entity_1.PasswordResetTokenEntity)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        auth_email_service_1.AuthEmailService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AuthService);
