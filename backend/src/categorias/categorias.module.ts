import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { Categoria } from './categorias.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Categoria]), // Registrar el repositorio de `Categoria`
  ],
  controllers: [CategoriasController], // Controlador de categorías
  providers: [CategoriasService], // Servicio de categorías
  exports: [
    TypeOrmModule, // Exportar para que otros módulos puedan usar `Categoria`
    CategoriasService, // Exportar el servicio si es necesario
  ],
})
export class CategoriasModule {}

