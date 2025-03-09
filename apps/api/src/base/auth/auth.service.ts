import { SignInDto } from "@app/api/base/auth/dto/signin.dto";
import { PayloadProps } from "@app/api/common/types/jwt";
import { CacheService } from "@app/common/cache/cache.service";
import { DatabaseService } from "@app/common/database/database.service";
import { comapareData } from "@app/common/utils/bcrypt";
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { ConfigService } from "@nestjs/config";
import { convertToMilliseconds } from "@app/common/utils/date-format";
import { TokenService } from "@app/api/base/auth/token.service";
import { getUnixTime } from "date-fns";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {}

  private async saveUserSession(payload: PayloadProps) {
    try {
      const key = `user_sessions:${payload.user_id}:${payload.session_id}`;
      const expires_in = this.configService.get<string>("JWT_RT_EXPIRED");
      await this.cacheService.setData({
        key: key,
        value: payload,
        expires_in: convertToMilliseconds(expires_in),
      });
    } catch (error) {
      throw error;
    }
  }

  public async signIn(body: SignInDto) {
    try {
      const { account, password } = body;
      const { success } = z.string().email().safeParse(account);
      const where_clause: Prisma.UsersWhereUniqueInput = success
        ? { email: account }
        : { username: account };
      const user = await this.databaseService.users.findUnique({
        where: where_clause,
        include: {
          profile: {
            omit: {
              user_id: true,
            },
          },
        },
      });
      if (!user) {
        throw new NotFoundException("User not found");
      }
      if (!comapareData(password, user.password)) {
        throw new UnauthorizedException("Invalid password");
      }
      if (!user.is_activated) {
        throw new UnauthorizedException("User is not activated");
      }
      const payload: PayloadProps = {
        user_id: user.id,
        session_id: getUnixTime(new Date()).toString(),
        role: user.role,
      };
      const tokens = this.tokenService.getJwtTokens(payload);
      await this.saveUserSession(payload);
      this.logger.log(`User ${user.username} signed in successfully`);
      return {
        ...tokens,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  public async getUserInfo(payload: PayloadProps) {
    try {
      const { user_id } = payload;
      const user = await this.databaseService.users.findUnique({
        where: {
          id: user_id,
        },
        include: {
          profile: {
            omit: {
              user_id: true,
            },
          },
        },
        omit: {
          password: true,
        },
      });
      return {
        code: 0,
        message: "Get user's info successfully",
        data: {
          ...user,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
}
