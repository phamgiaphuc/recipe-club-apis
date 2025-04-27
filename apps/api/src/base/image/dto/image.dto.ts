import { ApiProperty } from "@nestjs/swagger";

export class SingleImageDto {
  @ApiProperty({ type: "string", format: "binary", required: true })
  file: Express.Multer.File;
}

export class MultipleImagesDto {
  @ApiProperty({
    type: "array",
    items: { type: "string", format: "binary" },
  })
  files: Express.Multer.File[];
}
