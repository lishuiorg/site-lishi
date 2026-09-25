/* 站点常量与本站分类体系
 *
 * 六类内容、五期分期、三个板块的说明文字都只属于历史志，放在站点层；
 * kit 只提供通用的设计系统、组件与译法，不认这套分类。
 */

export const SITE = {
  id: 'lishui-history',
  name: '溧水历史志',
  nameEn: 'Lishui History',
  host: 'lishi.lishui.org',
  origin: 'https://lishi.lishui.org',
  portal: 'https://lishui.org',
  portalName: '溧水知识门户',
  portalNameEn: 'Lishui Knowledge Portal',
  contentUpdated: '',
};

/** 实体目录 → 实体类型；与内容库的目录名一致。 */
export const TYPE_DIRS = { events: 'event', places: 'place', articles: 'article' };

/* ---------- 六类内容 ---------- */

export const CATEGORIES = [
  {
    key: 'jianzhi',
    zh: '建置沿革',
    en: 'Administrative History',
    glyph: 'm1',
    dirName: 'articles',
    desc: {
      zh: '置县、升州、降县、撤县设区，以及历代隶属的转移。',
      en: 'The founding of the county, its promotion to a zhou and back, its reconstitution as a district, and the changes of superior authority.',
    },
  },
  {
    key: 'dashiji',
    zh: '历代大事记',
    en: 'Annals',
    glyph: 'm2',
    dirName: 'events',
    desc: {
      zh: '按年份系事的条目，每条标明纪年、精度与来源。',
      en: 'Entries tied to a year, each with its era name, date precision and sources.',
    },
  },
  {
    key: 'wenwu',
    zh: '文物古迹',
    en: 'Heritage Sites',
    glyph: 'm3',
    dirName: 'places',
    desc: {
      zh: '桥梁、古塔、遗址等不可移动文物，附文保级别与公布批次。',
      en: 'Bridges, pagodas and sites, with their protection level and listing.',
    },
  },
  {
    key: 'kaogu',
    zh: '考古发现',
    en: 'Archaeology',
    glyph: 'm4',
    dirName: 'articles',
    desc: {
      zh: '洞穴遗址、化石与发掘经过，年代口径逐条标明。',
      en: 'Cave sites, fossils and excavations, with the dating of each stated.',
    },
  },
  {
    key: 'jiuzhi',
    zh: '旧志摘录与考据',
    en: 'Gazetteer Selections',
    glyph: 'm5',
    dirName: 'articles',
    desc: {
      zh: '历代《溧水县志》的摘录与辨析，引文标卷次页码。',
      en: 'Selections from the Lishui gazetteers and commentary on them, quoted by juan and page.',
    },
  },
  {
    key: 'jindai',
    zh: '红色李巷与近现代',
    en: 'Modern Lishui',
    glyph: 'm6',
    dirName: 'places',
    desc: {
      zh: '抗战时期的驻军与机关，以及 1949 年以后的区划调整。',
      en: 'Wartime garrisons and organs, and the administrative changes after 1949.',
    },
  },
];

/* ---------- 时间分期 ---------- */

export const PERIODS = [
  {
    key: 'pre',
    zh: '史前',
    en: 'Prehistory',
    range: { zh: '置县之前', en: 'Before the county' },
    note: { zh: '年代为估算', en: 'Dates approximate' },
  },
  { key: 'suitang', zh: '隋唐', en: 'Sui and Tang', from: 591, to: 959, range: { zh: '591–959', en: '591–959' } },
  { key: 'songyuan', zh: '宋元', en: 'Song and Yuan', from: 960, to: 1367, range: { zh: '960–1367', en: '960–1367' } },
  { key: 'mingqing', zh: '明清', en: 'Ming and Qing', from: 1368, to: 1911, range: { zh: '1368–1911', en: '1368–1911' } },
  { key: 'minguo', zh: '民国', en: 'Republican Period', from: 1912, to: 1949, range: { zh: '1912–1949', en: '1912–1949' } },
  { key: 'dangdai', zh: '当代', en: 'Contemporary', from: 1950, to: 9999, range: { zh: '1950 年以后', en: 'since 1950' } },
];

/* ---------- 板块说明 ---------- */

export const SECTIONS = {
  events: {
    zh: {
      title: '历代大事记',
      lede: '按年份系事的条目：置县、升州降县、开河、兵事与区划调整。每条标明纪年、精度与来源；来源互相矛盾时并列呈现，不做单方面取舍。',
      note: '只收有年份可系的条目。年份存疑的，条目里标出另一说。',
    },
    en: {
      title: 'Annals',
      lede: 'Entries tied to a year: the founding of the county, its promotion and demotion, canal digging, warfare and boundary changes. Each states its era name, date precision and sources; where sources disagree they are set side by side.',
      note: 'Only entries that can be tied to a year. Where the year is disputed, the entry gives the other reading.',
    },
  },
  places: {
    zh: {
      title: '文物古迹',
      lede: '溧水境内的不可移动文物与纪念地。填了文保级别的条目同时标明公布批次；批次未能核实的，条目里写明待核。',
      note: '未查证到文保身份的纪念地不填保护级别，只写可考的活动事实。',
    },
    en: {
      title: 'Heritage Sites',
      lede: 'Immovable heritage and memorial sites in Lishui District. Where a protection level is given, its listing is given with it; where the listing is unverified, the entry says so.',
      note: 'Memorial sites without a verified heritage status carry no protection level, only the facts that can be checked.',
    },
  },
  articles: {
    zh: {
      title: '文章',
      lede: '自行撰写的条目：建置沿革综述、旧志摘录与考据、考古发现的整理。引文标卷次页码，传说与史实分段呈现。',
      note: '成果层文字一律自撰，不整段转录受版权保护的来源。',
    },
    en: {
      title: 'Articles',
      lede: 'Entries written here: surveys of administrative history, selections from the old gazetteers with commentary, and write-ups of archaeological discoveries. Quotations carry juan and page; tradition and record are kept apart.',
      note: 'Entry text is written here, never transcribed wholesale from copyrighted sources.',
    },
  },
};

/* ---------- 来源层归档方式 ---------- */

export const ARCHIVE = {
  zh: {
    fulltext: '全文或影印本归档',
    'link-registered': '登记链接（有在线版本）',
    'catalogued-only': '仅著录（未见在线版本）',
    excerpt: '摘录卡（只记必要片段）',
    link: '链接档案（政府页与名录）',
  },
  en: {
    fulltext: 'Full text or scan archived',
    'link-registered': 'Link registered (online copy exists)',
    'catalogued-only': 'Catalogued only (no online copy seen)',
    excerpt: 'Excerpt card (essential passages only)',
    link: 'Link record (government pages and lists)',
  },
};

/* ---------- 编纂凡例（首页） ---------- */

export const RULES = {
  zh: [
    ['一', '无来源不入库', '每条条目引用的来源都必须在来源层存在对应卡片，且 <code>rights</code> 字段填明授权状态。无来源的事实不进入已发布状态。'],
    ['二', '成果层自撰', '成果层文字一律自行撰写，不整段转录受版权保护的来源；旧志原文属公有领域，引用也标卷次页码。'],
    ['三', '矛盾并列', '来源互相矛盾时并列呈现、各自标注，不做单方面取舍；传说保留「相传」字样，与史实分段。'],
    ['四', '双语成对', '中英共用同一个条目 ID，英文稿放在 <code>content/en/</code> 的对称路径下。缺任一份，两份都不得发布。'],
  ],
  en: [
    ['I', 'No source, no entry', 'Every source cited by an entry must exist as a card in the source layer with its <code>rights</code> status stated. Nothing without a source is published.'],
    ['II', 'Written, not copied', 'Entry text is written here, not transcribed wholesale from copyrighted sources. Public-domain gazetteer passages are quoted by juan and page.'],
    ['III', 'Disagreement shown', 'Where sources disagree they are set side by side, each attributed; tradition keeps its original wording and is kept apart from record.'],
    ['IV', 'Paired languages', 'Chinese and English share one entry ID, with the English draft at the mirrored path under <code>content/en/</code>. If either is missing, neither may be published.'],
  ],
};
