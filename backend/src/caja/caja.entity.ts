// 📌 src/caja/caja.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('caja')
export class Caja {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'timestamp' })
  fechaEntrada!: Date;

  @Column({ type: 'timestamp', nullable: true })
  fechaSalida?: Date;

  @Column({ length: 100 })
  personaACargo!: string;

  @Column({ type: 'text' })
  motivo!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total!: number;

  @Column({ length: 50 })
  tipoPago!: string;

  @Column({ nullable: true })
  imagenComprobante?: string;

  @Column()
  categoriaId!: number;

  @CreateDateColumn()
  creadoEn!: Date;

  @UpdateDateColumn()
  actualizadoEn!: Date;
}
