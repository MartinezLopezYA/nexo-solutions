import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1754881563022 implements MigrationInterface {
    name = 'InitialMigration1754881563022'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "identification_types" DROP CONSTRAINT "PK_f412fc7ff27b1afce68d741e0d9"`);
        await queryRunner.query(`ALTER TABLE "identification_types" DROP COLUMN "identificationTypeUuid"`);
        await queryRunner.query(`ALTER TABLE "identification_types" DROP CONSTRAINT "UQ_b7a9f3ce3ef60094e6be1177d7b"`);
        await queryRunner.query(`ALTER TABLE "identification_types" DROP COLUMN "identificationTypeName"`);
        await queryRunner.query(`ALTER TABLE "identification_types" DROP CONSTRAINT "UQ_0783b58a5bd454c2830216934c6"`);
        await queryRunner.query(`ALTER TABLE "identification_types" DROP COLUMN "identificationTypeCode"`);
        await queryRunner.query(`ALTER TABLE "identification_types" ADD "identificationtypeuuid" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "identification_types" ADD CONSTRAINT "PK_7d2ddd29a9c51b9b5f500f44407" PRIMARY KEY ("identificationtypeuuid")`);
        await queryRunner.query(`ALTER TABLE "identification_types" ADD "identificationtypename" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "identification_types" ADD CONSTRAINT "UQ_5bbbfabc01cf3cceda1349a978e" UNIQUE ("identificationtypename")`);
        await queryRunner.query(`ALTER TABLE "identification_types" ADD "identificationtypecode" character varying(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "identification_types" ADD CONSTRAINT "UQ_13060d0fb5b76a1257764ab5f5e" UNIQUE ("identificationtypecode")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "identification_types" DROP CONSTRAINT "UQ_13060d0fb5b76a1257764ab5f5e"`);
        await queryRunner.query(`ALTER TABLE "identification_types" DROP COLUMN "identificationtypecode"`);
        await queryRunner.query(`ALTER TABLE "identification_types" DROP CONSTRAINT "UQ_5bbbfabc01cf3cceda1349a978e"`);
        await queryRunner.query(`ALTER TABLE "identification_types" DROP COLUMN "identificationtypename"`);
        await queryRunner.query(`ALTER TABLE "identification_types" DROP CONSTRAINT "PK_7d2ddd29a9c51b9b5f500f44407"`);
        await queryRunner.query(`ALTER TABLE "identification_types" DROP COLUMN "identificationtypeuuid"`);
        await queryRunner.query(`ALTER TABLE "identification_types" ADD "identificationTypeCode" character varying(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "identification_types" ADD CONSTRAINT "UQ_0783b58a5bd454c2830216934c6" UNIQUE ("identificationTypeCode")`);
        await queryRunner.query(`ALTER TABLE "identification_types" ADD "identificationTypeName" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "identification_types" ADD CONSTRAINT "UQ_b7a9f3ce3ef60094e6be1177d7b" UNIQUE ("identificationTypeName")`);
        await queryRunner.query(`ALTER TABLE "identification_types" ADD "identificationTypeUuid" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "identification_types" ADD CONSTRAINT "PK_f412fc7ff27b1afce68d741e0d9" PRIMARY KEY ("identificationTypeUuid")`);
    }

}
