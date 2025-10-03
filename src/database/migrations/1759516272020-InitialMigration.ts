import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1759516272020 implements MigrationInterface {
    name = 'InitialMigration1759516272020'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "professions-category" ("professioncategoryuuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "professioncategoryname" character varying(50) NOT NULL, "professioncategoryabbreviation" character varying(10), "professioncategorycode" character varying(10), "isActive" boolean NOT NULL DEFAULT true, "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6cafb82438bd1994ecaba89c136" UNIQUE ("professioncategoryname"), CONSTRAINT "UQ_200e8fd554df5799d67b0c713cb" UNIQUE ("professioncategoryabbreviation"), CONSTRAINT "UQ_c1d668d265fd9887efd0b9800d7" UNIQUE ("professioncategorycode"), CONSTRAINT "PK_afaf09eac6c1fdb645eb4faff50" PRIMARY KEY ("professioncategoryuuid"))`);
        await queryRunner.query(`CREATE TABLE "professions" ("professionuuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "professionabbreviation" character varying(10), "professionname" character varying(50) NOT NULL, "professiondescription" character varying(100), "professioncode" character varying(10), "isActive" boolean NOT NULL DEFAULT true, "isDeleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "professioncategoryProfessioncategoryuuid" uuid, CONSTRAINT "UQ_faca3d29c7a7a94c38cf414660b" UNIQUE ("professionabbreviation"), CONSTRAINT "UQ_d8cc86c26af575a2c50eeb18d00" UNIQUE ("professionname"), CONSTRAINT "UQ_61c0b62241d38b03ea2e6dc1967" UNIQUE ("professioncode"), CONSTRAINT "PK_67234172b43e9901d8573dd5dfa" PRIMARY KEY ("professionuuid"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "userprofession"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "professionuuid" uuid`);
        await queryRunner.query(`CREATE TYPE "public"."clients_clienttype_enum" AS ENUM('NATURAL', 'JURIDICO')`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "clienttype" "public"."clients_clienttype_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "clientidentificationnumber" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "UQ_d80a45e61ad02b58c36293b4424" UNIQUE ("clientidentificationnumber")`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "clientverificationnumber" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "UQ_fbc7a4e3efaec4946d6d1d3fe4d" UNIQUE ("clientverificationnumber")`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "identificationtypeuuid" uuid`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "cityuuid" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_5c7fdc6dfe1b55d00ec55e48000" UNIQUE ("useridentificationnumber")`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "clientcode" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "clientownerphone" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "clientowneremail" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "created_at" SET DEFAULT '"2025-10-03T18:31:12.980Z"'`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "updated_at" SET DEFAULT '"2025-10-03T18:31:12.980Z"'`);
        await queryRunner.query(`ALTER TABLE "professions" ADD CONSTRAINT "FK_6298e0dcd8dd3ef35ae63294ec5" FOREIGN KEY ("professioncategoryProfessioncategoryuuid") REFERENCES "professions-category"("professioncategoryuuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_b59506e7c24bbd415a651c242b8" FOREIGN KEY ("professionuuid") REFERENCES "professions"("professionuuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_e6dac83935ce654bea9d607eace" FOREIGN KEY ("identificationtypeuuid") REFERENCES "identification_types"("identificationtypeuuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_dc636f42965f1c05305567118b7" FOREIGN KEY ("cityuuid") REFERENCES "cities"("cityuuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "FK_dc636f42965f1c05305567118b7"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "FK_e6dac83935ce654bea9d607eace"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_b59506e7c24bbd415a651c242b8"`);
        await queryRunner.query(`ALTER TABLE "professions" DROP CONSTRAINT "FK_6298e0dcd8dd3ef35ae63294ec5"`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "updated_at" SET DEFAULT '2025-10-02 04:06:52.106'`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "created_at" SET DEFAULT '2025-10-02 04:06:52.106'`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "clientowneremail" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "clientownerphone" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "clientcode" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_5c7fdc6dfe1b55d00ec55e48000"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "cityuuid"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "identificationtypeuuid"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "UQ_fbc7a4e3efaec4946d6d1d3fe4d"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "clientverificationnumber"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "UQ_d80a45e61ad02b58c36293b4424"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "clientidentificationnumber"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "clienttype"`);
        await queryRunner.query(`DROP TYPE "public"."clients_clienttype_enum"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "professionuuid"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "userprofession" character varying(100)`);
        await queryRunner.query(`DROP TABLE "professions"`);
        await queryRunner.query(`DROP TABLE "professions-category"`);
    }

}
