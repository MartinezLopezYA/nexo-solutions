import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1760072529902 implements MigrationInterface {
    name = 'InitialMigration1760072529902'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "password" TO "userpassword"`);
        await queryRunner.query(`CREATE TABLE "workers" ("workeruuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "workername" character varying(50) NOT NULL, "workerlastname" character varying(50) NOT NULL, "workerusername" character varying(50) NOT NULL, "workeremail" character varying(100) NOT NULL, "workerpassword" character varying NOT NULL, "workerphone" character varying(15) NOT NULL, "workeridentificationnumber" integer NOT NULL, "isActive" boolean DEFAULT true, "isDeleted" boolean DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "clientuuid" uuid, CONSTRAINT "UQ_b6163b6bb40c572010142fd335c" UNIQUE ("workeridentificationnumber"), CONSTRAINT "PK_d4b2e08c096c8558ad3da966fa0" PRIMARY KEY ("workeruuid"))`);
        await queryRunner.query(`CREATE TABLE "worker_roles" ("workersWorkeruuid" uuid NOT NULL, "rolesRoleuuid" uuid NOT NULL, CONSTRAINT "PK_bd0aba3d6a136ceab6ee3997db8" PRIMARY KEY ("workersWorkeruuid", "rolesRoleuuid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4d4c1f4108212dad3b7b7976dd" ON "worker_roles" ("workersWorkeruuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_b45d42e8d7ce307397e5715204" ON "worker_roles" ("rolesRoleuuid") `);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "clientownerphone"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "clientowner"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "clientowneremail"`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "created_at" SET DEFAULT '"2025-10-10T05:02:10.925Z"'`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "updated_at" SET DEFAULT '"2025-10-10T05:02:10.928Z"'`);
        await queryRunner.query(`ALTER TABLE "workers" ADD CONSTRAINT "FK_e13e2fc091548893f213abe0517" FOREIGN KEY ("clientuuid") REFERENCES "clients"("clientuuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "worker_roles" ADD CONSTRAINT "FK_4d4c1f4108212dad3b7b7976ddc" FOREIGN KEY ("workersWorkeruuid") REFERENCES "workers"("workeruuid") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "worker_roles" ADD CONSTRAINT "FK_b45d42e8d7ce307397e57152046" FOREIGN KEY ("rolesRoleuuid") REFERENCES "roles"("roleuuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "worker_roles" DROP CONSTRAINT "FK_b45d42e8d7ce307397e57152046"`);
        await queryRunner.query(`ALTER TABLE "worker_roles" DROP CONSTRAINT "FK_4d4c1f4108212dad3b7b7976ddc"`);
        await queryRunner.query(`ALTER TABLE "workers" DROP CONSTRAINT "FK_e13e2fc091548893f213abe0517"`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "updated_at" SET DEFAULT '2025-10-05 14:30:58.414'`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "created_at" SET DEFAULT '2025-10-05 14:30:58.414'`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "clientowneremail" character varying(80)`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "clientowner" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "clientownerphone" character varying(10)`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b45d42e8d7ce307397e5715204"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4d4c1f4108212dad3b7b7976dd"`);
        await queryRunner.query(`DROP TABLE "worker_roles"`);
        await queryRunner.query(`DROP TABLE "workers"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "userpassword" TO "password"`);
    }

}
