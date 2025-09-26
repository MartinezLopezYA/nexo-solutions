import { CityInDepartmentDto } from "./city.dto";
import { CountryInDepartmentDto } from "./country.dto";

export class DepartmentResponseDto {
    departmentuuid: string;
    departmentname: string;
    departmentcode: string;
    isActive: boolean;
}

export class DepartmentWithCityDto {
    departmentuuid: string;
    departmentname: string;
    departmentcode: string;
    cities: CityInDepartmentDto[] | null;
    isActive: boolean;
}

export class DepartmentInCountryDto {
    departmentuuid: string;
    departmentname: string;
    departmentcode: string;
    isActive: boolean;
}

export class DepartmentInCityDto {
    departmentuuid: string;
    departmentname: string;
    country: CountryInDepartmentDto;
}
