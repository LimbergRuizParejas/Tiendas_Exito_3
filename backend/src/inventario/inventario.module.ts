// 📂 backend/src/inventario/inventario.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

import { Inventario } from './inventario.entity';
import { InventarioService } from './inventario.service';
import { InventarioController } from './inventario.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventario]),
    // Fallback global para uploads del módulo (el controlador puede sobreescribir storage)
    MulterModule.register({
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    }),
  ],
  controllers: [InventarioController],
  providers: [InventarioService],
  exports: [TypeOrmModule, InventarioService],
})
export class InventarioModule {}
