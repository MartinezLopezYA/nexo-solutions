import { IsBoolean, IsDate, IsEmail, IsNumber, IsString, IsUUID, Length, Matches, MinLength, IsOptional } from 'class-validator';
import { IdentificationTypeToUserDto } from 'src/modules/identification-type/dto/identification-type.dto';
import { CityWithDepartmentAndCountryDto } from 'src/modules/location/dto/city.dto';
import { RoleInUser } from 'src/modules/roles/dto/role.dto';
import { Type } from 'class-transformer';

export class UserCreateDto {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsString()
  username: string;

  @IsString()
  @IsEmail()
  useremail: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' })
  password: string;

  @IsString()
  @Length(10)
  userphone: string;

  @IsUUID()
  identificationtypeuuid: string;

  @IsNumber()
  useridentificationnumber: number;

  @IsString()
  @IsOptional()
  usergender?: string;

  @IsString()
  @IsOptional()
  userprofession?: string;

  @IsUUID()
  @IsOptional()
  cityuuid?: string;

  @IsString()
  @IsOptional()
  useraddress?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth?: Date;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UserUpdateDto {
  @IsString()
  @IsOptional()
  firstname?: string;

  @IsString()
  @IsOptional()
  lastname?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @Length(10)
  @IsOptional()
  userphone?: string;

  @IsUUID()
  @IsOptional()
  identificationtypeuuid?: string;

  @IsNumber()
  @IsOptional()
  useridentificationnumber?: number;

  @IsString()
  @IsOptional()
  usergender?: string;

  @IsString()
  @IsOptional()
  userprofession?: string;

  @IsUUID()
  @IsOptional()
  cityuuid?: string;

  @IsString()
  @IsOptional()
  useraddress?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth?: Date;
}

export class UsersBasicResponseDto {
  useruuid: string;
  firstname: string;
  lastname: string;
  username: string;
  useremail: string;
  userphone: string;
  userprofession: string;
  useridentificationtype: IdentificationTypeToUserDto;
  useridentificationnumber: number;
  isActive: boolean;
}

export class UserResponseDto {
  useruuid: string;
  firstname: string;
  lastname: string;
  username: string;
  useremail: string;
  userphone: string;
  useridentificationtype?: IdentificationTypeToUserDto;
  useridentificationnumber?: number;
  additionalInfo?: UserAditionalResponseDto;
}

export class UserAditionalResponseDto {
  usergender?: string;
  userprofession?: string;
  city?: CityWithDepartmentAndCountryDto;
  useraddress?: string;
  dateOfBirth?: Date;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  roles?: RoleInUser[] | [];
}

export class UserWithRolesDto {
  useruuid: string;
  firstname: string;
  lastname: string;
  username: string;
  useremail: string;
  userphone?: string;
  roles: RoleInUser[] | [];
}

export class UserStatusDto {
  useruuid: string;
  message: string;
  statusCode: number;
}

