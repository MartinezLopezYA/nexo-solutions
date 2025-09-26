import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1758923567325 implements MigrationInterface {
    name = 'InitialMigration1758923567325'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "usercountrycode"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "state"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "cityuuid" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_400f0038f0014490d1f1242a34f" FOREIGN KEY ("cityuuid") REFERENCES "cities"("cityuuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_400f0038f0014490d1f1242a34f"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "cityuuid"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "country" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "state" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "city" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "usercountrycode" character varying(3)`);
    }

}
