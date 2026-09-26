/* 页面模型（站点层）
 *
 * 视图模板在 lishui-kit/astro/views/，三站共用一份；本站要算什么、按什么口径算，
 * 全集中在这里。新增分站时改的就是这个文件，不必再复制六个视图。
 *
 * 每个函数返回的对象直接摊给对应的模板：ctx 与 lang 是必给的，
 * 其余是本站特有的那几处（规模条取哪几项、筛选组、分组维度、元信息行、排序口径）。
 */

import { forLang } from 'lishui-kit';
import { ctxFor } from './context.mjs';
import {
  siteContent, statsOf, ofSection, onTimeline, byYear, sortFilterValues,
} from './content.mjs';
import { CATEGORIES, PERIODS, SECTIONS, RULES } from './config.mjs';

/** 规模条四项。本站第三个数字是覆盖朝代。 */
const STAT_KEYS = ['entries', 'categories', 'dynasties', 'sources'];
const statItems = (stats) => STAT_KEYS.map((key) => ({ key, value: stats[key] }));

/** 首页凡例四条，编号与文字取自本站 config（本站用底座默认值）。 */
const rulesOf = (lang) => RULES[lang].map(([no, title, text]) => ({ no, title, text }));

/** 首页：形态是「时间轴预览」，中部预览区按五期分期。 */
export function homeModel(lang) {
  const ctx = ctxFor(lang);
  const content = siteContent();
  const list = forLang(content.entries, lang);
  const timeline = list.filter(onTimeline).sort(byYear);

  const periods = PERIODS.map((period) => ({
    key: period.key,
    name: lang === 'zh' ? period.zh : period.en,
    range: lang === 'zh' ? period.range.zh : period.range.en,
    items: timeline.filter((entry) => entry.period?.key === period.key),
  }));

  return {
    ctx,
    lang,
    statItems: statItems(statsOf(content, lang)),
    rules: rulesOf(lang),
    periods,
  };
}

/** 列表页：四个筛选组由本站字段推出，取值一律用内容库的原始取值。 */
export function listModel(lang, section) {
  const ctx = ctxFor(lang);
  const content = siteContent();
  const { ui } = ctx;

  const entries = ofSection(content.entries, lang, section).sort(byYear);

  const uniq = (fn) => [...new Set(entries.map(fn).filter(Boolean))];
  const dynasties = sortFilterValues(uniq((e) => e.time?.dynasty), 'dynasty', content);
  const towns = sortFilterValues(uniq((e) => e.town), 'town', content);
  const cats = sortFilterValues(uniq((e) => e.category), 'category', content);
  const tags = sortFilterValues([...new Set(entries.flatMap((e) => e.tags || []))], 'tag', content);

  const catNameOf = (key) => ctx.catName(CATEGORIES.find((c) => c.key === key));
  const option = (value, label) => ({ value, label });

  const groups = entries.length > 0 ? [
    { key: 'category', label: ui.list.filterCategory, options: cats.map((v) => option(v, catNameOf(v))) },
    { key: 'dynasty', label: ui.list.filterDynasty, options: dynasties.map((v) => option(v, ctx.tagLabel(v))) },
    { key: 'town', label: ui.list.filterTown, options: towns.map((v) => option(v, ctx.tagLabel(v))) },
    { key: 'tag', label: ui.list.filterTag, options: tags.map((v) => option(v, ctx.tagLabel(v))) },
  ].filter((group) => group.options.length > 0) : [];

  return { ctx, lang, section, entries, groups, text: SECTIONS[section][lang] };
}

/** 索引页：按年代分期分组，列序用模板默认（年份起首）。 */
export function indexModel(lang) {
  const ctx = ctxFor(lang);
  const content = siteContent();
  const { ui } = ctx;

  const list = forLang(content.entries, lang).sort(byYear);

  const groups = [
    ...PERIODS.map((period) => ({
      key: period.key,
      name: lang === 'zh' ? period.zh : period.en,
      range: lang === 'zh' ? period.range.zh : period.range.en,
      items: [],
    })),
    { key: 'none', name: ui.indexPage.noTime, range: '', items: [] },
  ];
  for (const entry of list) {
    const group = onTimeline(entry)
      ? groups.find((g) => g.key === entry.period.key)
      : groups[groups.length - 1];
    group.items.push(entry);
  }

  return { ctx, lang, groups, total: list.length };
}

/** 详情页：同板块条目按年份升序，元信息行取本站的年代口径。 */
export function detailModel(lang, entry) {
  const ctx = ctxFor(lang);
  const { ui } = ctx;

  const siblings = ofSection(siteContent().entries, lang, entry.dirName).sort(byYear);

  const metaBits = [
    ctx.timeText(entry) ? `${ui.detail.time}　${ctx.timeText(entry)}` : '',
    entry.time?.dynasty ? `${ui.detail.dynasty}　${ctx.gloss(entry.time.dynasty, lang)}` : '',
    entry.time?.precision ? `${ui.detail.precision}　${ctx.enumLabel('precision', entry.time.precision)}` : '',
    `${ui.detail.depth}　${ctx.depthLabel(entry)}`,
    entry.updated ? `${ui.detail.updated}　${entry.updated}` : '',
  ].filter(Boolean);

  const schemaType = entry.type === 'place'
    ? 'LandmarksOrHistoricalBuildings'
    : entry.type === 'event' ? 'Event' : 'Article';

  return { ctx, lang, entry, siblings, metaBits, schemaType };
}

/** 关于页：左栏放范围、来源、门禁、许可，右栏放双语、纠错、技术说明；本站无已知缺口。 */
export function aboutModel(lang) {
  const ctx = ctxFor(lang);
  return {
    ctx,
    lang,
    statItems: statItems(statsOf(siteContent(), lang)),
    columns: {
      left: ['scope', 'source', 'gate', 'license'],
      right: ['bilingual', 'fix', 'tech'],
    },
  };
}
