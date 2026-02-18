import path from 'node:path';
import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  outDir: 'dist',

  vite: () => ({
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@shared': path.resolve(__dirname, 'src/shared'),
        '@qr': path.resolve(__dirname, 'src/qr'),
      },
    },
  }),

  manifest: ({ browser }) => ({
    name: '__MSG_EXTENSION_NAME__',
    description: '__MSG_EXTENSION_DESCRIPTION__',
    version: '1.0.0',
    author: 'QRCGen <support@qrcgen.com>',
    homepage_url: 'https://qrcgen.com',
    default_locale: 'en',

    permissions: [...(browser !== 'firefox' ? ['sidePanel'] : []), 'storage', 'activeTab', 'tabs'],
    host_permissions: ['https://qr.qrcgen.com/*'],

    ...(browser !== 'firefox' && {
      side_panel: {
        default_path: 'sidepanel/index.html',
      },
    }),

    ...(browser === 'firefox' && {
      sidebar_action: {
        default_panel: 'sidepanel/index.html',
        default_title: '__MSG_EXTENSION_NAME__',
      },
    }),

    content_security_policy: {
      extension_pages: "script-src 'self'; object-src 'self'",
    },

    icons: {
      16: 'icons/16.png',
      32: 'icons/32.png',
      48: 'icons/48.png',
      128: 'icons/128.png',
    },

    action: {
      default_title: '__MSG_EXTENSION_NAME__',
    },

    ...(browser === 'chrome' && {
      minimum_chrome_version: '116',
    }),

    ...(browser === 'edge' && {
      minimum_chrome_version: '116',
    }),

    ...(browser === 'opera' && {
      minimum_chrome_version: '116',
    }),

    ...(browser === 'firefox' && {
      browser_specific_settings: {
        gecko: {
          id: 'qrcgen@qrcgen.com',
          strict_min_version: '142.0',
        },
      },
    }),
  }),

  browser: 'chrome',
});
