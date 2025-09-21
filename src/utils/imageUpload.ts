import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export interface ImageUploadOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  preserveAspectRatio?: boolean;
}

export interface ImageUploadResult {
  success: boolean;
  filename?: string;
  url?: string;
  width?: number;
  height?: number;
  size?: number;
  error?: string;
}

const DEFAULT_OPTIONS: ImageUploadOptions = {
  maxWidth: 300,
  maxHeight: 120,
  quality: 90,
  format: 'png',
  preserveAspectRatio: true,
};

export class ImageUploadService {
  private uploadDir: string;
  private publicPath: string;

  constructor(uploadDir = 'public/uploads/logos') {
    this.uploadDir = uploadDir;
    this.publicPath = uploadDir.replace('public', '');
  }

  async ensureUploadDir(): Promise<void> {
    if (!existsSync(this.uploadDir)) {
      await mkdir(this.uploadDir, { recursive: true });
    }
  }

  async processAndSaveImage(
    buffer: Buffer,
    filename: string,
    options: ImageUploadOptions = {}
  ): Promise<ImageUploadResult> {
    try {
      await this.ensureUploadDir();

      const opts = { ...DEFAULT_OPTIONS, ...options };
      const timestamp = Date.now();
      const ext = opts.format === 'jpeg' ? 'jpg' : opts.format;
      const processedFilename = `${filename}_${timestamp}.${ext}`;
      const filepath = path.join(this.uploadDir, processedFilename);

      // Process image with Sharp
      let sharpInstance = sharp(buffer);

      // Get original metadata
      const metadata = await sharpInstance.metadata();
      
      if (!metadata.width || !metadata.height) {
        return {
          success: false,
          error: 'Invalid image: could not determine dimensions',
        };
      }

      // Resize if needed
      if (opts.maxWidth || opts.maxHeight) {
        sharpInstance = sharpInstance.resize({
          width: opts.maxWidth,
          height: opts.maxHeight,
          fit: opts.preserveAspectRatio ? 'inside' : 'fill',
          withoutEnlargement: true,
        });
      }

      // Set format and quality
      if (opts.format === 'jpeg') {
        sharpInstance = sharpInstance.jpeg({ quality: opts.quality });
      } else if (opts.format === 'png') {
        sharpInstance = sharpInstance.png({ quality: opts.quality });
      } else if (opts.format === 'webp') {
        sharpInstance = sharpInstance.webp({ quality: opts.quality });
      }

      // Process and save
      const processedBuffer = await sharpInstance.toBuffer();
      await writeFile(filepath, processedBuffer);

      // Get final metadata
      const finalMetadata = await sharp(processedBuffer).metadata();

      return {
        success: true,
        filename: processedFilename,
        url: `${this.publicPath}/${processedFilename}`,
        width: finalMetadata.width,
        height: finalMetadata.height,
        size: processedBuffer.length,
      };
    } catch (error) {
      console.error('Image upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  validateImageFile(file: {
    mimetype: string;
    size: number;
  }): { valid: boolean; error?: string } {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.mimetype)) {
      return {
        valid: false,
        error: 'Formato de arquivo não suportado. Use JPEG, PNG, WebP ou SVG.',
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'Arquivo muito grande. O tamanho máximo é 5MB.',
      };
    }

    return { valid: true };
  }

  async extractDominantColors(buffer: Buffer): Promise<string[]> {
    try {
      // Get image stats to extract dominant colors
      const { dominant } = await sharp(buffer).stats();
      
      // Convert RGB to hex
      const rgbToHex = (r: number, g: number, b: number) => {
        return `#${[r, g, b].map(x => {
          const hex = Math.round(x).toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        }).join('')}`;
      };

      // Extract dominant color
      const dominantColor = rgbToHex(dominant.r, dominant.g, dominant.b);

      // For now, return the dominant color
      // In a more advanced implementation, we could use libraries like 'node-vibrant'
      // to extract a full color palette
      return [dominantColor];
    } catch (error) {
      console.error('Color extraction error:', error);
      return ['#3b82f6']; // Fallback to default primary color
    }
  }
}

export const imageUploadService = new ImageUploadService();

