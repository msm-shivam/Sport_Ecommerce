import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserSession } from './entities/user-session.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AdminCustomersController } from './admin-customers.controller';
import { SecurityComplianceModule } from '../security-compliance/security-compliance.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserSession]), SecurityComplianceModule],
  providers: [UsersService],
  controllers: [UsersController, AdminCustomersController],
  exports: [UsersService],
})
export class UsersModule {}
