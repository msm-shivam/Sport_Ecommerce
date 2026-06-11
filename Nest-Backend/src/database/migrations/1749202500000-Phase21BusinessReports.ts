import { MigrationInterface, QueryRunner } from 'typeorm';

export class Phase21BusinessReports1749202500000 implements MigrationInterface {
  name = 'Phase21BusinessReports1749202500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."dashboard_type_enum" AS ENUM (
        'MAIN', 'FINANCE', 'INVENTORY', 'SUPPORT', 'MARKETING'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."report_type_enum" AS ENUM (
        'SALES', 'REVENUE', 'PRODUCTS', 'CATEGORIES', 'BRANDS',
        'CUSTOMERS', 'INVENTORY', 'RETURNS', 'SUPPORT', 'MARKETING'
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "dashboard_snapshots" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "snapshot_date" TIMESTAMP WITH TIME ZONE NOT NULL,
        "dashboard_type" "public"."dashboard_type_enum" NOT NULL,
        "metrics_json" jsonb NOT NULL,
        CONSTRAINT "PK_dashboard_snapshots" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_dashboard_snapshots_snapshot_date"
      ON "dashboard_snapshots" ("snapshot_date")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_dashboard_snapshots_dashboard_type"
      ON "dashboard_snapshots" ("dashboard_type")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_dashboard_snapshots_created_at"
      ON "dashboard_snapshots" ("created_at")
    `);

    await queryRunner.query(`
      CREATE TABLE "report_execution_logs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "report_name" character varying(255) NOT NULL,
        "executed_by" uuid,
        "execution_time_ms" integer NOT NULL DEFAULT 0,
        "generated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        CONSTRAINT "PK_report_execution_logs" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_report_execution_logs_report_name"
      ON "report_execution_logs" ("report_name")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_report_execution_logs_generated_at"
      ON "report_execution_logs" ("generated_at")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_report_execution_logs_created_at"
      ON "report_execution_logs" ("created_at")
    `);

    await queryRunner.query(`
      CREATE TABLE "saved_reports" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "name" character varying(255) NOT NULL,
        "report_type" "public"."report_type_enum" NOT NULL,
        "filters_json" jsonb NOT NULL,
        "created_by" uuid,
        CONSTRAINT "PK_saved_reports" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_saved_reports_name"
      ON "saved_reports" ("name")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_saved_reports_report_type"
      ON "saved_reports" ("report_type")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_saved_reports_created_by"
      ON "saved_reports" ("created_by")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_saved_reports_created_at"
      ON "saved_reports" ("created_at")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "saved_reports"`);
    await queryRunner.query(`DROP TABLE "report_execution_logs"`);
    await queryRunner.query(`DROP TABLE "dashboard_snapshots"`);
    await queryRunner.query(`DROP TYPE "public"."report_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."dashboard_type_enum"`);
  }
}
