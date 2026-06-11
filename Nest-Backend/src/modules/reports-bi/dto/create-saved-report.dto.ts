import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsObject, IsString } from 'class-validator';
import { ReportType } from '../enums/report-type.enum';

export class CreateSavedReportDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ enum: ReportType })
  @IsEnum(ReportType)
  reportType: ReportType;

  @ApiProperty()
  @IsObject()
  filtersJson: Record<string, unknown>;
}
