import { GoogleProfileDto } from "@app/api/base/auth/dto/google-profile.dto";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>("GOOGLE_CLIENT_ID"),
      clientSecret: configService.get<string>("GOOGLE_CLIENT_SECRET"),
      callbackURL: configService.get<string>("GOOGLE_CALLBACK_URL"),
      scope: ["email", "profile"],
      passReqToCallback: true,
    });
  }

  authenticate(req: Request, options?: any) {
    if (req.query) {
      options = { ...options, state: JSON.stringify(req.query) };
    }
    return super.authenticate(req, options);
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { _json } = profile;
    const user: GoogleProfileDto = {
      sub: _json.sub,
      name: _json.name,
      givenName: _json.given_name,
      familyName: _json.family_name,
      picture: _json.picture,
      email: _json.email,
      emailVerified: _json.email_verified,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}
