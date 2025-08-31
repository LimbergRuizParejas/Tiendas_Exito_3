import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from './categorias.entity';
import { CreateCategoriaDto } from './create-categoria.dto';
import { UpdateCategoriaDto } from './update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private categoriasRepository: Repository<Categoria>,
  ) {}

  findAll(): Promise<Categoria[]> {
    return this.categoriasRepository.find();
  }

  async findOne(id: number): Promise<Categoria> {
    const categoria = await this.categoriasRepository.findOne({ where: { id } });
    if (!categoria) {
      throw new NotFoundException(`Categoria con ID ${id} no encontrada`);
    }
    return categoria;
  }

  async create(dto: CreateCategoriaDto): Promise<Categoria> {
    const categoria = this.categoriasRepository.create({ nombre: dto.nombre });
    return this.categoriasRepository.save(categoria);
  }

  async update(id: number, dto: UpdateCategoriaDto): Promise<Categoria> {
    const categoria = await this.findOne(id);
    if (dto.nombre !== undefined) {
      categoria.nombre = dto.nombre;
    }
    await this.categoriasRepository.save(categoria);
    return categoria;
  }

  async remove(id: number): Promise<void> {
    const result = await this.categoriasRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Categoria con ID ${id} no encontrada para eliminar`);
    }
  }
}
