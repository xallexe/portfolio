import yaml from 'js-yaml';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const yamlPath = resolve(here, '../../data/projects.yaml');

export interface PhotoEntry {
  file: string;
  info?: string;
  info_en?: string;
}

export type Column = 'a' | 'b';

export interface Project {
  id: string;
  /** Underlying ordinal. Drives column placement: odd → 'a' (left), even → 'b' (right).
   *  Stays constant even if `name` changes. */
  order: number;
  /** Optional override. When set, forces the project into this column regardless of `order`. */
  column?: Column;
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
}

interface RawData {
  site: SiteConfig;
  projects: Project[];
}

const raw = yaml.load(readFileSync(yamlPath, 'utf8')) as RawData;

// Fallback: if a project lacks an `order`, assign one based on its index in the YAML.
const projectsWithOrder: Project[] = raw.projects.map((p, i) => ({
  ...p,
  order: typeof p.order === 'number' ? p.order : i + 1,
}));

export const site: SiteConfig = raw.site;
export const projects: Project[] = projectsWithOrder;

/** Resolves the column for a project: explicit `column` override beats parity of `order`. */
export function columnFor(p: Project): Column {
  if (p.column === 'a' || p.column === 'b') return p.column;
  return p.order % 2 === 1 ? 'a' : 'b';
}
