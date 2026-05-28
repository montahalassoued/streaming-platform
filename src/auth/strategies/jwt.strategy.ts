import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import {
  JwtPayload,
  ValidatedUser,
} from "../../common/types/auth.types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Only accept JWTs from the Authorization: Bearer <token> header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? "dev-secret",
    });
  }

  validate(payload: JwtPayload): ValidatedUser {
    return {
      id: payload.sub,
      email: payload.email,
      username: payload.username,
      isAdmin: Boolean(payload.isAdmin),
    };
  }
}
