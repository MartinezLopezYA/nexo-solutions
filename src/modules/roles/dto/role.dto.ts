import { IsString } from 'class-validator';
import { PermissionInRoleDto } from 'src/modules/permissions/dto/permission.dto';

export class CreateRoleDto {
  @IsString()
  rolename: string = 'Administrador';

  @IsString()
  roledesc?: string = 'Rol con todos los permisos';

  @IsString()
  rolecode?: string = 'ADMIN';
}

export class UpdateRoleDto {
  @IsString()
  rolename?: string = 'Usuario';

  @IsString()
  roledesc?: string = 'Rol con permisos limitados';

  @IsString()
  rolecode?: string = 'USER';
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