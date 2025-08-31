import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './productos.entity';
import { Categoria } from '../categorias/categorias.entity';
import { Marca } from '../marcas/marcas.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productosRepository: Repository<Producto>,
    @InjectRepository(Categoria)
    private readonly categoriasRepository: Repository<Categoria>,
    @InjectRepository(Marca)
    private readonly marcasRepository: Repository<Marca>,
  ) {}

  // Obtener todos los productos con sus relaciones, ordenados por categoría y marca
  async findAll(): Promise<Producto[]> {
    return this.productosRepository.find({
      relations: ['categoria', 'marca'],
      order: {
        categoria: { nombre: 'ASC' }, // Ordenar por nombre de categoría
        marca: { nombre: 'ASC' }, // Luego por nombre de marca
      },
    });
  }

  // Obtener un producto específico por ID
  async findOne(id: number): Promise<Producto> {
    const producto = await this.productosRepository.findOne({
      where: { id },
      relations: ['categoria', 'marca'],
    });
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return producto;
  }

  // Crear un nuevo producto con relaciones
  async create(data: Partial<Producto>): Promise<Producto> {
    const producto = this.productosRepository.create(data);

    // Validar y asignar categoría
    if (data.categoria?.id) {
      const categoria = await this.categoriasRepository.findOne({ where: { id: data.categoria.id } });
      if (!categoria) {
        throw new NotFoundException(`Categoría con ID ${data.categoria.id} no encontrada`);
      }
      producto.categoria = categoria;
    }

    // Validar y asignar marca
    if (data.marca?.id) {
      const marca = await this.marcasRepository.findOne({ where: { id: data.marca.id } });
      if (!marca) {
        throw new NotFoundException(`Marca con ID ${data.marca.id} no encontrada`);
      }
      producto.marca = marca;
    }

    return this.productosRepository.save(producto);
  }

  // Actualizar un producto existente
  async update(id: number, data: Partial<Producto>): Promise<Producto> {
    const producto = await this.findOne(id);

    // Validar y asignar categoría si se envía
    if (data.categoria?.id) {
      const categoria = await this.categoriasRepository.findOne({ where: { id: data.categoria.id } });
      if (!categoria) {
        throw new NotFoundException(`Categoría con ID ${data.categoria.id} no encontrada`);
      }
      producto.categoria = categoria;
    }

    // Validar y asignar marca si se envía
    if (data.marca?.id) {
      const marca = await this.marcasRepository.findOne({ where: { id: data.marca.id } });
      if (!marca) {
        throw new NotFoundException(`Marca con ID ${data.marca.id} no encontrada`);
      }
      producto.marca = marca;
    }

    // Actualizar otros campos
    Object.assign(producto, data);

    return this.productosRepository.save(producto);
  }

  // Eliminar un producto
  async remove(id: number): Promise<void> {
    const result = await this.productosRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
  }
}
