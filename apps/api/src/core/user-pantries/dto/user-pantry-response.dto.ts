import { ApiProperty } from '@nestjs/swagger';

class IngredientSummary {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Carrot' })
  name: string;

  @ApiProperty({
    example: 'https://cdn.example.com/images/carrot.png',
    required: false,
  })
  image_url?: string;
}

export class UserPantryResponseDto {
  @ApiProperty({
    example: 'c7b1b7c0-469a-4c5d-8d9a-b65d5e8f22a0',
    description: 'ID of the user who owns the pantry',
  })
  user_id: string;

  @ApiProperty({
    type: [IngredientSummary],
    description: 'List of ingredients in the pantry',
    example: [
      {
        id: 1,
        name: 'Carrot',
        image_url: 'https://cdn.example.com/images/carrot.png',
      },
    ],
  })
  ingredients: IngredientSummary[];

  @ApiProperty({ example: 1, description: 'Total number of ingredients' })
  total: number;
}
