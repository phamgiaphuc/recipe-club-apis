export const RECIPE_INGR_INDEX = "recipe_ingr_index";

export interface GetGeneralRecipesResponse {
  possibilities: number;
  prompt: PromptIngredientProps[];
  results: RecipeResultProps[];
  start: number;
  tags: RecipeTagProps;
  total_can_make_right_now: number;
  uses_for_exclusion: string[];
  version: string;
}

export interface PromptIngredientProps {
  ingredient: string;
  score: number;
}

export interface RecipeResultProps {
  cluster: string[];
  domain: string;
  id: string;
  img: string;
  needs: string[];
  title: string;
  uses: string;
  v: number;
}

export interface RecipeTagProps {
  ctag_indian: number;
  diet_gluten_free: number;
  diet_vegetarian: number;
  ptag_baked_goods: number;
  ptag_e: number;
  ptag_easy: number;
  ptag_oven_free: number;
  ptag_side_dish: number;
  ptag_slow_cooker: number;
  ptag_special_occasions: number;
  schema_5_ingredients_or_less: number;
  schema_5_star_rating: number;
  schema_ready_in_under_15mins: number;
  schema_ready_in_under_5mins: number;
}
