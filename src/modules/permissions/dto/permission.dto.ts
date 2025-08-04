export class CreatePermissionDto {
  permissionname: string = 'Crear usuario';
  permissiondesc?: string = 'Permite crear un nuevo usuario en el sistema';
  permissioncode?: string = 'CREATE_USER';
}

export class UpdatePermissionDto {
  permissionname?: string = 'Actualizar usuario';
  permissiondesc?: string =
    'Permite actualizar la información de un usuario existente';
  permissioncode?: string = 'UPDATE_USER';
}

export class PermissionResponseDto {
  permissionuuid: string | null;
  permissionname: string | null;
  permissiondesc: string | null;
  isActive?: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export class PermissionInRoleDto {
  permissionuuid: string | null;
  permissionname: string | null;
  permissiondesc: string | null;
}
