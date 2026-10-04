import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests', testMatch: '**/*.spec.mjs',
  fullyParallel: true, workers: 2, forbidOnly: Boolean(process.env.CI),
  retries: 0, reporter: 'list',
  use: {
    channel: process.env.CI ? undefined : 'chrome',
    javaScriptEnabled: false, colorScheme: 'light',
  },
});
