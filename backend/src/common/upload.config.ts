// 📌 src/common/upload.config.ts
import { diskStorage } from 'multer';
import type { Request } from 'express';
import type { FileFilterCallback } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const UPLOAD_ROOT = join(process.cwd(), 'uploads', 'products');

function ensureUploadDir() {
  if (!existsSync(UPLOAD_ROOT)) {
    mkdirSync(UPLOAD_ROOT, { recursive: true });
  }
}

export const imageFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const allowed = /\/(jpg|jpeg|png|webp|gif)$/i;
  if (allowed.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (jpg, jpeg, png, webp, gif)'));
  }
};

export const storage = diskStorage({
  destination: (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    ensureUploadDir();
    cb(null, UPLOAD_ROOT);
  },
  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${unique}${extname(file.originalname)}`);
  },
});
