import { IsBoolean, IsDate, IsEmail, IsNumber, IsString, IsUUID, Length, Matches, MinLength, IsOptional, IsNotEmpty } from 'class-validator';
import { IdentificationTypeToUserDto } from 'src/modules/identification-type/dto/identification-type.dto';
import { CityWithDepartmentAndCountryDto } from 'src/modules/location/dto/city.dto';
import { RoleInUser } from 'src/modules/roles/dto/role.dto';
import { Transform, Type } from 'class-transformer';
import { capitalize, capitalizeFirstLetter } from 'src/common/utils/format';
import { ProfessionWithCategoriesDto } from 'src/modules/professions/dto/profession.dto';

export class UserCreateDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => capitalizeFirstLetter(value))
  firstname: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => capitalizeFirstLetter(value))
  lastname: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => capitalize(value))
  username: string;

  @IsEmail()
  @IsNotEmpty()
  useremail: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' })
  userpassword: string;

  @IsString()
  @Length(10)
  userphone: string;

  @IsUUID()
  @IsNotEmpty()
  identificationtypeuuid: string;

  @IsNumber()
  @IsNotEmpty()
  useridentificationnumber: number;

  @IsString()
  @IsOptional()
  usergender?: string;

  @IsUUID()
  @IsOptional()
  professionuuid?: string;

  @IsUUID()
  @IsOptional()
  cityuuid?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => capitalize(value))
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
  @Transform(({ value }) => capitalizeFirstLetter(value))
  firstname?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => capitalizeFirstLetter(value))
  lastname?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => capitalize(value))
  username?: string;

  @IsEmail()
  @IsOptional()
  useremail?: string;

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

  @IsUUID()
  @IsOptional()
  professionuuid?: string;

  @IsUUID()
  @IsOptional()
  cityuuid?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => capitalize(value))
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
  userprofession: ProfessionWithCategoriesDto;
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
  isActive?: boolean;
}

export class UserAditionalResponseDto {
  usergender?: string;
  userprofession?: ProfessionWithCategoriesDto;
  city?: CityWithDepartmentAndCountryDto;
  useraddress?: string;
  dateOfBirth?: Date;
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

