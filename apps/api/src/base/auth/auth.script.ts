import { DatabaseService } from "@app/common/database/database.service";
import { generateCustomAvatarUrl } from "@app/common/utils/avatar";
import { hashData } from "@app/common/utils/bcrypt";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UserProfiles, Users } from "@prisma/client";

@Injectable()
export class AuthScript implements OnModuleInit {
  private readonly logger = new Logger(AuthScript.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
  ) {}

  async onModuleInit() {
    try {
      await this.createDefaultAdmin();
    } catch (error) {
      throw error;
    }
  }

  private async createDefaultAdmin() {
    try {
      const admin: Pick<
        Users,
        "email" | "password" | "username" | "is_activated" | "role"
      > = {
        email: this.configService.get<string>("ADMIN_EMAIL"),
        password: hashData(this.configService.get<string>("ADMIN_PASSWORD")),
        username: this.configService.get<string>("ADMIN_USERNAME"),
        is_activated: true,
        role: "admin",
      };
      const admin_profile: Pick<
        UserProfiles,
        "first_name" | "last_name" | "full_name" | "avatar_url"
      > = {
        first_name: "Recipe Club",
        last_name: "Admin",
        full_name: "Recipe Club Admin",
        avatar_url: generateCustomAvatarUrl("Recipe", "Club"),
      };
      const is_admin_exist = await this.databaseService.users.findUnique({
        where: {
          username: admin.username,
        },
      });
      if (is_admin_exist) {
        this.logger.log("Admin account is already exist");
      } else {
        await this.databaseService.users.create({
          data: {
            ...admin,
            profile: {
              create: {
                ...admin_profile,
              },
            },
          },
        });
        this.logger.log("Admin account is created");
      }
    } catch (error) {
      throw error;
    }
  }
}
