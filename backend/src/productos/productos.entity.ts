import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Categoria } from '../categorias/categorias.entity';
import { Marca } from '../marcas/marcas.entity';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;
  @Column('decimal', { precision: 10, scale: 2 })
  precio!: number;
  

  @Column()
  descripcion!: string;

  @Column()
  imagen!: string;

  // Relación con Categoria
  @ManyToOne(() => Categoria, (categoria) => categoria.productos, {
    nullable: true, // Permite que la relación sea nula si se elimina la categoría
    eager: true,
    onDelete: 'SET NULL', // Establece en null cuando se elimina la categoría
  })
  @JoinColumn({ name: 'categoriaId' }) // Nombre explícito de la columna en la tabla
  categoria!: Categoria | null;

  // Relación con Marca
  @ManyToOne(() => Marca, (marca) => marca.productos, {
    nullable: true, // Permite que la relación sea nula si se elimina la marca
    eager: true,
    onDelete: 'SET NULL', // Establece en null cuando se elimina la marca
  })
  @JoinColumn({ name: 'marcaId' }) // Nombre explícito de la columna en la tabla
  marca!: Marca | null;
}
