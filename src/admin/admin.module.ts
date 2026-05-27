import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { UsersModule } from "../users/users.module";
import { AdminGuard } from "../auth/guards/admin.guard";

@Module({
  imports: [UsersModule],
  controllers: [AdminController],
  providers: [AdminService, AdminGuard],
})
export class AdminModule {}
