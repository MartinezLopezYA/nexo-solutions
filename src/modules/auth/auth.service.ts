import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from 'src/common/exceptions/general-exception.';
import { AuthResponseDto, CredentialsRequestDto } from './dto/auth.dto';
import { ClientsService } from '../clients/clients.service';
import { WorkersService } from '../workers/workers.service';
import { InternalException } from 'src/common/exceptions/internal-exception';

@Injectable()
export class AuthService {

    constructor(
        private userService: UsersService,
        private clientService: ClientsService,
        private workerService: WorkersService,
        private jwtService: JwtService,
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

            const token = this.jwtService.sign({ useremail: userExist.useremail });
            const loginResponse: AuthResponseDto = {
                access_token: token,
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



}

//  Windows + . = Emojis