import { AuthModule } from "@app/api/base/auth/auth.module";
import { ImageModule } from "@app/api/base/image/image.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [AuthModule, ImageModule],
})
export class BaseModule {}
