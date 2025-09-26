import { DepartmentInCityDto } from "./department.dto";

export class CityResponseDto {
    cityuuid: string;
    cityname: string;
    citycode: string;
    isActive: boolean;
}

export class CityInDepartmentDto {
    cityuuid: string;
    cityname: string;
    citycode: string;
    isActive: boolean;
}

export class CityWithDepartmentAndCountryDto {
    cityuuid: string;
    cityname: string;
    department: DepartmentInCityDto;
}

