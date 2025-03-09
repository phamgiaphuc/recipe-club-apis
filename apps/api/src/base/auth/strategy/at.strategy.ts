import { PayloadProps } from "@app/api/common/types/jwt";
import { CacheService } from "@app/common/cache/cache.service";
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-jwt";

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, "at") {
  constructor(
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
          throw new NotFoundException("Access token not found");
        }
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_AT_SECRET"),
    });
  }

  async validate(payload: PayloadProps) {
    const key = `user_sessions:${payload.user_id}:${payload.session_id}`;
    const session = await this.cacheService.getData({
      key: key,
    });
    if (!session) {
      throw new UnauthorizedException("Unauthorized permission");
    }
    return {
      session_id: payload.session_id,
      user_id: payload.user_id,
      role: payload.role,
    };
  }
}
