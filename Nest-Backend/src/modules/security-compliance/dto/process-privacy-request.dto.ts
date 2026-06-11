import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PrivacyRequestStatus } from '../enums/privacy-request-status.enum';

export class ProcessPrivacyRequestDto {
  @ApiPropertyOptional({ enum: PrivacyRequestStatus })
  @IsOptional()
  @IsEnum(PrivacyRequestStatus)
  status?: PrivacyRequestStatus;
}
