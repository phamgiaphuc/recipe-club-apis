// user-pantries.service.ts
import { Injectable, InternalServerErrorException, HttpException, Logger } from '@nestjs/common';
import { DatabaseService } from '@app/common/database/database.service';
import { CacheService } from '@app/common/cache/cache.service';
import { convertToMilliseconds } from '@app/common/utils/date-format';
import { UserPantryResponseDto } from './dto/user-pantry-response.dto';

@Injectable()
export class UserPantriesService {
  private readonly logger = new Logger(UserPantriesService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cacheService: CacheService,
  ) {}

  async getUserPantry(user_id: string): Promise<UserPantryResponseDto> {
    try {
      const cacheKey = `user_pantry_${user_id}`;
      let pantry = await this.cacheService.getData({ key: cacheKey }) as UserPantryResponseDto;

      if (!pantry) {
        const records = await this.databaseService.userPantries.findMany({
          where: { user_id },
          include: {
            ingredient: {
              select: {
                id: true,
                name: true,
                image_url: true,
              },
            },
          },
        });

        pantry = {
          user_id,
          ingredients: records.map((r) => r.ingredient),
          total: records.length,
        };

        await this.cacheService.setData({
          key: cacheKey,
          value: pantry,
          expires_in: convertToMilliseconds('2h'),
        });
      }

      this.logger.log(`Pantry for user ${user_id} retrieved successfully`);
      return pantry;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(error);
    }
  }

  async addIngredient(user_id: string, ingredient_id: number) {
    try {
      const result = await this.databaseService.userPantries.create({
        data: { user_id, ingredient_id },
      });
      await this.cacheService.deleteData({ key: `user_pantry_${user_id}` });
      return result;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(error);
    }
  }

  async removeIngredient(user_id: string, ingredient_id: number) {
    try {
      const result = await this.databaseService.userPantries.delete({
        where: {
          user_id_ingredient_id: {
            user_id,
            ingredient_id,
          },
        },
      });
      await this.cacheService.deleteData({ key: `user_pantry_${user_id}` });
      return result;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(error);
    }
  }
}