// 📂 backend/src/inventario/inventario.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  UsePipes,
  ValidationPipe,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';

import { FileInterceptor } from '@nestjs/platform-express';
import { InventarioService } from './inventario.service';
import { CrearInventarioDto } from './crear-inventario.dto';
import { UpdateInventoryDto } from './update-inventory.dto';
import { UpdateStockDto } from './update-stock.dto';

import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiTags,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

const UPLOAD_DIR = join(process.cwd(), 'uploads', 'products');
const MAX_FILE_MB = 5;

// Asegura que exista el directorio para subidas
function ensureDir(dir: string) {
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch {
    /* no-op */
  }
}

// Filtro de archivos por mimetype (defensa temprana)
function imageFileFilter(_req: any, file: Express.Multer.File, cb: (err: Error | null, accept: boolean) => void) {
  if (/^image\/(png|jpe?g|webp|gif)$/i.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Use PNG, JPG, JPEG, WEBP o GIF.'), false);
  }
}

const storage = diskStorage({
  destination: (_req, _file, cb) => {
    ensureDir(UPLOAD_DIR);
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${unique}${extname(file.originalname)}`);
  },
});

@ApiTags('Inventario')
@ApiBearerAuth('access-token')
@Controller('inventory') // => /api/inventory (por tu prefijo global)
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  // -------------------------------------------------------------------------
  // READ (ENDPOINTS ESTÁTICOS PRIMERO PARA EVITAR COLISIÓN DE RUTAS)
  // -------------------------------------------------------------------------
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar inventario' })
  @ApiOkResponse({ description: 'Listado del inventario' })
  async findAll() {
    return this.inventarioService.findAll();
  }

  @Get('summary')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resumen del inventario (totales)' })
  async getSummary() {
    return this.inventarioService.getSummary();
  }

  @Get('grouped')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Inventario agrupado por categoría y marca' })
  async findGroupedByCategoryAndBrand() {
    return this.inventarioService.findGroupedByCategoryAndBrand();
  }

  @Get('by-barcode/:codigo')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener un producto por código de barras' })
  @ApiParam({ name: 'codigo', required: true, description: 'Código de barras (solo dígitos)' })
  @ApiOkResponse({ description: 'Producto encontrado (o null si no existe)' })
  async findByBarcode(@Param('codigo') codigo: string) {
    const code = (codigo ?? '').trim();
    if (!code) return null;
    return this.inventarioService.findByBarcode(code);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID numérico del producto' })
  @ApiOkResponse({ description: 'Producto encontrado' })
  @ApiNotFoundResponse({ description: 'Producto no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inventarioService.findOne(id);
  }

  // -------------------------------------------------------------------------
  // CREATE (multipart/form-data con imagen opcional)
  // -------------------------------------------------------------------------
  @Post()
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage,
      fileFilter: imageFileFilter,
      limits: { fileSize: MAX_FILE_MB * 1024 * 1024 },
    }),
  )
  // Pipe a nivel de método para convivir con multipart (evita que el campo de archivo
  // choque con forbidNonWhitelisted del pipe global)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Crear producto con imagen opcional' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['nombreProducto', 'cantidad', 'precio', 'categoriaId', 'marcaId'],
      properties: {
        nombreProducto: { type: 'string' },
        codigoBarras: { type: 'string', nullable: true, example: '7501031311309', description: 'Solo dígitos (3–64)' },
        cantidad: { type: 'number' },
        precio: { type: 'number' },
        categoriaId: { type: 'number' },
        marcaId: { type: 'number' },
        fechaCaducidad: { type: 'string', format: 'date', nullable: true },
        imagen: { type: 'string', format: 'binary', nullable: true, description: `Máx ${MAX_FILE_MB}MB` },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Producto creado' })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @ApiConflictResponse({ description: 'Conflicto (p.ej. código de barras duplicado)' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CrearInventarioDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /image\/(png|jpe?g|webp|gif)$/i })
        .addMaxSizeValidator({ maxSize: MAX_FILE_MB * 1024 * 1024 })
        .build({ fileIsRequired: false }),
    )
    file?: Express.Multer.File,
  ) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('POST /inventory BODY:', dto);
      console.log('POST /inventory FILE?:', !!file);
    }
    const imagenPath = file ? `/uploads/products/${file.filename}` : undefined;
    return this.inventarioService.create({ ...dto, imagenPath });
  }

  // -------------------------------------------------------------------------
  // UPDATE (multipart/form-data con posible reemplazo de imagen)
  // -------------------------------------------------------------------------
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage,
      fileFilter: imageFileFilter,
      limits: { fileSize: MAX_FILE_MB * 1024 * 1024 },
    }),
  )
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Actualizar producto (con o sin nueva imagen)' })
  @ApiParam({ name: 'id', required: true, description: 'ID numérico del producto' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nombreProducto: { type: 'string' },
        codigoBarras: { type: 'string', nullable: true, example: '7501031311309', description: 'Solo dígitos (3–64)' },
        cantidad: { type: 'number' },
        precio: { type: 'number' },
        categoriaId: { type: 'number' },
        marcaId: { type: 'number' },
        fechaCaducidad: { type: 'string', format: 'date', nullable: true },
        imagen: { type: 'string', format: 'binary', nullable: true, description: `Máx ${MAX_FILE_MB}MB` },
      },
    },
  })
  @ApiOkResponse({ description: 'Producto actualizado' })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @ApiNotFoundResponse({ description: 'Producto no encontrado' })
  @ApiConflictResponse({ description: 'Conflicto (p.ej. código de barras duplicado)' })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInventoryDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /image\/(png|jpe?g|webp|gif)$/i })
        .addMaxSizeValidator({ maxSize: MAX_FILE_MB * 1024 * 1024 })
        .build({ fileIsRequired: false }),
    )
    file?: Express.Multer.File,
  ) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('PUT /inventory/:id BODY:', dto);
      console.log('PUT /inventory/:id FILE?:', !!file);
    }
    const extra = file ? { imagenPath: `/uploads/products/${file.filename}` } : {};
    return this.inventarioService.update(id, { ...dto, ...extra });
  }

  // -------------------------------------------------------------------------
  // PATCH stock
  // -------------------------------------------------------------------------
  @Patch(':id/stock')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar sólo el stock (cantidad)' })
  @ApiParam({ name: 'id', required: true, description: 'ID numérico del producto' })
  @ApiOkResponse({ description: 'Stock actualizado' })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @ApiNotFoundResponse({ description: 'Producto no encontrado' })
  async updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStockDto,
  ) {
    return this.inventarioService.updateStock(id, dto.cantidad);
  }

  // -------------------------------------------------------------------------
  // DELETE
  // -------------------------------------------------------------------------
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar producto' })
  @ApiParam({ name: 'id', required: true, description: 'ID numérico del producto' })
  @ApiResponse({ status: 204, description: 'Eliminado' })
  @ApiNotFoundResponse({ description: 'Producto no encontrado' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.inventarioService.delete(id);
  }
}
