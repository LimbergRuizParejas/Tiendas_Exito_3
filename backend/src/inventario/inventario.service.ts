// 📂 backend/src/inventario/inventario.service.ts
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs/promises';
import * as path from 'path';

import { Inventario } from './inventario.entity';
import { CrearInventarioDto } from './crear-inventario.dto';
import { UpdateInventoryDto } from './update-inventory.dto';

const stripUndefined = <T extends object>(obj: T): Partial<T> =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>;

/** Convierte un web-path (/uploads/...) a ruta de FS */
function toFsPathFromWebAsset(webPath?: string | null): string | null {
  if (!webPath) return null;
  // Sólo permitimos rutas bajo /uploads/ por seguridad
  if (!webPath.startsWith('/uploads/')) return null;
  return path.resolve(process.cwd(), '.' + webPath);
}

/** Intenta borrar un archivo sin romper el flujo */
async function safeUnlink(filePath?: string | null) {
  try {
    if (!filePath) return;
    await fs.unlink(filePath);
  } catch {
    // no-op
  }
}

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Inventario)
    private readonly inventarioRepository: Repository<Inventario>,
  ) {}

  // -----------------------------
  // READ
  // -----------------------------
  async findAll(): Promise<Inventario[]> {
    try {
      // Relaciones eager ya están en la entidad; igual forzamos orden
      return await this.inventarioRepository.find({ order: { id: 'DESC' } });
    } catch (error) {
      console.error('Error al obtener el inventario:', error);
      throw new InternalServerErrorException('No se pudo obtener el inventario.');
    }
  }

  async findOne(id: number): Promise<Inventario> {
    try {
      const item = await this.inventarioRepository.findOne({ where: { id } });
      if (!item) throw new NotFoundException(`Producto con ID ${id} no encontrado.`);
      return item;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error('Error en findOne:', error);
      throw new InternalServerErrorException('No se pudo obtener el producto.');
    }
  }

  async findByBarcode(codigo: string): Promise<Inventario | null> {
    try {
      const code = (codigo ?? '').trim();
      if (!code) return null;
      return await this.inventarioRepository.findOne({ where: { codigoBarras: code } });
    } catch (error) {
      console.error('Error en findByBarcode:', error);
      throw new InternalServerErrorException('No se pudo buscar por código de barras.');
    }
  }

  async getSummary() {
    try {
      const result = await this.inventarioRepository
        .createQueryBuilder('inventario')
        .select('SUM(inventario.cantidad)', 'totalProductos')
        .addSelect('SUM(inventario.cantidad * inventario.precio)', 'totalValor')
        .getRawOne();

      return {
        totalProductos: parseInt(result?.totalProductos || '0', 10),
        totalValor: parseFloat(result?.totalValor || '0'),
      };
    } catch (error) {
      console.error('Error al obtener el resumen:', error);
      throw new InternalServerErrorException('No se pudo obtener el resumen del inventario.');
    }
  }

  // -----------------------------
  // CREATE
  // -----------------------------
  async create(dto: CrearInventarioDto & { imagenPath?: string }): Promise<Inventario> {
    try {
      const payload: Partial<Inventario> = stripUndefined({
        ...dto,
        // permitir limpiar fecha si llega '' (desde formulario)
        fechaCaducidad: dto.fechaCaducidad === '' ? null : dto.fechaCaducidad,
      });

      const entity = this.inventarioRepository.create(payload);
      return await this.inventarioRepository.save(entity);
    } catch (error: any) {
      // 23505 = unique_violation (p.ej., codigoBarras duplicado)
      if (error?.code === '23505') {
        throw new ConflictException('Ya existe un producto con el mismo código de barras.');
      }
      console.error('Error al crear producto:', error);
      throw new InternalServerErrorException('No se pudo crear el producto.');
    }
  }

  // -----------------------------
  // GROUPED
  // -----------------------------
  async findGroupedByCategoryAndBrand() {
    try {
      return await this.inventarioRepository
        .createQueryBuilder('inventario')
        .innerJoin('inventario.categoria', 'categoria')
        .innerJoin('inventario.marca', 'marca')
        .select([
          'categoria.nombre AS categoria',
          'marca.nombre AS marca',
          'SUM(inventario.cantidad) AS totalCantidad',
          'SUM(inventario.cantidad * inventario.precio) AS totalValor',
        ])
        .groupBy('categoria.nombre')
        .addGroupBy('marca.nombre')
        .getRawMany();
    } catch (error) {
      console.error('Error al agrupar inventario:', error);
      throw new InternalServerErrorException('No se pudo agrupar el inventario.');
    }
  }

  // -----------------------------
  // UPDATE
  // -----------------------------
  async update(id: number, dto: UpdateInventoryDto & { imagenPath?: string }): Promise<Inventario> {
    const producto = await this.inventarioRepository.findOne({ where: { id } });
    if (!producto) throw new NotFoundException(`Producto con ID ${id} no encontrado.`);

    try {
      // permitir limpiar fecha si llega '' (desde formulario)
      if (dto.fechaCaducidad === '') (dto as any).fechaCaducidad = null;

      // si cambia imagen, borrar la anterior
      if (dto.imagenPath && dto.imagenPath !== producto.imagenPath) {
        await safeUnlink(toFsPathFromWebAsset(producto.imagenPath));
      }

      Object.assign(producto, stripUndefined(dto));
      return await this.inventarioRepository.save(producto);
    } catch (error: any) {
      if (error?.code === '23505') {
        throw new ConflictException('Ya existe un producto con el mismo código de barras.');
      }
      console.error('Error al actualizar producto:', error);
      throw new InternalServerErrorException('No se pudo actualizar el producto.');
    }
  }

  // -----------------------------
  // STOCK
  // -----------------------------
  async updateStock(id: number, cantidad: number): Promise<Inventario> {
    if (!Number.isInteger(cantidad) || cantidad < 0) {
      throw new BadRequestException('La cantidad debe ser un entero >= 0.');
    }

    const producto = await this.inventarioRepository.findOne({ where: { id } });
    if (!producto) throw new NotFoundException(`Producto con ID ${id} no encontrado.`);

    try {
      producto.cantidad = cantidad;
      return await this.inventarioRepository.save(producto);
    } catch (error) {
      console.error('Error al actualizar stock:', error);
      throw new InternalServerErrorException('No se pudo actualizar el stock.');
    }
  }

  // -----------------------------
  // DELETE
  // -----------------------------
  async delete(id: number): Promise<void> {
    // buscamos para poder limpiar la imagen en disco si existe
    const producto = await this.inventarioRepository.findOne({ where: { id } });
    if (!producto) throw new NotFoundException(`Producto con ID ${id} no encontrado.`);

    try {
      await this.inventarioRepository.delete(id);
      await safeUnlink(toFsPathFromWebAsset(producto.imagenPath));
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw new InternalServerErrorException('No se pudo eliminar el producto.');
    }
  }
}
