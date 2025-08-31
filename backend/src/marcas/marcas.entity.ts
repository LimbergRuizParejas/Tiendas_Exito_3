// src/marcas/marca.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  BeforeUpdate,
  Check,
  Relation,
} from 'typeorm';
import { Producto } from '../productos/productos.entity';

@Entity('marcas')
@Index('UQ_marcas_nombre', ['nombre'], { unique: true }) // nombre único
@Check(`"nombre" <> ''`) // evita strings vacíos
export class Marca {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 150, comment: 'Nombre visible de la marca' })
  nombre!: string;

  // Guarda URL o path de la imagen; más largo por si usas URLs firmadas
  @Column({ type: 'varchar', length: 2048, nullable: true, comment: 'URL/Path de la imagen' })
  imagen?: string | null;

  @OneToMany(() => Producto, (producto) => producto.marca, {
    cascade: false, // evita crear/borrrar productos al tocar la marca
  })
  productos!: Relation<Producto[]>;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
  deletedAt?: Date | null;

  // ---------- Hooks: limpieza básica ----------
  @BeforeInsert()
  @BeforeUpdate()
  private normalize() {
    if (typeof this.nombre === 'string') {
      this.nombre = this.nombre.trim().replace(/\s+/g, ' ');
    }
    if (this.imagen != null) {
      const v = String(this.imagen).trim();
      this.imagen = v.length ? v : null;
    }
  }
}
