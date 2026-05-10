import yaml from 'js-yaml';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(here, '../../data');

export interface PhotoEntry {
  /** Public URL relative to the site root, e.g. "/uploads/photos/foo.jpg". */
  file: string;
  info?: string;
  info_en?: string;
}

export type Column = 'a' | 'b';

export interface Project {
  /** Internal identifier (matches the YAML filename without extension). */
  id: string;
  /** Underlying ordinal. Drives column placement: odd → 'a' (left), even → 'b' (right). */
  order: number;
  /** Optional override. When set, forces the project into this column regardless of `order`. */
  column?: Column | '';
  name: string;
  name_en?: string;
  title?: string;
  title_en?: string;
  medium?: string;
  medium_en?: string;
  klant?: string;
  info?: string;
  info_en?: string;
  photos: PhotoEntry[];
}

export interface SiteConfig {
  artist: string;
  email: string;
  instagram?: string;
  behance?: string;
  linkedin?: string;
  website?: string;
}

const siteRaw = yaml.load(readFileSync(join(dataDir, 'site.yml'), 'utf8')) as SiteConfig;

const projectsDir = join(dataDir, 'projects');
const projectFiles = readdirSync(projectsDir).filter((f) => f.endsWith('.yml'));

const projectsRaw: Project[] = projectFiles.map((filename, i) => {
  const id = filename.replace(/\.yml$/, '');
  const data = yaml.load(readFileSync(join(projectsDir, filename), 'utf8')) as Omit<Project, 'id'>;
  return {
    id,
    ...data,
    order: typeof data.order === 'number' ? data.order : i + 1,
  };
});

export const site: SiteConfig = siteRaw;
export const projects: Project[] = projectsRaw;

/** Resolves the column for a project: explicit `column` override beats parity of `order`. */
export function columnFor(p: Project): Column {
  if (p.column === 'a' || p.column === 'b') return p.column;
  return p.order % 2 === 1 ? 'a' : 'b';
}
