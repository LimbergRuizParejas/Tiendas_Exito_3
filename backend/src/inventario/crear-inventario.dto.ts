import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

const ToNumber = () =>
  Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return undefined;
    const n = Number(value);
    return Number.isFinite(n) ? n : value;
  });

const TrimToUndefined = () =>
  Transform(({ value }) => {
    if (value === null || value === undefined) return undefined;
    const s = String(value).trim();
    return s === '' ? undefined : s;
  });

export class CrearInventarioDto {
  @ApiProperty({ example: 'Arroz 1kg' })
  @TrimToUndefined()
  @IsString({ message: 'El nombre del producto debe ser texto.' })
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio.' })
  nombreProducto!: string;

  @ApiProperty({ example: 10, type: Number })
  @ToNumber() @Type(() => Number)
  @IsInt({ message: 'La cantidad debe ser un entero.' })
  @Min(0, { message: 'La cantidad no puede ser negativa.' })
  cantidad!: number;

  @ApiProperty({ example: 12.5, type: Number })
  @ToNumber() @Type(() => Number)
  @IsNumber({ allowNaN: false, maxDecimalPlaces: 2 }, { message: 'El precio debe ser numérico (hasta 2 decimales).' })
  @Min(0, { message: 'El precio no puede ser negativo.' })
  precio!: number;

  @ApiProperty({ example: 1, type: Number })
  @ToNumber() @Type(() => Number)
  @IsInt({ message: 'categoriaId debe ser entero.' })
  @Min(1, { message: 'categoriaId debe ser >= 1.' })
  categoriaId!: number;

  @ApiProperty({ example: 1, type: Number })
  @ToNumber() @Type(() => Number)
  @IsInt({ message: 'marcaId debe ser entero.' })
  @Min(1, { message: 'marcaId debe ser >= 1.' })
  marcaId!: number;

  @ApiPropertyOptional({
    example: '7501031311309',
    description: 'Solo dígitos, 3–64. Opcional y único.',
  })
  @IsOptional()
  @TrimToUndefined()
  @IsString({ message: 'El código de barras debe ser texto.' })
  @Matches(/^\d{3,64}$/, { message: 'El código de barras debe ser numérico (3 a 64 dígitos).' })
  codigoBarras?: string;

  @ApiPropertyOptional({ example: '2025-12-31' })
  @IsOptional()
  @TrimToUndefined()
  @IsDateString({}, { message: 'fechaCaducidad inválida (YYYY-MM-DD).' })
  fechaCaducidad?: string;
}
