import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserAvatarColumn1791865863921 implements MigrationInterface {
  name = 'AddUserAvatarColumn1791865863921';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN "avatar" character varying(500) DEFAULT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar"`);
  }
}
