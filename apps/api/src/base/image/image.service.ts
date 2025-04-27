import { ImageResponse } from "@app/api/common/types/image";
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary } from "cloudinary";
import * as streamifier from "streamifier";

@Injectable()
export class ImageService {
  private readonly allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ];

  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get("CLOUDINARY_NAME"),
      api_key: this.configService.get("CLOUDINARY_API_KEY"),
      api_secret: this.configService.get("CLOUDINARY_API_SECRET"),
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<ImageResponse> {
    try {
      if (!this.allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException("Invalid image type");
      }
      return new Promise<ImageResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "recipe-club",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
}
