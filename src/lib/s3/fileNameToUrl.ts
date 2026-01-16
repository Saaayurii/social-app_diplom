import 'server-only';
/**
 * The database only stores the `fileName` of the files (image/video),
 * use this function to get the full URL of the file.
 *
 * @param fileName The filename of the image or video.
 * @returns The full URL of the image or video.
 */
export function fileNameToUrl(fileName: string | null) {
  if (!fileName) return null;
  // If it's already a full URL (external), return as-is
  if (fileName.startsWith('http://') || fileName.startsWith('https://')) {
    return fileName;
  }
  return `/uploads/${fileName}`;
}
