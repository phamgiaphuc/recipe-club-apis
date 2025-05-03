import {
  IsEmail,
  IsString,
  IsBoolean,
  IsOptional,
  IsUrl,
} from "class-validator";

export class GoogleProfileDto {
  @IsString()
  sub: string;

  @IsString()
  name: string;

  @IsString()
  givenName: string;

  @IsString()
  familyName: string;

  @IsUrl()
  picture: string;

  @IsEmail()
  email: string;

  @IsBoolean()
  emailVerified: boolean;

  @IsString()
  accessToken: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;
}
