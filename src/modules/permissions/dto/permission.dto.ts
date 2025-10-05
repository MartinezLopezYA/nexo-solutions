import { IsString } from "class-validator";

export class CreatePermissionDto {
  @IsString()
  permissionname: string = 'Crear usuario';

  @IsString()
  permissiondesc?: string = 'Permite crear un nuevo usuario en el sistema';

  @IsString()
  permissioncode?: string = 'CREATE_USER';
}

export class UpdatePermissionDto {
  @IsString()
  permissionname?: string = 'Actualizar usuario';

  @IsString()
  permissiondesc?: string = 'Permite actualizar la información de un usuario existente';

  @IsString()
  permissioncode?: string = 'UPDATE_USER';
}

export class PermissionResponseDto {
  permissionuuid: string | null;
  permissionname: string | null;
  permissiondesc: string | null;
  permissioncode: string | null;
  isActive?: boolean | null;
}

export class PermissionInRoleDto {
  permissionuuid: string | null;
  permissionname: string | null;
  permissioncode: string | null;
}

export class PermissionDeletedDto {
  message: string;
  permissionname: string;
  statusCode: string;
}