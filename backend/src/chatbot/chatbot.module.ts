import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { ChatbotMessage } from './chatbot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatbotMessage])],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class ChatbotModule {}
