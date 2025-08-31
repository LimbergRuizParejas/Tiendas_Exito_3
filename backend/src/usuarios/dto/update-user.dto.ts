// 📂 backend/src/usuarios/dto/update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

/* =========================
   Helpers de transformación
   ========================= */
const TrimToUndefined = () =>
  Transform(({ value }) => {
    if (value === null || value === undefined) return undefined;
    const s = String(value).trim();
    return s === '' ? undefined : s;
  });

const LowercaseTrimToUndefined = () =>
  Transform(({ value }) => {
    if (value === null || value === undefined) return undefined;
    const s = String(value).trim().toLowerCase();
    return s === '' ? undefined : s;
  });

const ToRole = () =>
  Transform(({ value }) => {
    if (value === null || value === undefined) return undefined;
    const s = String(value).trim().toLowerCase();
    return s === '' ? undefined : s;
  });

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    example: 'Carlos Gómez',
    description: 'Nombre completo del usuario (opcional).',
  })
  @IsOptional()
  @TrimToUndefined()
  @IsString({ message: 'El nombre debe ser un texto válido.' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  @MaxLength(50, { message: 'El nombre no debe superar los 50 caracteres.' })
  nombre?: string;

  @ApiPropertyOptional({
    example: 'carlos@example.com',
    description: 'Correo electrónico único (opcional).',
  })
  @IsOptional()
  @LowercaseTrimToUndefined()
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido.' })
  email?: string;

  @ApiPropertyOptional({
    example: 'NuevaClave123',
    description:
      'Nueva contraseña del usuario (mínimo 6 caracteres; se recomienda incluir letras y números).',
  })
  @IsOptional()
  @TrimToUndefined()
  @IsString({ message: 'La contraseña debe ser un texto.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @MaxLength(100, { message: 'La contraseña no debe superar los 100 caracteres.' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).{6,100}$/, {
    message: 'La contraseña debe incluir al menos una letra y un número.',
  })
  password?: string;

  @ApiPropertyOptional({
    example: 'admin',
    description: 'Rol del usuario (usuario o admin, opcional).',
  })
  @IsOptional()
  @ToRole()
  @IsIn(['usuario', 'admin'], { message: 'El rol debe ser usuario o admin.' })
  rol?: 'usuario' | 'admin';
}
