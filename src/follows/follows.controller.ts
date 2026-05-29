import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { FollowsService } from "./follows.service";
import { CreateFollowDto } from "./dto/create-follow.dto";

@ApiTags("follows")
@UseGuards(JwtAuthGuard)
@Controller("follows")
export class FollowsController {
  constructor(private readonly follows: FollowsService) {}

  @Post()
  @ApiOperation({ summary: "Follow a streamer" })
  @ApiResponse({ status: 201, description: "Follow created" })
  async follow(@CurrentUser() user: any, @Body() body: CreateFollowDto) {
    return this.follows.follow(user.id, body.streamerId);
  }

  @Delete(":streamerId")
  @ApiOperation({ summary: "Unfollow a streamer" })
  @ApiResponse({ status: 200, description: "Unfollowed" })
  async unfollow(
    @CurrentUser() user: any,
    @Param("streamerId") streamerId: string,
  ) {
    return this.follows.unfollow(user.id, streamerId);
  }

  @Get("/streamer/:streamerId")
  @ApiOperation({ summary: "Get followers for a streamer" })
  @ApiResponse({ status: 200, description: "List of followers" })
  async getFollowers(@Param("streamerId") streamerId: string) {
    return this.follows.getFollowers(streamerId);
  }

  @Get("/me")
  @ApiOperation({ summary: "Get list of streamers the current user follows" })
  @ApiResponse({ status: 200, description: "List of followed streamers" })
  async getMyFollowing(@CurrentUser() user: any) {
    return this.follows.getFollowing(user.id);
  }
}
