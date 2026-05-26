import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from "@nestjs/common";
import { Request } from "express";
import { DonationsService } from "./donations.service";
import { CreateDonationDto } from "./dto/create-donation.dto";
import { UpdateDonationDto } from "./dto/update-donation.dto";

@Controller("donations")
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Get()
  findAll() {
    return this.donationsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.donationsService.findOne(id);
  }

  @Post()
  create(@Body() createDonationDto: CreateDonationDto) {
    return this.donationsService.create(createDonationDto);
  }

  @Post("/webhook")
  async webhook(@Body() body: any, @Req() req: Request) {
    const signature = req.headers["x-pay-signature"] as string | undefined;
    const secret = process.env.PAYMENT_WEBHOOK_SECRET;
    if (secret && signature !== secret) {
      return { ok: false, message: "invalid signature" };
    }

    const { providerPaymentId, status } = body;
    const result = await this.donationsService.handleWebhook({ providerPaymentId, status });
    return { ok: true, result };
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateDonationDto: UpdateDonationDto,
  ) {
    return this.donationsService.update(id, updateDonationDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.donationsService.remove(id);
  }
}
