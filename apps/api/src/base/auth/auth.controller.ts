import { AuthService } from "@app/api/base/auth/auth.service";
import { CookieService } from "@app/api/base/auth/cookie.service";
import { GoogleProfileDto } from "@app/api/base/auth/dto/google-profile.dto";
import { SignInDto } from "@app/api/base/auth/dto/signin.dto";
import { SignUpDto } from "@app/api/base/auth/dto/signup.dto";
import { AtGuard } from "@app/api/base/auth/guard/at.guard";
import { GoogleGuard } from "@app/api/base/auth/guard/google.guard";
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
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";

@ApiTags("Auth")
@Controller(authRoute.index)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
    private readonly configSerivice: ConfigService,
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

  @ApiOperation({ summary: "Sign up" })
  @Post(authRoute.signUp)
  @HttpCode(HttpStatus.OK)
  async signUp(@Res() res: Response, @Body() body: SignUpDto) {
    const { access_token, refresh_token } = await this.authService.signUp(body);
    return this.cookieService
      .setAuthenticationCookies({ res, refresh_token })
      .status(HttpStatus.OK)
      .json({
        code: 0,
        message: "User signed up successfully",
        data: {
          access_token,
        },
      });
  }

  @ApiOperation({ summary: "Sign in with Google" })
  @HttpCode(HttpStatus.OK)
  @Get(authRoute.googleSignIn)
  @UseGuards(GoogleGuard)
  async googleSignIn() {}

  @ApiOperation({ summary: "Google callback" })
  @HttpCode(HttpStatus.OK)
  @Get(authRoute.googleCallback)
  @UseGuards(GoogleGuard)
  async googleCallback(
    @Req() req: Request,
    @Res() res: Response,
    @GetUserPayload() profile: GoogleProfileDto,
  ) {
    const { access_token, refresh_token } = await this.authService.googleSignIn(
      req,
      profile,
    );
    return res
      .status(HttpStatus.OK)
      .redirect(
        `${this.configSerivice.get<string>("FE_REDIRECT_URL")}?access_token=${access_token}&refresh_token=${refresh_token}`,
      );
  }

  @ApiOperation({ summary: "Get curent user's info" })
  @UseGuards(AtGuard)
  @Get(authRoute.getMe)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  async getMe(@GetUserPayload() payload: PayloadProps) {
    return this.authService.getUserInfo(payload);
  }
}
