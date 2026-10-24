async page => {
  // Run with playwright-cli run-code --filename tests/browser/privacy-focus.js
  // Navigate the runner tab to the desired preview origin before running.
  // Regression: a closed preferences panel must not request focus on page mount.
  const url = new URL('/', page.url()).href;
  const context = await page.context().browser().newContext({ viewport: { width: 1350, height: 940 } });
  const errors = [];
  const checks = [];
  await context.addInitScript(() => {
    window.__closedPrivacyFocus = [];
    const focus = HTMLElement.prototype.focus;
    HTMLElement.prototype.focus = function (...args) {
      const dialog = this.closest('.analytics-dialog');
      if (dialog && !dialog.open) window.__closedPrivacyFocus.push(this.getAttribute('aria-label'));
      return focus.apply(this, args);
    };
  });
  const tab = await context.newPage();
  tab.on('pageerror', e => errors.push(e.message));
  try {
    await tab.goto(url);
    const trigger = tab.getByRole('button', { name: 'Preferências de privacidade', exact: true });
    await trigger.waitFor({ state: 'attached' });
    const closedFocus = await tab.evaluate(() => window.__closedPrivacyFocus);
    if (closedFocus.length) throw new Error(`Closed privacy dialog requested focus during initial mount: ${JSON.stringify(closedFocus)}`);
    checks.push('no focus request while panel is closed at initial mount');
    const dialog = tab.locator('.analytics-dialog');
    const close = tab.getByRole('button', { name: 'Fechar preferências', exact: true });
    for (const method of ['button', 'escape']) {
      await trigger.click();
      await tab.waitForFunction(() => document.querySelector('.analytics-dialog')?.open);
      if (!await close.evaluate(el => el === document.activeElement)) throw new Error('Opening the panel did not focus its close control');
      checks.push(`focus on close after opening (${method})`);
      await tab.keyboard.press('Tab');
      if (!await dialog.evaluate(el => el.contains(document.activeElement))) throw new Error('Tab focus escaped the modal');
      if (method === 'button') await close.click(); else await tab.keyboard.press('Escape');
      await tab.waitForFunction(() => !document.querySelector('.analytics-dialog')?.open && document.activeElement === document.querySelector('.analytics-preferences > button'));
      checks.push(`restore opener after closing (${method})`);
    }
    if (errors.length) throw new Error(`Browser errors: ${errors.join('; ')}`);
    await page.evaluate(result => window.__privacyFocusQA = result, { pass: true, url, checks, errors });
  } catch (error) {
    await page.evaluate(result => window.__privacyFocusQA = result, { pass: false, url, checks, errors, failure: String(error) });
    throw error;
  } finally { await context.close(); }
}
