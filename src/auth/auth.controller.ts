import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { EmailVerificationDto } from "./dto/email-verification.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ResendEmailVerificationDto } from "./dto/resend-email-verification.dto";
import { RequestPasswordResetDto } from "./dto/request-password-reset.dto";
import { ConfirmPasswordResetDto } from "./dto/confirm-password-reset.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { RequestWithUser } from "../common/types/auth.types";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(200)
  @ApiOperation({ summary: "Login user" })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: "User successfully logged in and received tokens",
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Invalid credentials" })
  @UseGuards(LocalAuthGuard)
  login(@Req() request: RequestWithUser) {
    return this.authService.login(request.user);
  }

  @Post("register")
  @ApiOperation({ summary: "register" })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description:
      "User successfully registered and waiting for email verification",
  })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({
    status: 409,
    description: "User with this email or username already exists",
  })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
  @Post("verify-email")
  @HttpCode(200)
  @ApiOperation({ summary: "Verify email" })
  @ApiBody({ type: EmailVerificationDto })
  @ApiResponse({
    status: 200,
    description: "Email successfully verified",
  })
  @ApiResponse({
    status: 403,
    description: "Invalid or expired verification token",
  })
  async verifyEmail(@Body() emailVerificationDto: EmailVerificationDto) {
    return await this.authService.verifyEmail(emailVerificationDto);
  }
  @Post("resend-verification")
  @HttpCode(200)
  @ApiOperation({ summary: "Resend verification email" })
  @ApiBody({ type: ResendEmailVerificationDto })
  @ApiResponse({
    status: 200,
    description:
      "If this email is registered and not verified, a verification email has been sent. Please check your inbox or spam folder.",
  })
  @ApiResponse({
    status: 400,
    description: "Email already verified",
  })
  async resendVerificationEmail(
    @Body() resendEmailVerificationDto: ResendEmailVerificationDto,
  ) {
    return await this.authService.resendVerificationEmail(
      resendEmailVerificationDto.email,
    );
  }
  @Post("forgot-password")
  @HttpCode(200)
  @ApiOperation({ summary: "Forgot password" })
  @ApiBody({ type: RequestPasswordResetDto })
  @ApiResponse({
    status: 200,
    description:
      "If this email is registered, a password reset email has been sent. Please check your inbox or spam folder.",
  })
  async forgotPassword(
    @Body() requestPasswordResetDto: RequestPasswordResetDto,
  ) {
    return await this.authService.forgotPassword(requestPasswordResetDto);
  }

  @Post("reset-password")
  @HttpCode(200)
  @ApiOperation({ summary: "Reset password" })
  @ApiBody({ type: ConfirmPasswordResetDto })
  @ApiResponse({
    status: 200,
    description: "Password successfully reset",
  })
  @ApiResponse({
    status: 403,
    description: "Invalid or expired reset token",
  })
  resetPassword(@Body() confirmPasswordResetDto: ConfirmPasswordResetDto) {
    return this.authService.resetPassword(confirmPasswordResetDto);
  }

  @Post("refresh")
  @HttpCode(200)
  @ApiOperation({ summary: "Refresh access token" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        refreshToken: { type: "string", example: "refresh-token-here" },
      },
      required: ["refreshToken"],
    },
  })
  @ApiResponse({
    status: 200,
    description: "Access token successfully refreshed",
  })
  @ApiResponse({
    status: 401,
    description: "Invalid refresh token",
  })
  refresh(@Body("refreshToken") refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }
  @Post("logout")
  @HttpCode(200)
  @ApiOperation({ summary: "Logout user" })
  @ApiResponse({
    status: 200,
    description: "User successfully logged out",
  })
  logout() {
    return { message: "User logged out successfully" };
  }
}
