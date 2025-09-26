import { IsBoolean, IsDate, IsEmail, IsNumber, IsString, IsUUID, Length, Min } from 'class-validator';
import { IdentificationTypeToUserDto } from 'src/modules/identification-type/dto/identification-type.dto';
import { CityWithDepartmentAndCountryDto } from 'src/modules/location/dto/city.dto';
import { RoleInUser } from 'src/modules/roles/dto/role.dto';

export class UserCreateDto {
  @IsString()
  firstname: string = 'Andres';

  @IsString()
  lastname: string = 'Martinez';

  @IsString()
  username: string = 'andresmartinez';

  @IsString()
  @IsEmail()
  useremail: string = 'andresmartinez@gmail.com';

  @IsString()
  @Min(8)
  password: string = 'Andres123!';

  @IsString()
  @Length(10)
  userphone: string = '3182848957';

  @IsUUID()
  useridentificationtype: string = '123e4567-e89b-12d3-a456-426614174000';

  @IsNumber()
  useridentificationnumber: number = 123456789;

  @IsString()
  usergender: string = 'M';

  @IsString()
  userprofession?: string = 'Software Engineer';

  @IsUUID()
  cityuuid: string = '123e4567-e89b-12d3-a456-426614174000';

  @IsString()
  useraddress?: string = '123 Main St';

  @IsDate()
  dateOfBirth?: Date = new Date();

  @IsBoolean()
  isActive?: boolean = true;
}

export class UserUpdateBasicDto {
  @IsString()
  firstname: string = 'Andres';

  @IsString()
  lastname: string = 'Martinez';

  @IsString()
  username: string = 'andresmartinez';

  @IsString()
  @IsEmail()
  useremail: string = 'andresmartinez@gmail.com';

  @IsString()
  @Min(8)
  password: string = 'Andres123!';

  @IsString()
  @Length(10)
  userphone: string = '3182848957';

  @IsUUID()
  useridentificationtype: string = '123e4567-e89b-12d3-a456-426614174000';

  @IsNumber()
  useridentificationnumber: number = 123456789;
}

export class UserUpdateAdditionalDto {
  @IsString()
  usergender: string = 'M';

  @IsString()
  userprofession?: string = 'Software Engineer';

  @IsUUID()
  cityuuid: string = '123e4567-e89b-12d3-a456-426614174000';

  @IsString()
  useraddress?: string = '123 Main St';

  @IsDate()
  dateOfBirth?: Date = new Date();
}

export class UserResponseDto {
  useruuid: string;
  firstname: string;
  lastname: string;
  username: string;
  useremail: string;
  userphone: string;
  useridentificationtype: IdentificationTypeToUserDto;
  useridentificationnumber: number;
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
  roles?: RoleInUser[] | null;
}

export class UserWithRolesDto {
  useruuid: string;
  firstname: string;
  lastname: string;
  username: string;
  useremail: string;
  userphone?: string;
  roles: RoleInUser[] | null;
}

export class UserUpdateStatusDto {
  isActive?: boolean;
}
