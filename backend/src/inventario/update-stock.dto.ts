// 📌 backend/src/inventario/update-stock.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

/* =============================
   Helper: convierte string→number
============================= */
const ToNumber = () =>
  Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return undefined;
    const n = Number(value);
    return Number.isFinite(n) ? n : value; // si no es número, lo deja para que falle la validación
  });

export class UpdateStockDto {
  @ApiProperty({
    example: 5,
    type: Number,
    description: 'Nueva cantidad de stock para el producto (entero >= 0).',
  })
  @ToNumber()
  @Type(() => Number)
  @IsInt({ message: 'La cantidad debe ser un número entero.' })
  @Min(0, { message: 'La cantidad no puede ser negativa.' })
  cantidad!: number;
}
