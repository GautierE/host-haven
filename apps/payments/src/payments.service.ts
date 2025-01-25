import { CreateChargeDto } from "@app/common";
import { Injectable, UsePipes, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(
    this.configService.get("STRIPE_SECRET_KEY"),
    {
      apiVersion: "2024-12-18.acacia",
    },
  );

  constructor(private readonly configService: ConfigService) {}

  @UsePipes(new ValidationPipe())
  async createCharge({ card, amount }: CreateChargeDto) {
    return await this.stripe.paymentIntents.create({
      payment_method: "pm_card_visa",
      amount: amount * 100,
      confirm: true,
      payment_method_types: ["card"],
      currency: "eur",
    });
  }
}
