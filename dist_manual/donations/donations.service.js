"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DonationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const donation_entity_1 = require("./entities/donation.entity");
const payment_provider_interface_1 = require("./providers/payment-provider.interface");
let DonationsService = DonationsService_1 = class DonationsService {
    constructor(donationRepo, paymentProvider) {
        this.donationRepo = donationRepo;
        this.paymentProvider = paymentProvider;
        this.logger = new common_1.Logger(DonationsService_1.name);
    }
    async findAll() {
        return this.donationRepo.find();
    }
    async findOne(id) {
        return (await this.donationRepo.findOneBy({ id })) ?? null;
    }
    async create(createDonationDto) {
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
    async update(id, updateDonationDto) {
        const donation = await this.donationRepo.findOneBy({ id });
        if (!donation)
            return null;
        if (updateDonationDto.status !== undefined)
            donation.status = updateDonationDto.status;
        if (updateDonationDto.message !== undefined)
            donation.message = updateDonationDto.message;
        return this.donationRepo.save(donation);
    }
    async remove(id) {
        const donation = await this.donationRepo.findOneBy({ id });
        if (!donation)
            return null;
        await this.donationRepo.remove(donation);
        return donation;
    }
    async handleWebhook(dto) {
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
    async giveDonation(createDonationDto) {
        const donation = this.donationRepo.create({
            streamId: createDonationDto.streamId,
            userId: createDonationDto.userId,
            amountCents: createDonationDto.amountCents ?? 0,
            currency: createDonationDto.currency ?? "USD",
            message: createDonationDto.message ?? null,
            status: createDonationDto.status ?? "completed",
        });
        return this.donationRepo.save(donation);
    }
};
exports.DonationsService = DonationsService;
exports.DonationsService = DonationsService = DonationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(donation_entity_1.DonationEntity)),
    __param(1, (0, common_1.Inject)(payment_provider_interface_1.PAYMENT_PROVIDER)),
    __metadata("design:paramtypes", [typeorm_2.Repository, Object])
], DonationsService);
