import { ApiProperty } from "@nestjs/swagger";
import { Users } from "@prisma/client";
import { IsNotEmpty, IsString } from "class-validator";

export interface SignInProps extends Pick<Users, "password"> {
  account: string;
}

export class SignInDto implements SignInProps {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  account: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
