"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentProviderModule = void 0;
const common_1 = require("@nestjs/common");
const mock_payment_provider_1 = require("./mock-payment-provider");
const payment_provider_interface_1 = require("./payment-provider.interface");
let PaymentProviderModule = class PaymentProviderModule {
};
exports.PaymentProviderModule = PaymentProviderModule;
exports.PaymentProviderModule = PaymentProviderModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: payment_provider_interface_1.PAYMENT_PROVIDER,
                useClass: mock_payment_provider_1.MockPaymentProvider,
            },
        ],
        exports: [payment_provider_interface_1.PAYMENT_PROVIDER],
    })
], PaymentProviderModule);
