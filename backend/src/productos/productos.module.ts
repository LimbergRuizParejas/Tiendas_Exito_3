import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { Producto } from './productos.entity';
import { CategoriasModule } from '../categorias/categorias.module'; // Correcta ruta
import { MarcasModule } from '../marcas/marcas.module'; // Correcta ruta

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto]),
    CategoriasModule, // Importar el módulo de categorías
    MarcasModule, // Importar el módulo de marcas
  ],
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [ProductosService], // Exportar si es necesario
})
export class ProductosModule {}
