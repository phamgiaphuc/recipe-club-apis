import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber } from "class-validator";

export interface UpdateUserPantryProps {
  ingredient_ids: number[];
}

export class UpdateUserPantryDto implements UpdateUserPantryProps {
  @ApiProperty({
    type: Number,
    isArray: true,
    example: [1, 2, 3],
  })
  @IsArray()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  ingredient_ids: number[];
}
