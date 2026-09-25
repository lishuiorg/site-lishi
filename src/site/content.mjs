/* 内容装载（站点层）
 *
 * 读取内容库、套上本站的分类与分期规则，并把结果缓存起来——
 * 构建时每个页面模块都会调用，缓存保证内容只读一次。
 *
 * 通用的装载与解析在 lishui-kit：来源层与成果层读取、front-matter 解析、
 * Markdown 渲染、来源与关联解析。这里只做历史志特有的三件事：
 * 六类归属、时间分期、街镇筛选值。
 */

import { existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContent, forLang } from 'lishui-kit';
import { entryPath } from 'lishui-kit/i18n/paths.mjs';
import { SITE, CATEGORIES, PERIODS, TYPE_DIRS } from './config.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
export const SITE_ROOT = resolve(HERE, '..', '..');

/** 内容库位置：环境变量优先，其次站点库内的 content/ 子模块，最后同级目录。 */
export function resolveContentDir() {
  const candidates = [
    process.env.LISHUI_CONTENT_DIR,
    join(SITE_ROOT, 'content'),
    resolve(SITE_ROOT, '..', 'lishui-history'),
  ].filter(Boolean);
  for (const dir of candidates) {
    if (existsSync(join(dir, 'schema', 'enums.json'))) return dir;
  }
  throw new Error(
    '找不到内容库。请设置 LISHUI_CONTENT_DIR，或在站点库内放置 content/ 子模块，'
    + '或把 lishui-history 放在同级目录。',
  );
}

/* ---------- 本站分类规则 ---------- */

/** 六类归属由实体类型与 genre / place_type / tags 推出，规则固定，不额外维护字段。 */
function deriveCategory(entry) {
  if (entry.type === 'place') return entry.place_type === '纪念地' ? 'jindai' : 'wenwu';
  if (entry.type === 'article') {
    if (entry.genre === '沿革') return 'jianzhi';
    if (entry.genre === '综述') return 'kaogu';
    return 'jiuzhi';
  }
  const tags = entry.tags || [];
  if (tags.includes('近现代') || tags.includes('抗战')) return 'jindai';
  return 'dashiji';
}

/** 时间分期：精度不详或无年份的条目不上轴，返回 null。 */
export function periodOf(entry) {
  const t = entry.time;
  if (!t || typeof t.start !== 'number' || t.precision === 'unknown') return null;
  if (t.start < 591) return PERIODS[0];
  return PERIODS.find((p) => t.start >= p.from && t.start <= p.to) || PERIODS[PERIODS.length - 1];
}

/** 上轴条件：有年份且精度不是 unknown。 */
export const onTimeline = (entry) => periodOf(entry) !== null;

/** 街镇筛选值：从 address 里匹配行政区划专名，只作筛选用，不写回内容。 */
function deriveTown(entry, glossary) {
  const address = entry.address;
  if (!address) return null;
  for (const g of glossary) {
    if (g.category !== '行政区划') continue;
    if (!/(镇|街道)$/.test(g.zh)) continue;
    if (address.includes(g.zh)) return g.zh;
  }
  return null;
}

/* ---------- 装载与缓存 ---------- */

let cached = null;

export function siteContent() {
  if (cached) return cached;

  const content = loadContent({ contentDir: resolveContentDir(), typeDirs: TYPE_DIRS });
  for (const entry of content.entries) {
    entry.category = deriveCategory(entry);
    entry.path = entryPath(entry);
    entry.period = periodOf(entry);
    entry.town = deriveTown(entry, content.glossary);
  }

  const updated = content.entries.map((e) => e.updated).filter(Boolean).sort().pop() || '';
  SITE.contentUpdated = updated;
  cached = { ...content, updated };
  return cached;
}

/* ---------- 取用 ---------- */

export const ofSection = (entries, lang, dirName) =>
  entries.filter((e) => e.lang === lang && e.dirName === dirName);

export const ofCategory = (entries, lang, key) =>
  entries.filter((e) => e.lang === lang && e.category === key);

/** 按年份升序；无年份的排在最后，按标题排。 */
export function byYear(a, b) {
  const ya = typeof a.time?.start === 'number' ? a.time.start : null;
  const yb = typeof b.time?.start === 'number' ? b.time.start : null;
  if (ya === null && yb === null) return String(a.title).localeCompare(String(b.title), 'zh');
  if (ya === null) return 1;
  if (yb === null) return -1;
  return ya - yb;
}

export const byUpdated = (a, b) =>
  String(b.updated || '').localeCompare(String(a.updated || ''))
  || String(a.title).localeCompare(String(b.title), 'zh');

/** 筛选取值排序：朝代按取值表顺序，类别按本站六类顺序，其余按字面。 */
export function sortFilterValues(values, group, content) {
  if (group === 'dynasty') {
    const order = content.enums.dynasty || [];
    return values.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  }
  if (group === 'category') {
    const order = CATEGORIES.map((c) => c.key);
    return values.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  }
  return values.sort((a, b) => String(a).localeCompare(String(b), 'zh'));
}

/** 站点规模：条目数、类别数、覆盖朝代、来源记录数。 */
export function statsOf(content, lang) {
  const list = forLang(content.entries, lang);
  const dynasties = new Set(list.map((e) => e.time?.dynasty).filter(Boolean));
  return {
    entries: list.length,
    categories: CATEGORIES.length,
    dynasties: dynasties.size,
    sources: content.sourcesAll.length,
  };
}
