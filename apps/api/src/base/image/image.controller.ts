import {
  MultipleImagesDto,
  SingleImageDto,
} from "@app/api/base/image/dto/image.dto";
import { ImageService } from "@app/api/base/image/image.service";
import { imageRoute } from "@app/api/common/types/routes/image";
import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Images")
@Controller(imageRoute.index)
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiConsumes("multipart/form-data")
  @Post(imageRoute.uploadSingle)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Upload a single image" })
  @ApiBody({ type: SingleImageDto })
  @UseInterceptors(FileInterceptor("file"))
  async uploadSingleImage(@UploadedFile() file: Express.Multer.File) {
    const { url } = await this.imageService.uploadFile(file);
    return { image_url: url };
  }

  @ApiConsumes("multipart/form-data")
  @Post(imageRoute.uploadMultiple)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Upload multiple images" })
  @ApiBody({ type: MultipleImagesDto })
  @UseInterceptors(FilesInterceptor("files"))
  async uploadMultipleImages(@UploadedFiles() files: Express.Multer.File[]) {
    const urls = await Promise.all(
      files.map(async (file) => {
        const { url } = await this.imageService.uploadFile(file);
        return url;
      }),
    );
    return { image_urls: urls };
  }
}
