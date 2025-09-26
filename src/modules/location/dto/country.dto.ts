import { DepartmentInCountryDto, DepartmentWithCityDto } from "./department.dto";

export class CountryResponseDto {
    countryuuid: string;
    countryname: string;
    countryisocode: string;
    countrynumericcode: string;
    isActive: boolean;
}

export class CountryWithDepartmentDto {
    countryuuid: string;
    countryname: string;
    countryisocode: string;
    countrynumericcode: string;
    departments: DepartmentInCountryDto[] | null;
    isActive: boolean;
}

export class CountryWithDepartmentAndCityDto {
    countryuuid: string;
    countryname: string;
    countryisocode: string;
    countrynumericcode: string;
    departments: DepartmentWithCityDto[] | null;
    isActive: boolean;
}

export class CountryInDepartmentDto {
    countryuuid: string;
    countryname: string;
}