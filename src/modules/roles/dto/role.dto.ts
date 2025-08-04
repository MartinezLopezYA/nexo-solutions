import { PermissionInRoleDto } from 'src/modules/permissions/dto/permission.dto';

export class CreateRoleDto {
  rolename: string = 'Administrador';
  roledesc?: string = 'Rol con todos los permisos';
  rolecode?: string = 'ADMIN';
}

export class UpdateRoleDto {
  rolename?: string = 'Usuario';
  roledesc?: string = 'Rol con permisos limitados';
  rolecode?: string = 'USER';
}

export class RoleResponseDto {
  roleuuid: string | null;
  rolename: string | null;
  roledesc: string | null;
  isActive?: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export class RoleWithPermissionsDto {
  roleuuid: string | null;
  rolename: string | null;
  roledesc: string | null;
  permissions: PermissionInRoleDto[] | null;
}

export class RoleInUser {
  roleuuid: string | null;
  rolename: string | null;
  roledesc: string | null;
}
