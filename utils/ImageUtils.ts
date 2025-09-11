import path from 'path';
import sharp from 'sharp';

export default class ImageUtils {
  static imgTagRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi;

  public static async compressAndSaveImage(base64: string): Promise<string> {
    const matches = base64.match(/^data:image\/(png|jpeg|jpg);base64,(.+)$/);
    if (!matches) throw new Error('Invalid base64 image');

    const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const filename = `${Math.floor(
      Math.random() * 1_000_000_000,
    )}-${Date.now()}.${ext}`;
    const outputPath = path.join(__dirname, '../public/image', filename);

    await sharp(buffer)
      .toFormat('jpeg')
      .jpeg({ quality: 80 })
      .toFile(outputPath);
    return `/image/${filename}`;
  }

  public static async processHtmlImages(html: string): Promise<string> {
    let newHtml = html;
    let match: RegExpExecArray | null;

    while ((match = ImageUtils.imgTagRegex.exec(html)) !== null) {
      const src = match[1];
      if (!src) continue;
      if (src.startsWith('data:')) {
        const newSrc = await ImageUtils.compressAndSaveImage(src);
        newHtml = newHtml.replace(src, newSrc);
      }
    }

    return newHtml;
  }
}
