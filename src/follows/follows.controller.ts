import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { FollowsService } from "./follows.service";
import { CreateFollowDto } from "./dto/create-follow.dto";

@UseGuards(JwtAuthGuard)
@Controller("follows")
export class FollowsController {
  constructor(private readonly follows: FollowsService) {}

  @Post()
  async follow(@CurrentUser() user: any, @Body() body: CreateFollowDto) {
    return this.follows.follow(user.id, body.streamerId);
  }

  @Delete(":streamerId")
  async unfollow(
    @CurrentUser() user: any,
    @Param("streamerId") streamerId: string,
  ) {
    return this.follows.unfollow(user.id, streamerId);
  }

  @Get("/streamer/:streamerId")
  async getFollowers(@Param("streamerId") streamerId: string) {
    return this.follows.getFollowers(streamerId);
  }

  @Get("/me")
  async getMyFollowing(@CurrentUser() user: any) {
    return this.follows.getFollowing(user.id);
  }
}
