import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Reservation } from "../table-reservation/entity/reservations.entity";
import { Stripe } from "stripe";

@Injectable()
export class AdminService {
  constructor(@Inject("STRIPE_CLIENT") private stripe: Stripe) {
  }

  async getAllReservationsDetails() {
    const allReservations = await Reservation.find({
      relations: ["reservedBy"]
    });
    return allReservations.map((item) => ({
      id: item.id,
      reservationDate: item.reservationDate,
      tableType: item.tableType,
      user: {
        name: item.reservedBy.firstName,
        lastName: item.reservedBy.lastName,
        email: item.reservedBy.email
      }
    }));
  }

  async getAllTransactionsDetails() {
    const all = await this.stripe.paymentIntents.list();
    const filterData = all.data
      .filter((item) => item.status !== "canceled")
      .map((details) => {
        return {
          id: details.id,
          amount: details.amount / 100,
          currency: details.currency,
          charges: details.charges.data.map((item) => {
            return {
              transactionId: item.id,
              city: item.billing_details.address.city,
              country: item.billing_details.address.country,
              address: item.billing_details.address.line1,
              postCode: item.billing_details.address.postal_code,
              user: {
                email: item.billing_details.email,
                name: item.billing_details.name,
                phone: item.billing_details.phone
              },
              paymentMethodInfo: {
                type: item.payment_method_details.type,
                brand: item.payment_method_details.card.brand,
                funding: item.payment_method_details.card.funding,
                lastFour: item.payment_method_details.card.last4,
                network: item.payment_method_details.card.network
              },
              paid: item.paid,
              message: item.outcome.seller_message
            };
          }),
          bought: new Date(details.created * 1000).toISOString()
        };
      });
    const totalPrice = filterData
      .reduce((curr, prev) => curr + prev.amount / 100, 0)
      .toFixed(2);
    return {
      info: filterData,
      totalPrice
    };
  }

  async createCoupon(name: string, percent_off: number) {
    const coupon = await this.stripe.coupons.create({
      percent_off,
      duration: "once",
      currency: "pln",
      name
    });
    return await this.stripe.promotionCodes.create({
      coupon: coupon.id,
      code: name
    });
  }

  async allCoupons() {
    const allAvailableCoupons = await this.stripe.coupons.list();
    return {
      coupons: allAvailableCoupons.data.map((coupon) => {
        return {
          id: coupon.id,
          name: coupon.name
        };
      })
    };
  }

  async removeCoupon(id: string) {
    const coupon = await this.stripe.coupons.del(id);

    if (!coupon) {
      throw new HttpException("No coupon found", HttpStatus.BAD_REQUEST);
    }

    return {
      status: true,
      message: "Coupon removed"
    };
  }
}
