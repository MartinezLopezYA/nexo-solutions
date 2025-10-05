import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePermissionDto, PermissionDeletedDto, PermissionResponseDto, UpdatePermissionDto } from './dto/permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';
import { AlreadyExistsException, NotFoundException } from 'src/common/exceptions/general-exception.';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) { }

  async getAllPermissions(): Promise<PermissionResponseDto[]> {
    try {
      const permissions = await this.permissionRepository.find({
        order: { permissionname: 'ASC' },
      });
      if (!permissions || permissions.length === 0) throw new NotFoundException('No permissions found', HttpStatus.NOT_FOUND, 'NF_PERMISSION_ERROR');

      const permissionResponseDto = permissions.map(permission => ({
        permissionuuid: permission.permissionuuid,
        permissionname: permission.permissionname,
        permissiondesc: permission.permissiondesc,
        permissioncode: permission.permissioncode,
        isActive: permission.isActive,
      } as PermissionResponseDto)) || [];

      return permissionResponseDto;
    } catch (error) {
      this.handleInternalError(error, 'An error occurred while updating the permission');
    }
  }

  async getAllPermissionsActive(): Promise<PermissionResponseDto[]> {
    try {
      const permissions = await this.permissionRepository.find({
        where: { isActive: true },
        order: { permissionname: 'ASC' },
      });

      if (!permissions || permissions.length === 0) throw new NotFoundException('No active permissions found', HttpStatus.NOT_FOUND, 'NFA_PERMISSION_ERROR');

      const permissionResponseDto = permissions.map(permission => ({
        permissionuuid: permission.permissionuuid,
        permissionname: permission.permissionname,
        permissiondesc: permission.permissiondesc,
        permissioncode: permission.permissioncode,
        isActive: permission.isActive,
      } as PermissionResponseDto)) || [];

      return permissionResponseDto;
    } catch (error) {
      this.handleInternalError(error, 'An error occurred while updating the permission');
    }
  }

  async getPermissionByName(permissionname: string): Promise<Permission> {
    return await this.permissionRepository.findOneBy({
      permissionname: permissionname,
    });
  }

  async getPermissionByCode(permissioncode: string): Promise<Permission> {
    return await this.permissionRepository.findOneBy({
      permissioncode: permissioncode,
    });
  }

  async addPermission(permission: CreatePermissionDto): Promise<PermissionResponseDto> {
    try {

      await this.ensurePermissionDoesNotExist('permissionname', permission.permissionname, 'AEN_PERMISSION_ERROR');
      await this.ensurePermissionDoesNotExist('permissioncode', permission.permissioncode, 'AEC_PERMISSION_ERROR');

      const newPermission = this.permissionRepository.create(permission);
      const savedPermission = await this.permissionRepository.save(newPermission);
      const permissionResponseDto: PermissionResponseDto = {
        permissionuuid: savedPermission.permissionuuid,
        permissionname: savedPermission.permissionname,
        permissiondesc: savedPermission.permissiondesc,
        permissioncode: savedPermission.permissioncode,
        isActive: savedPermission.isActive,
      };
      return permissionResponseDto;
    } catch (error) {
      this.handleInternalError(error, 'An error occurred while updating the permission');
    }
  }

  async updatePermission(permissionuuid: string, permission: UpdatePermissionDto): Promise<PermissionResponseDto> {
    try {
      const existingPermission = await this.permissionRepository.findOneBy({
        permissionuuid: permissionuuid,
      });

      if (!existingPermission) throw new NotFoundException(`Permission with uuid ${permissionuuid} not found`, HttpStatus.NOT_FOUND, 'NF_PERMISSION_ERROR');

      await this.ensurePermissionDoesNotExist('permissionname', permission.permissionname, 'AEN_PERMISSION_ERROR');
      await this.ensurePermissionDoesNotExist('permissioncode', permission.permissioncode, 'AEC_PERMISSION_ERROR');

      const updatedPermission = Object.assign(existingPermission, permission);
      const savedPermission = await this.permissionRepository.save(updatedPermission);
      const permissionResponseDto: PermissionResponseDto = {
        permissionuuid: savedPermission.permissionuuid,
        permissionname: savedPermission.permissionname,
        permissiondesc: savedPermission.permissiondesc,
        permissioncode: savedPermission.permissioncode,
        isActive: savedPermission.isActive
      };
      return permissionResponseDto;
    } catch (error) {
      this.handleInternalError(error, 'An error occurred while updating the permission');
    }
  }

  async updatePermissionStatus(permissionuuid: string): Promise<PermissionResponseDto> {
    try {
      const existingPermission = await this.permissionRepository.findOneBy({
        permissionuuid: permissionuuid,
      });

      if (!existingPermission) throw new NotFoundException(`Permission with uuid ${permissionuuid} not found`, HttpStatus.NOT_FOUND, 'NF_PERMISSION_ERROR');

      existingPermission.isActive = !existingPermission.isActive;
      const savedPermission = await this.permissionRepository.save(existingPermission);
      const permissionResponseDto: PermissionResponseDto = {
        permissionuuid: savedPermission.permissionuuid,
        permissionname: savedPermission.permissionname,
        permissiondesc: savedPermission.permissiondesc,
        permissioncode: savedPermission.permissioncode,
        isActive: savedPermission.isActive,
      };
      return permissionResponseDto;
    } catch (error) {
      this.handleInternalError(error, 'An error occurred while updating the permission status');
    }
  }

  async deletePermission(permissionuuid: string): Promise<PermissionDeletedDto> {
    try {
      const existingPermission = await this.permissionRepository.findOneBy({
        permissionuuid: permissionuuid,
      });

      if (!existingPermission) throw new NotFoundException(`Permission with uuid ${permissionuuid} not found`, HttpStatus.NOT_FOUND, 'NF_PERMISSION_ERROR');

      await this.permissionRepository.remove(existingPermission);
      return {
        message: 'Permission deleted successfully',
        permissionname: existingPermission.permissionname,
        statusCode: 'SUCCESS',
      }
    } catch (error) {
      this.handleInternalError(error, 'An error occurred while deleting the permission');
    }
  }

  private async ensurePermissionDoesNotExist(type: 'permissionname' | 'permissioncode', value: string, code: string) {
    const permission = type === 'permissionname' ? await this.getPermissionByName(value as string) : await this.getPermissionByCode(value as string);
    if (permission) {
      throw new AlreadyExistsException(
        'Permission with ' + type + ' ' + value + ' already exists',
        HttpStatus.BAD_REQUEST,
        code,
      );
    }
  }

  private handleInternalError(error: unknown, message: string): never {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorCode: 'INTERNAL_SERVER_ERROR',
        message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
