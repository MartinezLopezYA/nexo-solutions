import { Controller, Post, Body, UseGuards, Get, Req, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsRequestDto, LogoutDto, RefreshTokenDto } from './dto/auth.dto';
import { ApiBody, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { UserResponseDto } from '../users/dto/user.dto';


@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UsersService
    ) { }

    @Get('v1/profile/:useruuid')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
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
    async getProfile(@Param('useruuid') useruuid: string): Promise<UserResponseDto> {
        const user = await this.userService.getUserByUuid(useruuid);
        return user;
    }

    @Get('v1/check-session/:useruuid')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({
        schema: {
            example: {
                sessionActive: true,
                refreshToken: true,
                user: {
                    useruuid: '123e4567-e89b-12d3-a456-426614174000',
                    useremail: 'user@example.com',
                    firstname: 'Juan',
                    lastname: 'Pérez'
                }
            }
        }
    })
    async validateSession(@Param('useruuid') useruuid: string) {
        const user = await this.userService.getUserByUuid(useruuid);
        const hasRefreshToken = !!user.refreshToken;

        return {
            sessionActive: hasRefreshToken,
            refreshToken: hasRefreshToken,
            user: {
                useruuid: user.useruuid,
                useremail: user.useremail,
                firstname: user.firstname,
                lastname: user.lastname,
            }
        };
    }


    @Post('v1/login')
    @ApiBody({ type: CredentialsRequestDto })
    async login(@Body() req: CredentialsRequestDto) {
        return this.authService.login(req);
    }

    @Post('v1/refresh-token')
    async refreshToken(@Body() body: RefreshTokenDto): Promise<{ access_token: string }> {
        return this.authService.refreshToken(body.refresh_token);
    }

    @Post('v1/logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiBody({ type: LogoutDto })
    async logout(@Body() body: LogoutDto): Promise<{ message: string }> {
        await this.authService.logout(body.useruuid);
        return { message: 'User logged out successfully' };
    }

}
