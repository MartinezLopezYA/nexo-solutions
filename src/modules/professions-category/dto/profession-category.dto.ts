import { Transform } from "class-transformer";
import { IsString } from "class-validator";
import { capitalize, capitalizeFirstLetter } from "src/common/utils/format";
import { ProfessionInCategory } from "src/modules/professions/dto/profession.dto";

export class ProfessionCategoryCreateDto {
    @IsString()
    @Transform(({ value }) => capitalizeFirstLetter(value))
    professioncategoryname: string;

    @IsString()
    @Transform(({ value }) => capitalize(value))
    professioncategoryabbreviation: string;

    @IsString()
    @Transform(({ value }) => capitalize(value))
    professioncategorycode: string;
}

export class ProfessionCategoryUpdateDto {
    @IsString()
    @Transform(({ value }) => capitalizeFirstLetter(value))
    professioncategoryname: string;

    @IsString()
    @Transform(({ value }) => capitalize(value))
    professioncategoryabbreviation: string;

    @IsString()
    @Transform(({ value }) => capitalize(value))
    professioncategorycode: string;
}

export class ProfessionCategoryResponseDto {
    professioncategoryuuid: string;
    professioncategoryname: string;
    professioncategoryabbreviation: string;
    professioncategorycode: string;
    isActive: boolean;
}

export class ProfessionCategoryInCategoryResponseDto {
    professioncategoryuuid: string;
    professioncategoryname: string;
    isActive: boolean;
}

export class CategoryWithProfessionDto {
    professioncategoryuuid: string;
    professioncategoryname: string;
    professions: ProfessionInCategory[] | null;
}

export class CategoryInProfessionDto {
    professioncategoryuuid: string;
    professioncategoryname: string;
}

export class ProfessionCategoryStatusDto {
    professioncategoryuuid: string;
    message: string;
    statusCode: number;
}