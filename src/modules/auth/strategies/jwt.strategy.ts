import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/modules/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly usersService: UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
        });
    }

    async validate(payload: any): Promise<any> {
        const user = await this.usersService.getUserById(payload.sub);

        // Flatten roles → permissions → strings
        const roles = user.additionalInfo.roles.flatMap(r => r.rolecode);
        const permissions = (user.additionalInfo.roles ?? []).flatMap(role =>
            (role.permissions ?? []).map(p => p.permissioncode)
        );

        return {
            useruuid: user.useruuid,
            username: user.username,
            roles,
            permissions,
        };
    }
}
