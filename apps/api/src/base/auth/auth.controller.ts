import { AuthService } from "@app/api/base/auth/auth.service";
import { CookieService } from "@app/api/base/auth/cookie.service";
import { SignInDto } from "@app/api/base/auth/dto/signin.dto";
import { AtGuard } from "@app/api/base/auth/guard/at.guard";
import { GetUserPayload } from "@app/api/common/decorators/get-user-payload";
import { PayloadProps } from "@app/api/common/types/jwt";
import { authRoute } from "@app/api/common/types/routes/auth";
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Response } from "express";

@ApiTags("Auth")
@Controller(authRoute.index)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @ApiOperation({ summary: "Sign in" })
  @Post(authRoute.signIn)
  @HttpCode(HttpStatus.OK)
  async signIn(@Res() res: Response, @Body() body: SignInDto) {
    const { access_token, refresh_token } = await this.authService.signIn(body);
    return this.cookieService
      .setAuthenticationCookies({ res, refresh_token })
      .status(HttpStatus.OK)
      .json({
        code: 0,
        message: "User signed in successfully",
        data: {
          access_token,
        },
      });
  }

  @ApiOperation({ summary: "Get curent user's info" })
  @UseGuards(AtGuard)
  @Get(authRoute.getMe)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getMe(@GetUserPayload() payload: PayloadProps) {
    console.log(payload);
    return this.authService.getUserInfo(payload);
  }
}
