import { convertToMilliseconds } from "@app/common/utils/date-format";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CookieOptions, Response } from "express";

interface AuthCookieProps {
  res: Response;
  refresh_token: string;
}

@Injectable()
export class CookieService {
  constructor(private configService: ConfigService) {}

  private defaultOptions: CookieOptions = {
    httpOnly: false,
    // sameSite: "none",
    secure: false,
    // secure:
    //   this.configService.get<string>("NODE_ENV") === "production"
    //     ? true
    //     : false,
  };

  public getRefreshTokenCookieOptions(): CookieOptions {
    const expiredTime = convertToMilliseconds(
      this.configService.get<string>("JWT_RT_EXPIRED"),
    );
    return {
      ...this.defaultOptions,
      maxAge: expiredTime,
      path: "/",
    };
  }

  public setAuthenticationCookies({
    res,
    refresh_token,
  }: AuthCookieProps): Response {
    return res.cookie(
      "refresh_token",
      refresh_token,
      this.getRefreshTokenCookieOptions(),
    );
  }
}
