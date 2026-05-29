import { Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AdminService } from "./admin.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AdminGuard } from "../auth/guards/admin.guard";

@ApiTags("admin")
@Controller("admin")
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("users")
  @ApiOperation({ summary: "List all users (admin)" })
  @ApiResponse({ status: 200, description: "Array of users" })
  listUsers() {
    return this.adminService.listUsers();
  }

  @Post("users/:id/promote")
  @ApiOperation({ summary: "Promote a user to admin" })
  @ApiResponse({ status: 200, description: "User promoted" })
  promote(@Param("id") id: string) {
    return this.adminService.setAdmin(id, true);
  }

  @Post("users/:id/demote")
  @ApiOperation({ summary: "Demote a user from admin" })
  @ApiResponse({ status: 200, description: "User demoted" })
  demote(@Param("id") id: string) {
    return this.adminService.setAdmin(id, false);
  }
}
