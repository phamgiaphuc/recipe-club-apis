import { JwtSignOptions } from "@nestjs/jwt";
import { IsString } from "class-validator";

export interface PayloadProps {
  session_id: string;
  user_id: string;
  role: string;
  iat?: number;
  exp?: number;
  aud?: string;
}

export interface TokenOptions extends JwtSignOptions {
  secret: string;
}

export type TokenType = "at" | "rt" | "custom";

export const initialTokenOptions: TokenOptions = {
  expiresIn: "30m",
  secret: "fdhmlqq04wWleWdQDf5hH9CYItsJkhBF",
};

export class PayloadDto implements PayloadProps {
  @IsString()
  session_id: string;

  @IsString()
  user_id: string;

  @IsString()
  role: string;
}
