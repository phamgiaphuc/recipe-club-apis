import { SignInDto } from "@app/api/base/auth/dto/signin.dto";
import { PayloadProps } from "@app/api/common/types/jwt";
import { CacheService } from "@app/common/cache/cache.service";
import { DatabaseService } from "@app/common/database/database.service";
import { comapareData, hashData } from "@app/common/utils/bcrypt";
import {
  HttpException,
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
import { SignUpDto } from "@app/api/base/auth/dto/signup.dto";
import { generateCustomAvatarUrl } from "@app/common/utils/avatar";
import { GoogleProfileDto } from "@app/api/base/auth/dto/google-profile.dto";
import { Request } from "express";
import { omit } from "lodash";

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

  public async googleSignIn(req: Request, profile: GoogleProfileDto) {
    try {
      let user = await this.databaseService.users.findFirst({
        where: {
          OR: [{ email: profile.email }],
        },
      });
      if (!user) {
        user = await this.databaseService.users.create({
          data: {
            email: profile.email,
            password: "",
            username: profile.name,
            is_activated: true,
            role: "user",
            profile: {
              create: {
                first_name: profile.givenName,
                last_name: profile.familyName,
                full_name: `${profile.givenName} ${profile.familyName}`,
                avatar_url: generateCustomAvatarUrl(
                  profile.givenName,
                  profile.familyName,
                ),
              },
            },
          },
        });
      }
      const payload: PayloadProps = {
        user_id: user.id,
        session_id: getUnixTime(new Date()).toString(),
        role: user.role,
      };
      const tokens = this.tokenService.getJwtTokens(payload);
      await this.saveUserSession(payload);
      this.logger.log(`User ${user.username} google signed in successfully`);
      return {
        ...tokens,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  public async signUp(body: SignUpDto) {
    try {
      const { email, username, password, first_name, last_name } = body;
      const existed_user = await this.databaseService.users.findFirst({
        where: {
          OR: [{ email: email }, { username: username }],
        },
      });
      if (existed_user) {
        throw new UnauthorizedException("User already exists");
      }
      const user = await this.databaseService.users.create({
        data: {
          email: email,
          username: username,
          password: hashData(password),
          is_activated: true,
          role: "user",
          profile: {
            create: {
              first_name: first_name,
              last_name: last_name,
              full_name: `${first_name} ${last_name}`,
              avatar_url: generateCustomAvatarUrl(first_name, last_name),
            },
          },
        },
        include: {
          profile: {
            omit: {
              user_id: true,
            },
          },
        },
      });
      const payload: PayloadProps = {
        user_id: user.id,
        session_id: getUnixTime(new Date()).toString(),
        role: user.role,
      };
      const tokens = this.tokenService.getJwtTokens(payload);
      await this.saveUserSession(payload);
      this.logger.log(`User ${user.username} signed up successfully`);
      return {
        ...tokens,
        user: omit(user, ["password"]),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
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
        user: omit(user, ["password"]),
      };
    } catch (error) {
      if (error instanceof HttpException) {
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
      this.logger.log(`Get user ${user_id}'s info successfully`);
      return {
        code: 0,
        message: "Get user's info successfully",
        data: {
          ...user,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
}
