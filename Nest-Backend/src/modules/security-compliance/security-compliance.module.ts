import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { LoginActivity } from './entities/login-activity.entity';
import { SecuritySession } from './entities/security-session.entity';
import { SecurityEvent } from './entities/security-event.entity';
import { PrivacyRequest } from './entities/privacy-request.entity';
import { ConsentRecord } from './entities/consent-record.entity';
import { AuditLogService } from './services/audit-log.service';
import { SecurityService } from './services/security.service';
import { SessionService } from './services/session.service';
import { PrivacyRequestService } from './services/privacy-request.service';
import { ConsentService } from './services/consent.service';
import { AdminAuditLogController } from './controllers/admin-audit-log.controller';
import { AdminSecurityController } from './controllers/admin-security.controller';
import { AdminPrivacyController } from './controllers/admin-privacy.controller';
import { CustomerPrivacyController } from './controllers/customer-privacy.controller';
import { AdminUser } from '../admin/entities/admin-user.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AuditLog,
      LoginActivity,
      SecuritySession,
      SecurityEvent,
      PrivacyRequest,
      ConsentRecord,
      AdminUser,
      User,
    ]),
  ],
  controllers: [
    AdminAuditLogController,
    AdminSecurityController,
    AdminPrivacyController,
    CustomerPrivacyController,
  ],
  providers: [
    AuditLogService,
    SecurityService,
    SessionService,
    PrivacyRequestService,
    ConsentService,
  ],
  exports: [AuditLogService, SecurityService, SessionService],
})
export class SecurityComplianceModule {}
