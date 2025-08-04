// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Permission } from './entities/permission.entity';
// import { Repository } from 'typeorm';
// import { CreatePermissionDto, UpdatePermissionDto } from './dto/permission.dto';

// @Injectable()
// export class PermissionRepository {
//   constructor(
//     @InjectRepository(Permission)
//     private readonly permissionRepository: Repository<Permission>,
//   ) {}

//   async findAll(): Promise<Permission[]> {
//     return await this.permissionRepository.find();
//   }

//   async findById(permissionuuid: string): Promise<Permission> {
//     return await this.permissionRepository.findOneBy({
//       permissionuuid: permissionuuid,
//     });
//   }

//   async findByName(permissionname: string): Promise<Permission> {
//     return await this.permissionRepository.findOneBy({
//       permissionname: permissionname,
//     });
//   }

//   async create(dto: CreatePermissionDto): Promise<Permission> {
//     const permission = this.permissionRepository.create(dto);
//     return await this.permissionRepository.save(permission);
//   }

//   async update(
//     permissionuuid: string,
//     dto: UpdatePermissionDto,
//   ): Promise<Permission> {
//     await this.permissionRepository.update(permissionuuid, dto);
//     return await this.findById(permissionuuid);
//   }

//   async delete(permissionuuid: string): Promise<void> {
//     await this.permissionRepository.delete(permissionuuid);
//   }
// }
