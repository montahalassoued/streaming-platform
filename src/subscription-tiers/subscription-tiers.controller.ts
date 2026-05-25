import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { SubscriptionTiersService } from "./subscription-tiers.service";
import { CreateSubscriptionTierDto } from "./dto/create-subscription-tier.dto";
import { UpdateSubscriptionTierDto } from "./dto/update-subscription-tier.dto";

@Controller("subscription-tiers")
export class SubscriptionTiersController {
  constructor(private readonly svc: SubscriptionTiersService) {}

  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.svc.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateSubscriptionTierDto) {
    return this.svc.create(dto as any);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateSubscriptionTierDto) {
    return this.svc.update(id, dto as any);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.svc.remove(id);
  }
}
