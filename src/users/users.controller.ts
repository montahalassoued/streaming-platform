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
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get("/me")
  @ApiOperation({ summary: "Get current user profile" })
  @ApiResponse({ status: 200, description: "Current user profile" })
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
  @ApiOperation({ summary: "Convert current user to streamer" })
  @ApiResponse({ status: 200, description: "User is now a streamer" })
  becomeStreamer(@CurrentUser() user: any) {
    return this.usersService.becomeStreamer(user.id);
  }

  // Public profile by username
  @Get(":username")
  @ApiOperation({ summary: "Get public profile by username" })
  @ApiResponse({ status: 200, description: "Public profile" })
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
  @ApiOperation({ summary: "List all users (admin)" })
  @ApiResponse({ status: 200, description: "All users" })
  findAll() {
    return this.usersService.findAll();
  }

  @Get("/id/:id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Create a user (admin)" })
  @ApiResponse({ status: 201, description: "User created" })
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
