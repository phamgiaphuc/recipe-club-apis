import { ImageController } from "@app/api/base/image/image.controller";
import { ImageService } from "@app/api/base/image/image.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
