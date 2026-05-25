import { Injectable } from "@nestjs/common";
import { CreateDonationDto, UpdateDonationDto } from "./donations.dto";

@Injectable()
export class DonationsService {
  findAll() {
    return [{ message: "Donations list placeholder" }];
  }

  findOne(id: string) {
    return { message: "Donation detail placeholder", id };
  }

  create(createDonationDto: CreateDonationDto) {
    return { message: "Donation created placeholder", data: createDonationDto };
  }

  update(id: string, updateDonationDto: UpdateDonationDto) {
    return {
      message: "Donation updated placeholder",
      id,
      data: updateDonationDto,
    };
  }

  remove(id: string) {
    return { message: "Donation removed placeholder", id };
  }
}
