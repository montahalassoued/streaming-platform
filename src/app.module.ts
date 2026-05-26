import "dotenv/config";
import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { TypeOrmModule } from "@nestjs/typeorm";
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
import { SubscriptionTiersModule } from "./subscription-tiers/subscription-tiers.module";
import { RedisModule } from "./redis/redis.module";
import { NotificationsModule } from "./notifications/notifications.module";

const bullImports = process.env.REDIS_URL
  ? [
      BullModule.forRoot({
        connection: { url: process.env.REDIS_URL },
      }),
    ]
  : [];

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false,
    }),
    ...bullImports,
    AuthModule,
    CategoriesModule,
    ChatModule,
    DonationsModule,
    NotificationsModule,
    StreamsModule,
    UsersModule,
    SubscriptionTiersModule,
    AdminModule,
    VodsModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
