import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeepPartial, In, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UserCreateDto, UserResponseDto, UserStatusDto, UserUpdateDto, UserWithRolesDto, UsersBasicResponseDto } from './dto/user.dto';
import { AlreadyExistsException, NotFoundException } from 'src/common/exceptions/general-exception.';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../roles/entities/role.entity';
import { IdentificationType } from '../identification-type/entities/identification-type.entity';
import { Profession } from '../professions/entities/profession.entity';
import { City } from '../location/entities/city.entity';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectRepository(IdentificationType)
        private readonly identificationTypeRepository: Repository<IdentificationType>,
        @InjectRepository(Profession)
        private readonly professionRepository: Repository<Profession>,
        @InjectRepository(City)
        private readonly cityRepository: Repository<City>,
    ) { }

    async getUserByUsername(username: string): Promise<User> {
        return await this.userRepository.findOneBy({
            username: username
        });
    }

    async getUserByEmail(useremail: string): Promise<User> {
        return await this.userRepository.findOneBy({
            useremail: useremail
        });
    }

    async getUserByPhone(userphone: string): Promise<User> {
        return await this.userRepository.findOneBy({
            userphone: userphone
        });
    }

    async getUserByIdentificationNumber(identificationnumber: number): Promise<User> {
        return await this.userRepository.findOneBy({
            useridentificationnumber: identificationnumber
        });
    }

    async getUserById(useruuid: string): Promise<UserResponseDto> {
        try {
            const user = await this.userRepository.findOne({
                where: {
                    useruuid: useruuid,
                },
                relations: {
                    useridentificationtype: true,
                    userprofession: true,
                    roles: {
                        permissions: true,
                    },
                    city: {
                        department: {
                            country: true,
                        }
                    },
                }
            });

            if (!user) throw new NotFoundException('User not found', HttpStatus.NOT_FOUND, 'NF_USER_ERROR');

            const userResponse = {
                useruuid: user.useruuid,
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username,
                useremail: user.useremail,
                userphone: user.userphone,
                isActive: user.isActive,
                useridentificationtype: {
                    identificationtypeuuid: user?.useridentificationtype.identificationtypeuuid,
                    identificationtypename: user?.useridentificationtype.identificationtypename,
                },
                useridentificationnumber: user?.useridentificationnumber,
                additionalInfo: {
                    usergender: user?.usergender,
                    userprofession: user?.userprofession,
                    city: {
                        cityuuid: user?.city?.cityuuid,
                        cityname: user?.city?.cityname,
                        department: {
                            departmentuuid: user?.city?.department?.departmentuuid,
                            departmentname: user?.city?.department?.departmentname,
                            country: {
                                countryuuid: user?.city?.department?.country?.countryuuid,
                                countryname: user?.city?.department?.country?.countryname,
                            },
                        },
                    },
                    useraddress: user?.useraddress,
                    dateOfBirth: user?.dateOfBirth,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    roles: user?.roles.map(role => ({
                        roleuuid: role.roleuuid,
                        rolename: role.rolename,
                        permissions: role?.permissions.filter((permission) => permission.isActive).map((permission) => ({
                            permissionuuid: permission.permissionuuid,
                            permissionname: permission.permissionname,
                            permissioncode: permission.permissioncode
                        })) || null,
                    })) || null,
                }
            };
            return userResponse;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while getting a user by id');
        }
    }

    async getAllUsers(): Promise<UsersBasicResponseDto[]> {
        try {
            const users = await this.userRepository.find({
                where: { isDeleted: false },
                order: { firstname: 'ASC' },
                relations: {
                    useridentificationtype: true,
                    userprofession: true,
                    roles: true,
                    city: {
                        department: {
                            country: true,
                        }
                    },
                }
            });

            if (!users || users.length === 0) throw new NotFoundException('No users found', HttpStatus.NOT_FOUND, 'NF_USER_ERROR');

            const userResponseDto = users.map(user => ({
                useruuid: user.useruuid,
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username,
                useremail: user.useremail,
                userphone: user.userphone,
                userprofession: user?.userprofession,
                useridentificationtype: user?.useridentificationtype,
                useridentificationnumber: user?.useridentificationnumber,
                isActive: user.isActive
            } as UsersBasicResponseDto)) || [];
            return userResponseDto;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while getting all users');
        }
    }

    async getActiveUsers(): Promise<UsersBasicResponseDto[]> {
        try {
            const users = await this.userRepository.find({
                order: { firstname: 'ASC' },
                where: {
                    isDeleted: false,
                    isActive: true
                },
                relations: {
                    useridentificationtype: true,
                    userprofession: true,
                    roles: true,
                    city: {
                        department: {
                            country: true,
                        }
                    },
                }
            });

            if (!users || users.length === 0) throw new NotFoundException('No active users found', HttpStatus.NOT_FOUND, 'NF_USER_ERROR');

            const userResponseDto = users.map(user => ({
                useruuid: user.useruuid,
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username,
                useremail: user.useremail,
                userphone: user.userphone,
                userprofession: user?.userprofession,
                useridentificationtype: user.useridentificationtype,
                useridentificationnumber: user.useridentificationnumber,
                isActive: user.isActive
            } as UsersBasicResponseDto)) || [];
            return userResponseDto;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while getting active users');
        }
    }

    async addUser(user: UserCreateDto): Promise<UsersBasicResponseDto> {
        try {

            await this.ensureUserDoesNotExist('useremail', user.useremail, 'AEE_USER_ERROR');
            await this.ensureUserDoesNotExist('useridentificationnumber', user.useridentificationnumber, 'AEIN_USER_ERROR');

            const [identificationType, profession, city] = await Promise.all([
                this.identificationTypeRepository.findOneBy({ identificationtypeuuid: user.identificationtypeuuid }),
                this.professionRepository.findOneBy({ professionuuid: user.professionuuid }),
                this.cityRepository.findOneBy({ cityuuid: user.cityuuid }),
            ]);

            if (!identificationType) throw new NotFoundException('Identification type not found', HttpStatus.NOT_FOUND, 'NF_IDENTIFICATION_TYPE_ERROR');
            if (!profession) throw new NotFoundException('Profession not found', HttpStatus.NOT_FOUND, 'NF_PROFESSION_ERROR');
            if (!city) throw new NotFoundException('City not found', HttpStatus.NOT_FOUND, 'NF_CITY_ERROR');

            const saltOrRounds = 10;
            const hashedPassword = await bcrypt.hash(user.password, saltOrRounds);

            const newUserData: DeepPartial<User> = {
                ...user,
                userpassword: hashedPassword,
                useridentificationtype: { identificationtypeuuid: user.identificationtypeuuid },
                userprofession: { professionuuid: user.professionuuid },
                city: { cityuuid: user.cityuuid },
            };

            const newUser = this.userRepository.create(newUserData);
            const savedUser = await this.userRepository.save(newUser);
            const userResponse: UsersBasicResponseDto = {
                useruuid: savedUser.useruuid,
                firstname: savedUser.firstname,
                lastname: savedUser.lastname,
                username: savedUser.username,
                useremail: savedUser.useremail,
                userphone: savedUser.userphone,
                userprofession: savedUser?.userprofession,
                useridentificationtype: savedUser.useridentificationtype,
                useridentificationnumber: savedUser.useridentificationnumber,
                isActive: savedUser.isActive
            }
            return userResponse;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while adding a user');
        }
    }

    async updateUserStatus(useruuid: string): Promise<UserStatusDto> {
        try {
            const existingUser = await this.userRepository.findOneBy({
                useruuid: useruuid,
            });

            if (!existingUser) throw new NotFoundException(`User with uuid ${useruuid} not found`, HttpStatus.NOT_FOUND, 'NF_USER_ERROR');

            existingUser.isActive = !existingUser.isActive;
            const savedUser = await this.userRepository.save(existingUser);
            const userResponse: UserStatusDto = {
                useruuid: savedUser.useruuid,
                message: 'User status updated successfully',
                statusCode: HttpStatus.OK,
            };
            return userResponse;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while updating the user status');
        }
    }

    async updateUser(useruuid: string, user: UserUpdateDto): Promise<UserResponseDto> {
        try {
            const existingUser = await this.userRepository.findOneBy({
                useruuid: useruuid,
            });

            if (!existingUser) throw new NotFoundException(`User with uuid ${useruuid} not found`, HttpStatus.NOT_FOUND, 'NF_USER_ERROR');

            await this.ensureUserDoesNotExist('useremail', user.useremail, 'AEE_USER_ERROR');
            await this.ensureUserDoesNotExist('useridentificationnumber', user.useridentificationnumber, 'AEIN_USER_ERROR');

            const [identificationType, profession, city] = await Promise.all([
                this.identificationTypeRepository.findOneBy({ identificationtypeuuid: user.identificationtypeuuid }),
                this.professionRepository.findOneBy({ professionuuid: user.professionuuid }),
                this.cityRepository.findOneBy({ cityuuid: user.cityuuid }),
            ]);

            if (!identificationType) throw new NotFoundException('Identification type not found', HttpStatus.NOT_FOUND, 'NF_IDENTIFICATION_TYPE_ERROR');
            if (!profession) throw new NotFoundException('Profession not found', HttpStatus.NOT_FOUND, 'NF_PROFESSION_ERROR');
            if (!city) throw new NotFoundException('City not found', HttpStatus.NOT_FOUND, 'NF_CITY_ERROR');

            const userUpdateData: DeepPartial<User> = {
                ...user,
                useridentificationtype: { identificationtypeuuid: user.identificationtypeuuid },
                userprofession: { professionuuid: user.professionuuid },
                city: { cityuuid: user.cityuuid },
            };

            const updatedUser = Object.assign(existingUser, userUpdateData);
            const savedUser = await this.userRepository.save(updatedUser);
            const userResponse: UserResponseDto = {
                useruuid: savedUser.useruuid,
                firstname: savedUser.firstname,
                lastname: savedUser.lastname,
                username: savedUser.username,
                useremail: savedUser.useremail,
                userphone: savedUser.userphone,
                isActive: savedUser.isActive,
                useridentificationtype: {
                    identificationtypeuuid: savedUser?.useridentificationtype?.identificationtypeuuid,
                    identificationtypename: savedUser?.useridentificationtype?.identificationtypename,
                },
                useridentificationnumber: savedUser.useridentificationnumber,
                additionalInfo: {
                    usergender: savedUser.usergender,
                    userprofession: savedUser?.userprofession,
                    city: {
                        cityuuid: savedUser?.city?.cityuuid,
                        cityname: savedUser?.city?.cityname,
                        department: {
                            departmentuuid: savedUser?.city?.department?.departmentuuid,
                            departmentname: savedUser?.city?.department?.departmentname,
                            country: {
                                countryuuid: savedUser?.city?.department?.country?.countryuuid,
                                countryname: savedUser?.city?.department?.country?.countryname,
                            },
                        },
                    },
                    useraddress: savedUser.useraddress,
                    dateOfBirth: savedUser.dateOfBirth,
                    createdAt: savedUser.createdAt,
                    updatedAt: savedUser.updatedAt,
                    roles: savedUser.roles,
                },
            };
            return userResponse;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while updating the user');
        }
    }

    async removeUser(useruuid: string): Promise<UserStatusDto> {
        try {
            const existingUser = await this.userRepository.findOneBy({
                useruuid: useruuid,
            });

            if (!existingUser) throw new NotFoundException(`User with uuid ${useruuid} not found`, HttpStatus.NOT_FOUND, 'NF_USER_ERROR');

            existingUser.isDeleted = !existingUser.isDeleted;
            const savedUser = await this.userRepository.save(existingUser);
            const userResponse: UserStatusDto = {
                useruuid: savedUser.useruuid,
                message: 'User deleted successfully',
                statusCode: HttpStatus.OK,
            };
            return userResponse;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while updating the user status');
        }
    }

    async assignRolesToUser(useruuid: string, roleuuids: string[]): Promise<UserWithRolesDto> {
        try {
            const user = await this.userRepository.findOne({
                where: { useruuid: useruuid },
                relations: ['roles'],
            });

            if (!user) throw new NotFoundException(`User with uuid ${useruuid} not found`, HttpStatus.NOT_FOUND, 'NF_USER_ERROR');

            const idsArray = Array.isArray(roleuuids) ? roleuuids : Object.values(roleuuids);

            const roles = await this.roleRepository.findBy({
                roleuuid: In(idsArray),
            });

            if (roles.length !== idsArray.length) throw new NotFoundException(`Some roles not found for user with uuid ${useruuid}`, HttpStatus.NOT_FOUND, 'NFR_USER_ERROR');

            user.roles = roles;
            const savedUser = await this.userRepository.save(user);
            const userResponse: UserWithRolesDto = {
                useruuid: savedUser.useruuid,
                firstname: savedUser.firstname,
                lastname: savedUser.lastname,
                username: savedUser.username,
                useremail: savedUser.useremail,
                userphone: savedUser.userphone,
                roles: savedUser.roles.map(role => ({
                    roleuuid: role.roleuuid,
                    rolename: role.rolename,
                    permissions: role?.permissions?.map(permission => ({
                        permissionuuid: permission.permissionuuid,
                        permissionname: permission.permissionname,
                        permissioncode: permission.permissioncode,
                    })) || [],
                })),
            }
            return userResponse;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while assigning roles to the user');
        }
    }

    private async ensureUserDoesNotExist(type: 'useremail' | 'useridentificationnumber', value: string | number, code: string) {
        const user = type === 'useremail' ? await this.getUserByEmail(value as string) : await this.getUserByIdentificationNumber(value as number);
        if (user) {
            throw new AlreadyExistsException(
                'User with ' + type + ' ' + value + ' already exists',
                HttpStatus.BAD_REQUEST,
                code,
            );
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
