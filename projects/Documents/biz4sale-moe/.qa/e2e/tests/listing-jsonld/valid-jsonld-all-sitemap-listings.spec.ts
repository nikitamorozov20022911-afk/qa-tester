// spec: specs/listing-jsonld.md
// seed: tests/seed.spec.ts
import { test, expect } from '@playwright/test';

const LISTING_TYPES = ['Product', 'Offer', 'LocalBusiness'];

function typesOf(node: any): string[] {
  const t = node?.['@type'];
  return Array.isArray(t) ? t : t ? [t] : [];
}

// Разворачивает массивы и @graph в плоский список узлов.
function flatten(json: any): any[] {
  if (Array.isArray(json)) return json.flatMap(flatten);
  if (json && Array.isArray(json['@graph'])) return [json, ...json['@graph'].flatMap(flatten)];
  return json ? [json] : [];
}

function locs(xml: string): string[] {
  return [...xml.matchAll(/<loc>\s*([^<\s][^<]*?)\s*<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, '&'));
}

test.describe('JSON-LD страницы объявления', () => {
  test('Каждое объявление из sitemap: валидный JSON-LD — один BreadcrumbList и один блок объявления #fbeedf @desktop @prod-safe', async ({ request }) => {
    test.setTimeout(600_000);

    // 1. request.get('/sitemap.xml'), взять все <loc> с /businessdetail?id=
    const sitemapRes = await request.get('/sitemap.xml');
    expect(sitemapRes.status()).toBe(200);
    const urls = locs(await sitemapRes.text());
    // Если это sitemap index — раскрыть вложенные карты.
    for (const n of urls.filter((u) => /\.xml(\?|$)/.test(u))) {
      const r = await request.get(n);
      expect(r.status(), `sitemap ${n}`).toBe(200);
      urls.push(...locs(await r.text()));
    }
    const listingUrls = [...new Set(urls.filter((u) => u.includes('/businessdetail?id=')))];
    expect(listingUrls.length, 'В sitemap ≥ 1 URL /businessdetail?id=').toBeGreaterThanOrEqual(1);

    const problems: string[] = [];
    for (const url of listingUrls) {
      // 2. Для каждого URL: request.get(url), достать все <script type="application/ld+json">
      const res = await request.get(url);
      if (res.status() !== 200) {
        problems.push(`${url}: HTTP ${res.status()}`);
        continue;
      }
      const html = await res.text();
      const blocks = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);

      // 3. Каждый блок — JSON.parse; посчитать узлы BreadcrumbList и блоки объявления
      const nodes: any[] = [];
      for (const [i, raw] of blocks.entries()) {
        try {
          nodes.push(...flatten(JSON.parse(raw)));
        } catch (e) {
          problems.push(`${url}: блок JSON-LD #${i + 1} не парсится (${(e as Error).message})`);
        }
      }
      const breadcrumbs = nodes.filter((n) => typesOf(n).includes('BreadcrumbList')).length;
      const listings = nodes.filter((n) => typesOf(n).some((t) => LISTING_TYPES.includes(t))).length;
      if (breadcrumbs !== 1) problems.push(`${url}: BreadcrumbList = ${breadcrumbs}, ожидался 1`);
      if (listings !== 1) problems.push(`${url}: блоков объявления = ${listings}, ожидался 1`);

      // В <meta name="robots"> нет noindex
      const robots = [...html.matchAll(/<meta[^>]*name=["']robots["'][^>]*>/gi)].map((m) => m[0]);
      if (robots.some((m) => /noindex/i.test(m))) problems.push(`${url}: meta robots содержит noindex`);
    }

    expect(problems, problems.join('\n')).toEqual([]);
  });
});
