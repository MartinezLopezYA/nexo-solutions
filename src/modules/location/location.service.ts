import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { City } from './entities/city.entity';
import { CountryResponseDto } from './dto/country.dto';
import { NotFoundException } from 'src/common/exceptions/general-exception.';
import { DepartmentResponseDto } from './dto/department.dto';
import { CityResponseDto } from './dto/city.dto';

@Injectable()
export class LocationService {

    constructor(
        @InjectRepository(Country)
        private readonly countryRepository: Repository<Country>,
        @InjectRepository(Department)
        private readonly departmentRepository: Repository<Department>,
        @InjectRepository(City)
        private readonly cityRepository: Repository<City>,
    ) { }


    async getAllCountries(): Promise<CountryResponseDto[]> {
        try {
            const countries = await this.countryRepository.find({
                order: { countryname: 'ASC' },
            });
            if (!countries || countries.length === 0) {
                throw new NotFoundException(
                    'No countries found',
                    HttpStatus.NOT_FOUND,
                    'NF_COUNTRY_ERROR',
                );
            }
            const countryResponseDto = countries.map(country => ({
                countryuuid: country.countryuuid,
                countryname: country.countryname,
                countryisocode: country.countryisocode,
                countrynumericcode: country.countrynumericcode,
                isActive: country.isActive,
            } as CountryResponseDto)) || [];
            return countryResponseDto;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while updating the country');
        }
    }

    async getAllDepartments(): Promise<DepartmentResponseDto[]> {
        try {
            const departments = await this.departmentRepository.find(
                {
                    order: { departmentname: 'ASC' },
                }
            );
            if (!departments || departments.length === 0) {
                throw new NotFoundException(
                    'No departments found',
                    HttpStatus.NOT_FOUND,
                    'NF_DEPARTMENT_ERROR',
                );
            }
            const departmentResponseDto = departments.map(department => ({
                departmentuuid: department.departmentuuid,
                departmentname: department.departmentname,
                departmentcode: department.departmentcode,
                isActive: department.isActive,
            } as DepartmentResponseDto)) || [];
            return departmentResponseDto;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while updating the department');
        }
    }

    async getDepartmentsByCountry(countryuuid: string): Promise<DepartmentResponseDto[]> {
        try {
            const departments = await this.departmentRepository.find({
                order: { departmentname: 'ASC' },
                where: { country: { countryuuid: countryuuid } },
            });
            if (!departments || departments.length === 0) {
                throw new NotFoundException(
                    'No departments found',
                    HttpStatus.NOT_FOUND,
                    'NF_DEPARTMENT_ERROR',
                );
            }
            const departmentResponseDto = departments.map(department => ({
                departmentuuid: department.departmentuuid,
                departmentname: department.departmentname,
                departmentcode: department.departmentcode,
                isActive: department.isActive,
            } as DepartmentResponseDto)) || [];
            return departmentResponseDto;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while updating the department');
        }
    }

    async getAllCities(): Promise<CityResponseDto[]> {
        try {
            const cities = await this.cityRepository.find({
                order: { cityname: 'ASC' },
            });
            if (!cities || cities.length === 0) {
                throw new NotFoundException(
                    'No cities found',
                    HttpStatus.NOT_FOUND,
                    'NF_CITY_ERROR',
                );
            }
            const cityResponseDto = cities.map(city => ({
                cityuuid: city.cityuuid,
                cityname: city.cityname,
                citycode: city.citycode,
                isActive: city.isActive,
            } as CityResponseDto)) || [];
            return cityResponseDto;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while updating the city');
        }
    }

    async getCitiesByDepartment(departmentuuid: string): Promise<CityResponseDto[]> {
        try {
            const cities = await this.cityRepository.find({
                order: { cityname: 'ASC' },
                where: { department: { departmentuuid: departmentuuid } },
            });
            if (!cities || cities.length === 0) {
                throw new NotFoundException(
                    'No cities found',
                    HttpStatus.NOT_FOUND,
                    'NF_CITY_ERROR',
                );
            }
            const cityResponseDto = cities.map(city => ({
                cityuuid: city.cityuuid,
                cityname: city.cityname,
                citycode: city.citycode,
                isActive: city.isActive,
            } as CityResponseDto)) || [];
            return cityResponseDto;
        } catch (error) {
            this.handleInternalError(error, 'An error occurred while updating the city');
        }
    }

    private handleInternalError(error: unknown, message: string): never {
        if (error instanceof HttpException) {
            throw error;
        }
        throw new HttpException(
            {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                errorCode: 'INTERNAL_SERVER_ERROR',
                message,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }

}
