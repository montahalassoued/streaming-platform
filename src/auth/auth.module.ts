import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import { UsersModule } from "../users/users.module";
import { EmailVerificationTokenEntity } from "./entities/email-verification-token.entity";
import { PasswordResetTokenEntity } from "./entities/password-reset-token.entity";
import { UserEntity } from "../users/entities/user.entity";
import { AuthEmailService } from "./services/auth-email.service";

@Module({
  imports: [
    PassportModule,
    UsersModule,
    TypeOrmModule.forFeature([
      UserEntity,
      EmailVerificationTokenEntity,
      PasswordResetTokenEntity,
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? "dev-secret",
      signOptions: { expiresIn: "1h" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthEmailService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
