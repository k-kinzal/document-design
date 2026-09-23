import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4174',
    channel: process.env.CI ? undefined : 'chrome',
    viewport: { width: 1440, height: 1000 },
    colorScheme: 'light',
  },
  webServer: {
    command: 'npm run build && npx vp preview --port 4174',
    url: 'http://127.0.0.1:4174',
    env: { DOC_SITE_NO_OPEN: '1' },
    reuseExistingServer: false,
    timeout: 120000,
  },
});
