import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1759674657418 implements MigrationInterface {
    name = 'InitialMigration1759674657418'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category-professions" ("professionsCategoryProfessioncategoryuuid" uuid NOT NULL, "professionsProfessionuuid" uuid NOT NULL, CONSTRAINT "PK_1fc08585779eea012628120f733" PRIMARY KEY ("professionsCategoryProfessioncategoryuuid", "professionsProfessionuuid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2714e13f75e955c8914a0e6390" ON "category-professions" ("professionsCategoryProfessioncategoryuuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_f41c309a25fb0508363b775997" ON "category-professions" ("professionsProfessionuuid") `);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "created_at" SET DEFAULT '"2025-10-05T14:30:58.414Z"'`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "updated_at" SET DEFAULT '"2025-10-05T14:30:58.414Z"'`);
        await queryRunner.query(`ALTER TABLE "category-professions" ADD CONSTRAINT "FK_2714e13f75e955c8914a0e6390b" FOREIGN KEY ("professionsCategoryProfessioncategoryuuid") REFERENCES "professions-category"("professioncategoryuuid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "category-professions" ADD CONSTRAINT "FK_f41c309a25fb0508363b7759973" FOREIGN KEY ("professionsProfessionuuid") REFERENCES "professions"("professionuuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category-professions" DROP CONSTRAINT "FK_f41c309a25fb0508363b7759973"`);
        await queryRunner.query(`ALTER TABLE "category-professions" DROP CONSTRAINT "FK_2714e13f75e955c8914a0e6390b"`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "updated_at" SET DEFAULT '2025-10-05 14:29:44.44'`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "created_at" SET DEFAULT '2025-10-05 14:29:44.44'`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f41c309a25fb0508363b775997"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2714e13f75e955c8914a0e6390"`);
        await queryRunner.query(`DROP TABLE "category-professions"`);
    }

}
