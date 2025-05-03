import { AuthController } from "@app/api/base/auth/auth.controller";
import { AuthScript } from "@app/api/base/auth/auth.script";
import { AuthService } from "@app/api/base/auth/auth.service";
import { CookieService } from "@app/api/base/auth/cookie.service";
import { AtStrategy } from "@app/api/base/auth/strategy/at.strategy";
import { GoogleStrategy } from "@app/api/base/auth/strategy/google.strategy";
import { TokenService } from "@app/api/base/auth/token.service";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthScript,
    AuthService,
    TokenService,
    CookieService,
    AtStrategy,
    GoogleStrategy,
  ],
})
export class AuthModule {}
