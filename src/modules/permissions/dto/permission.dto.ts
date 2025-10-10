import { Transform } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { capitalize, capitalizeFirstLetter } from "src/common/utils/format";

export class CreatePermissionDto {
  @IsString()
  @Transform(({ value }) => capitalizeFirstLetter(value))
  permissionname: string = 'Crear usuario';

  @IsString()
  permissiondesc?: string = 'Permite crear un nuevo usuario en el sistema';

  @IsString()
  @Transform(({ value }) => capitalize(value))
  permissioncode?: string = 'CREATE_USER';
}

export class UpdatePermissionDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => capitalizeFirstLetter(value))
  permissionname?: string = 'Actualizar usuario';

  @IsString()
  @IsOptional()
  permissiondesc?: string = 'Permite actualizar la información de un usuario existente';

  @IsString()
  @IsOptional()
  @Transform(({ value }) => capitalize(value))
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