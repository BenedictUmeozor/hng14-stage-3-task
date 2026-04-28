import { test, expect } from '@playwright/test';

test.describe('PWA Functionality', () => {
  test('manifest.json is accessible', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/manifest.json');
    expect(response?.status()).toBe(200);
    
    const manifest = await response?.json();
    expect(manifest.name).toBe('Habit Tracker');
    expect(manifest.short_name).toBe('Habits');
    expect(manifest.start_url).toBe('/');
    expect(manifest.display).toBe('standalone');
    expect(manifest.background_color).toBe('#ffffff');
    expect(manifest.theme_color).toBe('#3b82f6');
    expect(manifest.icons).toHaveLength(2);
    expect(manifest.icons[0].src).toBe('/icons/icon-192.png');
    expect(manifest.icons[1].src).toBe('/icons/icon-512.png');
  });

  test('service worker registers successfully', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Wait for service worker to register
    const swRegistered = await page.evaluate(async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          return registration !== null;
        } catch (error) {
          return false;
        }
      }
      return false;
    });
    
    expect(swRegistered).toBe(true);
  });

  test('PWA icons are accessible', async ({ page }) => {
    const icon192Response = await page.goto('http://localhost:3000/icons/icon-192.png');
    expect(icon192Response?.status()).toBe(200);
    
    const icon512Response = await page.goto('http://localhost:3000/icons/icon-512.png');
    expect(icon512Response?.status()).toBe(200);
  });

  test('service worker file is accessible', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/sw.js');
    expect(response?.status()).toBe(200);
    
    const content = await response?.text();
    expect(content).toContain('habit-tracker-v1');
    expect(content).toContain('install');
    expect(content).toContain('fetch');
  });

  test('theme color meta tag is present', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const themeColor = await page.locator('meta[name="theme-color"]').getAttribute('content');
    expect(themeColor).toBe('#3b82f6');
  });

  test('manifest link is present in head', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const manifestLink = await page.locator('link[rel="manifest"]').getAttribute('href');
    expect(manifestLink).toBe('/manifest.json');
  });
});
