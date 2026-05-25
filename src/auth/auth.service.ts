import { Injectable } from "@nestjs/common";
import { LoginDto, RegisterDto } from "./auth.dto";

@Injectable()
export class AuthService {
  login(loginDto: LoginDto) {
    return {
      message: "Auth login placeholder",
      data: loginDto,
    };
  }

  register(registerDto: RegisterDto) {
    return {
      message: "Auth register placeholder",
      data: registerDto,
    };
  }
}
