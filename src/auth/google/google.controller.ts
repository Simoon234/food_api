import { Controller, Get, Inject, Res, UseGuards } from "@nestjs/common";
import { GoogleAuth } from "../guards/google.guard";
import { Person } from "../../decorators/person.decorator";
import { GoogleService } from "./google.service";
import { Response } from "express";
import { JwtGuard } from "../guards/jwt.guard";
import { User } from "../../types";

@Controller("/google")
export class GoogleController {
  constructor(@Inject(GoogleService) private authService: GoogleService) {
  }

  @Get("/")
  @UseGuards(GoogleAuth)
  async googleLogin(@Person() obj: any) {
    return obj;
  }

  @Get("/redirect")
  @UseGuards(GoogleAuth)
  async googleAuthRedirect(@Person() obj: any, @Res() res: Response) {
    return this.authService.loggedIn(obj, res);
  }

  @UseGuards(JwtGuard)
  @Get("/logout")
  async logout(@Person() obj: User, @Res() res: Response) {
    return this.authService.logout(obj, res);
  }
}
