import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdminAvatarColumn1749203100000 implements MigrationInterface {
  name = 'AddAdminAvatarColumn1749203100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "admin_users" ADD COLUMN "avatar" character varying(500) DEFAULT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "admin_users" DROP COLUMN "avatar"`);
  }
}
