import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { CreateChatbotMessageDto } from './create-chatbot-message.dto';
import { ChatbotMessage } from './chatbot.entity';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  // Crear mensaje de conversación (guarda en la DB)
  @Post()
  async create(@Body() dto: CreateChatbotMessageDto): Promise<ChatbotMessage> {
    try {
      return await this.chatbotService.create(dto);
    } catch (error) {
      console.error('Error al crear el mensaje del chatbot:', error);
      throw new HttpException(
        'No se pudo guardar el mensaje del chatbot',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Obtener historial del chatbot para un usuario
  @Get(':usuario_id')
  async findAllByUser(@Param('usuario_id') usuario_id: number): Promise<ChatbotMessage[]> {
    try {
      return await this.chatbotService.findAllByUser(usuario_id);
    } catch (error) {
      console.error('Error al obtener historial del usuario:', error);
      throw new HttpException(
        'No se pudo obtener el historial del chatbot',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Opcional: para testear que está vivo
  @Get()
  healthCheck(): string {
    return 'Chatbot API funcionando 🚀';
  }
}
