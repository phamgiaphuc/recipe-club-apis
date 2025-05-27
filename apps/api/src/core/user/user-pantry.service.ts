import { PayloadProps } from "@app/api/common/types/jwt";
import { UpdateUserPantryDto } from "@app/api/core/user/dto/user-pantry/update-user-pantry.dto";
import { DatabaseService } from "@app/common/database/database.service";
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";

@Injectable()
export class UserPantryService {
  private readonly logger = new Logger(UserPantryService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  public async getUserPantries(payload: PayloadProps) {
    try {
      const { user_id } = payload;
      const pantries = await this.databaseService.userPantries.findMany({
        where: {
          user_id: user_id,
        },
        include: {
          ingredient: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      this.logger.log(`Get user ${user_id}'s pantries successfully`);
      return {
        code: 0,
        message: "Get user's pantry successfully",
        data: pantries.map((item) => item.ingredient),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  public async updateUserPantries(
    payload: PayloadProps,
    body: UpdateUserPantryDto,
  ) {
    try {
      const { user_id } = payload;
      const { ingredient_ids } = body;
      await this.databaseService.$transaction(async (prisma) => {
        // Delete ingredients not in ingredient_ids
        await prisma.userPantries.deleteMany({
          where: {
            user_id: user_id,
            ingredient_id: {
              notIn: ingredient_ids,
            },
          },
        });
        // Insert new pantry entries, ignoring duplicates
        await prisma.userPantries.createMany({
          data: ingredient_ids.map((ingredient_id) => ({
            user_id,
            ingredient_id,
          })),
          skipDuplicates: true,
        });
      });
      return {
        code: 0,
        message: "Update user's pantry successfully",
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  
}

