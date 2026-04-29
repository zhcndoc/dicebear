export type ComparisonCellValue = 'yes' | 'no' | 'free' | 'paid' | string;

export type ComparisonServiceKey =
  | 'dicebear'
  | 'boringAvatars'
  | 'avvvatars'
  | 'multiavatar'
  | 'jdenticon';

export interface ComparisonService {
  key: ComparisonServiceKey;
  name: string;
  url: string;
  starsRepo: string;
  starsFallback: string;
}

export interface ComparisonRow {
  feature: string;
  values: Record<ComparisonServiceKey, ComparisonCellValue>;
}

export interface ComparisonContext {
  stars: Record<string, string>;
  styleCount: number;
}

export const comparisonServices: readonly ComparisonService[] = [
  {
    key: 'dicebear',
    name: 'DiceBear',
    url: 'https://www.dicebear.com',
    starsRepo: 'dicebear/dicebear',
    starsFallback: '8k+',
  },
  {
    key: 'boringAvatars',
    name: 'Boring Avatars',
    url: 'https://boringavatars.com',
    starsRepo: 'boringdesigners/boring-avatars',
    starsFallback: '6k+',
  },
  {
    key: 'avvvatars',
    name: 'Avvvatars',
    url: 'https://avvvatars.com',
    starsRepo: 'nusu/avvvatars',
    starsFallback: '2k+',
  },
  {
    key: 'multiavatar',
    name: 'Multiavatar',
    url: 'https://multiavatar.com',
    starsRepo: 'multiavatar/Multiavatar',
    starsFallback: '1.9k+',
  },
  {
    key: 'jdenticon',
    name: 'Jdenticon',
    url: 'https://jdenticon.com',
    starsRepo: 'dmester/jdenticon',
    starsFallback: '1.7k+',
  },
];

export function buildComparisonRows({ stars, styleCount }: ComparisonContext): ComparisonRow[] {
  const githubStars: Record<ComparisonServiceKey, ComparisonCellValue> = {
    dicebear: stars['dicebear/dicebear'] || '8k+',
    boringAvatars: stars['boringdesigners/boring-avatars'] || '6k+',
    avvvatars: stars['nusu/avvvatars'] || '2k+',
    multiavatar: stars['multiavatar/Multiavatar'] || '1.9k+',
    jdenticon: stars['dmester/jdenticon'] || '1.7k+',
  };

  return [
    { feature: 'GitHub 星标', values: githubStars },
    {
      feature: '头像风格数量',
      values: {
        dicebear: `${styleCount}`,
        boringAvatars: '6',
        avvvatars: '2',
        multiavatar: '1',
        jdenticon: '1',
      },
    },
    {
      feature: '可自定义选项',
      values: {
        dicebear: '丰富',
        boringAvatars: '丰富',
        avvvatars: '有限',
        multiavatar: '有限',
        jdenticon: '有限',
      },
    },
    {
      feature: 'HTTP 接口',
      values: {
        dicebear: 'free',
        boringAvatars: 'paid',
        avvvatars: 'no',
        multiavatar: 'no',
        jdenticon: 'no',
      },
    },
    {
      feature: '命令行',
      values: {
        dicebear: 'yes',
        boringAvatars: 'no',
        avvvatars: 'no',
        multiavatar: 'no',
        jdenticon: 'yes',
      },
    },
    {
      feature: '语言支持',
      values: {
        dicebear: 'JavaScript/TypeScript',
        boringAvatars: 'JavaScript',
        avvvatars: 'JavaScript/TypeScript',
        multiavatar: 'JavaScript、PHP、Python',
        jdenticon: 'JavaScript、.NET、PHP',
      },
    },
    {
      feature: '依赖项',
      values: {
        dicebear: '无',
        boringAvatars: 'React',
        avvvatars: 'React',
        multiavatar: '无',
        jdenticon: '无',
      },
    },
    {
      feature: '输出格式',
      values: {
        dicebear: 'SVG、PNG、JPEG、WebP、AVIF',
        boringAvatars: 'SVG',
        avvvatars: 'SVG',
        multiavatar: 'SVG',
        jdenticon: 'SVG、PNG',
      },
    },
    {
      feature: '设计许可',
      values: {
        dicebear: '视风格而定',
        boringAvatars: 'MIT',
        avvvatars: 'MIT',
        multiavatar: '自定义',
        jdenticon: 'MIT',
      },
    },
    {
      feature: '开源',
      values: {
        dicebear: 'yes',
        boringAvatars: 'yes',
        avvvatars: 'yes',
        multiavatar: 'yes',
        jdenticon: 'yes',
      },
    },
    {
      feature: '确定性',
      values: {
        dicebear: 'yes',
        boringAvatars: 'yes',
        avvvatars: 'yes',
        multiavatar: 'yes',
        jdenticon: 'yes',
      },
    },
  ];
}
