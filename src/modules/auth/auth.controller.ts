import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsRequestDto } from './dto/auth.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @ApiBody({ type: CredentialsRequestDto })
    async login(@Body() req: CredentialsRequestDto) {
        return this.authService.login(req);
    }

}
