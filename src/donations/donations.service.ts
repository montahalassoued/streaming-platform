import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateDonationDto } from "./dto/create-donation.dto";
import { UpdateDonationDto } from "./dto/update-donation.dto";
import { DonationEntity } from "./entities/donation.entity";
import { DonationWebhookDto } from "./dto/donation-webhook.dto";
import { IPaymentProvider, PAYMENT_PROVIDER } from "./providers/payment-provider.interface";
@Injectable()
export class DonationsService {
  private readonly logger = new Logger(DonationsService.name);

  constructor(
    @InjectRepository(DonationEntity)
    private readonly donationRepo: Repository<DonationEntity>,
    @Inject(PAYMENT_PROVIDER)
    private readonly paymentProvider: IPaymentProvider,
  ) {}

  async findAll() {
    return this.donationRepo.find();
  }

  async findOne(id: string) {
    return (await this.donationRepo.findOneBy({ id })) ?? null;
  }

  async create(createDonationDto: CreateDonationDto) {
    const donation = this.donationRepo.create({
      streamId: createDonationDto.streamId,
      userId: createDonationDto.userId,
      amountCents: createDonationDto.amountCents,
      currency: createDonationDto.currency,
      message: createDonationDto.message ?? null,
      status: "pending",
    });

    const saved = await this.donationRepo.save(donation);

    const { providerPaymentId, checkoutUrl } = await this.paymentProvider.createCheckout({
      donationId: saved.id,
      amountCents: saved.amountCents,
      currency: saved.currency,
    });

    saved.providerPaymentId = providerPaymentId;
    const updated = await this.donationRepo.save(saved);

    return { donation: updated, paymentUrl: checkoutUrl };
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
  async handleWebhook(dto: DonationWebhookDto) {
    const donation = await this.donationRepo.findOneBy({ providerPaymentId: dto.providerPaymentId });
    if (!donation) {
      this.logger.warn(`Webhook for unknown providerPaymentId: ${dto.providerPaymentId}`);
      return null;
    }

    const newStatus = this.paymentProvider.mapEventToStatus(dto.event);
    if (!newStatus) {
      this.logger.warn(`Unrecognised provider event: ${dto.event}`);
      return null;
    }

    donation.status = newStatus;
    return this.donationRepo.save(donation);
  }
  async giveDonation(createDonationDto: Partial<DonationEntity>) {
    const donation = this.donationRepo.create({
      streamId: createDonationDto.streamId!,
      userId: createDonationDto.userId!,
      amountCents: createDonationDto.amountCents ?? 0,
      currency: createDonationDto.currency ?? "USD",
      message: createDonationDto.message ?? null,
      status: createDonationDto.status ?? "completed",
    });
    return this.donationRepo.save(donation);
  }
}
