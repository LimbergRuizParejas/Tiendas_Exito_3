"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const chatbot_entity_1 = require("./chatbot.entity");
const openai_1 = __importDefault(require("openai"));
let ChatbotService = class ChatbotService {
    constructor(chatbotRepository) {
        this.chatbotRepository = chatbotRepository;
        this.openai = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    /**
     * Genera una respuesta con OpenAI (GPT-4) y guarda tanto la pregunta
     * como la respuesta en la base de datos.
     */
    async create(dto) {
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
        }
        catch (error) {
            console.error('❌ Error al generar respuesta con OpenAI:', error);
            throw new common_1.InternalServerErrorException('No se pudo generar la respuesta del chatbot.');
        }
    }
    /**
     * Retorna el historial de conversación de un usuario ordenado por fecha.
     */
    async findAllByUser(usuario_id) {
        try {
            return await this.chatbotRepository.find({
                where: { usuario_id },
                order: { fecha: 'DESC' },
            });
        }
        catch (error) {
            console.error('❌ Error al obtener historial del usuario:', error);
            throw new common_1.InternalServerErrorException('No se pudo recuperar el historial del chatbot.');
        }
    }
};
exports.ChatbotService = ChatbotService;
exports.ChatbotService = ChatbotService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chatbot_entity_1.ChatbotMessage)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ChatbotService);
