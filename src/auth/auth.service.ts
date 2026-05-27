import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { EmailVerificationDto } from "./dto/email-verification.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { RegisterDto } from "./dto/register.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { UserEntity } from "../users/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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

    const { passwordHash, ...result } = user;
    return result;
  }

  async login(user: Pick<UserEntity, "id" | "email" | "username" | "isAdmin">) {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin,
    };

    return {
      access_token: this.jwtService.sign(payload),
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

      return {
        message: "User registered successfully",
        ...(await this.login(user)),
      };
    } catch {
      throw new ConflictException("User already exists");
    }
  }

  async verifyEmail(emailVerificationDto: EmailVerificationDto) {
    return {
      message: "Email verification is not yet wired to persistence",
      token: emailVerificationDto.token,
    };
  }

  async resendVerificationEmail(email: string) {
    return {
      message: "Verification email resend is not yet wired to persistence",
      email,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    return {
      message: "Password reset email is not yet wired to persistence",
      email: forgotPasswordDto.email,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    return {
      message: "Password reset is not yet wired to persistence",
      token: resetPasswordDto.token,
    };
  }
}
