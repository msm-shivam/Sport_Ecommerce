import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSeverityToAuditLogs1781865863915 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "audit_logs" ADD "severity" varchar(50) NOT NULL DEFAULT 'info'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "severity"`);
  }
}
