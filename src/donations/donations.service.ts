import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateDonationDto } from "./dto/create-donation.dto";
import { UpdateDonationDto } from "./dto/update-donation.dto";
import { DonationEntity } from "./entities/donation.entity";
import { randomUUID } from "node:crypto";

@Injectable()
export class DonationsService {
  private readonly logger = new Logger(DonationsService.name);

  constructor(
    @InjectRepository(DonationEntity)
    private readonly donationRepo: Repository<DonationEntity>,
  ) {}

  async findAll() {
    return this.donationRepo.find();
  }

  async findOne(id: string) {
    return (await this.donationRepo.findOneBy({ id })) ?? null;
  }

  async create(createDonationDto: CreateDonationDto) {
    // Create a pending donation and return a simulated payment URL
    const providerPaymentId = randomUUID();

    const donation = this.donationRepo.create({
      streamId: createDonationDto.streamId,
      userId: createDonationDto.userId,
      amountCents: createDonationDto.amountCents,
      currency: createDonationDto.currency,
      message: createDonationDto.message ?? null,
      status: createDonationDto.status ?? "pending",
      providerPaymentId,
    });

    const saved = await this.donationRepo.save(donation);

    // Simulate a redirect URL to an external payment page
    const paymentUrl = `${process.env.PAYMENT_PROVIDER_BASE_URL ?? "https://payments.example"}/checkout/${providerPaymentId}`;

    return { donation: saved, paymentUrl };
  }

  async update(id: string, updateDonationDto: UpdateDonationDto) {
    const donation = await this.donationRepo.findOneBy({ id });
    if (!donation) return null;

    if (updateDonationDto.status !== undefined)
      donation.status = updateDonationDto.status;
    if (updateDonationDto.message !== undefined)
      donation.message = updateDonationDto.message;

    return this.donationRepo.save(donation);
  }

  async remove(id: string) {
    const donation = await this.donationRepo.findOneBy({ id });
    if (!donation) return null;
    await this.donationRepo.remove(donation);
    return donation;
  }

  // Webhook handler for payment provider
  async handleWebhook(event: { providerPaymentId: string; status: string }) {
    const { providerPaymentId, status } = event;
    const donation = await this.donationRepo.findOneBy({ providerPaymentId });
    if (!donation) {
      this.logger.warn(`Webhook for unknown payment id ${providerPaymentId}`);
      return null;
    }

    donation.status = status;
    const saved = await this.donationRepo.save(donation);

    // Optionally: emit events, notify streamer, publish to Redis, etc.

    return saved;
  }
}
