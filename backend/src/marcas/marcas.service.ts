import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Marca } from './marcas.entity';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';

@Injectable()
export class MarcasService {
  constructor(
    @InjectRepository(Marca)
    private readonly marcasRepository: Repository<Marca>,
  ) {}

  findAll(): Promise<Marca[]> {
    return this.marcasRepository.find();
  }

  async findOne(id: number): Promise<Marca> {
    const marca = await this.marcasRepository.findOne({ where: { id } });
    if (!marca) throw new NotFoundException(`Marca con ID ${id} no encontrada`);
    return marca;
  }

  create(dto: CreateMarcaDto): Promise<Marca> {
    const entity = this.marcasRepository.create({
      nombre: dto.nombre.trim(),
      imagen: dto.imagen?.trim() ?? null,
    });
    return this.marcasRepository.save(entity);
  }

  async update(id: number, dto: UpdateMarcaDto): Promise<Marca> {
    const marca = await this.findOne(id);

    if (dto.nombre !== undefined) marca.nombre = dto.nombre.trim();
    if (dto.imagen !== undefined) marca.imagen = dto.imagen?.trim() ?? null;

    return this.marcasRepository.save(marca);
  }

  async remove(id: number): Promise<void> {
    const result = await this.marcasRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Marca con ID ${id} no encontrada para eliminar`);
    }
  }
}
