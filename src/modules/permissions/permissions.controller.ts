import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreatePermissionDto,
  PermissionResponseDto,
  UpdatePermissionDto,
} from './dto/permission.dto';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private permissionsService: PermissionsService) {}

  @Get('v1')
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
  @ApiOperation({
    summary: 'Delete a permission',
    description: 'This endpoint allows you to delete a permission.',
  })
  @ApiResponse({ status: 204, description: 'Permission deleted successfully' })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  deletePermission(
    @Param('permissionuuid') permissionuuid: string,
  ): Promise<void> {
    return this.permissionsService.deletePermission(permissionuuid);
  }
}
