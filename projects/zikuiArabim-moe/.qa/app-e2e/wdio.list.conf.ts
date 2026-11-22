// Прогон по списку файлов: SPEC_LIST=<файл со списком путей specs/...> (по одному в строке).
import fs from 'node:fs';
import { config as base } from './wdio.conf.ts';
const list = fs.readFileSync(process.env.SPEC_LIST!, 'utf8').split('\n').filter(Boolean).map((p) => './' + p);
export const config = { ...base, specs: list, exclude: [] };
