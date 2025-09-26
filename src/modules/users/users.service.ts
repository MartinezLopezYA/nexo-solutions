import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserAditionalResponseDto, UserResponseDto } from './dto/user.dto';
import { NotFoundException } from 'src/common/exceptions/general-exception.';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async getAllUsers(): Promise<UserResponseDto[]> {
        try {
            const users = await this.userRepository.find({
                order: { firstname: 'ASC' },
                relations: {
                    useridentificationtype: true,
                    roles: true,
                    city: {
                        department: {
                            country: true,
                        }
                    },
                }
            });
            if (!users || users.length === 0) {
                throw new NotFoundException(
                    'No users found',
                    HttpStatus.NOT_FOUND,
                    'NF_USER_ERROR',
                );
            }
            const userResponseDto = users.map(user => ({
                useruuid: user.useruuid,
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username,
                useremail: user.useremail,
                userphone: user.userphone,
                useridentificationtype: user.useridentificationtype,
                useridentificationnumber: user.useridentificationnumber,
                additionalInfo: {
                    usergender: user.usergender,
                    userprofession: user.userprofession,
                    city: {
                        cityuuid: user.city.cityuuid,
                        cityname: user.city.cityname,
                        department: {
                            departmentuuid: user.city.department.departmentuuid,
                            departmentname: user.city.department.departmentname,
                            country: {
                                countryuuid: user.city.department.country.countryuuid,
                                countryname: user.city.department.country.countryname,
                            }
                        }
                    },
                    useraddress: user.useraddress,
                    dateOfBirth: user.dateOfBirth,
                    isActive: user.isActive,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    roles: user.roles,
                }
            } as UserResponseDto)) || [];
            return userResponseDto;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while updating the user');
        }
    }

    private handleInternalError(error: unknown, message: string): never {
        if (error instanceof HttpException) {
            throw error;
        }
        throw new HttpException(
            {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                errorCode: 'INTERNAL_SERVER_ERROR',
                message,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    };
}
