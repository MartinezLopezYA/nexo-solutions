import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { LoginDto } from './dto/auth.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @ApiBody({ type: LoginDto })
    async login(@Body() body: LoginDto) {
        const user = await this.authService.validateUser(body.useremail, body.userpassword);
        return this.authService.login(user);
    }

}
