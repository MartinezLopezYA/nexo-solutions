import { HttpStatus, Injectable } from '@nestjs/common';
import { PermissionResponseDto } from './dto/permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';
import { PermissionException } from 'src/common/exceptions/permission-exception';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async getAllPermissions(): Promise<PermissionResponseDto[]> {
    const permissions = await this.permissionRepository.find({
      order: { permissionname: 'ASC' },
    });

    if (!permissions || permissions.length === 0) {
      throw new PermissionException(
        'No permissions found',
        HttpStatus.NOT_FOUND,
      );
    }

    return permissions;
  }

  async getAllPermissionsActive(): Promise<PermissionResponseDto[]> {
    const permissions = await this.permissionRepository.find({
      where: { isActive: true },
      order: { permissionname: 'ASC' },
    });

    if (!permissions || permissions.length === 0) {
      throw new PermissionException(
        'No active permissions found',
        HttpStatus.NOT_FOUND,
      );
    }

    return permissions;
  }
}

// async findOne(id: string): Promise<Role> {
//   const role = await this.roleRepository.findOneBy({ roleuuid: id });
//   if (!role) throw new RoleNotFoundException(id);
//   return role;
// }

// async findAll(): Promise<Role[]> {
//   return await this.roleRepository.find({
//     relations: ['permissions', 'users'], // si quieres traer relaciones
//     order: { rolename: 'ASC' }, // opcional, para ordenar por nombre
//   });
// }
