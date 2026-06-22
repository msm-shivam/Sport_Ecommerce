import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUser } from './entities/admin-user.entity';
import { AdminSession } from './entities/admin-session.entity';
import { Role } from '../rbac/entities/role.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminProfileController } from './admin-profile.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AdminUser, AdminSession, Role])],
  providers: [AdminService],
  controllers: [AdminController, AdminProfileController],
  exports: [AdminService],
})
export class AdminModule {}
