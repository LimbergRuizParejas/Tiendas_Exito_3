import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatbotMessage } from './chatbot.entity';
import { CreateChatbotMessageDto } from './create-chatbot-message.dto';
import OpenAI from 'openai';

@Injectable()
export class ChatbotService {
  private openai: OpenAI;

  constructor(
    @InjectRepository(ChatbotMessage)
    private readonly chatbotRepository: Repository<ChatbotMessage>,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Genera una respuesta con OpenAI (GPT-4) y guarda tanto la pregunta
   * como la respuesta en la base de datos.
   */
  async create(dto: CreateChatbotMessageDto): Promise<ChatbotMessage> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: dto.pregunta,
          },
        ],
      });

      const respuesta = completion.choices?.[0]?.message?.content ?? '';

      console.log(`✔ Chatbot respuesta generada: "${respuesta}"`);

      const message = this.chatbotRepository.create({
        usuario_id: dto.usuario_id,
        pregunta: dto.pregunta,
        respuesta,
      });

      return await this.chatbotRepository.save(message);
    } catch (error) {
      console.error('❌ Error al generar respuesta con OpenAI:', error);
      throw new InternalServerErrorException(
        'No se pudo generar la respuesta del chatbot.',
      );
    }
  }

  /**
   * Retorna el historial de conversación de un usuario ordenado por fecha.
   */
  async findAllByUser(usuario_id: number): Promise<ChatbotMessage[]> {
    try {
      return await this.chatbotRepository.find({
        where: { usuario_id },
        order: { fecha: 'DESC' },
      });
    } catch (error) {
      console.error('❌ Error al obtener historial del usuario:', error);
      throw new InternalServerErrorException(
        'No se pudo recuperar el historial del chatbot.',
      );
    }
  }
}
