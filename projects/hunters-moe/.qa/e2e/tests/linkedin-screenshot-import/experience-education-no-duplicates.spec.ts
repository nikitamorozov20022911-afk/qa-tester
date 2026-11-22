// spec: LinkedIn screenshot import — Edit Profile
// seed: tests/seed.talent.spec.ts
import { test, expect, Locator } from '@playwright/test';
import path from 'path';

test.use({ storageState: path.join(__dirname, '../../../auth/talent.json') });

const count = (text: string, needle: string) => text.split(needle).length - 1;

// Reads the text of the work-experience and education sections from the dialog.
async function readLists(dialog: Locator) {
  const text = await dialog.innerText();
  const workStart = text.indexOf('ניסיון תעסוקתי');
  const eduStart = text.indexOf('השכלה', workStart);
  const articlesStart = text.indexOf('מאמרים/כתבות', eduStart);
  return {
    work: text.slice(workStart, eduStart),
    edu: text.slice(eduStart, articlesStart),
  };
}

test.describe('LinkedIn screenshot import — Edit Profile', () => {
  test('Experience and education are added unsaved, without duplicates @desktop #8fc7be', async ({ page }) => {
    // 1. Open /profile?edit=personal. Open tab «ניסיון מקצועי»; remember the lists.
    await page.goto('https://hunters-sooty.vercel.app/profile?edit=personal');
    const dialog = page.getByRole('dialog', { name: 'עריכת פרופיל' });
    await expect(dialog).toBeVisible();
    const personalTab = dialog.getByRole('tab', { name: 'פרטים אישיים' });
    const experienceTab = dialog.getByRole('tab', { name: 'ניסיון מקצועי' });
    const documentsTab = dialog.getByRole('tab', { name: 'מסמכים' });
    await experienceTab.click();
    await expect(dialog.getByText('ניסיון תעסוקתי', { exact: true })).toBeVisible();
    const before = await readLists(dialog);

    // 2. Back on «פרטים אישיים»: upload li-mock-1.png, wait for the summary box.
    await personalTab.click();
    await expect(personalTab).toHaveAttribute('aria-selected', 'true');
    const chooserPromise = page.waitForEvent('filechooser');
    await dialog.getByRole('button', { name: 'בחירת תמונה', exact: true }).click();
    const chooser = await chooserPromise;
    await chooser.setFiles(path.join(__dirname, '../../fixtures/linkedin-screenshot/li-mock-1.png'));
    await expect(dialog.getByText('יובא מצילום המסך של LinkedIn')).toBeVisible({ timeout: 90_000 });

    // 3. Open «ניסיון מקצועי»; read «ניסיון תעסוקתי» and «השכלה».
    await experienceTab.click();
    await expect(dialog.getByText('ניסיון תעסוקתי', { exact: true })).toBeVisible();
    const verify = async () => {
      const { work, edu } = await readLists(dialog);

      // Every work place that was there before is still there
      for (const line of before.work.split('\n').map((l) => l.trim()).filter(Boolean)) {
        if (/^(ניסיון תעסוקתי|הוספת מקום עבודה)$/.test(line)) continue;
        expect(work).toContain(line);
      }

      // Exactly one row each
      expect(count(work, 'Senior Backend Developer')).toBe(1);
      expect(count(work, 'Wix')).toBe(1);
      expect(count(work, 'Software Engineer')).toBe(1);
      expect(count(work, 'Check Point')).toBe(1);
      expect(count(edu, 'Tel Aviv University')).toBe(1);

      // Dates
      expect(work).toContain('מרץ 2021');
      expect(work).toContain('היום');
      expect(work).toContain('2017');
      expect(work).toContain('2021');
      expect(edu).toContain('2013');
      expect(edu).toContain('2016');
      return { work, edu };
    };
    const first = await verify();

    // 4. Switch to «מסמכים», then back to «ניסיון מקצועי»; read both lists again.
    await documentsTab.click();
    await expect(documentsTab).toHaveAttribute('aria-selected', 'true');
    await experienceTab.click();
    await expect(dialog.getByText('ניסיון תעסוקתי', { exact: true })).toBeVisible();
    const second = await verify();

    // Lists are the same after the tab switch
    expect(second.work).toBe(first.work);
    expect(second.edu).toBe(first.edu);

    // Close the dialog without saving
    await dialog.getByRole('button', { name: 'סגירה' }).click();
    await expect(dialog).toBeHidden();
  });
});
