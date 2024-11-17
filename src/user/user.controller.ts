import { 
  Controller, 
  Get, 
  Param, 
  UsePipes, 
  ValidationPipe, 
  HttpCode, 
  Put, 
  Body 
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { UserDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Auth()
  async getProfile(@CurrentUser('id') id: number) {  
    return this.userService.byId(id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put('profile')
  async updateProfile(@CurrentUser('id') id: number, @Body() dto: UserDto) {  
    return this.userService.updateProfile(id, dto);
  }

  @HttpCode(200)
  @Auth()
  @Put('profile/favorite/:productId')
  async toggleFavorite(
    @CurrentUser('id') id: number,
    @Param('productId') productId: string
  ) {  
    return this.userService.toggleFavorite(id, +productId);
  }
}
