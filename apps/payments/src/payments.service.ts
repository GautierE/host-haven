import { CreateChargeDto, NOTIFICATIONS_SERVICE } from "@app/common";
import { Inject, Injectable, UsePipes, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy } from "@nestjs/microservices";
import Stripe from "stripe";
import { PaymentsCreateChargeDto } from "./dto/payments-create-charge.dto";

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(
    this.configService.get("STRIPE_SECRET_KEY"),
    {
      apiVersion: "2025-01-27.acacia",
    },
  );

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
  ) {}

  @UsePipes(new ValidationPipe())
  async createCharge({ card, amount, email }: PaymentsCreateChargeDto) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: "pm_card_visa",
      amount: amount * 100,
      confirm: true,
      payment_method_types: ["card"],
      currency: "eur",
    });

    this.notificationsService.emit("notify_email", {
      email,
      text: `Your payment of ${amount}$  was successful`,
    });

    return paymentIntent;
  }
}
