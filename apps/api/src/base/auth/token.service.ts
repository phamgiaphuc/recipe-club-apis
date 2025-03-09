import {
  initialTokenOptions,
  PayloadProps,
  TokenOptions,
  TokenType,
} from "@app/api/common/types/jwt";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, JwtVerifyOptions } from "@nestjs/jwt";

@Injectable()
export class TokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public getJwtTokens(payload: PayloadProps) {
    const [access_token, refresh_token] = [
      this.generateJwtToken(payload, "at"),
      this.generateJwtToken(payload, "rt"),
    ];
    return {
      access_token,
      refresh_token,
    };
  }

  public verifyToken = <T extends object | PayloadProps>(
    token: string,
    options?: JwtVerifyOptions,
  ): T => {
    return this.jwtService.verify(token, options) as T;
  };

  public generateJwtToken(
    payload: PayloadProps,
    type: TokenType,
    options?: TokenOptions,
  ) {
    const { secret, expiresIn } = this.getTokenExpireTime(type, options);
    return this.jwtService.sign(payload, {
      expiresIn: expiresIn,
      secret: secret,
      audience: payload.role,
    });
  }

  private getTokenExpireTime(
    type: TokenType,
    options?: TokenOptions,
  ): TokenOptions {
    switch (type) {
      case "at":
        return {
          expiresIn: this.configService.get<string>("JWT_AT_EXPIRED"),
          secret: this.configService.get<string>("JWT_AT_SECRET"),
        };
      case "rt":
        return {
          expiresIn: this.configService.get<string>("JWT_RT_EXPIRED"),
          secret: this.configService.get<string>("JWT_RT_SECRET"),
        };
      case "custom":
        return options || initialTokenOptions;
      default:
        return initialTokenOptions;
    }
  }
}
