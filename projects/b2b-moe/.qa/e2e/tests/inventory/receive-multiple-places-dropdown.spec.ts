// spec: specs/inventory.md §6.4
// seed: tests/seed.admin.spec.ts
// #2830b76e (+ #10cc07dc) — товар «QA-AUTO-2830-C-<ts>» в двух СУЩЕСТВУЮЩИХ ПУСТЫХ местах C-01 и C-02 («קומה 1»), добавленных через «הוספת מיקום»;
// «קליטת מלאי» даёт выбор только из мест товара, количество попадает в выбранное место. Нет «הוספת מיקום» (#7b8b97e9) — test.skip.
// Карта не меняется. afterAll: «הסרה מהמקום» в обоих местах, удаление товара, проверка что C-01/C-02 «ריק».
import { test, expect, Page, Browser } from '@playwright/test';
import * as path from 'path';

const ADMIN = path.resolve(__dirname, '../../../auth/admin.json');
test.use({ storageState: ADMIN });
test.describe.configure({ mode: 'serial' });

const TS = Date.now().toString().slice(-7);
const created = new Set<string>(); // QA-AUTO товары, которые нужно убрать в afterAll
const usedPlaces = new Set<string>(); // коды мест, которые тест занимал

const qtyBtn = (page: Page, p: string) => page.getByRole('button', { name: `קליטת מלאי — ${p}`, exact: true });
const locBtn = (page: Page, p: string) => page.getByRole('button', { name: `מיקום במחסן — ${p}`, exact: true });
const row = (page: Page, p: string) => qtyBtn(page, p).locator('xpath=ancestor::*[.//button[@aria-label="פעולות"]][1]');

async function findProduct(page: Page, p: string) {
  await page.goto('/catalog');
  await expect(page.getByRole('heading', { level: 1, name: 'קטלוג וניהול' })).toBeVisible({ timeout: 30_000 });
  await page.getByRole('textbox', { name: /חיפוש מוצר/ }).fill(p);
  await expect(qtyBtn(page, p).or(page.getByText('לא נמצאו מוצרים התואמים לסינון'))).toBeVisible({ timeout: 20_000 });
}

async function createProduct(page: Page, p: string, sku: string) {
  await page.goto('/catalog/new');
  await expect(page.getByRole('heading', { level: 1, name: 'מוצר חדש' })).toBeVisible({ timeout: 30_000 });
  await page.getByRole('textbox', { name: /שם מוצר/ }).fill(p);
  await page.getByRole('textbox', { name: /מק"ט/ }).fill(sku);
  await page.getByRole('spinbutton', { name: 'מחיר בסיס' }).fill('1');
  created.add(p);
  await page.getByRole('button', { name: 'שמירה', exact: true }).click();
  await expect(page.getByText('נוסף לקטלוג.')).toBeVisible({ timeout: 15_000 });
}

// ---------- карта склада ----------
const side = (page: Page) =>
  page.getByRole('complementary').filter({ has: page.getByRole('button', { name: 'כיווץ סרגל האחסון' }) });

/** /warehouse/map → «קומה 1» → шкаф → полка с кодом (код ищем по совпадению «(CODE)» в подписи, не по полной подписи).
 *  Возвращает имя полки (из панели шкафа) — оно нужно для выбора в окне «מיקום במחסן». */
async function openPlace(page: Page, code: string): Promise<string> {
  await page.goto('/warehouse/map');
  await expect(page.getByRole('heading', { level: 1, name: 'מפת המחסן' })).toBeVisible({ timeout: 30_000 });
  const tabs = page.getByRole('tablist', { name: 'קומות המחסן' });
  await expect(tabs).toBeVisible({ timeout: 30_000 });
  await tabs.getByRole('tab', { name: 'קומה 1' }).click();
  await expect(page.getByText('טוען את המלאי')).toHaveCount(0, { timeout: 30_000 });
  const cabinet = `ארון ${code[0]}`;
  await side(page).getByRole('button', { name: new RegExp(`^${cabinet}`) }).click();
  await expect(side(page).getByRole('heading', { name: 'תכולת הארון' })).toBeVisible();
  const shelf = side(page).getByRole('button', { name: new RegExp(`${code}(?!\\d)`) }).first();
  await expect(shelf).toBeVisible();
  const label = (await shelf.innerText()).split('\n').map((s) => s.trim()).filter(Boolean);
  await shelf.click();
  await expect(side(page).getByRole('heading', { name: 'תכולת המדף' })).toBeVisible();
  return label[0];
}

/** Место должно быть пустым («המדף ריק») — иначе test.skip. Возвращает имя полки. */
async function openEmptyPlaceOrSkip(page: Page, code: string): Promise<string> {
  const shelfName = await openPlace(page, code);
  const empty = await side(page).getByText('המדף ריק').isVisible().catch(() => false);
  test.skip(!empty, `${code} занято`);
  usedPlaces.add(code);
  return shelfName;
}

/** Окно «מיקום במחסן» для товара → «קומה 1» → шкаф → полка → «שמירה». */
async function bindPlace(page: Page, p: string, code: string, shelfName: string, add = false) {
  if (add) await row(page, p).getByText('הוספת מיקום').click();
  else await locBtn(page, p).first().click();
  const dlg = page.getByRole('dialog');
  await expect(dlg.getByRole('heading', { name: add ? 'הוספת מיקום' : 'מיקום במחסן' })).toBeVisible();
  await expect(dlg).toContainText(p);
  await dlg.getByRole('tab', { name: 'קומה 1' }).click();
  await expect(dlg.getByText('בחרו פריט אחסון')).toBeVisible();
  await dlg.getByRole('button', { name: `ארון ${code[0]}`, exact: true }).click();
  await expect(dlg.getByText(`בחרו מדף ב«ארון ${code[0]}»`)).toBeVisible();
  await dlg.getByRole('button', { name: shelfName, exact: true }).click();
  await expect(dlg).toContainText(`| ${code}`);
  await dlg.getByRole('button', { name: 'שמירה', exact: true }).click();
  await expect(dlg).toHaveCount(0, { timeout: 15_000 });
}

/** Подпись опции в select «מקום היעד» для кода места на «קומה 1». */
async function placeOption(dlg: ReturnType<Page['getByRole']>, code: string) {
  const opts = dlg.getByRole('combobox', { name: 'מקום היעד' }).locator('option');
  const texts = await opts.allInnerTexts();
  const hit = texts.filter((t) => t.startsWith('קומה 1') && t.includes(`(${code})`));
  expect(hit, `опция места ${code} на «קומה 1»`).toHaveLength(1);
  return hit[0];
}

/** Открыть «קליטת מלאי» входом 1 (число «במלאי») или входом 2 (кнопка в шапке + выбор товара). */
async function openIntake(page: Page, p: string, entry: 1 | 2) {
  await findProduct(page, p);
  if (entry === 1) {
    await qtyBtn(page, p).click();
  } else {
    await page.getByRole('button', { name: 'קליטת מלאי', exact: true }).click();
    const dlg0 = page.getByRole('dialog');
    await expect(dlg0.getByRole('heading', { name: 'הוספת פריט למלאי' })).toBeVisible();
    await selectProductInIntake(page, p);
  }
  const dlg = page.getByRole('dialog');
  await expect(dlg.getByRole('heading', { name: 'הוספת פריט למלאי' })).toBeVisible();
  return dlg;
}

async function selectProductInIntake(page: Page, p: string) {
  const dlg = page.getByRole('dialog');
  const box = dlg.getByRole('combobox', { name: 'מוצר' });
  await box.fill(p);
  await dlg.getByRole('option', { name: new RegExp(p) }).first().click();
}

async function submitIntake(page: Page, qty: number, p: string, code: string | null) {
  const dlg = page.getByRole('dialog');
  await dlg.getByRole('spinbutton', { name: 'כמות', exact: true }).fill(String(qty));
  await dlg.getByRole('button', { name: 'הוספה' }).click();
  // имя товара в тосте обёрнуто в bidi-изоляторы U+2068/U+2069 — поэтому regex
  if (code) await expect(page.getByText(new RegExp(`^${qty} של .?${p}.? נקלטו למדף ${code}\\.$`))).toBeVisible({ timeout: 15_000 });
  await expect(dlg).toHaveCount(0, { timeout: 15_000 });
}

/** Строка товара в панели места, закреплённая за местом (с «הסרה מהמקום»); строка «ממתין לשיוך למקום» (остаток без места) — другая. */
const placedItem = (page: Page, p: string) =>
  side(page).getByRole('listitem').filter({ hasText: p }).filter({ has: page.getByRole('button', { name: 'הסרה מהמקום' }) });

// ---------- уборка ----------
/** На карте: у товара p в месте code — «הסרה מהמקום» → «הסרה» (если он там есть). */
async function unplaceFromPlace(page: Page, p: string, code: string) {
  await openPlace(page, code);
  const item = placedItem(page, p);
  if (!(await item.count())) return;
  await item.getByRole('button', { name: 'הסרה מהמקום' }).click();
  const dlg = page.getByRole('dialog');
  await expect(dlg.getByRole('heading', { name: 'הסרת המוצר מהמקום' })).toBeVisible();
  await dlg.getByRole('button', { name: 'הסרה', exact: true }).click();
  await expect(placedItem(page, p)).toHaveCount(0, { timeout: 15_000 });
}

async function deleteFromCatalog(page: Page, p: string) {
  await findProduct(page, p);
  if (!(await qtyBtn(page, p).count())) return;
  await row(page, p).getByRole('button', { name: 'פעולות' }).click();
  await page.getByRole('menuitem', { name: /^מחיקה/ }).click();
  const dlg = page.getByRole('dialog');
  await expect(dlg.getByRole('heading', { name: 'מחיקת מוצר' })).toBeVisible({ timeout: 20_000 });
  await dlg.getByRole('button', { name: 'מחיקה', exact: true }).click();
  await expect(page.getByText(/הוסר מהקטלוג|נמחק\./).first()).toBeVisible({ timeout: 15_000 });
}

/** afterAll: освободить места, удалить товары, убедиться что места «ריק». */
async function cleanupAll(browser: Browser) {
  const ctx = await browser.newContext({ storageState: ADMIN, locale: 'he-IL', viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  try {
    for (const p of created) {
      for (const code of usedPlaces) await unplaceFromPlace(page, p, code);
      await deleteFromCatalog(page, p);
    }
    for (const code of usedPlaces) {
      await openPlace(page, code);
      await expect(side(page).getByText('המדף ריק'), `${code} должно быть «ריק» после уборки`).toBeVisible();
    }
  } finally {
    await ctx.close();
  }
}

/** «יומן תנועות» на карте: поиск по товару; возвращает локатор записей по типу. */
async function openJournal(page: Page, p: string) {
  await page.goto('/warehouse/map');
  await expect(page.getByRole('heading', { level: 1, name: 'מפת המחסן' })).toBeVisible({ timeout: 30_000 });
  const expand = page.getByRole('button', { name: 'פתיחת יומן התנועות' });
  if (await expand.isVisible().catch(() => false)) await expand.click();
  await page.getByRole('textbox', { name: 'חיפוש ביומן התנועות' }).fill(p);
  return (kind: string) =>
    page.getByText(kind, { exact: true }).and(page.locator(':not([role="tab"])'))
      .locator(`xpath=ancestor::div[.//*[contains(normalize-space(), "${p}")]][1]`);
}

/** Количество товара в панели места: строка листитема, состоящая только из числа. */
async function qtyInPlacePanel(page: Page, p: string): Promise<number> {
  const item = placedItem(page, p);
  await expect(item).toHaveCount(1);
  const lines = (await item.innerText()).split('\n').map((s) => s.trim());
  const n = lines.find((l) => /^\d+$/.test(l));
  return n === undefined ? NaN : Number(n);
}

/** Количества записей журнала (строка с числом перед именем автора «test admin»), по возрастанию. */
async function journalQtys(entries: ReturnType<Page['locator']>): Promise<number[]> {
  const texts = await entries.allInnerTexts();
  return texts.map((t) => Number(t.match(/(\d+)\s*\n\s*test admin/)?.[1] ?? NaN)).sort((a, b) => a - b);
}

const C = `QA-AUTO-2830-C-${TS}`;
const CODE1 = 'C-01';
const CODE2 = 'C-02';
const NO_PLACE = 'ללא מקום — לשיוך בהמשך';

/** Варианты мест в «לאיזה מקום»: кроме «ללא מקום» — только места товара (C-01 и C-02 на «קומה 1»); выбрано одно из них. */
async function expectOnlyProductPlaces(dlg: ReturnType<Page['getByRole']>) {
  const select = dlg.getByRole('combobox', { name: 'מקום היעד' });
  const texts = (await select.locator('option').allInnerTexts()).filter((t) => t !== NO_PLACE);
  expect(texts.sort(), 'варианты мест: только C-01 и C-02').toEqual([await placeOption(dlg, CODE1), await placeOption(dlg, CODE2)].sort());
  const chosen = await select.locator('option:checked').innerText();
  expect(chosen, 'выбрано одно из мест товара, не «ללא מקום»').toMatch(/\((C-01|C-02)\)/);
  expect(chosen.startsWith('קומה 1')).toBe(true);
}

test.describe('inventory — קליטה: מוצר בשני מקומות (#2830b76e)', () => {
  test.afterAll(async ({ browser }) => {
    test.setTimeout(240_000);
    await cleanupAll(browser);
  });

  test('מוצר בשני מקומות — בחירה מבין מקומות המוצר, הכמות נכנסת למקום שנבחר #2830b76e @desktop @data', async ({ page }) => {
    test.setTimeout(300_000);
    const shelf1 = await openEmptyPlaceOrSkip(page, CODE1);
    const shelf2 = await openEmptyPlaceOrSkip(page, CODE2);

    // 1. создать C; C-01 через «מיקום במחסן»; затем «הוספת מיקום» → C-02
    await createProduct(page, C, `QA2830C${TS}`);
    await findProduct(page, C);
    await bindPlace(page, C, CODE1, shelf1);
    await findProduct(page, C);
    await expect(row(page, C)).toContainText(CODE1);
    test.skip(!(await row(page, C).getByText('הוספת מיקום').count()), 'нет «הוספת מיקום» (#7b8b97e9)');
    await bindPlace(page, C, CODE2, shelf2, true);

    // 2. ячейка: два места, «קבוע» нет (текст / title / aria-name)
    await findProduct(page, C);
    const cell = row(page, C).getByRole('button', { name: /^מיקום במחסן — / });
    const texts = await cell.allInnerTexts();
    const joined = texts.join(' | ');
    expect(joined).toContain(CODE1);
    expect(joined).toContain(CODE2);
    for (const btn of await cell.all()) {
      expect(await btn.innerText()).not.toContain('קבוע');
      expect((await btn.getAttribute('title')) ?? '').not.toContain('קבוע');
      expect((await btn.getAttribute('aria-label')) ?? '').not.toContain('קבוע');
    }
    await expect(row(page, C).getByText('קבוע', { exact: true })).toHaveCount(0);

    // 3. вход 1: варианты — только места C; выбрать C-02 → 3
    let dlg = await openIntake(page, C, 1);
    await expectOnlyProductPlaces(dlg);
    await dlg.getByRole('combobox', { name: 'מקום היעד' }).selectOption({ label: await placeOption(dlg, CODE2) });
    await expect(dlg).toContainText(/נבחר: .*\(C-02\)/);
    await submitIntake(page, 3, C, CODE2);

    // 4. вход 2: выбрать C → варианты; выбрать C-01 → 1
    dlg = await openIntake(page, C, 2);
    await expectOnlyProductPlaces(dlg);
    await dlg.getByRole('combobox', { name: 'מקום היעד' }).selectOption({ label: await placeOption(dlg, CODE1) });
    await expect(dlg).toContainText(/נבחר: .*\(C-01\)/);
    await submitIntake(page, 1, C, CODE1);
    await findProduct(page, C);
    await expect(qtyBtn(page, C)).toHaveText('4', { timeout: 15_000 });

    // 5. карта: C-02 — 3, C-01 — 1; журнал: «← C-02» (3) и «← C-01» (1), «← ללא מקום» нет
    await openPlace(page, CODE2);
    expect(await qtyInPlacePanel(page, C)).toBe(3);
    await openPlace(page, CODE1);
    expect(await qtyInPlacePanel(page, C)).toBe(1);

    const entry = await openJournal(page, C);
    const intakes = entry('קליטה');
    await expect(intakes).toHaveCount(2, { timeout: 20_000 });
    const in2 = intakes.filter({ hasText: CODE2 });
    const in1 = intakes.filter({ hasText: CODE1 });
    await expect(in2).toHaveCount(1);
    await expect(in1).toHaveCount(1);
    await expect(in2).toContainText('מחוץ למחסן');
    await expect(in1).toContainText('מחוץ למחסן');
    expect(await journalQtys(in2)).toEqual([3]);
    expect(await journalQtys(in1)).toEqual([1]);
    await expect(intakes.filter({ hasText: 'ללא מקום' })).toHaveCount(0);
  });
});
