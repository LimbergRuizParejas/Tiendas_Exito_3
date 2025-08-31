// 📌 src/auth/dto/register-auth.dto.ts
import { IsString, IsEmail, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RolUsuario } from '../../usuarios/usuarios.entity';

export class RegisterAuthDto {
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo del usuario',
  })
  @IsString({ message: 'El nombre debe ser un texto válido' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre no debe superar los 50 caracteres' })
  nombre!: string;

  @ApiProperty({
    example: 'juan@example.com',
    description: 'Correo electrónico único del usuario',
  })
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  email!: string;

  @ApiProperty({
    example: '1234seguro',
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
  })
  @IsString({ message: 'La contraseña debe ser un texto válido' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(100, { message: 'La contraseña no debe superar los 100 caracteres' })
  password!: string;

  @ApiProperty({
    example: RolUsuario.USUARIO,
    description: 'Rol asignado al usuario (usuario o admin). Por defecto "usuario".',
    required: false,
    enum: RolUsuario,
  })
  @IsOptional()
  @IsEnum(RolUsuario, { message: 'El rol debe ser "usuario" o "admin"' })
  rol?: RolUsuario = RolUsuario.USUARIO;
}
