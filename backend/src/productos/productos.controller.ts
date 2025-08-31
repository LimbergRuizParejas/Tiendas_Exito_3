import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { Producto } from './productos.entity';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  // Obtener todos los productos
  @Get()
  async findAll(): Promise<Producto[]> {
    return this.productosService.findAll();
  }

  // Obtener un producto por ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Producto> {
    return this.productosService.findOne(id);
  }

  // Crear un producto
  @Post()
  async create(@Body() data: Partial<Producto>): Promise<Producto> {
    return this.productosService.create(data);
  }

  // Actualizar un producto por ID
  @Put(':id')
  async update(@Param('id') id: number, @Body() data: Partial<Producto>): Promise<Producto> {
    return this.productosService.update(id, data);
  }

  // Eliminar un producto por ID
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.productosService.remove(id);
  }
}
