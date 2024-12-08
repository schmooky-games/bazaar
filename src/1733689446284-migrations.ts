import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1733689446284 implements MigrationInterface {
    name = 'Migrations1733689446284'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" character varying(32) NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auction" ("id" character varying(32) NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "startingPrice" integer NOT NULL, "currentPrice" integer NOT NULL, "endDate" TIMESTAMP NOT NULL, "sellerId" character varying(32), CONSTRAINT "PK_9dc876c629273e71646cf6dfa67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bid" ("id" character varying(32) NOT NULL, "amount" integer NOT NULL, "placedAt" TIMESTAMP NOT NULL, "auctionId" character varying(32), "bidderId" character varying(32), CONSTRAINT "PK_ed405dda320051aca2dcb1a50bb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "auction" ADD CONSTRAINT "FK_a8985d3662c274c57c2d0118538" FOREIGN KEY ("sellerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bid" ADD CONSTRAINT "FK_2e00b0f268f93abcf693bb682c6" FOREIGN KEY ("auctionId") REFERENCES "auction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bid" ADD CONSTRAINT "FK_1345c9f3ee0789dcff101f6c79b" FOREIGN KEY ("bidderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bid" DROP CONSTRAINT "FK_1345c9f3ee0789dcff101f6c79b"`);
        await queryRunner.query(`ALTER TABLE "bid" DROP CONSTRAINT "FK_2e00b0f268f93abcf693bb682c6"`);
        await queryRunner.query(`ALTER TABLE "auction" DROP CONSTRAINT "FK_a8985d3662c274c57c2d0118538"`);
        await queryRunner.query(`DROP TABLE "bid"`);
        await queryRunner.query(`DROP TABLE "auction"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
