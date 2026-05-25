import { Controller, Get, Param, Post } from "@nestjs/common";
import { AdminService } from "./admin.service";

@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("users")
  listUsers() {
    return this.adminService.listUsers();
  }

  @Post("users/:id/promote")
  promote(@Param("id") id: string) {
    return this.adminService.setAdmin(id, true);
  }

  @Post("users/:id/demote")
  demote(@Param("id") id: string) {
    return this.adminService.setAdmin(id, false);
  }
}
