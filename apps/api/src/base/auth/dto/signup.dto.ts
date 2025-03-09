import { ApiProperty } from "@nestjs/swagger";
import { UserProfiles, Users } from "@prisma/client";
import { IsNotEmpty, IsString } from "class-validator";

export interface SignUpProps
  extends Pick<Users, "email" | "username" | "password">,
    Pick<UserProfiles, "first_name" | "last_name"> {}

export class SignUpDto implements SignUpProps {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  last_name: string;
}
