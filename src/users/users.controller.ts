import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get("/me")
  me(@CurrentUser() user: any) {
    return this.usersService.findByIdOrThrow(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("/me")
  updateMe(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, dto as any);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/me/become-streamer")
  becomeStreamer(@CurrentUser() user: any) {
    return this.usersService.becomeStreamer(user.id);
  }

  // Public profile by username
  @Get(":username")
  profile(@Param("username") username: string) {
    return this.usersService.getProfile(username);
  }

  @Get(":username/stats")
  stats(@Param("username") username: string) {
    // for now reuse profile which includes followers/following counts
    return this.usersService.getProfile(username);
  }

  // Admin / internal endpoints
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get("/id/:id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
