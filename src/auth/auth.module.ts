import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { GoogleStrategy } from "./strategies/google.strategy";
import { JsonAuthStrategy } from "./strategies/json-auth-strategy";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import * as dotenv from "dotenv";
import { PassportModule } from "@nestjs/passport";
import { SECRET_JWT_KEY } from "../../db-config";

dotenv.config();

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: SECRET_JWT_KEY
    })
  ],
  controllers: [AuthController],
  providers: [
    GoogleStrategy,
    JsonAuthStrategy,
    AuthService
  ],
  exports: [AuthService]
})
export class AuthModule {
}
