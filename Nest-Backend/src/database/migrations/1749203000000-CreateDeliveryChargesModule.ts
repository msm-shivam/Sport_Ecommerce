import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDeliveryChargesModule1749203000000 implements MigrationInterface {
  name = 'CreateDeliveryChargesModule1749203000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create delivery_charge_type enum
    await queryRunner.query(`CREATE TYPE "public"."delivery_charges_charge_type_enum" AS ENUM('FIXED_DELIVERY', 'FREE_SHIPPING_THRESHOLD', 'COD_CHARGE', 'HANDLING_CHARGE')`);

    // Create delivery_charges table
    await queryRunner.query(`
      CREATE TABLE "delivery_charges" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "name" character varying(150) NOT NULL,
        "description" text,
        "charge_amount" numeric(12,2) NOT NULL DEFAULT '0',
        "charge_type" "public"."delivery_charges_charge_type_enum" NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_by" uuid,
        "updated_by" uuid,
        CONSTRAINT "PK_delivery_charges" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_delivery_charges_charge_type" ON "delivery_charges" ("charge_type")`);
    await queryRunner.query(`CREATE INDEX "IDX_delivery_charges_is_active" ON "delivery_charges" ("is_active")`);

    // Create delivery_charge_audits table
    await queryRunner.query(`
      CREATE TABLE "delivery_charge_audits" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "delivery_charge_id" uuid NOT NULL,
        "old_value" jsonb,
        "new_value" jsonb,
        "changed_by" uuid,
        "changed_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_delivery_charge_audits" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`ALTER TABLE "delivery_charge_audits" ADD CONSTRAINT "FK_delivery_charge_audits_charge" FOREIGN KEY ("delivery_charge_id") REFERENCES "delivery_charges"("id") ON DELETE CASCADE`);

    // Add charge columns to orders table
    await queryRunner.query(`ALTER TABLE "orders" ADD "delivery_charge" numeric(12,2) NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "orders" ADD "cod_charge" numeric(12,2) NOT NULL DEFAULT '0'`);
    await queryRunner.query(`ALTER TABLE "orders" ADD "handling_charge" numeric(12,2) NOT NULL DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove charge columns from orders
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "handling_charge"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "cod_charge"`);
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "delivery_charge"`);

    // Drop delivery_charge_audits
    await queryRunner.query(`ALTER TABLE "delivery_charge_audits" DROP CONSTRAINT "FK_delivery_charge_audits_charge"`);
    await queryRunner.query(`DROP TABLE "delivery_charge_audits"`);

    // Drop delivery_charges
    await queryRunner.query(`DROP INDEX "IDX_delivery_charges_is_active"`);
    await queryRunner.query(`DROP INDEX "IDX_delivery_charges_charge_type"`);
    await queryRunner.query(`DROP TABLE "delivery_charges"`);

    // Drop enum
    await queryRunner.query(`DROP TYPE "public"."delivery_charges_charge_type_enum"`);
  }
}
