import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class ChatbotMessage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  usuario_id!: number;

  @Column()
  pregunta!: string;

  @Column()
  respuesta!: string;

  @CreateDateColumn()
  fecha!: Date;
}
