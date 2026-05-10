import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://example.com',
  i18n: {
    defaultLocale: 'nl',
    locales: ['nl', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  vite: {
    server: {
      allowedHosts: ['.trycloudflare.com', '.lan', 'localhost'],
    },
  },
});
