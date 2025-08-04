import { Controller, Get } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PermissionResponseDto } from './dto/permission.dto';

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
}
