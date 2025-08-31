import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Producto } from '../productos/productos.entity';

@Entity('categorias') // <- nombre de tabla explícito
export class Categoria {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  nombre!: string;

  @OneToMany(() => Producto, (producto) => producto.categoria)
  productos!: Producto[];
}
