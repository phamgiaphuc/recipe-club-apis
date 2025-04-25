import { DefaultRouteProps } from "@app/api/common/types/routes/default";

export interface UserRouteProps extends DefaultRouteProps {
  createUserPantries: string;
  getUserPantries: string;
  updateUserPantries: string;
}

export const userRoute: UserRouteProps = {
  index: "/users",
  default: "/",
  status: "/api-status",
  createUserPantries: "/pantries",
  getUserPantries: "/pantries",
  updateUserPantries: "/pantries",
};
