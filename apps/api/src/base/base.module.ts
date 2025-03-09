import { AuthModule } from "@app/api/base/auth/auth.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [AuthModule],
})
export class BaseModule {}
