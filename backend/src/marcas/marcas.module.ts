import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarcasController } from './marcas.controller';
import { MarcasService } from './marcas.service';
import { Marca } from './marcas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Marca])],
  controllers: [MarcasController],
  providers: [MarcasService],
  exports: [TypeOrmModule, MarcasService],
})
export class MarcasModule {}
