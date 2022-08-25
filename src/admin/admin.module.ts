import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { RolesGuard } from "../auth/guards/roles.guard";

@Module({
  controllers: [AdminController],
  providers: [
    AdminService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ],
  exports: [AdminService]
})
export class AdminModule {
}
