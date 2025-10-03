import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Clients')
@Controller('client')
export class ClientController {}
