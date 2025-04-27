import { PayloadProps } from "@app/api/common/types/jwt";
import {
  CreateUserRatingDto,
  UpdateUserRatingDto,
} from "@app/api/core/user/dto/user-rating/user-rating.dto";
import { DatabaseService } from "@app/common/database/database.service";
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";

@Injectable()
export class UserRatingService {
  private readonly logger = new Logger(UserRatingService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  public async createUserRatings(
    payload: PayloadProps,
    body: CreateUserRatingDto,
  ) {
    try {
      const { user_id } = payload;
      const { recipe_id, rating, comment, image_urls } = body;
      await this.databaseService.userRatings.create({
        data: {
          user_id: user_id,
          recipe_id: recipe_id,
          rating: rating,
          comment: comment,
          image_urls: image_urls,
        },
      });
      this.logger.log(
        `Create user ${user_id}'s rating for recipe ${recipe_id} successfully`,
      );
      return {
        code: 0,
        message: "Create user's rating successfully",
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  public async updateUserRatings(rating_id: string, body: UpdateUserRatingDto) {
    try {
      const { rating, comment, image_urls } = body;
      await this.databaseService.userRatings.update({
        where: {
          id: rating_id,
        },
        data: {
          rating: rating,
          comment: comment,
          image_urls: image_urls,
        },
      });
      this.logger.log(`Update user's rating ${rating_id} successfully`);
      return {
        code: 0,
        message: "Update user's rating successfully",
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  public async deleteUserRatings(rating_id: string) {
    try {
      await this.databaseService.userRatings.delete({
        where: {
          id: rating_id,
        },
      });
      this.logger.log(`Delete user's rating ${rating_id} successfully`);
      return {
        code: 0,
        message: "Delete user's rating successfully",
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
}
