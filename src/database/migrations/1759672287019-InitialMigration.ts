import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1759672287019 implements MigrationInterface {
    name = 'InitialMigration1759672287019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "professions" DROP CONSTRAINT "FK_6298e0dcd8dd3ef35ae63294ec5"`);
        await queryRunner.query(`ALTER TABLE "professions" RENAME COLUMN "professioncategoryProfessioncategoryuuid" TO "professioncategoryuuid"`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "created_at" SET DEFAULT '"2025-10-05T13:51:28.166Z"'`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "updated_at" SET DEFAULT '"2025-10-05T13:51:28.166Z"'`);
        await queryRunner.query(`ALTER TABLE "professions" ADD CONSTRAINT "FK_a969638444603ebbfa9fd62d436" FOREIGN KEY ("professioncategoryuuid") REFERENCES "professions-category"("professioncategoryuuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "professions" DROP CONSTRAINT "FK_a969638444603ebbfa9fd62d436"`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "updated_at" SET DEFAULT '2025-10-03 18:47:21.502'`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "created_at" SET DEFAULT '2025-10-03 18:47:21.502'`);
        await queryRunner.query(`ALTER TABLE "professions" RENAME COLUMN "professioncategoryuuid" TO "professioncategoryProfessioncategoryuuid"`);
        await queryRunner.query(`ALTER TABLE "professions" ADD CONSTRAINT "FK_6298e0dcd8dd3ef35ae63294ec5" FOREIGN KEY ("professioncategoryProfessioncategoryuuid") REFERENCES "professions-category"("professioncategoryuuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
