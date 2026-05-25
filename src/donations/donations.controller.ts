import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { DonationsService } from "./donations.service";
import { CreateDonationDto, UpdateDonationDto } from "./donations.dto";

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
