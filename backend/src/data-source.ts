import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres', // Tipo de base de datos
  host: process.env.DB_HOST, // Host de la base de datos
  port: parseInt(process.env.DB_PORT || '5432', 10), // Usa un valor por defecto de 5432

  username: process.env.DB_USERNAME, // Usuario de la base de datos
  password: process.env.DB_PASSWORD, // Contraseña de la base de datos
  database: process.env.DB_NAME, // Nombre de la base de datos
  entities: [__dirname + '/../**/*.entity{.ts,.js}'], // Entidades de TypeORM
  migrations: [__dirname + '/../migrations/*{.ts,.js}'], // Migraciones
  synchronize: false, // Evitar sincronización automática en producción
  logging: true, // Mostrar logs de SQL para depuración
});
