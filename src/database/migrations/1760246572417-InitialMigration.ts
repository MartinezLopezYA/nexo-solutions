import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1760246572417 implements MigrationInterface {
    name = 'InitialMigration1760246572417'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" ADD "isDeleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "roles" ADD "isDeleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "UQ_fbc7a4e3efaec4946d6d1d3fe4d"`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "created_at" SET DEFAULT '"2025-10-12T05:22:54.470Z"'`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "updated_at" SET DEFAULT '"2025-10-12T05:22:54.470Z"'`);
        await queryRunner.query(`ALTER TABLE "workers" ADD CONSTRAINT "UQ_b4d1dca452fcd2bce4e0320e2dd" UNIQUE ("workerusername")`);
        await queryRunner.query(`ALTER TABLE "workers" ADD CONSTRAINT "UQ_c6fec67bee2ba2119c0c46e9612" UNIQUE ("workeremail")`);
        await queryRunner.query(`ALTER TABLE "workers" ADD CONSTRAINT "UQ_ceb0bde43974d3f4ea121e2e3c4" UNIQUE ("workerphone")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_14b86f94b5bdf5d33a54c1a8d20" UNIQUE ("useremail")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_1f719c172ef8cd303311cd8ef4b" UNIQUE ("userphone")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_1f719c172ef8cd303311cd8ef4b"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_14b86f94b5bdf5d33a54c1a8d20"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710"`);
        await queryRunner.query(`ALTER TABLE "workers" DROP CONSTRAINT "UQ_ceb0bde43974d3f4ea121e2e3c4"`);
        await queryRunner.query(`ALTER TABLE "workers" DROP CONSTRAINT "UQ_c6fec67bee2ba2119c0c46e9612"`);
        await queryRunner.query(`ALTER TABLE "workers" DROP CONSTRAINT "UQ_b4d1dca452fcd2bce4e0320e2dd"`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "updated_at" SET DEFAULT '2025-10-10 05:06:33.559'`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "created_at" SET DEFAULT '2025-10-10 05:06:33.559'`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "UQ_fbc7a4e3efaec4946d6d1d3fe4d" UNIQUE ("clientverificationnumber")`);
        await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "isDeleted"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "isDeleted"`);
    }

}
