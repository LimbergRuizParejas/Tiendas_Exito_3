import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Caja } from './caja.entity';
import { CreateCajaDto } from './dto/create-caja.dto';
import { UpdateCajaDto } from './dto/update-caja.dto';

@Injectable()
export class CajaService {
  constructor(
    @InjectRepository(Caja)
    private readonly cajaRepository: Repository<Caja>,
  ) {}

  async create(dto: CreateCajaDto): Promise<Caja> {
    const registro = this.cajaRepository.create(dto);
    return this.cajaRepository.save(registro);
  }

  async findAll(): Promise<Caja[]> {
    return this.cajaRepository.find();
  }

  async findOne(id: number): Promise<Caja> {
    const registro = await this.cajaRepository.findOne({ where: { id } });
    if (!registro) throw new NotFoundException(`Registro de caja con id ${id} no encontrado`);
    return registro;
  }

  async update(id: number, dto: UpdateCajaDto): Promise<Caja> {
    const registro = await this.findOne(id);
    Object.assign(registro, dto);
    return this.cajaRepository.save(registro);
  }

  async remove(id: number): Promise<{ message: string }> {
    const registro = await this.findOne(id);
    await this.cajaRepository.remove(registro);
    return { message: 'Registro eliminado correctamente' };
  }
}
