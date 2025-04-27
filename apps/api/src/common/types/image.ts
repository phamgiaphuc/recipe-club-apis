import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

export type ImageResponse = UploadApiResponse | UploadApiErrorResponse;
