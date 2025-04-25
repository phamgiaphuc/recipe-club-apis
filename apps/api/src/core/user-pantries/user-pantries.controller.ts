import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserPantriesService } from './user-pantries.service';
import { AtGuard } from '@app/api/base/auth/guard/at.guard';
import { UserPantryResponseDto } from './dto/user-pantry-response.dto';

@ApiTags('User Pantry')
@UseGuards(AtGuard) // Dùng guard kiểm tra access token
@Controller('user-pantries')
export class UserPantriesController {
  constructor(private readonly service: UserPantriesService) {}

  @Get()
  @ApiOkResponse({ description: 'lấy danh sách nguyên liệu trong pantry của người dùng', type: UserPantryResponseDto })
  @ApiUnauthorizedResponse({ description: 'người dùng chưa đăng nhập hoặc token không hợp lệ' })
  async getPantry(@Request() req) {
    const userId = req.user.user_id;
    return this.service.getUserPantry(userId);
  }

  @Delete(':ingredientId')
  @ApiOkResponse({ description: 'xoá nguyên liệu khỏi pantry thành công' })
  @ApiUnauthorizedResponse({ description: 'người dùng chưa đăng nhập hoặc token không hợp lệ' })
  async removeFromPantry(@Request() req, @Param('ingredientId') ingredientId: number) {
    const userId = req.user.user_id;
    return this.service.removeIngredient(userId, ingredientId);
  }
}
