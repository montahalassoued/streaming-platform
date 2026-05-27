"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VodsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const vods_controller_1 = require("./vods.controller");
const vods_service_1 = require("./vods.service");
const vod_entity_1 = require("./entities/vod.entity");
const stream_entity_1 = require("../streams/entities/stream.entity");
let VodsModule = class VodsModule {
};
exports.VodsModule = VodsModule;
exports.VodsModule = VodsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([vod_entity_1.VodEntity, stream_entity_1.StreamEntity])],
        controllers: [vods_controller_1.VodsController],
        providers: [vods_service_1.VodsService],
        exports: [vods_service_1.VodsService],
    })
], VodsModule);
