import 'server-only';
import { unlink } from 'fs/promises';
import path from 'path';

export async function deleteObject(fileName: string) {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  const filePath = path.join(uploadsDir, fileName);

  try {
    await unlink(filePath);
  } catch (error) {
    // File may not exist, ignore error
  }
}
