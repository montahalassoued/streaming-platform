import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Query,
} from "@nestjs/common";
import { StreamerService } from "./streamer.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { UpdateChannelSettingsDto } from "./dto/update-channel-settings.dto";

@Controller("streamer")
export class StreamerController {
  constructor(private readonly svc: StreamerService) {}

  @UseGuards(JwtAuthGuard)
  @Get("/me")
  me(@CurrentUser() user: any) {
    return this.svc.getStreamerByUser(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/me/donations")
  donations(
    @CurrentUser() user: any,
    @Query("page") pageQ: string,
    @Query("limit") limitQ: string,
  ) {
    const page = Number(pageQ) || 1;
    const limit = Number(limitQ) || 20;
    return this.svc.getDonationsReceived(user.id, page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/me/subscribers")
  subscribers(@CurrentUser() user: any) {
    return this.svc.getSubscribers(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("/me/settings")
  updateSettings(
    @CurrentUser() user: any,
    @Body() dto: UpdateChannelSettingsDto,
  ) {
    return this.svc.updateChannelSettings(user.id, dto as any);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Delete("/me/chat/message/:id")
  deleteMessage(@CurrentUser() user: any, @Param("id") id: string) {
    return this.svc.deleteChatMessage(user.id, id);
  }
}
