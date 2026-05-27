"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
require("dotenv/config");
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const categories_module_1 = require("./categories/categories.module");
const chat_module_1 = require("./chat/chat.module");
const donations_module_1 = require("./donations/donations.module");
const streams_module_1 = require("./streams/streams.module");
const streamer_module_1 = require("./streamer/streamer.module");
const users_module_1 = require("./users/users.module");
const vods_module_1 = require("./vods/vods.module");
const admin_module_1 = require("./admin/admin.module");
const subscriptions_module_1 = require("./subscriptions/subscriptions.module");
const redis_module_1 = require("./redis/redis.module");
const notifications_module_1 = require("./notifications/notifications.module");
const workers_module_1 = require("./workers/workers.module");
const bullImports = process.env.REDIS_URL
    ? [
        bullmq_1.BullModule.forRoot({
            connection: { url: process.env.REDIS_URL },
        }),
    ]
    : [];
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: "postgres",
                url: process.env.DATABASE_URL,
                autoLoadEntities: true,
                synchronize: false,
            }),
            ...bullImports,
            auth_module_1.AuthModule,
            categories_module_1.CategoriesModule,
            chat_module_1.ChatModule,
            donations_module_1.DonationsModule,
            notifications_module_1.NotificationsModule,
            streams_module_1.StreamsModule,
            streamer_module_1.StreamerModule,
            users_module_1.UsersModule,
            subscriptions_module_1.SubscriptionsModule,
            admin_module_1.AdminModule,
            vods_module_1.VodsModule,
            workers_module_1.WorkersModule,
            redis_module_1.RedisModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
