import { ApiProperty } from '@nestjs/swagger';



class RecipeItem {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  image_url?: string;

  @ApiProperty({ required: false })
  domain?:string;

  @ApiProperty()
  matched_ingredients: number;;



 
}

export class RecommendRecipesResponseDto {
  @ApiProperty({ type: [RecipeItem] })
  recipes: RecipeItem[];

  @ApiProperty()
  total: number;;
}
