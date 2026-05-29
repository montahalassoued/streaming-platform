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
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { StreamerService } from "./streamer.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { UpdateChannelSettingsDto } from "./dto/update-channel-settings.dto";

@ApiTags("streamer")
@Controller("streamer")
export class StreamerController {
  constructor(private readonly svc: StreamerService) {}

  @UseGuards(JwtAuthGuard)
  @Get("/me")
  @ApiOperation({ summary: "Get current user's streamer profile" })
  @ApiResponse({ status: 200, description: "Streamer profile" })
  me(@CurrentUser() user: any) {
    return this.svc.getStreamerByUser(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/me/donations")
  @ApiOperation({ summary: "Get donations received by the current streamer" })
  @ApiResponse({ status: 200, description: "Paged list of donations" })
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
  @ApiOperation({ summary: "List subscribers (followers) of the current streamer" })
  @ApiResponse({ status: 200, description: "List of followers" })
  subscribers(@CurrentUser() user: any) {
    return this.svc.getSubscribers(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("/me/settings")
  @ApiOperation({ summary: "Update channel settings (bio, chat rules)" })
  @ApiResponse({ status: 200, description: "Updated streamer settings" })
  updateSettings(
    @CurrentUser() user: any,
    @Body() dto: UpdateChannelSettingsDto,
  ) {
    return this.svc.updateChannelSettings(user.id, dto as any);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Delete("/me/chat/message/:id")
  @ApiOperation({ summary: "Delete a chat message from your channel" })
  @ApiResponse({ status: 200, description: "Message marked deleted" })
  deleteMessage(@CurrentUser() user: any, @Param("id") id: string) {
    return this.svc.deleteChatMessage(user.id, id);
  }
}
