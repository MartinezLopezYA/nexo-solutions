import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from 'src/common/exceptions/general-exception.';
import { AuthResponseDto, CredentialsRequestDto } from './dto/auth.dto';
import { ClientsService } from '../clients/clients.service';
import { WorkersService } from '../workers/workers.service';
import { InternalException } from 'src/common/exceptions/internal-exception';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    constructor(
        private userService: UsersService,
        private clientService: ClientsService,
        private workerService: WorkersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async login(user: CredentialsRequestDto): Promise<AuthResponseDto> {
        try {
            const userExist = await this.userService.getUserByEmail(user.useremail);

            if (!userExist) {
                throw new UnauthorizedException('Credentials are not valid', HttpStatus.UNAUTHORIZED, 'USER_CREDENTIALS_NOT_VALID_ERROR');
            }

            const matchPassword = await bcrypt.compare(user.userpassword, userExist.userpassword);

            if (!matchPassword) {
                throw new UnauthorizedException('Credentials are not valid', HttpStatus.UNAUTHORIZED, 'USER_CREDENTIALS_NOT_VALID_ERROR');
            }

            if (userExist && !userExist.isActive) {
                throw new UnauthorizedException('User is not active', HttpStatus.UNAUTHORIZED, 'USER_IS_NOT_ACTIVE_ERROR');
            }

            if (userExist && userExist.isDeleted) {
                throw new UnauthorizedException('User is deleted', HttpStatus.UNAUTHORIZED, 'USER_IS_DELETED_ERROR');
            }

            const payload = { useremail: userExist.useremail, sub: userExist.useruuid };

            const accessToken = this.jwtService.sign(payload, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: this.configService.get('JWT_EXPIRES_IN'),
            });

            const refreshToken = this.jwtService.sign(payload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
            });

            await this.userService.saveRefreshToken(userExist.useruuid, refreshToken);

            const loginResponse: AuthResponseDto = {
                access_token: accessToken,
                refresh_token: refreshToken,
                user: {
                    useruuid: userExist.useruuid,
                    firstname: userExist.firstname,
                    lastname: userExist.lastname,
                    username: userExist.username,
                    useremail: userExist.useremail,
                    userphone: userExist.userphone,
                    useridentificationnumber: userExist.useridentificationnumber
                }
            };
            return loginResponse;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalException('An error occurred while logging in');
        }
    }

    async refreshToken(token: string): Promise<{ access_token: string }> {
        try {
            const payload = this.jwtService.verify(token, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });

            const user = await this.userService.getUserByEmail(payload.useremail);
            if (!user) throw new UnauthorizedException('Invalid refresh token', HttpStatus.UNAUTHORIZED, 'REFRESH_TOKEN_INVALID_ERROR');

            const isValid = await this.userService.validateRefreshToken(user.useruuid, token);
            if (!isValid) throw new UnauthorizedException('Invalid refresh token', HttpStatus.UNAUTHORIZED, 'REFRESH_TOKEN_INVALID_ERROR');

            const newAccessToken = this.jwtService.sign(
                { useremail: user.useremail, sub: user.useruuid },
                {
                    secret: this.configService.get('JWT_SECRET'),
                    expiresIn: this.configService.get('JWT_EXPIRES_IN'),
                }
            );

            return { access_token: newAccessToken };
        } catch {
            throw new UnauthorizedException('Refresh token inválido', HttpStatus.UNAUTHORIZED, 'REFRESH_TOKEN_INVALID_ERROR');
        }
    }

    async logout(useruuid: string): Promise<void> {
        await this.userService.removeRefreshToken(useruuid);
    }

}