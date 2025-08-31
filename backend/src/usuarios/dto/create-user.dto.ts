// 📂 backend/src/usuarios/dto/create-user.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

/* =========================
   Helpers de transformación
   ========================= */
const Trim = () =>
  Transform(({ value }) =>
    value === null || value === undefined ? value : String(value).trim(),
  );

const LowercaseTrim = () =>
  Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  );

const ToRole = () =>
  Transform(({ value }) =>
    value === null || value === undefined
      ? value
      : String(value).trim().toLowerCase(),
  );

export class CreateUserDto {
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo del usuario',
  })
  @Trim()
  @IsString({ message: 'El nombre debe ser un texto válido.' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  @MaxLength(50, { message: 'El nombre no debe superar los 50 caracteres.' })
  nombre!: string;

  @ApiProperty({
    example: 'juan@example.com',
    description: 'Correo electrónico único del usuario',
  })
  @LowercaseTrim()
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido.' })
  email!: string;

  @ApiProperty({
    example: '1234seguro',
    description:
      'Contraseña del usuario (mín. 6 caracteres; se recomienda incluir letras y números).',
  })
  @Trim()
  @IsString({ message: 'La contraseña debe ser un texto.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @MaxLength(100, {
    message: 'La contraseña no debe superar los 100 caracteres.',
  })
  // ✅ Si quieres reforzar complejidad, deja la línea siguiente; si no, quítala.
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).{6,100}$/, {
    message: 'La contraseña debe incluir al menos una letra y un número.',
  })
  password!: string;

  @ApiPropertyOptional({
    example: 'usuario',
    description: 'Rol asignado al usuario (usuario o admin).',
  })
  @IsOptional()
  @ToRole()
  @IsIn(['usuario', 'admin'], { message: 'El rol debe ser usuario o admin.' })
  rol?: 'usuario' | 'admin' = 'usuario'; // ✅ default
}
