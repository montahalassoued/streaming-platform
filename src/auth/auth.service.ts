import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { createHash, randomBytes } from "node:crypto";
import * as bcrypt from "bcrypt";
import { Repository, IsNull } from "typeorm";
import { UsersService } from "../users/users.service";
import { EmailVerificationDto } from "./dto/email-verification.dto";
import { RequestPasswordResetDto } from "./dto/request-password-reset.dto";
import { RegisterDto } from "./dto/register.dto";
import { ConfirmPasswordResetDto } from "./dto/confirm-password-reset.dto";
import { UserEntity } from "../users/entities/user.entity";
import { EmailVerificationTokenEntity } from "./entities/email-verification-token.entity";
import { PasswordResetTokenEntity } from "./entities/password-reset-token.entity";
import { AuthEmailService } from "./services/auth-email.service";
import { JwtPayload } from "../common/types/auth.types";

const DEFAULT_EMAIL_VERIFICATION_TTL_HOURS = 24;
const DEFAULT_PASSWORD_RESET_TTL_MINUTES = 60;
const DEFAULT_REFRESH_TTL_DAYS = 7;

const toNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly authEmailService: AuthEmailService,
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
    @InjectRepository(EmailVerificationTokenEntity)
    private readonly emailVerificationTokens: Repository<EmailVerificationTokenEntity>,
    @InjectRepository(PasswordResetTokenEntity)
    private readonly passwordResetTokens: Repository<PasswordResetTokenEntity>,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return null;
    }

    const {
      passwordHash,
      refreshTokenHash,
      refreshTokenExpiresAt,
      ...safeUser
    } = user;
    return safeUser;
  }

  async login(user: Pick<UserEntity, "id" | "email" | "username" | "isAdmin">) {
    const tokens = await this.issueTokens(user);
    return {
      ...tokens,
      user,
    };
  }

  async register(registerDto: RegisterDto) {
    const username = registerDto?.username?.trim();
    const email = registerDto?.email?.trim();
    const password = registerDto?.password;

    if (!username || !email || !password) {
      throw new BadRequestException(
        "username, email and password are required",
      );
    }

    const [existingByEmail, existingByUsername] = await Promise.all([
      this.usersService.findByEmail(email),
      this.usersService.findByUsername(username),
    ]);

    if (existingByEmail) {
      throw new ConflictException("User with this email already exists");
    }

    if (existingByUsername) {
      throw new ConflictException("User with this username already exists");
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
    } catch {
      throw new ConflictException("User already exists");
    }
  }

  async verifyEmail(emailVerificationDto: EmailVerificationDto) {
    const tokenHash = this.hashToken(emailVerificationDto.token);
    const tokenRecord = await this.emailVerificationTokens.findOne({
      where: { tokenHash },
    });

    if (!tokenRecord || tokenRecord.usedAt) {
      throw new ForbiddenException("Invalid or expired verification token");
    }

    if (tokenRecord.expiresAt.getTime() <= Date.now()) {
      throw new ForbiddenException("Invalid or expired verification token");
    }

    const user = await this.usersRepo.findOneBy({ id: tokenRecord.userId });
    if (!user) {
      throw new ForbiddenException("Invalid or expired verification token");
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

  async resendVerificationEmail(email: string) {
    const normalizedEmail = email?.trim();
    if (!normalizedEmail) {
      throw new BadRequestException("email is required");
    }

    const user = await this.usersService.findByEmail(normalizedEmail);
    if (!user) {
      return {
        message:
          "If this email is registered and not verified, a verification email has been sent.",
      };
    }

    if (user.isEmailVerified) {
      throw new BadRequestException("Email already verified");
    }

    await this.sendVerificationEmail(user);
    return {
      message:
        "If this email is registered and not verified, a verification email has been sent.",
    };
  }

  async forgotPassword(requestPasswordResetDto: RequestPasswordResetDto) {
    const normalizedEmail = requestPasswordResetDto.email?.trim();
    if (!normalizedEmail) {
      throw new BadRequestException("email is required");
    }

    const user = await this.usersService.findByEmail(normalizedEmail);
    if (user) {
      await this.sendPasswordResetEmail(user);
    }

    return {
      message:
        "If this email is registered, a password reset email has been sent. Please check your inbox or spam folder.",
    };
  }

  async resetPassword(confirmPasswordResetDto: ConfirmPasswordResetDto) {
    const tokenHash = this.hashToken(confirmPasswordResetDto.token);
    const tokenRecord = await this.passwordResetTokens.findOne({
      where: { tokenHash },
    });

    if (!tokenRecord || tokenRecord.usedAt) {
      throw new ForbiddenException("Invalid or expired reset token");
    }

    if (tokenRecord.expiresAt.getTime() <= Date.now()) {
      throw new ForbiddenException("Invalid or expired reset token");
    }

    const user = await this.usersRepo.findOneBy({ id: tokenRecord.userId });
    if (!user) {
      throw new ForbiddenException("Invalid or expired reset token");
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

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new BadRequestException("refreshToken is required");
    }

    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.getRefreshSecret(),
      }) as JwtPayload;
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const user = await this.usersRepo.findOneBy({ id: payload.sub });
    if (!user || !user.refreshTokenHash || !user.refreshTokenExpiresAt) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    if (user.refreshTokenExpiresAt.getTime() <= Date.now()) {
      await this.usersRepo.update(
        { id: user.id },
        { refreshTokenHash: null, refreshTokenExpiresAt: null },
      );
      throw new UnauthorizedException("Invalid refresh token");
    }

    const refreshTokenHash = this.hashToken(refreshToken);
    if (refreshTokenHash !== user.refreshTokenHash) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    return this.issueTokens(user);
  }

  private async sendVerificationEmail(user: UserEntity) {
    const token = await this.issueEmailVerificationToken(user);
    await this.authEmailService.sendVerificationEmail(user.email, token);
  }

  private async sendPasswordResetEmail(user: UserEntity) {
    const token = await this.issuePasswordResetToken(user);
    await this.authEmailService.sendPasswordResetEmail(user.email, token);
  }

  private async issueEmailVerificationToken(user: UserEntity) {
    const tokenValue = this.createTokenValue();
    const tokenHash = this.hashToken(tokenValue);
    const expiresAt = new Date(
      Date.now() +
        toNumber(
          process.env.EMAIL_VERIFICATION_TOKEN_TTL_HOURS,
          DEFAULT_EMAIL_VERIFICATION_TTL_HOURS,
        ) *
          60 *
          60 *
          1000,
    );

    await this.emailVerificationTokens.update(
      { userId: user.id, usedAt: IsNull() },
      { usedAt: new Date() },
    );

    const record = this.emailVerificationTokens.create({
      userId: user.id,
      tokenHash,
      expiresAt,
    });
    await this.emailVerificationTokens.save(record);
    return tokenValue;
  }

  private async issuePasswordResetToken(user: UserEntity) {
    const tokenValue = this.createTokenValue();
    const tokenHash = this.hashToken(tokenValue);
    const expiresAt = new Date(
      Date.now() +
        toNumber(
          process.env.PASSWORD_RESET_TOKEN_TTL_MINUTES,
          DEFAULT_PASSWORD_RESET_TTL_MINUTES,
        ) *
          60 *
          1000,
    );

    await this.passwordResetTokens.update(
      { userId: user.id, usedAt: IsNull() },
      { usedAt: new Date() },
    );

    const record = this.passwordResetTokens.create({
      userId: user.id,
      tokenHash,
      expiresAt,
    });
    await this.passwordResetTokens.save(record);
    return tokenValue;
  }

  private async issueTokens(
    user: Pick<UserEntity, "id" | "email" | "username" | "isAdmin">,
  ) {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin,
    };

    const refreshTtlDays = toNumber(
      process.env.JWT_REFRESH_TTL_DAYS,
      DEFAULT_REFRESH_TTL_DAYS,
    );

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.getRefreshSecret(),
      expiresIn: `${refreshTtlDays}d`,
    });
    const refreshTokenHash = this.hashToken(refreshToken);
    const refreshTokenExpiresAt = new Date(
      Date.now() + refreshTtlDays * 24 * 60 * 60 * 1000,
    );

    await this.usersRepo.update(
      { id: user.id },
      { refreshTokenHash, refreshTokenExpiresAt },
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private createTokenValue() {
    return randomBytes(32).toString("hex");
  }

  private hashToken(token: string) {
    return createHash("sha256").update(token).digest("hex");
  }

  private getRefreshSecret() {
    return process.env.JWT_REFRESH_SECRET ?? process.env.JWT_SECRET ?? "dev-secret";
  }
}
