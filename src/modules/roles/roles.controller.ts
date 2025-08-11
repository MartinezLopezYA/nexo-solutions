import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto, RoleDeletedDto, RoleResponseDto, RoleWithPermissionsDto, UpdateRoleDto } from './dto/role.dto';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get('v1')
  @ApiOperation({
    summary: 'Get all roles',
    description: 'This endpoint returns a list of all roles.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of roles',
    type: [RoleResponseDto],
  })
  @ApiResponse({ status: 404, description: 'No roles found' })
  async getAllRoles(): Promise<RoleResponseDto[]> {
    return this.rolesService.getAllRoles();
  }

  @Get('v1/active')
  @ApiOperation({
    summary: 'Get all active roles',
    description: 'This endpoint returns a list of all active roles.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of active roles',
    type: [RoleResponseDto],
  })
  @ApiResponse({ status: 404, description: 'No active roles found' })
  async getAllActiveRoles(): Promise<RoleResponseDto[]> {
    return this.rolesService.getAllRolesActive();
  }

  @Get('v1/:roleuuid/permissions')
  @ApiOperation({
    summary: 'Get role with permissions',
    description: 'This endpoint returns a role with its permissions.',
  })
  @ApiResponse({
    status: 200,
    description: 'Role with permissions',
    type: RoleWithPermissionsDto,
  })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async getRoleWithPermissions(
    @Param('roleuuid') roleuuid: string,
  ): Promise<RoleWithPermissionsDto> {
    return this.rolesService.getRoleWithPermissions(roleuuid);
  }

  @Post('v1')
  @ApiOperation({
    summary: 'Add a new role',
    description: 'This endpoint allows you to add a new role.',
  })
  @ApiResponse({
    status: 201,
    description: 'Role created successfully',
    type: RoleResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async addRole(@Body() role: CreateRoleDto): Promise<RoleResponseDto> {
    return this.rolesService.addRole(role);
  }

  @Patch('v1/:roleuuid')
  @ApiOperation({
    summary: 'Update an existing role',
    description: 'This endpoint allows you to update an existing role.',
  })
  @ApiResponse({
    status: 200,
    description: 'Role updated successfully',
    type: RoleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async updateRole(
    @Param('roleuuid') roleuuid: string,
    @Body() role: Partial<UpdateRoleDto>,
  ): Promise<RoleResponseDto> {
    return this.rolesService.updateRole(roleuuid, role);
  }

  @Patch('v1/:roleuuid/status')
  @ApiOperation({
    summary: 'Update the status of a role',
    description: 'This endpoint allows you to update the status of a role.',
  })
  @ApiResponse({
    status: 200,
    description: 'Role status updated successfully',
    type: RoleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async updateRoleStatus(
    @Param('roleuuid') roleuuid: string,
  ): Promise<RoleResponseDto> {
    return this.rolesService.updateRoleStatus(roleuuid);
  }

  @Delete('v1/:roleuuid')
  @ApiOperation({
    summary: 'Delete a role',
    description: 'This endpoint allows you to delete a role.',
  })
  @ApiResponse({ status: 204, description: 'Role deleted successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async deleteRole(@Param('roleuuid') roleuuid: string): Promise<RoleDeletedDto> {
    return this.rolesService.deleteRole(roleuuid);
  }

  @Post('v1/:roleuuid/permissions')
  @ApiOperation({
    summary: 'Assign permissions to a role',
    description: 'This endpoint allows you to assign permissions to a role.',
  })
  @ApiResponse({
    status: 200,
    description: 'Permissions assigned successfully',
    type: RoleWithPermissionsDto,
  })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async assignPermissionsToRole(
    @Param('roleuuid') roleuuid: string,
    @Body() permissionuuids: string[],
  ): Promise<RoleWithPermissionsDto> {
    return this.rolesService.assignPermissionsToRole(roleuuid, permissionuuids);
  }
}
