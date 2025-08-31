// 📌 backend/src/inventario/inventario.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
  Check,
} from 'typeorm';
import { Categoria } from '../categorias/categorias.entity';
import { Marca } from '../marcas/marcas.entity';

// Convierte DECIMAL (BD) ⇄ number (JS)
const decimalToNumber = {
  to: (value: number) => value,
  from: (value: string | number) => Number(value),
};

@Index('idx_inventario_nombre', ['nombreProducto'])
@Index('idx_inventario_categoria', ['categoriaId'])
@Index('idx_inventario_marca', ['marcaId'])
@Unique('UQ_inventario_codigoBarras', ['codigoBarras'])
@Check('CHK_inventario_cantidad_nonneg', '"cantidad" >= 0')
@Check('CHK_inventario_precio_nonneg', '"precio" >= 0')
@Entity('inventario')
export class Inventario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 150 })
  nombreProducto!: string;

  /**
   * Código de barras opcional:
   * - String para conservar ceros a la izquierda (EAN/UPC/otros).
   * - Único si se proporciona; puede ser null.
   */
  @Column({ type: 'varchar', length: 64, nullable: true, unique: true })
  codigoBarras?: string | null;

  @Column('int', { default: 0 })
  cantidad!: number;

  // PRECISIÓN: 10 dígitos totales, 2 decimales (máx ~99999999.99)
  @Column('decimal', { precision: 10, scale: 2, transformer: decimalToNumber })
  precio!: number;

  // Caducidad opcional (DATE en Postgres)
  @Column({ type: 'date', nullable: true })
  fechaCaducidad?: string | null;

  // Ruta relativa del archivo subido (si existe)
  @Column({ type: 'varchar', length: 255, nullable: true })
  imagenPath?: string | null;

  // ---------------------------
  // Relaciones
  // ---------------------------
  @ManyToOne(() => Categoria, { nullable: false, eager: true })
  @JoinColumn({ name: 'categoriaId' })
  categoria!: Categoria;

  @Column({ type: 'int' })
  categoriaId!: number;

  @ManyToOne(() => Marca, { nullable: false, eager: true })
  @JoinColumn({ name: 'marcaId' })
  marca!: Marca;

  @Column({ type: 'int' })
  marcaId!: number;

  // ---------------------------
  // Timestamps
  // ---------------------------
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
