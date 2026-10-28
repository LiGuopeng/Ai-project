import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { mkdirSync } from 'node:fs';
import { extname, join } from 'node:path';

const uploadDirectory = join(process.cwd(), 'uploads');

function sanitizeBaseName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

@Controller('files')
export class UploadController {
  @Post('single')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_request, _file, callback) => {
          mkdirSync(uploadDirectory, { recursive: true });
          callback(null, uploadDirectory);
        },
        filename: (_request, file, callback) => {
          const extension = extname(file.originalname).toLowerCase();
          const nameWithoutExtension = extension
            ? file.originalname.slice(0, -extension.length)
            : file.originalname;
          const baseName = sanitizeBaseName(nameWithoutExtension);
          callback(null, `${Date.now()}-${baseName || 'file'}${extension}`);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
      fileFilter: (_request, file, callback) => {
        const allowedMimeTypes = new Set([
          'image/jpeg',
          'image/png',
          'application/pdf',
        ]);

        callback(null, allowedMimeTypes.has(file.mimetype));
      },
    }),
  )
  uploadSingle(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        '请使用 multipart/form-data，并将文件放在名为 file 的字段中；仅支持 JPG、PNG、PDF。',
      );
    }

    return {
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: `/uploads/${encodeURIComponent(file.filename)}`,
    };
  }
}
