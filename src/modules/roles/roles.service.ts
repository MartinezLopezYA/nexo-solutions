import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import {
  CreateRoleDto,
  RoleResponseDto,
  RoleWithPermissionsDto,
  UpdateRoleDto,
} from './dto/role.dto';
import { RoleException } from 'src/common/exceptions/role-exception';
import { Permission } from '../permissions/entities/permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async getAllRoles(): Promise<RoleResponseDto[]> {
    const roles = await this.roleRepository.find({
      order: { rolename: 'ASC' },
    });

    if (!roles || roles.length === 0) {
      throw new RoleException('No roles found', HttpStatus.NOT_FOUND);
    }

    return roles;
  }

  async getAllRolesActive(): Promise<RoleResponseDto[]> {
    const roles = await this.roleRepository.find({
      where: { isActive: true },
      order: { rolename: 'ASC' },
    });

    if (!roles || roles.length === 0) {
      throw new RoleException('No active roles found', HttpStatus.NOT_FOUND);
    }

    return roles;
  }

  async getRoleWithPermissions(
    roleuuid: string,
  ): Promise<RoleWithPermissionsDto> {
    const role = await this.roleRepository.findOne({
      where: { roleuuid: roleuuid },
      relations: ['permissions'],
    });

    if (!role) {
      throw new RoleException(
        `Role with ID ${roleuuid} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return role;
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
    const existName = await this.findByName(role.rolename);
    if (existName) {
      throw new RoleException(
        `Role with name ${role.rolename} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const existCode = await this.findByCode(role.rolecode);
    if (existCode) {
      throw new RoleException(
        `Role with code ${role.rolecode} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newRole = this.roleRepository.create(role);
    return await this.roleRepository.save(newRole);
  }

  async updateRole(
    roleuuid: string,
    role: Partial<UpdateRoleDto>,
  ): Promise<RoleResponseDto> {
    const existingRole = await this.roleRepository.findOneBy({
      roleuuid: roleuuid,
    });

    if (!existingRole) {
      throw new RoleException(
        `Role with uuid ${roleuuid} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedRole = Object.assign(existingRole, role);
    return await this.roleRepository.save(updatedRole);
  }

  async updateRoleStatus(roleuuid: string): Promise<RoleResponseDto> {
    const existingRole = await this.roleRepository.findOneBy({
      roleuuid: roleuuid,
    });

    if (!existingRole) {
      throw new RoleException(
        `Role with uuid ${roleuuid} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    existingRole.isActive = !existingRole.isActive;
    return await this.roleRepository.save(existingRole);
  }

  async deleteRole(roleuuid: string): Promise<void> {
    const existingRole = await this.roleRepository.findOneBy({
      roleuuid: roleuuid,
    });

    if (!existingRole) {
      throw new RoleException(
        `Role with uuid ${roleuuid} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.roleRepository.remove(existingRole);
  }

  async assignPermissionsToRole(
    roleuuid: string,
    permissionuuids: string[],
  ): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { roleuuid: roleuuid },
      relations: ['permissions'],
    });

    if (!role) {
      throw new RoleException(
        `Role with uuid ${roleuuid} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const permissions = await this.roleRepository.manager.findByIds(
      Permission,
      permissionuuids,
    );

    if (permissions.length !== permissionuuids.length) {
      throw new RoleException(
        'Some permissions not found',
        HttpStatus.BAD_REQUEST,
      );
    }

    role.permissions = permissions;
    return await this.roleRepository.save(role);
  }
}
