import type {
  ClothesListItemResponseDtoCategory,
  ClothesListItemResponseDtoSubCategory,
  CreateClothesDtoColorItem,
  CreateClothesDtoMaterialItem,
  CreateClothesDtoSeasonItem,
} from '@/shared/model/orvalSchemas';

export const CATEGORIES = {
  전체: [],
  상의: [
    'SHORT_SLEEVE_TEE',
    'LONG_SLEEVE_TEE',
    'SHIRT_BLOUSE',
    'KNIT_SWEATER',
    'HOODIE',
    'SWEATSHIRT',
    'SLEEVELESS_TEE',
    'POLO_TEE',
    'OTHER_TOP',
  ],
  하의: [
    'DENIM_PANTS',
    'COTTON_PANTS',
    'SLACKS',
    'SHORT_PANTS',
    'LEGGINGS',
    'JOGGER_PANTS',
    'JUMPSUIT_OVERALL',
    'OTHER_BOTTOM',
  ],
  아우터: [
    'SINGLE_COAT',
    'DOUBLE_COAT',
    'MID_SEASON_COAT',
    'OTHER_COAT',
    'CARDIGAN',
    'SUIT_BLAZER',
    'LEATHER_RIDERS',
    'BLOUSON_MA1',
    'TRUCKER_JACKET',
    'STADIUM_JACKET',
    'NYLON_COACH_JACKET',
    'SAFARI_HUNTING_JACKET',
    'ANORAK',
    'TRAINING_JACKET',
    'HOOD_ZIPUP',
    'SHORT_PADDING',
    'LONG_PADDING',
    'LIGHT_PADDING',
    'FLEECE',
    'MUSTANG_FUR',
    'OTHER_OUTER',
  ],
  '드레스/스커트': ['MINI_DRESS', 'MIDI_DRESS', 'MAXI_DRESS', 'MINI_SKIRT', 'MIDI_SKIRT', 'LONG_SKIRT'],
  신발: ['SNEAKERS', 'DRESS_SHOES', 'BOOTS', 'SANDALS_SLIPPERS', 'SPORTS_SHOES', 'PADDING_SHOES'],
  악세사리: [
    'BAG',
    'HAT',
    'BELT',
    'JEWELRY',
    'MUFFLER',
    'WATCH',
    'SUNGLASSES_FRAMES',
    'SOCKS_LEGWEAR',
    'PROPS',
  ],
} as const;

type ClosetMainCategory = Exclude<keyof typeof CATEGORIES, '전체'>;
type CategoryAliasKey =
  | ClothesListItemResponseDtoCategory
  | ClosetMainCategory
  | '드레스'
  | '스커트'
  | '액세서리';

export const SEASONS: CreateClothesDtoSeasonItem[] = ['SPRING', 'SUMMER', 'FALL', 'WINTER', 'ALL'];

export const COLORS = [
  { name: 'WHITE', hex: '#FFFFFF' },
  { name: 'IVORY', hex: '#FFFFF0' },
  { name: 'BEIGE', hex: '#F5DEB3' },
  { name: 'LIGHT_GRAY', hex: '#D1D5DB' },
  { name: 'DARK_GRAY', hex: '#6B7280' },
  { name: 'BLACK', hex: '#000000' },
  { name: 'LIGHT_YELLOW', hex: '#FEF9C3' },
  { name: 'YELLOW', hex: '#FACC15' },
  { name: 'AMBER', hex: '#EAB308' },
  { name: 'ORANGE', hex: '#F97316' },
  { name: 'CORAL', hex: '#F87171' },
  { name: 'RED', hex: '#EF4444' },
  { name: 'PINK', hex: '#FCA5A5' },
  { name: 'DEEP_PINK', hex: '#EC4899' },
  { name: 'LIGHT_GREEN', hex: '#86EFAC' },
  { name: 'GREEN', hex: '#22C55E' },
  { name: 'OLIVE', hex: '#808000' },
  { name: 'DARK_OLIVE', hex: '#556B2F' },
  { name: 'TEAL', hex: '#14B8A6' },
  { name: 'KHAKI', hex: '#6B7040' },
  { name: 'CYAN', hex: '#06B6D4' },
  { name: 'SKY_BLUE', hex: '#93C5FD' },
  { name: 'BLUE', hex: '#3B82F6' },
  { name: 'NAVY', hex: '#1E3A5F' },
  { name: 'LAVENDER', hex: '#C4B5FD' },
  { name: 'PURPLE', hex: '#8B5CF6' },
  { name: 'BURGUNDY', hex: '#7B1F2A' },
  { name: 'CAMEL', hex: '#C19A6B' },
  { name: 'BROWN', hex: '#92400E' },
  { name: 'DARK_BROWN', hex: '#451A03' },
  { name: 'MAGENTA', hex: '#D946EF' },
  { name: 'GOLD', hex: '#F59E0B' },
  { name: 'SILVER', hex: '#9CA3AF' },
  { name: 'MULTICOLORED', hex: null },
] as const;

export const MATERIALS = [
  'COTTON',
  'POLYESTER',
  'NYLON',
  'WOOL',
  'CASHMERE',
  'MOHAIR',
  'ALPACA',
  'ANGORA',
  'DENIM',
  'LEATHER',
  'SUEDE',
  'SILK',
  'LINEN',
  'LYOCELL',
  'RAYON',
  'VISCOSE',
  'CUPRA',
  'CHIFFON',
  'LACE',
  'VELVET',
  'CORDUROY',
  'TWEED',
  'SPANDEX',
  'DOWN_FEATHER',
  'FUR',
  'METAL',
  'ACRYLIC',
  'ETC',
] as const;

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'FREE'] as const;

export const CATEGORY_FROM_API: Record<ClothesListItemResponseDtoCategory, ClosetMainCategory> = {
  TOP: '상의',
  BOTTOM: '하의',
  OUTER: '아우터',
  DRESS_SKIRT: '드레스/스커트',
  SHOES: '신발',
  ACCESSORY: '악세사리',
};

export const CATEGORY_ALIASES: Record<CategoryAliasKey, ClosetMainCategory> = {
  TOP: '상의',
  BOTTOM: '하의',
  OUTER: '아우터',
  DRESS_SKIRT: '드레스/스커트',
  SHOES: '신발',
  ACCESSORY: '악세사리',
  상의: '상의',
  하의: '하의',
  아우터: '아우터',
  드레스: '드레스/스커트',
  스커트: '드레스/스커트',
  '드레스/스커트': '드레스/스커트',
  신발: '신발',
  악세사리: '악세사리',
  액세서리: '악세사리',
};

type ApiSubCategory = Exclude<ClothesListItemResponseDtoSubCategory, null>;

const CATEGORY_KEYS = (Object.keys(CATEGORIES) as ClosetMainCategory[]).filter(
  (key) => key !== ('전체' as never),
);

const subCategoryEntries = CATEGORY_KEYS.flatMap((mainCategory) => {
  const codes = CATEGORIES[mainCategory];
  return codes.map((code) => [code, code] as const);
});

export const SUBCATEGORY_FROM_API = Object.fromEntries(subCategoryEntries) as Record<ApiSubCategory, string>;
export const SUBCATEGORY_TO_API = Object.fromEntries(
  subCategoryEntries.map(([code, koLabel]) => [koLabel, code]),
) as Record<string, ClothesListItemResponseDtoSubCategory>;

export const COLOR_CODES = COLORS.map((color) => color.name) as CreateClothesDtoColorItem[];
export const MATERIAL_CODES = MATERIALS as readonly CreateClothesDtoMaterialItem[];
