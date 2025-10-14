import { Transform} from "class-transformer";
import { IsString, IsEmail, MinLength, Matches, Length, IsNumber, IsOptional, IsNotEmpty } from "class-validator";
import { capitalize, capitalizeFirstLetter} from "src/common/utils/format";
import { RoleInUser } from "src/modules/roles/dto/role.dto";

export class WorkerCreateDto {
    @IsString()
    @Transform(({ value }) => capitalizeFirstLetter(value))
    @IsNotEmpty()
    workername: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => capitalizeFirstLetter(value))
    workerlastname: string;

    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => capitalize(value))
    workerusername: string;

    @IsEmail()
    @IsNotEmpty()
    workeremail: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' })
    workerpassword: string;

    @IsString()
    @Length(10)
    @IsNotEmpty()
    workerphone: string;

    @IsNumber()
    @IsNotEmpty()
    workeridentificationnumber: number;

    @IsString()
    @IsNotEmpty()
    clientuuid: string;
}

export class WorkerUpdateDto {
    @IsString()
    @IsOptional()
    @Transform(({ value }) => capitalizeFirstLetter(value))
    workername?: string;

    @IsString()
    @IsOptional()
    @Transform(({ value }) => capitalizeFirstLetter(value))
    workerlastname?: string;

    @IsString()
    @IsOptional()
    @Transform(({ value }) => capitalize(value))
    workerusername?: string;

    @IsEmail()
    @IsOptional()
    workeremail?: string;

    @IsString()
    @Length(10)
    workerphone?: string;

    @IsNumber()
    @IsOptional()
    workeridentificationnumber?: number;
}

export class WorkerResponseDto {
    workeruuid: string;
    workername: string;
    workerlastname: string;
    workerusername: string;
    workeremail: string;
    workerphone?: string;
    workeridentificationnumber?: number;
    isActive: boolean;
    roles: RoleInUser[] | [];
}

export class WorkerStatusDto {
    workeruuid: string;
    message: string;
    statusCode: number;
}

