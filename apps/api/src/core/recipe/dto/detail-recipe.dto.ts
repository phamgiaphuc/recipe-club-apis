import { ApiProperty } from '@nestjs/swagger';

class NutritionFacts {
  @ApiProperty() calories_kcal: number;
  @ApiProperty() fat_total_g: number;
  @ApiProperty() protein_g: number;
  @ApiProperty() carbohydrates_total_g: number;
  @ApiProperty() fat_saturated_g: number;
  @ApiProperty() fat_monounsaturated_g: number;
  @ApiProperty() fat_polyunsaturated_g: number;
  @ApiProperty() fat_trans_g: number;
  @ApiProperty() sodium_mg: number;
  @ApiProperty() calcium_mg: number;
  @ApiProperty() magnesium_mg: number;
  @ApiProperty() potassium_mg: number;
  @ApiProperty() cholesterol_mg: number;
  @ApiProperty() iron_mg: number;
  @ApiProperty() zinc_mg: number;
  @ApiProperty() phosphorus_mg: number;
  @ApiProperty() fiber_g: number;
  @ApiProperty() sugar_g: number;
  @ApiProperty() vitamin_a_ug: number;
  @ApiProperty() vitamin_c_mg: number;
  @ApiProperty() vitamin_b1_mg: number;
  @ApiProperty() vitamin_b2_mg: number;
  @ApiProperty() vitamin_b3_mg: number;
  @ApiProperty() vitamin_b6_mg: number;
  @ApiProperty() folate_dfe_ug: number;
  @ApiProperty() folate_food_ug: number;
  @ApiProperty() folic_acid_ug: number;
  @ApiProperty() vitamin_b12_ug: number;
  @ApiProperty() vitamin_d_ug: number;
  @ApiProperty() vitamin_e_mg: number;
  @ApiProperty() vitamin_k_ug: number;
  @ApiProperty() water_g: number;
}
export class RecipeDetailResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  image_url?: string;

  @ApiProperty({ required: false })
  domain?: string;

  @ApiProperty({ type: [String] })
  ingredients: string[];

  @ApiProperty()
number_of_matched_ingredients: number;

  @ApiProperty({ type: NutritionFacts })
  nutrition_facts: NutritionFacts;
}