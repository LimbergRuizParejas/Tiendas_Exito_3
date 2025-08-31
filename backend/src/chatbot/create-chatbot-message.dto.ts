import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateChatbotMessageDto {
  @IsNumber()
  usuario_id!: number;

  @IsNotEmpty()
  @IsString()
  pregunta!: string;
}
