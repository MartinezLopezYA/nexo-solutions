import { HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local';
import { AuthService } from "../auth.service";
import { UnauthorizedException } from "src/common/exceptions/general-exception.";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({ usernameField: 'useremail' });
    }

    async validate(useremail: string, userpassword: string): Promise<any> {
        const user = await this.authService.validateUser(useremail, userpassword);
        if (!user) {
            throw new UnauthorizedException('Credentials are not valid', HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED_ERROR');
        }
        return user;
    }
}