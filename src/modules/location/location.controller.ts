import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocationService } from './location.service';
import { CountryResponseDto } from './dto/country.dto';
import { DepartmentResponseDto } from './dto/department.dto';
import { CityResponseDto } from './dto/city.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('Location')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('location')
export class LocationController {
    constructor(private locationService: LocationService){}

    @Get('v1/countries')
    @ApiOperation({
        summary: 'Get all countries',
        description: 'This endpoint returns a list of all countries.',
    })
    @ApiResponse({
        status: 200,
        description: 'List of countries',
        type: [CountryResponseDto],
    })
    async getAllCountries(): Promise<CountryResponseDto[]> {
        return await this.locationService.getAllCountries();
    }

    @Get('v1/departments')
    @ApiOperation({
        summary: 'Get all departments',
        description: 'This endpoint returns a list of all departments.',
    })
    @ApiResponse({
        status: 200,
        description: 'List of departments',
        type: [DepartmentResponseDto],
    })
    async getAllDepartments(): Promise<DepartmentResponseDto[]> {
        return await this.locationService.getAllDepartments();
    }

    @Get('v1/departments/:countryuuid')
    @ApiOperation({
        summary: 'Get departments by country',
        description: 'This endpoint returns a list of departments by country.',
    })
    @ApiResponse({
        status: 200,
        description: 'List of departments by country',
        type: [DepartmentResponseDto],
    })
    async getDepartmentsByCountry(@Param('countryuuid') countryuuid: string): Promise<DepartmentResponseDto[]> {
        return await this.locationService.getDepartmentsByCountry(countryuuid);
    }

    @Get('v1/cities')
    @ApiOperation({
        summary: 'Get all cities',
        description: 'This endpoint returns a list of all cities.',
    })
    @ApiResponse({
        status: 200,
        description: 'List of cities',
        type: [CityResponseDto],
    })
    async getAllCities(): Promise<CityResponseDto[]> {
        return await this.locationService.getAllCities();
    }

    @Get('v1/cities/:departmentuuid')
    @ApiOperation({
        summary: 'Get cities by department',
        description: 'This endpoint returns a list of cities by department.',
    })
    @ApiResponse({
        status: 200,
        description: 'List of cities by department',
        type: [CityResponseDto],
    })
    async getCitiesByDepartment(@Param('departmentuuid') departmentuuid: string): Promise<CityResponseDto[]> {
        return await this.locationService.getCitiesByDepartment(departmentuuid);
    }

}
