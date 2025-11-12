import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  // Enable console logging
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    console.log('[BROWSER ' + type.toUpperCase() + ']: ' + text);
  });

  // Capture network errors
  page.on('requestfailed', request => {
    console.log('[NETWORK FAILED]: ' + request.url() + ' - ' + request.failure().errorText);
  });

  // Capture API responses
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('/weather/') || url.includes('/api/weather/')) {
      console.log('[WEATHER API]: ' + response.status() + ' ' + url);
      try {
        const body = await response.text();
        console.log('[WEATHER RESPONSE]: ' + body);
      } catch (e) {
        console.log('[WEATHER RESPONSE]: Could not read body');
      }
    }
  });

  try {
    console.log('Navigating to http://localhost:5173...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    console.log('Taking screenshot of login page...');
    await page.screenshot({ path: '/tmp/01-login-page.png', fullPage: true });

    // Check if already logged in
    const currentUrl = page.url();
    if (currentUrl.includes('/admin')) {
      console.log('Already logged in, continuing...');
    } else {
      console.log('Logging in with admin credentials...');
      await page.fill('input[type="email"]', 'admin@greenscape.com');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(3000);
    }

    console.log('Taking screenshot after login...');
    await page.screenshot({ path: '/tmp/02-after-login.png', fullPage: true });

    // Navigate to Admin Dashboard
    console.log('Navigating to Admin Dashboard...');
    await page.goto('http://localhost:5173/admin/dashboard', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    console.log('Taking screenshot of Admin Dashboard...');
    await page.screenshot({ path: '/tmp/03-admin-dashboard.png', fullPage: true });

    // Check if WeatherWidget is in the DOM
    console.log('Checking for WeatherWidget in DOM...');
    const weatherWidgetExists = await page.$('.bg-gradient-to-br.from-blue-500.to-blue-600');
    console.log('WeatherWidget DOM element exists on Dashboard: ' + (weatherWidgetExists !== null));

    // Check Quick Widgets section
    const quickWidgetsSection = await page.$$('.grid.grid-cols-1.gap-5.lg\\:grid-cols-3');
    console.log('Quick Widgets sections found: ' + quickWidgetsSection.length);

    // Get all gradient boxes in the Quick Widgets section
    const gradientBoxes = await page.$$('.bg-gradient-to-br');
    console.log('Total gradient boxes found: ' + gradientBoxes.length);

    // Navigate to Appointment Calendar
    console.log('Navigating to Appointment Calendar...');
    await page.goto('http://localhost:5173/admin/appointments', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    console.log('Taking screenshot of Appointment Calendar...');
    await page.screenshot({ path: '/tmp/04-appointment-calendar.png', fullPage: true });

    // Check if WeatherWidget is in the DOM on calendar page
    console.log('Checking for WeatherWidget in DOM on calendar page...');
    const weatherWidgetExistsCalendar = await page.$('.bg-gradient-to-br.from-blue-500.to-blue-600');
    console.log('WeatherWidget DOM element exists on Calendar: ' + (weatherWidgetExistsCalendar !== null));

    // Check header section
    const headerSection = await page.$('.flex.justify-between.items-start.gap-6');
    console.log('Header section with weather widget container exists: ' + (headerSection !== null));

    if (headerSection) {
      const widthDiv = await page.$('.w-80.flex-shrink-0');
      console.log('Weather widget container (w-80) exists: ' + (widthDiv !== null));
    }

    // Get HTML of the weather widget area
    try {
      const dashboardHTML = await page.evaluate(() => {
        const section = document.querySelector('.grid.grid-cols-1.gap-5.lg\\:grid-cols-3');
        return section ? section.innerHTML : 'Section not found';
      });
      console.log('\n[DASHBOARD QUICK WIDGETS HTML]:\n' + dashboardHTML.substring(0, 500));
    } catch (e) {
      console.log('Could not extract dashboard HTML');
    }

    console.log('\nScreenshots saved:');
    console.log('  - /tmp/01-login-page.png');
    console.log('  - /tmp/02-after-login.png');
    console.log('  - /tmp/03-admin-dashboard.png');
    console.log('  - /tmp/04-appointment-calendar.png');

    await page.waitForTimeout(2000);

  } catch (error) {
    console.error('Error during debugging:' + error);
    await page.screenshot({ path: '/tmp/error-screenshot.png', fullPage: true });
  } finally {
    await browser.close();
  }
})();
