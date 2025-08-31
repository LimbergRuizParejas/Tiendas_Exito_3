import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam, ApiBody } from '@nestjs/swagger';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './create-categoria.dto';
import { UpdateCategoriaDto } from './update-categoria.dto';
import { Public } from '../auth/public.decorator';

@ApiTags('Categorias')
@ApiBearerAuth('access-token')
@Controller('categorias') // => /api/categorias (por tu prefijo global)
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  /** GET /api/categorias (público mientras desarrollas) */
  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar categorías' })
  @ApiResponse({ status: 200, description: 'OK' })
  findAll() {
    return this.categoriasService.findAll();
  }

  /** GET /api/categorias/:id (público mientras desarrollas) */
  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una categoría por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 404, description: 'No encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.findOne(id);
  }

  /** POST /api/categorias */
  @Post()
  @ApiOperation({ summary: 'Crear categoría' })
  @ApiBody({ type: CreateCategoriaDto })
  @ApiResponse({ status: 201, description: 'Creado' })
  create(@Body() dto: CreateCategoriaDto) {
    return this.categoriasService.create(dto);
  }

  /** PUT /api/categorias/:id */
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar categoría' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiBody({ type: UpdateCategoriaDto })
  @ApiResponse({ status: 200, description: 'Actualizado' })
  @ApiResponse({ status: 404, description: 'No encontrada' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoriaDto) {
    return this.categoriasService.update(id, dto);
  }

  /** DELETE /api/categorias/:id */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar categoría' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 204, description: 'Eliminado' })
  @ApiResponse({ status: 404, description: 'No encontrada' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.categoriasService.remove(id);
  }
}
