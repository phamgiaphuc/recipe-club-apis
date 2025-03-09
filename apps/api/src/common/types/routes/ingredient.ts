import { DefaultRouteProps } from "apps/api/src/common/types/routes/default";

export interface IngredientRouteProps extends DefaultRouteProps {
  getIngredients: string;
  getCategories: string;
  crawlIngredientNutritions: string;
}

export const ingredientRoute: IngredientRouteProps = {
  index: "/ingredients",
  default: "/",
  status: "/api-status",
  getIngredients: "/",
  getCategories: "/categories",
  crawlIngredientNutritions: "/crawler/nutritions",
};
