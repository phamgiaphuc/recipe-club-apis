import { AtGuard } from "@app/api/base/auth/guard/at.guard";
import { GetUserPayload } from "@app/api/common/decorators/get-user-payload";
import { PayloadProps } from "@app/api/common/types/jwt";
import { userRoute } from "@app/api/common/types/routes/user";
import { UpdateUserPantryDto } from "@app/api/core/user/dto/user-pantry/update-user-pantry.dto";
import {
  CreateUserRatingDto,
  UpdateUserRatingDto,
} from "@app/api/core/user/dto/user-rating/user-rating.dto";
import { UserPantryService } from "@app/api/core/user/user-pantry.service";
import { UserRatingService } from "@app/api/core/user/user-rating.service";
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Users")
@ApiBearerAuth()
@UseGuards(AtGuard)
@Controller(userRoute.index)
export class UserController {
  constructor(
    private readonly userPantryService: UserPantryService,
    private readonly userRatingService: UserRatingService,
  ) {}

  @ApiOperation({ summary: "Get curent user's pantry" })
  @HttpCode(HttpStatus.OK)
  @Get(userRoute.getUserPantries)
  async getUserPantries(@GetUserPayload() payload: PayloadProps) {
    return this.userPantryService.getUserPantries(payload);
  }

  @ApiOperation({ summary: "Modify curent user's pantry" })
  @HttpCode(HttpStatus.OK)
  @Put(userRoute.updateUserPantries)
  async updateUserPantries(
    @GetUserPayload() payload: PayloadProps,
    @Body() body: UpdateUserPantryDto,
  ) {
    return this.userPantryService.updateUserPantries(payload, body);
  }

  @ApiOperation({ summary: "Create user's rating by recipe's id" })
  @HttpCode(HttpStatus.OK)
  @Post(userRoute.createUserRatings)
  async createUserRatings(
    @GetUserPayload() payload: PayloadProps,
    @Body() body: CreateUserRatingDto,
  ) {
    return this.userRatingService.createUserRatings(payload, body);
  }

  @ApiOperation({ summary: "Modify user's rating by id" })
  @HttpCode(HttpStatus.OK)
  @Put(userRoute.updateUserRatings)
  async updateUserRatings(
    @Param("id") id: string,
    @Body() body: UpdateUserRatingDto,
  ) {
    return this.userRatingService.updateUserRatings(id, body);
  }

  @ApiOperation({ summary: "Delete user's rating by id" })
  @HttpCode(HttpStatus.OK)
  @Delete(userRoute.deleteUserRatings)
  async deleteUserRatings(@Param("id") id: string) {
    return this.userRatingService.deleteUserRatings(id);
  }
}
