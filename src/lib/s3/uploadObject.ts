import 'server-only';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function uploadObject(file: Buffer, fileName: string, type: string) {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  const filePath = path.join(uploadsDir, fileName);

  await writeFile(filePath, file);
}
