import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { CategoriesModule } from "./categories/categories.module";
import { ChatModule } from "./chat/chat.module";
import { DonationsModule } from "./donations/donations.module";
import { StreamsModule } from "./streams/streams.module";
import { UsersModule } from "./users/users.module";
import { VodsModule } from "./vods/vods.module";
import { AdminModule } from "./admin/admin.module";

@Module({
  imports: [
    AuthModule,
    CategoriesModule,
    ChatModule,
    DonationsModule,
    StreamsModule,
    UsersModule,
    AdminModule,
    VodsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
