import { Body, Controller, Get, HttpCode, Inject, Post, Res, UseGuards } from "@nestjs/common";
import { LocalService } from "./local.service";
import { PersonInterface, User } from "../../types";
import { Response } from "express";
import { LogDto } from "./dto/log.dto";
import { JwtGuard } from "../guards/jwt.guard";
import { Person } from "src/decorators/person.decorator";

@Controller("/auth")
export class LocalController {
  constructor(@Inject(LocalService) private localService: LocalService) {
  }

  @Post("/register")
  async registerUser(@Body() customer: User) {
    return this.localService.register(customer);
  }

  @HttpCode(200)
  @Post("/login")
  log(@Body() log: LogDto, @Res() res: Response): Promise<void> {
    return this.localService.login(log, res);
  }

  @UseGuards(JwtGuard)
  @Get("/logout")
  logout(@Person() person: PersonInterface, @Res() res: Response): Promise<void> {
    console.log(person);
    return this.localService.logout(person, res);
  }
}
