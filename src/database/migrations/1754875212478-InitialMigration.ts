import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1754875212478 implements MigrationInterface {
    name = 'InitialMigration1754875212478'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cities" ("cityuuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "cityname" character varying(100) NOT NULL, "citycode" character varying NOT NULL, "isActive" boolean DEFAULT true, "createdAt" TIMESTAMP DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "departmentDepartmentuuid" uuid NOT NULL, CONSTRAINT "PK_1dd60dabe6adbcfc7d97fcc7b7f" PRIMARY KEY ("cityuuid"))`);
        await queryRunner.query(`CREATE TABLE "departments" ("departmentuuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "departmentname" character varying(100) NOT NULL, "departmentcode" character varying(3) NOT NULL, "isActive" boolean DEFAULT true, "createdAt" TIMESTAMP DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "countryCountryuuid" uuid NOT NULL, CONSTRAINT "PK_2f457a91f3f405316da4a6566a3" PRIMARY KEY ("departmentuuid"))`);
        await queryRunner.query(`CREATE TABLE "countries" ("countryuuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "countryname" character varying(100) NOT NULL, "countryisocode" character varying(3) NOT NULL, "countrynumericcode" character varying(4) NOT NULL, "isActive" boolean DEFAULT true, "createdAt" TIMESTAMP DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_62c0788820e2cbca420bb176440" PRIMARY KEY ("countryuuid"))`);
        await queryRunner.query(`CREATE TABLE "identification_types" ("identificationTypeUuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "identificationTypeName" character varying(100) NOT NULL, "identificationTypeCode" character varying(10) NOT NULL, "isActive" boolean DEFAULT true, "createdAt" TIMESTAMP DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), CONSTRAINT "UQ_b7a9f3ce3ef60094e6be1177d7b" UNIQUE ("identificationTypeName"), CONSTRAINT "UQ_0783b58a5bd454c2830216934c6" UNIQUE ("identificationTypeCode"), CONSTRAINT "PK_f412fc7ff27b1afce68d741e0d9" PRIMARY KEY ("identificationTypeUuid"))`);
        await queryRunner.query(`ALTER TABLE "cities" ADD CONSTRAINT "FK_7e88f5df563daa567b6f2bca2df" FOREIGN KEY ("departmentDepartmentuuid") REFERENCES "departments"("departmentuuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "departments" ADD CONSTRAINT "FK_bc767d1e57dcd84a926e25c96f4" FOREIGN KEY ("countryCountryuuid") REFERENCES "countries"("countryuuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "departments" DROP CONSTRAINT "FK_bc767d1e57dcd84a926e25c96f4"`);
        await queryRunner.query(`ALTER TABLE "cities" DROP CONSTRAINT "FK_7e88f5df563daa567b6f2bca2df"`);
        await queryRunner.query(`DROP TABLE "identification_types"`);
        await queryRunner.query(`DROP TABLE "countries"`);
        await queryRunner.query(`DROP TABLE "departments"`);
        await queryRunner.query(`DROP TABLE "cities"`);
    }

}
