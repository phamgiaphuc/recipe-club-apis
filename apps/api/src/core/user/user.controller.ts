import { AtGuard } from "@app/api/base/auth/guard/at.guard";
import { GetUserPayload } from "@app/api/common/decorators/get-user-payload";
import { PayloadProps } from "@app/api/common/types/jwt";
import { userRoute } from "@app/api/common/types/routes/user";
import { UpdateUserPantryDto } from "@app/api/core/user/dto/user-pantry/update-user-pantry.dto";
import { UserPantryService } from "@app/api/core/user/user-pantry.service";
import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Users")
@ApiBearerAuth()
@UseGuards(AtGuard)
@Controller(userRoute.index)
export class UserController {
  constructor(private readonly userPantryService: UserPantryService) {}

  @ApiOperation({ summary: "Get curent user's pantry" })
  @Get(userRoute.getUserPantries)
  async getUserPantries(@GetUserPayload() payload: PayloadProps) {
    return this.userPantryService.getUserPantries(payload);
  }

  @ApiOperation({ summary: "Update user's pantry" })
  @Put(userRoute.updateUserPantries)
  async updateUserPantries(
    @GetUserPayload() payload: PayloadProps,
    @Body() body: UpdateUserPantryDto,
  ) {
    return this.userPantryService.updateUserPantries(payload, body);
  }
}
