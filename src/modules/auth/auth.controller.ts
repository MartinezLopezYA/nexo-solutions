import { Controller, Post, Body, UseGuards, Get, Req, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsRequestDto, LogoutDto, RefreshTokenDto } from './dto/auth.dto';
import { ApiBody, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { UserResponseDto } from '../users/dto/user.dto';
import { GetUser } from 'src/common/decorators/users.decorator';


@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UsersService
    ) { }

    @Get('v1/profile')
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
    async getProfile(@GetUser('useruuid') useruuid: string): Promise<UserResponseDto> {
        return this.userService.getUserById(useruuid);
    }

    @Get('v1/check-session')
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
    async validateSession(@GetUser('useruuid') useruuid: string) {
        const user = await this.userService.getUserByUuid(useruuid);
        const hasRefreshToken = !!user.refreshToken;

        return {
            sessionActive: hasRefreshToken,
            refreshToken: hasRefreshToken,
            user: {
                useruuid: user.useruuid,
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username,
                useremail: user.useremail,
                userphone: user.userphone,
                useridentificationnumber: user.useridentificationnumber
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
    async logout(@GetUser('useruuid') useruuid: string): Promise<{ message: string }> {
        await this.authService.logout(useruuid);
        return { message: 'User logged out successfully' };
    }

}
