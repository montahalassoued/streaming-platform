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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonationsController = void 0;
const common_1 = require("@nestjs/common");
const donations_service_1 = require("./donations.service");
const create_donation_dto_1 = require("./dto/create-donation.dto");
const update_donation_dto_1 = require("./dto/update-donation.dto");
const donation_webhook_dto_1 = require("./dto/donation-webhook.dto");
const payment_provider_interface_1 = require("./providers/payment-provider.interface");
let DonationsController = class DonationsController {
    constructor(donationsService, paymentProvider) {
        this.donationsService = donationsService;
        this.paymentProvider = paymentProvider;
    }
    findAll() {
        return this.donationsService.findAll();
    }
    findOne(id) {
        return this.donationsService.findOne(id);
    }
    create(createDonationDto) {
        return this.donationsService.create(createDonationDto);
    }
    async webhook(dto, req, signature) {
        const rawBody = req.rawBody?.toString() ?? JSON.stringify(dto);
        const valid = this.paymentProvider.verifyWebhookSignature(rawBody, signature ?? "");
        if (!valid)
            throw new common_1.UnauthorizedException('Invalid webhook signature');
        const result = await this.donationsService.handleWebhook(dto);
        return { ok: true, result };
    }
    update(id, updateDonationDto) {
        return this.donationsService.update(id, updateDonationDto);
    }
    remove(id) {
        return this.donationsService.remove(id);
    }
};
exports.DonationsController = DonationsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_donation_dto_1.CreateDonationDto]),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("/webhook"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Headers)('x-pay-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [donation_webhook_dto_1.DonationWebhookDto, Object, String]),
    __metadata("design:returntype", Promise)
], DonationsController.prototype, "webhook", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_donation_dto_1.UpdateDonationDto]),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DonationsController.prototype, "remove", null);
exports.DonationsController = DonationsController = __decorate([
    (0, common_1.Controller)("donations"),
    __param(1, (0, common_1.Inject)(payment_provider_interface_1.PAYMENT_PROVIDER)),
    __metadata("design:paramtypes", [donations_service_1.DonationsService, Object])
], DonationsController);
