// 📂 src/caja/caja.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { CajaService } from './caja.service';
import { CreateCajaDto } from './dto/create-caja.dto';
import { UpdateCajaDto } from './dto/update-caja.dto';
import { Public } from '../auth/public.decorator';

@ApiTags('Caja') // 👉 Grupo en Swagger
@ApiBearerAuth('access-token') // 👉 Muestra el botón Authorize (los GET son @Public por ahora)
@Controller('caja') // Con app.setGlobalPrefix('api') => /api/caja
export class CajaController {
  constructor(private readonly cajaService: CajaService) {}

  /**
   * 🟢 Crear un nuevo registro de caja
   * POST /api/caja
   */
  @Post()
  @ApiOperation({ summary: 'Crear registro de caja' })
  @ApiBody({ type: CreateCajaDto })
  @ApiResponse({ status: 201, description: 'Registro creado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() dto: CreateCajaDto) {
    return this.cajaService.create(dto);
  }

  /**
   * 🟢 Listar todos los registros de caja
   * GET /api/caja
   * (Temporalmente público para desarrollo)
   */
  @Public()
  @Get()
  @ApiOperation({ summary: 'Obtener todos los registros de caja' })
  @ApiResponse({
    status: 200,
    description: 'Lista de registros obtenida correctamente',
  })
  async findAll() {
    return this.cajaService.findAll();
  }

  /**
   * 🟢 Obtener un registro por ID
   * GET /api/caja/:id
   * (Temporalmente público para desarrollo)
   */
  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener registro por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Registro obtenido correctamente' })
  @ApiResponse({ status: 404, description: 'Registro no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cajaService.findOne(id);
  }

  /**
   * 🟢 Actualizar un registro por ID
   * PUT /api/caja/:id
   */
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar registro por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: UpdateCajaDto })
  @ApiResponse({ status: 200, description: 'Registro actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'Registro no encontrado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCajaDto,
  ) {
    return this.cajaService.update(id, dto);
  }

  /**
   * 🟢 Eliminar un registro por ID
   * DELETE /api/caja/:id
   * Devuelve 204 No Content si todo va bien.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar registro por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 204, description: 'Registro eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Registro no encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.cajaService.remove(id);
    // 204: sin contenido
  }
}
