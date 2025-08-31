import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
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

export class UpdateInventoryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @TrimToUndefined()
  @IsString({ message: 'El nombre del producto debe ser texto.' })
  nombreProducto?: string;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @ToNumber()
  @Type(() => Number)
  @IsInt({ message: 'La cantidad debe ser un entero.' })
  @Min(0, { message: 'La cantidad no puede ser negativa.' })
  cantidad?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @ToNumber()
  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, maxDecimalPlaces: 2 },
    { message: 'El precio debe ser numérico (hasta 2 decimales).' },
  )
  @Min(0, { message: 'El precio no puede ser negativo.' })
  precio?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @ToNumber()
  @Type(() => Number)
  @IsInt({ message: 'categoriaId debe ser entero.' })
  @Min(1, { message: 'categoriaId debe ser >= 1.' })
  categoriaId?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @ToNumber()
  @Type(() => Number)
  @IsInt({ message: 'marcaId debe ser entero.' })
  @Min(1, { message: 'marcaId debe ser >= 1.' })
  marcaId?: number;

  @ApiPropertyOptional({
    description: 'Código de barras (solo dígitos, 3–64).',
    example: '7501031311309',
  })
  @IsOptional()
  @TrimToUndefined()
  @IsString({ message: 'El código de barras debe ser texto.' })
  @Matches(/^\d{3,64}$/, {
    message: 'El código de barras debe ser numérico (3 a 64 dígitos).',
  })
  codigoBarras?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @TrimToUndefined()
  @IsDateString({}, { message: 'fechaCaducidad inválida (YYYY-MM-DD).' })
  fechaCaducidad?: string;
}
