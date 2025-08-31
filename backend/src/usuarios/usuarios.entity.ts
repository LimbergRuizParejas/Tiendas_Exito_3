import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * ✅ Enum de roles disponibles en el sistema
 */
export enum RolUsuario {
  ADMIN = 'admin',
  USUARIO = 'usuario',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  nombre!: string;

  @Index({ unique: true }) // ✅ índice único para acelerar búsquedas y garantizar unicidad
  @Column({ unique: true, length: 150 })
  email!: string;

  /**
   * ⚠️ La contraseña no se selecciona por defecto
   * Necesitas `addSelect("usuario.password")` cuando quieras obtenerla.
   */
  @Column({ select: false })
  password!: string;

  /**
   * ✅ Rol del usuario, usando enum fuerte tipado
   * Valores posibles: "admin" o "usuario"
   */
  @Column({
    type: 'enum',
    enum: RolUsuario,
    default: RolUsuario.USUARIO,
  })
  rol!: RolUsuario;

  /**
   * ✅ Fechas de auditoría
   */
  @CreateDateColumn({ type: 'timestamp' })
  creadoEn!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  actualizadoEn!: Date;
}
