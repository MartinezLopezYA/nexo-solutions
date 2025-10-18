import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1760718244636 implements MigrationInterface {
    name = 'InitialMigration1760718244636'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT '"2025-10-17T16:24:05.695Z"'`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT '"2025-10-17T16:24:05.695Z"'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "refreshToken" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refreshToken"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT '2025-10-12 05:22:54.47'`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "created_at" TIMESTAMP NOT NULL DEFAULT '2025-10-12 05:22:54.47'`);
    }

}
