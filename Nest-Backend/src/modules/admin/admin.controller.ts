import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { AdminJwtGuard } from '../../common/guards/admin-jwt.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  DefaultPermissions,
  DefaultRoles,
} from '../../common/constants/roles.constants';
import type { AdminJwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('Admin — User Management')
@ApiBearerAuth('JWT')
@UseGuards(AdminJwtGuard, RolesGuard, PermissionsGuard)
@Controller('admin/users')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get own admin profile with roles and permissions' })
  @ApiResponse({ status: 200, description: 'Profile returned.' })
  async getProfile(@CurrentUser() user: AdminJwtPayload) {
    return this.adminService.getProfile(user.sub);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(DefaultRoles.SUPER_ADMIN)
  @Permissions(DefaultPermissions.ADMIN_CREATE)
  @ApiOperation({ summary: 'Create a new admin user (Super Admin only)' })
  @ApiResponse({ status: 201, description: 'Admin user created.' })
  @ApiResponse({ status: 400, description: 'Email already taken.' })
  async create(@Body() dto: CreateAdminDto) {
    return this.adminService.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Permissions(DefaultPermissions.ADMIN_UPDATE, DefaultPermissions.SUPPORT_ASSIGN)
  @ApiOperation({ summary: 'List all admin users' })
  @ApiResponse({ status: 200, description: 'Admin users returned.' })
  async findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(DefaultRoles.SUPER_ADMIN)
  @Permissions(DefaultPermissions.ADMIN_UPDATE)
  @ApiOperation({ summary: 'Get admin user by ID' })
  @ApiResponse({ status: 200, description: 'Admin user returned.' })
  @ApiResponse({ status: 404, description: 'Admin user not found.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.findById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(DefaultRoles.SUPER_ADMIN)
  @Permissions(DefaultPermissions.ADMIN_UPDATE)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          cb(null, `admin-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Admin name' },
        email: { type: 'string', description: 'Admin email' },
        isActive: { type: 'boolean', description: 'Active status' },
        avatar: {
          type: 'string',
          format: 'binary',
          description: 'Avatar image (max 2MB)',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Update an admin user' })
  @ApiResponse({ status: 200, description: 'Admin user updated.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAdminDto,
    @CurrentUser() admin: AdminJwtPayload,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    if (avatar) {
      dto.avatar = `/uploads/avatars/${avatar.filename}`;
    }
    return this.adminService.update(id, dto, admin.sub);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(DefaultRoles.SUPER_ADMIN)
  @Permissions(DefaultPermissions.ADMIN_DELETE)
  @ApiOperation({ summary: 'Delete an admin user' })
  @ApiResponse({ status: 200, description: 'Admin user deleted.' })
  @ApiResponse({ status: 400, description: 'Cannot delete a super admin.' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() admin: AdminJwtPayload,
  ) {
    return this.adminService.remove(id, admin.sub);
  }

  @Post(':id/roles')
  @HttpCode(HttpStatus.OK)
  @Roles(DefaultRoles.SUPER_ADMIN)
  @Permissions(DefaultPermissions.ROLES_MANAGE)
  @ApiOperation({ summary: 'Assign roles to an admin user' })
  @ApiResponse({ status: 200, description: 'Roles assigned.' })
  @ApiResponse({ status: 400, description: 'Cannot modify roles of a super admin.' })
  async assignRoles(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignRolesDto,
  ) {
    return this.adminService.assignRoles(id, dto);
  }

  @Delete(':id/roles')
  @HttpCode(HttpStatus.OK)
  @Roles(DefaultRoles.SUPER_ADMIN)
  @Permissions(DefaultPermissions.ROLES_MANAGE)
  @ApiOperation({ summary: 'Revoke roles from an admin user' })
  @ApiResponse({ status: 200, description: 'Roles revoked.' })
  @ApiResponse({ status: 400, description: 'Cannot modify roles of a super admin.' })
  async revokeRoles(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignRolesDto,
  ) {
    return this.adminService.revokeRoles(id, dto);
  }
}
