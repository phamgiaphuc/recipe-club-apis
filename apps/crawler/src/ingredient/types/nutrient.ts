export type Nutrient = {
  label: string;
  quantity: number;
  unit: string;
};

export type TotalNutrients = {
  ENERC_KCAL: Nutrient;
  FAT: Nutrient;
  FASAT: Nutrient;
  FAMS: Nutrient;
  FAPU: Nutrient;
  FATRN: Nutrient;
  CHOCDF: Nutrient;
  "CHOCDF.net": Nutrient;
  FIBTG: Nutrient;
  SUGAR: Nutrient;
  "SUGAR.added": Nutrient;
  PROCNT: Nutrient;
  CHOLE: Nutrient;
  NA: Nutrient;
  CA: Nutrient;
  MG: Nutrient;
  K: Nutrient;
  FE: Nutrient;
  ZN: Nutrient;
  P: Nutrient;
  VITA_RAE: Nutrient;
  VITC: Nutrient;
  THIA: Nutrient;
  RIBF: Nutrient;
  NIA: Nutrient;
  VITB6A: Nutrient;
  FOLDFE: Nutrient;
  FOLFD: Nutrient;
  FOLAC: Nutrient;
  VITB12: Nutrient;
  VITD: Nutrient;
  TOCPHA: Nutrient;
  VITK1: Nutrient;
  WATER: Nutrient;
};

export interface GetIngredientNutrientsResponse {
  dietLabels: string[];
  healthLabels: string[];
  totalNutrients: TotalNutrients;
}
