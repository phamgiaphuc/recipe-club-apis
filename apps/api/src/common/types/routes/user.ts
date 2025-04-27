import { DefaultRouteProps } from "@app/api/common/types/routes/default";

export interface UserRouteProps extends DefaultRouteProps {
  createUserRatings: string;
  getUserRatings: string;
  updateUserRatings: string;
  deleteUserRatings: string;
  getUserPantries: string;
  updateUserPantries: string;
}

export const userRoute: UserRouteProps = {
  index: "/users",
  default: "/",
  status: "/api-status",
  createUserRatings: "/ratings",
  getUserRatings: "/ratings",
  updateUserRatings: "/ratings/:id",
  deleteUserRatings: "/ratings/:id",
  getUserPantries: "/pantries",
  updateUserPantries: "/pantries",
};
