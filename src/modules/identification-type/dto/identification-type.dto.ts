import { IsString } from "class-validator";

export class CreateIdentificationTypeDto {
    @IsString()
    identificationtypename: string;
    @IsString()
    identificationtypecode: string;
}

export class IdentificationTypeResponseDto {
    identificationtypeuuid: string;
    identificationtypename: string;
    identificationtypecode: string;
    isActive: boolean;
}

export class IdentificationTypeToUserDto {
    identificationtypeuuid: string;
    identificationtypename: string;
}