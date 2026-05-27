import { Body, Controller, Post, UseGuards, Get } from "@nestjs/common";
import { SubscriptionsService } from "./subscriptions.service";
import { CreateSubscriptionDto } from "./dto/create-subscription.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags('subscriptions')
@ApiBearerAuth()
@Controller("subscriptions")
export class SubscriptionsController {
  constructor(private readonly svc: SubscriptionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  subscribe(@CurrentUser() user: any, @Body() dto: CreateSubscriptionDto) {
    return this.svc.subscribeToStreamer(user.id, dto.streamerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  list(@CurrentUser() user: any) {
    return this.svc.getUserSubscriptions(user.id);
  }
}
