import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, ValidateNested } from "class-validator";

export interface UpdateUserPantryProps {
  ingredient_ids: number[];
}

export class UpdateUserPantryDto implements UpdateUserPantryProps {
  @ApiProperty({
    type: "number",
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @IsNotEmpty()
  ingredient_ids: number[];
}
