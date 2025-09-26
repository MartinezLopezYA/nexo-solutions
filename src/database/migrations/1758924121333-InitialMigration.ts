import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1758924121333 implements MigrationInterface {
    name = 'InitialMigration1758924121333'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "useridentificationnumber" character varying(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "identificationtypeuuid" uuid`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "userphone" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_da1d3f29fa23f2546c613b66f30" FOREIGN KEY ("identificationtypeuuid") REFERENCES "identification_types"("identificationtypeuuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_da1d3f29fa23f2546c613b66f30"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "userphone" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "identificationtypeuuid"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "useridentificationnumber"`);
    }

}
