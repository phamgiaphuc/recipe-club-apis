import { DefaultRouteProps } from "@app/api/common/types/routes/default";

export interface ImageRouteProps extends DefaultRouteProps {
  uploadSingle: string;
  uploadMultiple: string;
}

export const imageRoute: ImageRouteProps = {
  index: "/images",
  default: "/",
  status: "/api-status",
  uploadSingle: "/upload/single",
  uploadMultiple: "/upload/multiple",
};
