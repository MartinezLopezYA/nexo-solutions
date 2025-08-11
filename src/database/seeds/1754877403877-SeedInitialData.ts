import { MigrationInterface, QueryRunner } from "typeorm";
import * as fs from 'fs';
import * as path from 'path';

export class SeedInitialData1754877403877 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const countriesSql = fs.readFileSync(
            path.join(__dirname, '../sql/countries.sql'),
            'utf8',
        );
        const departmentsSql = fs.readFileSync(
            path.join(__dirname, '../sql/departments.sql'),
            'utf8',
        );
        const citiesSql = fs.readFileSync(
            path.join(__dirname, '../sql/cities.sql'),
            'utf8',
        );

        await queryRunner.query(countriesSql);
        await queryRunner.query(departmentsSql);
        await queryRunner.query(citiesSql);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM cities`);
        await queryRunner.query(`DELETE FROM departments`);
        await queryRunner.query(`DELETE FROM countries`);
    }

}
