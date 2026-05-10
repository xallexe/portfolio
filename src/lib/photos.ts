import type { ImageMetadata } from 'astro';

const imports = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/photos/*.{jpg,JPG,jpeg,JPEG,png,PNG}',
  { eager: true }
);

const byFilename = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(imports)) {
  const filename = path.split('/').pop()!;
  byFilename.set(filename, mod.default);
}

export function getPhoto(filename: string): ImageMetadata | undefined {
  return byFilename.get(filename);
}
