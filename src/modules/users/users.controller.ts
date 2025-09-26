import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('v1')
    @ApiOperation({
        summary: 'Get all users',
        description: 'This endpoint returns a list of all users.',
    })
    @ApiResponse({
        status: 200,
        description: 'List of users',
        type: [UserResponseDto],
    })
    @ApiResponse({ status: 404, description: 'No users found' })
    async getAllUsers(): Promise<UserResponseDto[]> {
        return this.usersService.getAllUsers();
    }

}
