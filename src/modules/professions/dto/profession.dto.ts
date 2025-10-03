import { Transform } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { capitalize, capitalizeFirstLetter } from "src/common/utils/format";
import { CategoryInProfessionDto } from "src/modules/professions-category/dto/profession-category.dto";

export class ProfessionCreateDto {
    @IsString()
    @Transform(({ value }) => capitalizeFirstLetter(value))
    professionname: string;

    @IsString()
    @IsOptional()
    professiondescription: string;

    @IsString()
    @IsOptional()
    @Transform(({ value }) => capitalize(value))
    professionabbreviation: string;

    @IsString()
    @IsOptional()
    @Transform(({ value }) => capitalize(value))
    professioncode: string;
}

export class ProfessionUpdateDto {
    @IsString()
    @IsOptional()
    @Transform(({ value }) => capitalizeFirstLetter(value))
    professionname?: string;

    @IsString()
    @IsOptional()
    professiondescription?: string;

    @IsString()
    @IsOptional()
    @Transform(({ value }) => capitalize(value))
    professionabbreviation?: string;

    @IsString()
    @IsOptional()
    @Transform(({ value }) => capitalize(value))
    professioncode?: string;
}

export class ProfessionResponseDto {
    professionuuid: string;
    professionname: string;
    professiondescription: string;
    professionabbreviation: string;
    professioncode: string;
    isActive: boolean;
}

export class ProfessionInCategory {
    professionuuid: string;
    professionname: string;
    professioncategory: CategoryInProfessionDto;
}