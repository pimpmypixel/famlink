import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/Browser',
  use: {
    baseURL: 'https://famlink.test', // Laravel Herd URL
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'echo "Using Laravel Herd - server should already be running"',
    port: 443,
    reuseExistingServer: true,
  },
});
