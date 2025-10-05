import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1759674583317 implements MigrationInterface {
    name = 'InitialMigration1759674583317'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "professions" DROP CONSTRAINT "FK_6298e0dcd8dd3ef35ae63294ec5"`);
        await queryRunner.query(`CREATE TABLE "professions_category" ("professionsCategoryProfessioncategoryuuid" uuid NOT NULL, "professionsProfessionuuid" uuid NOT NULL, CONSTRAINT "PK_9e12c5e71771e69c81be8bd3acc" PRIMARY KEY ("professionsCategoryProfessioncategoryuuid", "professionsProfessionuuid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_200f67c612e31be817995878df" ON "professions_category" ("professionsCategoryProfessioncategoryuuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_94a77e17bcac533cb83c728f86" ON "professions_category" ("professionsProfessionuuid") `);
        await queryRunner.query(`ALTER TABLE "professions" DROP COLUMN "professioncategoryProfessioncategoryuuid"`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "created_at" SET DEFAULT '"2025-10-05T14:29:44.440Z"'`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "updated_at" SET DEFAULT '"2025-10-05T14:29:44.440Z"'`);
        await queryRunner.query(`ALTER TABLE "professions_category" ADD CONSTRAINT "FK_200f67c612e31be817995878dfb" FOREIGN KEY ("professionsCategoryProfessioncategoryuuid") REFERENCES "professions-category"("professioncategoryuuid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "professions_category" ADD CONSTRAINT "FK_94a77e17bcac533cb83c728f86b" FOREIGN KEY ("professionsProfessionuuid") REFERENCES "professions"("professionuuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "professions_category" DROP CONSTRAINT "FK_94a77e17bcac533cb83c728f86b"`);
        await queryRunner.query(`ALTER TABLE "professions_category" DROP CONSTRAINT "FK_200f67c612e31be817995878dfb"`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "updated_at" SET DEFAULT '2025-10-05 14:12:59.408'`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "created_at" SET DEFAULT '2025-10-05 14:12:59.408'`);
        await queryRunner.query(`ALTER TABLE "professions" ADD "professioncategoryProfessioncategoryuuid" uuid`);
        await queryRunner.query(`DROP INDEX "public"."IDX_94a77e17bcac533cb83c728f86"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_200f67c612e31be817995878df"`);
        await queryRunner.query(`DROP TABLE "professions_category"`);
        await queryRunner.query(`ALTER TABLE "professions" ADD CONSTRAINT "FK_6298e0dcd8dd3ef35ae63294ec5" FOREIGN KEY ("professioncategoryProfessioncategoryuuid") REFERENCES "professions-category"("professioncategoryuuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
