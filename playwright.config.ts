import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    /* Porta dedicada para não colidir com outros dev servers locais. */
    baseURL: 'http://localhost:9264',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command:
      'concurrently -k -n vite,api -c blue,magenta "cross-env VITE_API_PROXY_TARGET=http://127.0.0.1:9281 npx vite --port 9264 --strictPort" "cross-env PORT=9281 npm --prefix server run start"',
    url: 'http://localhost:9264',
    reuseExistingServer: false,
    timeout: 180_000,
  },
})
