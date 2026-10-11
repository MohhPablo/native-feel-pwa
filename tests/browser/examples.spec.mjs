import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for(const port of [4173,4174]) {
 test(`reader/dialog/viewport/a11y on ${port}`,async({page})=>{
  await page.goto(`http://127.0.0.1:${port}`);
  await expect(page.getByRole('heading',{level:1})).toHaveText('Reading room');
  const meta=await page.locator('meta[name="viewport"]').getAttribute('content');
  expect(meta).not.toMatch(/user-scalable\s*=\s*no|maximum-scale/);
  await page.getByLabel('Practice note (not saved)').fill('A useful note');
  expect(await page.getByLabel('Practice note (not saved)').evaluate(e=>parseFloat(getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(16);
  const trigger=page.getByRole('button',{name:'About this example'});
  await trigger.click();
  await expect(page.getByRole('dialog',{name:'About the reading room'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Close',exact:true})).toBeFocused();
  for (const key of ['Tab','Tab','Shift+Tab','Shift+Tab']) {
    await page.keyboard.press(key);
    expect(await page.getByLabel('Practice note (not saved)').evaluate(e=>e===document.activeElement)).toBe(false);
    expect(await trigger.evaluate(e=>e===document.activeElement)).toBe(false);
  }
  await page.getByLabel('Practice note (not saved)').evaluate(e=>e.focus());
  expect(await page.getByLabel('Practice note (not saved)').evaluate(e=>e===document.activeElement)).toBe(false);
  await page.setViewportSize({width:320,height:640});
  expect(await page.getByRole('dialog').evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
  const modalResults=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  expect(modalResults.violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();await page.getByRole('button',{name:'Close',exact:true}).click();
  await expect(trigger).toBeFocused();
  await expect(page.getByLabel('Practice note (not saved)')).toHaveValue('A useful note');
  await page.setViewportSize({width:320,height:640});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.evaluate(()=>document.documentElement.style.fontSize='200%');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await trigger.click();
  expect(await page.getByRole('dialog').evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
  await page.getByRole('button',{name:'Close',exact:true}).click();
  await page.emulateMedia({reducedMotion:'reduce'});
  expect(await trigger.evaluate(e=>getComputedStyle(e).transitionDuration)).toBe('0s');
  const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  expect(results.violations).toEqual([]);
  const manifest=await page.request.get(`http://127.0.0.1:${port}/manifest.webmanifest`);
  expect(manifest.ok()).toBe(true);expect((await manifest.json()).display).toBe('standalone');
 });
}
