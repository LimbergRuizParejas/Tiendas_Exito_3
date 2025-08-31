"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCajaDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_caja_dto_1 = require("./create-caja.dto");
class UpdateCajaDto extends (0, mapped_types_1.PartialType)(create_caja_dto_1.CreateCajaDto) {
}
exports.UpdateCajaDto = UpdateCajaDto;
