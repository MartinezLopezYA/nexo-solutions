import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1759673578435 implements MigrationInterface {
    name = 'InitialMigration1759673578435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "professions" DROP CONSTRAINT "FK_a969638444603ebbfa9fd62d436"`);
        await queryRunner.query(`ALTER TABLE "professions" RENAME COLUMN "professioncategoryuuid" TO "professioncategoryProfessioncategoryuuid"`);
        await queryRunner.query(`CREATE TABLE "professions_professioncategory" ("professionsCategoryProfessioncategoryuuid" uuid NOT NULL, "professionsProfessionuuid" uuid NOT NULL, CONSTRAINT "PK_c9122fad717b9c893152c9c18b4" PRIMARY KEY ("professionsCategoryProfessioncategoryuuid", "professionsProfessionuuid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_adc04b069edfdfced47ba17144" ON "professions_professioncategory" ("professionsCategoryProfessioncategoryuuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_f7cd59b8700a3a0a7d8da2e44f" ON "professions_professioncategory" ("professionsProfessionuuid") `);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "created_at" SET DEFAULT '"2025-10-05T14:12:59.408Z"'`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "updated_at" SET DEFAULT '"2025-10-05T14:12:59.408Z"'`);
        await queryRunner.query(`ALTER TABLE "professions" ADD CONSTRAINT "FK_6298e0dcd8dd3ef35ae63294ec5" FOREIGN KEY ("professioncategoryProfessioncategoryuuid") REFERENCES "professions-category"("professioncategoryuuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "professions_professioncategory" ADD CONSTRAINT "FK_adc04b069edfdfced47ba171444" FOREIGN KEY ("professionsCategoryProfessioncategoryuuid") REFERENCES "professions-category"("professioncategoryuuid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "professions_professioncategory" ADD CONSTRAINT "FK_f7cd59b8700a3a0a7d8da2e44fe" FOREIGN KEY ("professionsProfessionuuid") REFERENCES "professions"("professionuuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "professions_professioncategory" DROP CONSTRAINT "FK_f7cd59b8700a3a0a7d8da2e44fe"`);
        await queryRunner.query(`ALTER TABLE "professions_professioncategory" DROP CONSTRAINT "FK_adc04b069edfdfced47ba171444"`);
        await queryRunner.query(`ALTER TABLE "professions" DROP CONSTRAINT "FK_6298e0dcd8dd3ef35ae63294ec5"`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "updated_at" SET DEFAULT '2025-10-05 13:51:28.166'`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "created_at" SET DEFAULT '2025-10-05 13:51:28.166'`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f7cd59b8700a3a0a7d8da2e44f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_adc04b069edfdfced47ba17144"`);
        await queryRunner.query(`DROP TABLE "professions_professioncategory"`);
        await queryRunner.query(`ALTER TABLE "professions" RENAME COLUMN "professioncategoryProfessioncategoryuuid" TO "professioncategoryuuid"`);
        await queryRunner.query(`ALTER TABLE "professions" ADD CONSTRAINT "FK_a969638444603ebbfa9fd62d436" FOREIGN KEY ("professioncategoryuuid") REFERENCES "professions-category"("professioncategoryuuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
