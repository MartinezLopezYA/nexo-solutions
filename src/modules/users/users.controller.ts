import { Body, Controller, Get, Param, Patch, Post, Delete, UseInterceptors, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserCreateDto, UserResponseDto, UserStatusDto, UserUpdateDto, UserWithRolesDto, UsersBasicResponseDto } from './dto/user.dto';
import { UndefinedToNullInterceptorInterceptor } from 'src/common/interceptors/undefined-to-null-interceptor.interceptor';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('Users')
@UseInterceptors(UndefinedToNullInterceptorInterceptor)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Get('v1')
    @ApiOperation({
        summary: 'Get all users',
        description: 'This endpoint returns a list of all users.',
    })
    @ApiResponse({
        status: 200,
        description: 'List of users',
        type: [UsersBasicResponseDto],
    })
    @ApiResponse({ status: 404, description: 'No users found' })
    async getAllUsers(): Promise<UsersBasicResponseDto[]> {
        return this.usersService.getAllUsers();
    }

    @Get('v1/active')
    @ApiOperation({
        summary: 'Get all active users',
        description: 'This endpoint returns a list of all active users.',
    })
    @ApiResponse({
        status: 200,
        description: 'List of active users',
        type: [UsersBasicResponseDto],
    })
    @ApiResponse({ status: 404, description: 'No active users found' })
    async getActiveUsers(): Promise<UsersBasicResponseDto[]> {
        return this.usersService.getActiveUsers();
    }

    @Get('v1/:useruuid')
    @ApiOperation({
        summary: 'Get a user by id',
        description: 'This endpoint returns a user by id.',
    })
    @ApiResponse({
        status: 200,
        description: 'User found',
        type: UserResponseDto,
    })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getUserById(
        @Param('useruuid') useruuid: string
    ): Promise<UserResponseDto> {
        return this.usersService.getUserById(useruuid);
    }

    @Post('v1')
    @ApiOperation({
        summary: 'Add a user',
        description: 'This endpoint adds a new user.',
    })
    @ApiResponse({
        status: 201,
        description: 'User added successfully',
        type: UsersBasicResponseDto,
    })
    @ApiResponse({ status: 400, description: 'User already exists' })
    async addUser(
        @Body() user: UserCreateDto
    ): Promise<UsersBasicResponseDto> {
        return this.usersService.addUser(user);
    }

    @Patch('v1/:useruuid/status')
    @ApiOperation({
        summary: 'Update user status',
        description: 'This endpoint updates the status of a user.',
    })
    @ApiResponse({
        status: 200,
        description: 'User status updated successfully',
        type: UserStatusDto,
    })
    @ApiResponse({ status: 404, description: 'User not found' })
    async updateUserStatus(
        @Param('useruuid') useruuid: string
    ): Promise<UserStatusDto> {
        return this.usersService.updateUserStatus(useruuid);
    }

    @Patch('v1/:useruuid')
    @ApiOperation({
        summary: 'Update user',
        description: 'This endpoint updates a user.',
    })
    @ApiResponse({
        status: 200,
        description: 'User updated successfully',
        type: UserResponseDto,
    })
    @ApiResponse({ status: 404, description: 'User not found' })
    async updateUser(
        @Param('useruuid') useruuid: string,
        @Body() user: UserUpdateDto
    ): Promise<UserResponseDto> {
        return this.usersService.updateUser(useruuid, user);
    }

    @Delete('v1/:useruuid/remove')
    @ApiOperation({
        summary: 'Delete a user',
        description: 'This endpoint deletes a user.',
    })
    @ApiResponse({
        status: 200,
        description: 'User deleted successfully',
        type: UserStatusDto,
    })
    @ApiResponse({ status: 404, description: 'User not found' })
    async deleteUser(
        @Param('useruuid') useruuid: string
    ): Promise<UserStatusDto> {
        return this.usersService.removeUser(useruuid);
    }

    @Post('v1/:useruuid/assign-roles')
    @ApiOperation({
        summary: 'Assign roles to a user',
        description: 'This endpoint allows you to assign roles to a user.',
    })
    @ApiResponse({
        status: 200,
        description: 'Roles assigned successfully',
        type: UserWithRolesDto,
    })
    @ApiResponse({ status: 404, description: 'User not found' })
    async assignRolesToUser(
        @Param('useruuid') useruuid: string,
        @Body() roleuuids: string[],
    ): Promise<UserWithRolesDto> {
        return this.usersService.assignRolesToUser(useruuid, roleuuids);
    }
}
