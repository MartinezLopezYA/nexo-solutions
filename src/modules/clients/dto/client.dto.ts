import { Transform } from "class-transformer";
import { TypeClientEnum } from "../enums/client.enum";
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Length } from "class-validator";
import { capitalize, capitalizeFirstLetter } from "src/common/utils/format";
import { IdentificationTypeToUserDto } from "src/modules/identification-type/dto/identification-type.dto";
import { CityWithDepartmentAndCountryDto } from "src/modules/location/dto/city.dto";
import { WorkerResponseDto } from "src/modules/workers/dto/worker.dto";

export class ClientCreateDto {
    @IsEnum(TypeClientEnum)
    @IsString()
    @IsNotEmpty()
    clienttype: TypeClientEnum;

    @IsUUID()
    @IsNotEmpty()
    clientidentificationtype: string;

    @IsNumber()
    @IsNotEmpty()
    clientidentificationnumber: number;

    @IsNumber()
    @IsNotEmpty()
    clientverificationnumber: number;

    @IsString()
    @IsNotEmpty()
    @Length(80)
    @Transform(({ value }) => capitalizeFirstLetter(value))
    clientname: string;

    @IsString()
    @Length(20)
    @Transform(({ value }) => capitalize(value))
    clientcode: string;

    @IsEmail()
    @IsNotEmpty()
    @Length(80)
    clientemail: string;

    @IsString()
    @IsNotEmpty()
    @Length(10)
    clientphone: string;

    @IsString()
    @IsNotEmpty()
    cityuuid: string;

    @IsString()
    @IsNotEmpty()
    @Length(80)
    @Transform(({ value }) => capitalize(value))
    clientaddress: string;
}

export class ClientUpdateDto {
    @IsEnum(TypeClientEnum)
    @IsString()
    @IsOptional()
    clienttype?: TypeClientEnum;

    @IsUUID()
    @IsOptional()
    clientidentificationtype?: string;

    @IsNumber()
    @IsOptional()
    clientidentificationnumber?: number;

    @IsNumber()
    @IsOptional()
    clientverificationnumber?: number;

    @IsString()
    @IsOptional()
    @Length(80)
    @Transform(({ value }) => capitalizeFirstLetter(value))
    clientname?: string;

    @IsString()
    @IsOptional()
    @Length(20)
    @Transform(({ value }) => capitalize(value))
    clientcode?: string;

    @IsEmail()
    @IsOptional()
    @Length(80)
    clientemail?: string;

    @IsString()
    @IsOptional()
    @Length(10)
    clientphone?: string;

    @IsString()
    @IsOptional()
    cityuuid?: string;

    @IsString()
    @IsOptional()
    @Length(80)
    @Transform(({ value }) => capitalize(value))
    clientaddress?: string;
}

export class ClientResponseDto {
    clientuuid: string;
    clienttype: TypeClientEnum;
    clientidentificationtype: IdentificationTypeToUserDto;
    clientidentificationnumber: number;
    clientverificationnumber: number;
    clientname: string;
    clientcode: string;
    clientemail: string;
    clientphone: string;
    city: CityWithDepartmentAndCountryDto;
    clientaddress: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class ClientWithWorkersDto {
    clientuuid: string;
    clienttype: TypeClientEnum;
    clientidentificationtype: IdentificationTypeToUserDto;
    clientidentificationnumber: number;
    clientverificationnumber: number;
    clientname: string;
    clientcode: string;
    clientemail: string;
    clientphone: string;
    city: CityWithDepartmentAndCountryDto;
    clientaddress: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    workers: WorkerResponseDto[];
}

export class ClientStatusDto {
    clientuuid: string;
    message: string;
    statusCode: number;
}

