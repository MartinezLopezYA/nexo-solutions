import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1758926985647 implements MigrationInterface {
    name = 'InitialMigration1758926985647'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "useridentificationnumber"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "useridentificationnumber" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "useridentificationnumber"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "useridentificationnumber" character varying(10) NOT NULL`);
    }

}
