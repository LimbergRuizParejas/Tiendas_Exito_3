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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatbotController = void 0;
const common_1 = require("@nestjs/common");
const chatbot_service_1 = require("./chatbot.service");
const create_chatbot_message_dto_1 = require("./create-chatbot-message.dto");
let ChatbotController = class ChatbotController {
    constructor(chatbotService) {
        this.chatbotService = chatbotService;
    }
    // Crear mensaje de conversación (guarda en la DB)
    async create(dto) {
        try {
            return await this.chatbotService.create(dto);
        }
        catch (error) {
            console.error('Error al crear el mensaje del chatbot:', error);
            throw new common_1.HttpException('No se pudo guardar el mensaje del chatbot', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    // Obtener historial del chatbot para un usuario
    async findAllByUser(usuario_id) {
        try {
            return await this.chatbotService.findAllByUser(usuario_id);
        }
        catch (error) {
            console.error('Error al obtener historial del usuario:', error);
            throw new common_1.HttpException('No se pudo obtener el historial del chatbot', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    // Opcional: para testear que está vivo
    healthCheck() {
        return 'Chatbot API funcionando 🚀';
    }
};
exports.ChatbotController = ChatbotController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_chatbot_message_dto_1.CreateChatbotMessageDto]),
    __metadata("design:returntype", Promise)
], ChatbotController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':usuario_id'),
    __param(0, (0, common_1.Param)('usuario_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChatbotController.prototype, "findAllByUser", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], ChatbotController.prototype, "healthCheck", null);
exports.ChatbotController = ChatbotController = __decorate([
    (0, common_1.Controller)('chatbot'),
    __metadata("design:paramtypes", [chatbot_service_1.ChatbotService])
], ChatbotController);
