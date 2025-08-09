import { HttpStatus, Injectable } from '@nestjs/common';
import {
  CreatePermissionDto,
  PermissionResponseDto,
  UpdatePermissionDto,
} from './dto/permission.dto';
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

  async findByName(permissionname: string): Promise<Permission> {
    return await this.permissionRepository.findOneBy({
      permissionname: permissionname,
    });
  }

  async findByCode(permissioncode: string): Promise<Permission> {
    return await this.permissionRepository.findOneBy({
      permissioncode: permissioncode,
    });
  }

  async addPermission(
    permission: CreatePermissionDto,
  ): Promise<PermissionResponseDto> {
    const existName = await this.findByName(permission.permissionname);
    if (existName) {
      throw new PermissionException(
        `Permission with name ${permission.permissionname} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const existCode = await this.findByCode(permission.permissioncode);
    if (existCode) {
      throw new PermissionException(
        `Permission with code ${permission.permissioncode} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const newPermission = this.permissionRepository.create(permission);
    const savedPermission = await this.permissionRepository.save(newPermission);
    return savedPermission;
  }

  async updatePermission(
    permissionuuid: string,
    permission: UpdatePermissionDto,
  ): Promise<PermissionResponseDto> {
    const existingPermission = await this.permissionRepository.findOneBy({
      permissionuuid: permissionuuid,
    });

    if (!existingPermission) {
      throw new PermissionException(
        `Permission with uuid ${permissionuuid} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const existName = await this.findByName(permission.permissionname);
    if (existName && existName.permissionuuid !== permissionuuid) {
      throw new PermissionException(
        `Permission with name ${permission.permissionname} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const existCode = await this.findByCode(permission.permissioncode);
    if (existCode && existCode.permissionuuid !== permissionuuid) {
      throw new PermissionException(
        `Permission with code ${permission.permissioncode} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedPermission = Object.assign(existingPermission, permission);
    return await this.permissionRepository.save(updatedPermission);
  }

  async updatePermissionStatus(
    permissionuuid: string,
  ): Promise<PermissionResponseDto> {
    const existingPermission = await this.permissionRepository.findOneBy({
      permissionuuid: permissionuuid,
    });

    if (!existingPermission) {
      throw new PermissionException(
        `Permission with uuid ${permissionuuid} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    existingPermission.isActive = !existingPermission.isActive;
    return await this.permissionRepository.save(existingPermission);
  }

  async deletePermission(permissionuuid: string): Promise<void> {
    const existingPermission = await this.permissionRepository.findOneBy({
      permissionuuid: permissionuuid,
    });

    if (!existingPermission) {
      throw new PermissionException(
        `Permission with uuid ${permissionuuid} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.permissionRepository.remove(existingPermission);
  }
}
