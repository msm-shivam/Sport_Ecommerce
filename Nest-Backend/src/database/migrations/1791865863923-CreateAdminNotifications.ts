import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdminNotifications1791865863923
  implements MigrationInterface
{
  name = 'CreateAdminNotifications1791865863923';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."admin_notifications_type_enum" AS ENUM ('order', 'inventory', 'customer', 'system_alert')
    `);
    await queryRunner.query(`
      CREATE TABLE "admin_notifications" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "type" "public"."admin_notifications_type_enum" NOT NULL,
        "title" character varying(255) NOT NULL,
        "message" text NOT NULL,
        "data" jsonb,
        "is_read" boolean NOT NULL DEFAULT false,
        "read_at" timestamptz,
        CONSTRAINT "PK_admin_notifications_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_admin_notifications_type" ON "admin_notifications" ("type")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_admin_notifications_is_read" ON "admin_notifications" ("is_read")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_admin_notifications_created_at" ON "admin_notifications" ("created_at")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "admin_notifications"`);
    await queryRunner.query(`DROP TYPE "public"."admin_notifications_type_enum"`);
  }
}
