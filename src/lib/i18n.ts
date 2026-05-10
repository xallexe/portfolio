export type Lang = 'nl' | 'en';

export const ui = {
  nl: {
    home: 'Home',
    contact: 'Contact',
    work: 'work',
    close: 'sluiten',
    email: 'email',
    backToWork: 'terug naar werk',
  },
  en: {
    home: 'Home',
    contact: 'Contact',
    work: 'work',
    close: 'close',
    email: 'email',
    backToWork: 'back to work',
  },
} as const;

export function t(lang: Lang, key: keyof typeof ui.nl): string {
  return ui[lang][key];
}

export function localized(lang: Lang, nl?: string, en?: string): string {
  if (lang === 'en') return en?.trim() || nl?.trim() || '';
  return nl?.trim() || '';
}

export function pathFor(lang: Lang, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === 'en') return `/en${clean === '/' ? '' : clean}`;
  return clean;
}
