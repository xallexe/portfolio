import yaml from 'js-yaml';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const tekstenDir = resolve(here, '../../data/teksten');

export interface Tekst {
  /** Internal identifier (matches the YAML filename without extension). */
  id: string;
  title: string;
  title_en?: string;
  /** ISO date, e.g. "2026-10-18". */
  date: string;
  body?: string;
  body_en?: string;
}

// js-yaml turns an unquoted `date: 2026-10-18` into a Date; Decap may also
// write it as a string. Normalise both to "YYYY-MM-DD".
function isoDate(raw: unknown): string {
  if (raw instanceof Date) return raw.toISOString().slice(0, 10);
  return String(raw ?? '').slice(0, 10);
}

const files = existsSync(tekstenDir)
  ? readdirSync(tekstenDir).filter((f) => f.endsWith('.yml'))
  : [];

/** All texts, newest first. */
export const teksten: Tekst[] = files
  .map((filename) => {
    const data = yaml.load(readFileSync(join(tekstenDir, filename), 'utf8')) as Omit<Tekst, 'id' | 'date'> & {
      date?: unknown;
    };
    return { ...data, id: filename.replace(/\.yml$/, ''), date: isoDate(data.date) };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

export function formatDate(iso: string, lang: 'nl' | 'en'): string {
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(lang === 'nl' ? 'nl-BE' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
