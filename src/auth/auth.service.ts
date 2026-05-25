import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { RegisterDto } from "./dto/auth.dto";
import { UserEntity } from "../users/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = this.usersService.findByEmail(email);
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
    const passwordHash = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      username: registerDto.username,
      email: registerDto.email,
      passwordHash,
      name: registerDto.name,
    });

    return {
      message: "User registered successfully",
      ...(await this.login(user)),
    };
  }
}
