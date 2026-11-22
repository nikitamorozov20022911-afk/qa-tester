// spec: specs/child-handover.md
// seed: tests/seed.parent.spec.ts
import { test, expect } from '@playwright/test';
import * as path from 'path';
import { captureSupabase, rest, userHeaders, visibleText } from '../session-auth/session-auth.helpers';

test.use({ storageState: path.resolve(__dirname, '../../../auth/parent.json') });

test.describe('Режим родителя: контроль данных и окна «אימות זהות» над формами (#a1f2c1, #ee2f5b)', () => {
  test('7.1 Режим родителя: consents и family_members возвращают данные; тестовых согласий нет @desktop @prod-safe #a1f2c1', async ({ page, request }) => {
    // 1. captureSupabase(page, '/children') — видно «מי מתרגל היום?» (режим родителя)
    const sb = await captureSupabase(page, '/children');
    await expect(
      visibleText(page, 'מי מתרגל היום?'),
      'parent.json в режиме ребёнка — не трогать, сообщить пользователю',
    ).toBeVisible();
    const headers = userHeaders(sb);

    // 2. GET rest/v1/consents?select=*
    const consents = await rest(request, sb.base, headers, 'GET', '/rest/v1/consents?select=*');
    expect(consents.status, `consents: ${consents.text}`).toBe(200);
    const consentRows = JSON.parse(consents.text);
    expect(consentRows.length).toBeGreaterThanOrEqual(1);
    for (const row of consentRows) {
      expect(row).toHaveProperty('purpose');
      expect(row).toHaveProperty('policy_version');
    }

    // 3. GET rest/v1/family_members?select=*
    const members = await rest(request, sb.base, headers, 'GET', '/rest/v1/family_members?select=*');
    expect(members.status, `family_members: ${members.text}`).toBe(200);
    expect(JSON.parse(members.text).length).toBeGreaterThanOrEqual(1);

    // 4. GET rest/v1/consents?select=*&purpose=eq.qa-a1f2c1
    const qaConsent = await rest(request, sb.base, headers, 'GET', '/rest/v1/consents?select=*&purpose=eq.qa-a1f2c1');
    expect(qaConsent.status, `consents qa-a1f2c1: ${qaConsent.text}`).toBe(200);
    expect(JSON.parse(qaConsent.text)).toEqual([]);
  });
});
