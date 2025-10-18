import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/modules/users/dto/user.dto';

export class CredentialsRequestDto {
    @ApiProperty({ example: 'usuario@example.com' })
    @IsEmail()
    useremail: string;

    @ApiProperty({ example: '123456' })
    @IsString()
    userpassword: string;
}

export class AuthResponseDto {
    access_token: string;
    refresh_token: string;
    user: UserResponseDto;
}

export class RefreshTokenDto {
    @IsString()
    refresh_token: string;
}

export class LogoutDto {
    @IsString()
    useruuid: string;
}

