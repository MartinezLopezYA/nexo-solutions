import { RoleInUser } from 'src/modules/roles/dto/role.dto';

export class UserCreateDto {
  firstname: string;
  lastname: string;
  username: string;
  useremail: string;
  password: string;
  usercountrycode?: string;
  userphone?: string;
}

export class UserUpdateBasicDto {
  firstname?: string;
  lastname?: string;
  username?: string;
  useremail?: string;
  usercountrycode?: string;
  userphone?: string;
}

export class UserUpdateAdditionalDto {
  usergender?: string;
  userprofession?: string;
  useraddress?: string;
  dateOfBirth?: Date;
  city?: string;
  state?: string;
  country?: string;
}

export class UserResponseDto {
  useruuid: string;
  firstname: string;
  lastname: string;
  username: string;
  useremail: string;
  usercountrycode?: string;
  userphone?: string;
  additionalInfo?: UserAditionalResponseDto;
}

export class UserAditionalResponseDto {
  usergender?: string;
  userprofession?: string;
  useraddress?: string;
  dateOfBirth?: Date;
  city?: string;
  state?: string;
  country?: string;
}

export class UserWithRolesDto {
  useruuid: string;
  firstname: string;
  lastname: string;
  username: string;
  useremail: string;
  usercountrycode?: string;
  userphone?: string;
  roles: RoleInUser[] | null;
}

export class UserUpdateStatusDto {
  isActive?: boolean;
}
