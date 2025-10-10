import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { capitalizeFirstLetter } from 'src/common/utils/format';
import { PermissionInRoleDto } from 'src/modules/permissions/dto/permission.dto';
import { Transform } from 'class-transformer';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => capitalizeFirstLetter(value))
  rolename: string;

  @IsString()
  @IsOptional()
  roledesc?: string;

  @IsString()
  @IsOptional()
  rolecode?: string;
}

export class UpdateRoleDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => capitalizeFirstLetter(value))
  rolename?: string;

  @IsString()
  @IsOptional()
  roledesc?: string;

  @IsString()
  @IsOptional()
  rolecode?: string;
}

export class RoleResponseDto {
  roleuuid: string | null;
  rolename: string | null;
  roledesc: string | null;
  rolecode: string | null;
  isActive?: boolean | null;
}

export class RoleWithPermissionsDto {
  roleuuid: string | null;
  rolename: string | null;
  roledesc: string | null;
  rolecode: string | null;
  permissions: PermissionInRoleDto[] | [];
}

export class RoleInUser {
  roleuuid: string | null;
  rolename: string | null;
  permissions: PermissionInRoleDto[] | [];
}

export class RoleDeletedDto {
  message: string;
  rolename: string;
  statusCode: string;
}