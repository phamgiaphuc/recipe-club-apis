import { ApiProperty } from "@nestjs/swagger";
import { Recipes, UserRatings } from "@prisma/client";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

interface UserRatingProps
  extends Pick<UserRatings, "rating" | "comment" | "image_urls"> {}

interface RecipeIdProps {
  recipe_id: Recipes["id"];
}

export class UserRatingDto implements UserRatingProps {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @ApiProperty({
    type: "string",
    isArray: true,
    required: false,
  })
  @IsArray()
  image_urls: string[];

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  comment: string;
}

export class CreateUserRatingDto
  extends UserRatingDto
  implements RecipeIdProps
{
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  recipe_id: string;
}

export class UpdateUserRatingDto extends UserRatingDto {}
