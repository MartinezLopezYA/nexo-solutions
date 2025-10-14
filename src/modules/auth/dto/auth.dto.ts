// src/modules/auth/dto/login.dto.ts
import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ example: 'usuario@example.com' })
    @IsEmail()
    useremail: string;

    @ApiProperty({ example: '123456' })
    @IsString()
    userpassword: string;
}
