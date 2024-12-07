import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1733386120063 implements MigrationInterface {
  name = 'Migrations1733386120063';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bid" ADD "placedAt" TIMESTAMP`);

    await queryRunner.query(`UPDATE "bid" SET "placedAt" = NOW()`);

    await queryRunner.query(
      `ALTER TABLE "bid" ALTER COLUMN "placedAt" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bid" DROP COLUMN "placedAt"`);
  }
}
