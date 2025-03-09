export interface GetCategoriesResponse {
  id: number;
  name: string;
  image_url: string;
  ingredients: {
    id: number;
    name: string;
    image_url: string;
  }[];
}
