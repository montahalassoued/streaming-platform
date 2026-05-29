import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Request } from "express";
import { DonationsService } from "./donations.service";
import { CreateDonationDto } from "./dto/create-donation.dto";
import { UpdateDonationDto } from "./dto/update-donation.dto";
import { DonationWebhookDto } from "./dto/donation-webhook.dto";
import { IPaymentProvider, PAYMENT_PROVIDER } from "./providers/payment-provider.interface";

@ApiTags("donations")
@Controller("donations")
export class DonationsController {
  constructor(
    private readonly donationsService: DonationsService,
    @Inject(PAYMENT_PROVIDER) private readonly paymentProvider: IPaymentProvider,
  ) {}

  @Get()
  findAll() {
    return this.donationsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.donationsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Create a donation (initiates checkout)" })
  @ApiResponse({ status: 200, description: "Donation created and checkout URL returned" })
  create(@Body() createDonationDto: CreateDonationDto) {
    return this.donationsService.create(createDonationDto);
  }

  @Post("/webhook")
  async webhook(
    @Body() dto: DonationWebhookDto,
    @Req() req: Request,
    @Headers('x-pay-signature') signature?: string,
  ) {
    const rawBody = (req as any).rawBody?.toString() ?? JSON.stringify(dto);
    const valid = this.paymentProvider.verifyWebhookSignature(rawBody, signature ?? "");
    if (!valid) throw new UnauthorizedException('Invalid webhook signature');

    const result = await this.donationsService.handleWebhook(dto);
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
