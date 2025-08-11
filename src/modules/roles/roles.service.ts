import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto, RoleDeletedDto, RoleResponseDto, RoleWithPermissionsDto, UpdateRoleDto } from './dto/role.dto';
import { Permission } from '../permissions/entities/permission.entity';
import { AlreadyExistsException, NotFoundException } from 'src/common/exceptions/general-exception.';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) { }

  async getAllRoles(): Promise<RoleResponseDto[]> {
    try {
      const roles = await this.roleRepository.find({
        order: { rolename: 'ASC' },
      });

      if (!roles || roles.length === 0) {
        throw new NotFoundException(
          'No roles found',
          HttpStatus.NOT_FOUND,
          'NF_ROLE_ERROR',
        );
      }

      const roleResponseDto = roles.map(role => ({
        roleuuid: role.roleuuid,
        rolename: role.rolename,
        roledesc: role.roledesc,
        rolecode: role.rolecode,
        isActive: role.isActive,
      } as RoleResponseDto)) || [];

      return roleResponseDto;
    } catch (error) {
      this.handleInternalError(error, 'An error occurred while updating the role');
    }
  }

  async getAllRolesActive(): Promise<RoleResponseDto[]> {
    try {
      const roles = await this.roleRepository.find({
        where: { isActive: true },
        order: { rolename: 'ASC' },
      });

      if (!roles || roles.length === 0) {
        throw new NotFoundException(
          'No active roles found',
          HttpStatus.NOT_FOUND,
          'NFA_ROLE_ERROR',
        );
      }
      const roleResponseDto = roles.map(role => ({
        roleuuid: role.roleuuid,
        rolename: role.rolename,
        roledesc: role.roledesc,
        rolecode: role.rolecode,
        isActive: role.isActive,
      } as RoleResponseDto)) || [];

      return roleResponseDto;
    } catch (error) {
      this.handleInternalError(error, 'An error occurred while updating the role');
    }
  }

  async getRoleWithPermissions(roleuuid: string): Promise<RoleWithPermissionsDto> {
    try {
      const role = await this.roleRepository.findOne({
        where: { roleuuid: roleuuid },
        relations: ['permissions'],
      });

      if (!role) {
        throw new NotFoundException(
          `Role with ID ${roleuuid} not found`,
          HttpStatus.NOT_FOUND,
          'NF_ROLE_WITH_PERMISSIONS_ERROR',
        );
      }

      const roleWithPermissions: RoleWithPermissionsDto = {
        roleuuid: role.roleuuid,
        rolename: role.rolename,
        roledesc: role.roledesc,
        rolecode: role.rolecode,
        permissions: role.permissions.filter((permission) => permission.isActive).map((permission) => ({
          permissionuuid: permission.permissionuuid,
          permissionname: permission.permissionname,
          permissiondesc: permission.permissiondesc,
          permissioncode: permission.permissioncode
        })) || [],
      }

      return roleWithPermissions;
    } catch (error) {
      this.handleInternalError(error, 'An error occurred while retrieving the role with permissions');
    }
  }

  async findByName(rolename: string): Promise<Role> {
    return await this.roleRepository.findOneBy({
      rolename: rolename,
    });
  }

  async findByCode(rolecode: string): Promise<Role> {
    return await this.roleRepository.findOneBy({
      rolecode: rolecode,
    });
  }

  async addRole(role: CreateRoleDto): Promise<RoleResponseDto> {
    try {
      const existName = await this.findByName(role.rolename);
      if (existName) {
        throw new AlreadyExistsException(
          'Role with name ' + role.rolename + ' already exists',
          HttpStatus.BAD_REQUEST,
          'AEN_ROLE_ERROR',
        );
      }

      const existCode = await this.findByCode(role.rolecode);
      if (existCode) {
        throw new AlreadyExistsException(
          'Role with code ' + role.rolecode + ' already exists',
          HttpStatus.BAD_REQUEST,
          'AEC_ROLE_ERROR',
        );
      }
      const newRole = this.roleRepository.create(role);
      const savedRole = await this.roleRepository.save(newRole);
      const roleResponse: RoleResponseDto = {
        roleuuid: savedRole.roleuuid,
        rolename: savedRole.rolename,
        roledesc: savedRole.roledesc,
        rolecode: savedRole.rolecode,
        isActive: savedRole.isActive,
      };
      return roleResponse;
    } catch (error) {
      this.handleInternalError(error, 'An error occurred while adding the role');
    }
  }

  async updateRole(roleuuid: string, role: Partial<UpdateRoleDto>): Promise<RoleResponseDto> {
    try {
      const existingRole = await this.roleRepository.findOneBy({
        roleuuid: roleuuid,
      });

      if (!existingRole) {
        throw new NotFoundException(
          `Role with uuid ${roleuuid} not found`,
          HttpStatus.NOT_FOUND,
          'NF_ROLE_ERROR',
        );
      }

      const updatedRole = Object.assign(existingRole, role);
      const savedRole = await this.roleRepository.save(updatedRole);
      const roleResponse: RoleResponseDto = {
        roleuuid: savedRole.roleuuid,
        rolename: savedRole.rolename,
        roledesc: savedRole.roledesc,
        rolecode: savedRole.rolecode,
        isActive: savedRole.isActive
      };
      return roleResponse;
    } catch (error) {
      this.handleInternalError(error, 'An error occurred while updating the role');
    }
  }

  async updateRoleStatus(roleuuid: string): Promise<RoleResponseDto> {
    try {
      const existingRole = await this.roleRepository.findOneBy({
        roleuuid: roleuuid,
      });

      if (!existingRole) {
        throw new NotFoundException(
          `Role with uuid ${roleuuid} not found`,
          HttpStatus.NOT_FOUND,
          'NF_ROLE_ERROR',
        );
      }

      existingRole.isActive = !existingRole.isActive;
      const savedRole = await this.roleRepository.save(existingRole);
      const roleResponse: RoleResponseDto = {
        roleuuid: savedRole.roleuuid,
        rolename: savedRole.rolename,
        roledesc: savedRole.roledesc,
        rolecode: savedRole.rolecode,
        isActive: savedRole.isActive,
      };
      return roleResponse;
    } catch (error) {
      this.handleInternalError(error, 'An error occurred while updating the role status');
    }
  }

  async deleteRole(roleuuid: string): Promise<RoleDeletedDto> {
    try {
      const existingRole = await this.roleRepository.findOneBy({
        roleuuid: roleuuid,
      });

      if (!existingRole) {
        throw new NotFoundException(
          `Role with uuid ${roleuuid} not found`,
          HttpStatus.NOT_FOUND,
          'NF_ROLE_ERROR',
        );
      }

      await this.roleRepository.remove(existingRole);
      return {
        message: 'Role deleted successfully',
        rolename: existingRole.rolename,
        statusCode: 'SUCCESS',
      }
    } catch (error) {
      this.handleInternalError(error, 'An error occurred while deleting the role');
    }
  }

  async assignPermissionsToRole(roleuuid: string, permissionuuids: string[]): Promise<RoleWithPermissionsDto> {
    try {
      const role = await this.roleRepository.findOne({
        where: { roleuuid: roleuuid },
        relations: ['permissions'],
      });

      if (!role) {
        throw new NotFoundException(
          `Role with uuid ${roleuuid} not found`,
          HttpStatus.NOT_FOUND,
          'NF_ROLE_ERROR',
        );
      }

      const permissions = await this.roleRepository.manager.findByIds(Permission, permissionuuids);

      if (permissions.length !== permissionuuids.length) {
        throw new NotFoundException(
          `Some permissions not found for role with uuid ${roleuuid}`,
          HttpStatus.NOT_FOUND,
          'NFP_ROLE_ERROR',
        );
      }

      role.permissions = permissions;
      const savedPermissionRole = await this.roleRepository.save(role);
      const roleResponse: RoleWithPermissionsDto = {
        roleuuid: savedPermissionRole.roleuuid,
        rolename: savedPermissionRole.rolename,
        roledesc: savedPermissionRole.roledesc,
        rolecode: savedPermissionRole.rolecode,
        permissions: savedPermissionRole.permissions.map(permission => ({
          permissionuuid: permission.permissionuuid,
          permissionname: permission.permissionname,
          permissiondesc: permission.permissiondesc,
          permissioncode: permission.permissioncode
        })),
      }

      return roleResponse;
    } catch (error) {
      this.handleInternalError(error, 'An error occurred while assigning permissions to the role');
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
