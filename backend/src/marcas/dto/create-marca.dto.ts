import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMarcaDto {
  @IsString({ message: 'El nombre debe ser un texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @MaxLength(150, { message: 'El nombre no debe superar 150 caracteres.' })
  nombre!: string;

  // No uso IsUrl para no forzar URLs estrictas (puedes activarlo si quieres)
  @IsOptional()
  @IsString({ message: 'La imagen debe ser texto (URL).' })
  @MaxLength(255)
  imagen?: string;
}
