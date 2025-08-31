"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.imageFileFilter = void 0;
// 📌 src/common/upload.config.ts
const multer_1 = require("multer");
const path_1 = require("path");
const fs_1 = require("fs");
const UPLOAD_ROOT = (0, path_1.join)(process.cwd(), 'uploads', 'products');
function ensureUploadDir() {
    if (!(0, fs_1.existsSync)(UPLOAD_ROOT)) {
        (0, fs_1.mkdirSync)(UPLOAD_ROOT, { recursive: true });
    }
}
const imageFileFilter = (_req, file, cb) => {
    const allowed = /\/(jpg|jpeg|png|webp|gif)$/i;
    if (allowed.test(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Solo se permiten imágenes (jpg, jpeg, png, webp, gif)'));
    }
};
exports.imageFileFilter = imageFileFilter;
exports.storage = (0, multer_1.diskStorage)({
    destination: (_req, _file, cb) => {
        ensureUploadDir();
        cb(null, UPLOAD_ROOT);
    },
    filename: (_req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${unique}${(0, path_1.extname)(file.originalname)}`);
    },
});
