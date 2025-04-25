import { UserPantryService } from "@app/api/core/user/user-pantry.service";
import { UserController } from "@app/api/core/user/user.controller";
import { Module } from "@nestjs/common";

@Module({
  controllers: [UserController],
  providers: [UserPantryService],
})
export class UserModule {}
