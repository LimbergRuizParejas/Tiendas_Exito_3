import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateCajaDto {
  @IsOptional()
  @IsDateString()
  fechaEntrada?: Date;

  @IsOptional()
  @IsDateString()
  fechaSalida?: Date;

  @IsString()
  personaACargo!: string;

  @IsOptional()
  @IsString()
  motivo?: string;

  @IsNumber()
  monto!: number;

  @IsNumber()
  total!: number;

  @IsString()
  tipoPago!: string;

  @IsOptional()
  @IsString()
  imagenComprobante?: string;

  @IsOptional()
  @IsNumber()
  categoriaId?: number;
}
