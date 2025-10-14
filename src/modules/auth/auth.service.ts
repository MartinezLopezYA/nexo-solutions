// src/auth/auth.service.ts
import { HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from 'src/common/exceptions/general-exception.';

@Injectable()
export class AuthService {

    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
    ) { }


    async validateUser(useremail: string, userpassword: string): Promise<any> {
        const user = await this.userService.getUserByEmail(useremail);
        if (user && await bcrypt.compare(userpassword, user.userpassword)) {
            const {userpassword, ...result} = user;
            return result;
        }
        throw new UnauthorizedException('Credentials are not valid', HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED_ERROR');
    }

    async login(user: any) {
        const payload = { useremail: user.useremail, sub: user.useruuid };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

}
