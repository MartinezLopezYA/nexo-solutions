import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePermissionDto, PermissionDeletedDto, PermissionResponseDto, UpdatePermissionDto } from './dto/permission.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@ApiTags('Permissions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('permissions')
export class PermissionsController {
  constructor(private permissionsService: PermissionsService) { }

  @Get('v1')
  @Permissions('LIST_ALL_PERMISSIONS')
  @ApiOperation({
    summary: 'Get all permissions',
    description: 'This endpoint returns a list of all permissions.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of permissions',
    type: [PermissionResponseDto],
  })
  @ApiResponse({ status: 404, description: 'No permissions found' })
  getAllPermissions(): Promise<PermissionResponseDto[]> {
    return this.permissionsService.getAllPermissions();
  }

  @Get('v1/active')
  @Permissions('LIST_ACTIVE_PERMISSIONS')
  @ApiOperation({
    summary: 'Get all active permissions',
    description: 'This endpoint returns a list of all active permissions.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of active permissions',
    type: [PermissionResponseDto],
  })
  @ApiResponse({ status: 404, description: 'No active permissions found' })
  getAllActivePermissions(): Promise<PermissionResponseDto[]> {
    return this.permissionsService.getAllPermissionsActive();
  }

  @Post('v1/')
  @Permissions('CREATE_PERMISSION')
  @ApiOperation({
    summary: 'Add a new permission',
    description: 'This endpoint allows you to add a new permission.',
  })
  @ApiResponse({
    status: 201,
    description: 'Permission created successfully',
    type: PermissionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  addPermission(
    @Body() permission: CreatePermissionDto,
  ): Promise<PermissionResponseDto> {
    return this.permissionsService.addPermission(permission);
  }

  @Patch('v1/:permissionuuid')
  @Permissions('UPDATE_PERMISSION')
  @ApiOperation({
    summary: 'Update an existing permission',
    description: 'This endpoint allows you to update an existing permission.',
  })
  @ApiResponse({
    status: 200,
    description: 'Permission updated successfully',
    type: PermissionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  updatePermission(
    @Param('permissionuuid') permissionuuid: string,
    @Body() permission: UpdatePermissionDto,
  ): Promise<PermissionResponseDto> {
    return this.permissionsService.updatePermission(permissionuuid, permission);
  }

  @Patch('v1/:permissionuuid/status')
  @Permissions('DEACTIVATE_PERMISSION', 'ACTIVATE_PERMISSION')
  @ApiOperation({
    summary: 'Update the status of a permission',
    description:
      'This endpoint allows you to update the status of a permission.',
  })
  @ApiResponse({
    status: 200,
    description: 'Permission status updated successfully',
    type: PermissionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  updatePermissionStatus(
    @Param('permissionuuid') permissionuuid: string,
  ): Promise<PermissionResponseDto> {
    return this.permissionsService.updatePermissionStatus(permissionuuid);
  }

  @Delete('v1/:permissionuuid')
  @Permissions('DELETE_PERMISSION')
  @ApiOperation({
    summary: 'Delete a permission',
    description: 'This endpoint allows you to delete a permission.',
  })
  @ApiResponse({ status: 204, description: 'Permission deleted successfully' })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  deletePermission(
    @Param('permissionuuid') permissionuuid: string,
  ): Promise<PermissionDeletedDto> {
    return this.permissionsService.deletePermission(permissionuuid);
  }
}
