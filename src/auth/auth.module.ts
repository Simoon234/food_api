import { Module } from "@nestjs/common";
import { GoogleController } from "./google/google.controller";
import { GoogleStrategy } from "./strategies/google.strategy";
import { JsonAuthStrategy } from "./strategies/json-auth-strategy";
import { JwtModule } from "@nestjs/jwt";
import * as dotenv from "dotenv";
import { PassportModule } from "@nestjs/passport";
import { SECRET_JWT_KEY } from "../../db-config";
import { LocalModule } from "./local/local.module";
import { GoogleService } from "./google/google.service";

dotenv.config();

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: SECRET_JWT_KEY
    }),
    LocalModule
  ],
  controllers: [GoogleController],
  providers: [GoogleStrategy, JsonAuthStrategy, GoogleService],
  exports: [GoogleService]
})
export class AuthModule {
}
