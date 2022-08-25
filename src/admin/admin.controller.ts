import { Body, Controller, Delete, Get, Inject, Param, Post } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { Coupon } from "../types";

@Controller("/admin")
export class AdminController {
  constructor(@Inject(AdminService) private adminService: AdminService) {
  }

  @Get("/all-reserved-table")
  async getAllReservationsDetails() {
    return this.adminService.getAllReservationsDetails();
  }

  @Get("/list-of-transactions")
  async getAllTransactionsDetails() {
    return this.adminService.getAllTransactionsDetails();
  }

  @Post("/create-coupon")
  async createCoupon(@Body() { percent_off, name }: Coupon) {
    return this.adminService.createCoupon(name, percent_off);
  }

  @Get("/all-coupons")
  async allCoupons() {
    return this.adminService.allCoupons();
  }

  @Delete("/remove-coupon/:id")
  async removeCoupon(@Param("id") id: string) {
    return this.adminService.removeCoupon(id);
  }
}
