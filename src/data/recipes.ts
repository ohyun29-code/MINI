import { Ingredient, Recipe } from '../types';
import eggFriedRiceImg from '../assets/images/egg_fried_rice_1788060374118.jpg';
import handmadeBurgerImg from '../assets/images/handmade_burger_1788060388269.jpg';
import cheesePastaImg from '../assets/images/cheese_pasta_1788060400563.jpg';
import spicyRamenImg from '../assets/images/spicy_ramen_1788060412013.jpg';

export const INGREDIENTS: Ingredient[] = [
  { id: 'egg', em: '🥚', nm: '계란' },
  { id: 'rice', em: '🍚', nm: '밥' },
  { id: 'veg', em: '🥬', nm: '야채' },
  { id: 'chz', em: '🧀', nm: '치즈' },
  { id: 'meat', em: '🥩', nm: '고기' },
  { id: 'fish', em: '🐟', nm: '생선' },
  { id: 'noodle', em: '🍜', nm: '면' },
  { id: 'potato', em: '🥔', nm: '감자' },
  { id: 'bread', em: '🍞', nm: '빵' },
  { id: 'chili', em: '🌶️', nm: '고추' },
];

export const STANDARD_RECIPES: Recipe[] = [
  { id: 'r1', a: 'egg', b: 'rice', em: '🍳', nm: '계란볶음밥', img: eggFriedRiceImg, desc: '고소한 계란과 고슬고슬 밥알이 어우러진 최고의 급식 메뉴!' },
  { id: 'r2', a: 'veg', b: 'potato', em: '🥗', nm: '아삭샐러드', desc: '신선한 야채와 포슬포슬 감자의 건강한 조화.' },
  { id: 'r3', a: 'chz', b: 'noodle', em: '🍝', nm: '치즈파스타', img: cheesePastaImg, desc: '진하고 꾸덕한 치즈 소스가 듬뿍 밴 파스타.' },
  { id: 'r4', a: 'meat', b: 'rice', em: '🍛', nm: '고기덮밥', desc: '달콤 짭조름한 양념 고기가 듬뿍 올라간 든든한 덮밥.' },
  { id: 'r5', a: 'fish', b: 'rice', em: '🍣', nm: '초밥', desc: '신선한 생선회와 밥의 깔끔한 한 입.' },
  { id: 'r6', a: 'meat', b: 'potato', em: '🍖', nm: '감자갈비', desc: '부드러운 갈비 양념과 감자의 환상적인 만남.' },
  { id: 'r7', a: 'chz', b: 'potato', em: '🍕', nm: '감자피자', desc: '고소한 감자 토핑과 쭉 늘어나는 치즈의 향연.' },
  { id: 'r8', a: 'egg', b: 'noodle', em: '🍲', nm: '계란라면', desc: '얼큰한 라면에 부드러운 반숙 계란이 퐁당!' },
  { id: 'r9', a: 'veg', b: 'meat', em: '🌯', nm: '고기쌈말이', desc: '신선한 야채에 싸먹는 육즙 가득 고기.' },
  { id: 'r10', a: 'fish', b: 'veg', em: '🍥', nm: '생선어묵국', desc: '시원하고 담백한 국물이 일품인 어묵탕.' },
  { id: 'r11', a: 'chz', b: 'egg', em: '🥪', nm: '치즈계란말이', desc: '황금빛 계란 속에 고소한 치즈가 사르르!' },
  { id: 'r12', a: 'fish', b: 'noodle', em: '🍤', nm: '해물볶음면', desc: '바다 향 가득한 생선과 쫄깃한 면의 볶음 요리.' },
  { id: 'r13', a: 'chili', b: 'rice', em: '🌶️', nm: '매콤비빔밥', desc: '매콤달콤 고추장과 다채로운 나물이 어우러진 비빔밥.' },
  { id: 'r14', a: 'chili', b: 'meat', em: '🥘', nm: '제육볶음', desc: '불맛 가득 매콤한 양념으로 볶아낸 밥도둑 제육.' },
  { id: 'r15', a: 'chili', b: 'noodle', em: '🍜', nm: '얼큰짬뽕', img: spicyRamenImg, desc: '칼칼하고 진한 육수에 탱글한 면발이 살아있는 짬뽕.' },
  { id: 'r16', a: 'chili', b: 'veg', em: '🥬', nm: '매운김치', desc: '아삭하고 알싸하게 잘 익은 밥상의 단짝 김치.' },
  { id: 'r17', a: 'chili', b: 'chz', em: '🫕', nm: '치즈불닭', desc: '화끈한 매운맛을 고소한 치즈로 감싼 요리.' },
  { id: 'r18', a: 'bread', b: 'chz', em: '🥪', nm: '치즈토스트', desc: '바삭하게 구운 식빵 사이로 흐르는 멜팅 치즈.' },
  { id: 'r19', a: 'bread', b: 'meat', em: '🍔', nm: '수제버거', img: handmadeBurgerImg, desc: '두툼한 소고기 패티와 푹신한 번의 수제 버거!' },
  { id: 'r20', a: 'bread', b: 'egg', em: '🥞', nm: '에그토스트', desc: '달콤 촉촉한 프렌치 토스트 스타일의 계란 빵.' },
  { id: 'r21', a: 'bread', b: 'fish', em: '🌭', nm: '생선까스샌드', desc: '바삭한 생선 커틀릿과 타르타르 소스의 조화.' },
  { id: 'r22', a: 'potato', b: 'chili', em: '🍟', nm: '매콤감자튀김', desc: '스파이시 시즈닝을 버무린 바삭한 프렌치프라이.' },
  { id: 'r23', a: 'egg', b: 'meat', em: '🥩', nm: '소고기장조림', desc: '달콤 짭조름한 간장에 졸여낸 계란과 고기 반찬.' },
  { id: 'r24', a: 'veg', b: 'noodle', em: '🥗', nm: '야채비빔국수', desc: '새콤달콤한 양념과 아삭한 채소의 시원한 면 요리.' },
  { id: 'r25', a: 'egg', b: 'veg', em: '🍳', nm: '야채계란말이', desc: '색색의 채소를 쫑쫑 썰어 넣은 영양 만점 계란말이.' },
  { id: 'r26', a: 'rice', b: 'chz', em: '🧀', nm: '치즈리조또', desc: '크리미하고 부드러운 서양식 쌀 요리.' },
  { id: 'r27', a: 'meat', b: 'chz', em: '🥩', nm: '치즈돈까스', desc: '바삭한 튀김옷 속에 모짜렐라가 꽉 찬 돈까스.' },
  { id: 'r28', a: 'fish', b: 'potato', em: '🍟', nm: '피쉬앤칩스', desc: '영국 대표 길거리 간식, 바삭한 생선과 감자.' },
  { id: 'r29', a: 'fish', b: 'chili', em: '🍲', nm: '얼큰매운탕', desc: '칼칼하고 얼큰하게 끓여낸 깊은 바다의 맛.' },
  { id: 'r30', a: 'bread', b: 'noodle', em: '🥖', nm: '야키소바빵', desc: '볶음면을 폭신한 핫도그 빵에 가득 채운 별미.' },
  { id: 'r31', a: 'rice', b: 'veg', em: '🥣', nm: '야채죽', desc: '속을 편안하게 달래주는 부드러운 죽.' },
  { id: 'r32', a: 'bread', b: 'veg', em: '🥪', nm: '신선야채샌드위치', desc: '아삭한 양상추와 토마토가 듬뿍 든 신선한 샌드위치.' },
  { id: 'r33', a: 'egg', b: 'potato', em: '🥔', nm: '감자계란샐러드', desc: '부드럽게 으깬 감자와 삶은 달걀의 마요네즈 버무림.' },
  { id: 'r34', a: 'egg', b: 'chili', em: '🍳', nm: '매콤계란찜', desc: '청양고추 팍팍 넣어 칼칼하고 포슬포슬한 뚝배기 계란찜.' },
  { id: 'r35', a: 'rice', b: 'noodle', em: '🍚', nm: '라밥', desc: '라면 국물에 밥을 말아먹는 한국인의 소울푸드!' },
  { id: 'r36', a: 'meat', b: 'noodle', em: '🍝', nm: '차돌비빔면', desc: '고소하게 구운 차돌박이를 얹은 매콤 비빔면.' },
  { id: 'r37', a: 'veg', b: 'chz', em: '🥗', nm: '리코타치즈샐러드', desc: '고소한 수제 리코타 치즈와 발사믹 드레싱의 만남.' },
  { id: 'r38', a: 'bread', b: 'potato', em: '🥐', nm: '고소한감자빵', desc: '쫀득한 피 속에 으깬 감자 앙금이 가득 찬 빵.' },
  { id: 'r39', a: 'fish', b: 'chz', em: '🧀', nm: '치즈생선까스', desc: '고소한 치즈가 곁들여진 바삭 담백 생선까스.' },
  { id: 'r40', a: 'rice', b: 'potato', em: '🥣', nm: '감자조림밥', desc: '포슬포슬 감자조림을 비벼먹는 든든한 밥.' },
];

export const HIDDEN_RECIPES: Recipe[] = [
  { id: 'h1', a: 'bread', b: 'meat', c: 'chz', em: '🍔', nm: '특제치즈버거', img: handmadeBurgerImg, hidden: true, hint: '핵심 재료: 빵(🍞) + 고기(🥩) + 치즈(🧀)' },
  { id: 'h2', a: 'rice', b: 'chili', c: 'meat', em: '🍲', nm: '제육비빔밥', hidden: true, hint: '핵심 재료: 밥(🍚) + 고추(🌶️) + 고기(🥩)' },
  { id: 'h3', a: 'noodle', b: 'egg', c: 'chili', em: '🍜', nm: '특제매운라면', img: spicyRamenImg, hidden: true, hint: '핵심 재료: 면(🍜) + 계란(🥚) + 고추(🌶️)' },
  { id: 'h4', a: 'bread', b: 'egg', c: 'chz', em: '🥪', nm: '몬테크리스토', hidden: true, hint: '핵심 재료: 빵(🍞) + 계란(🥚) + 치즈(🧀)' },
  { id: 'h5', a: 'potato', b: 'chz', c: 'meat', em: '🍕', nm: '콤비네이션피자', hidden: true, hint: '핵심 재료: 감자(🥔) + 치즈(🧀) + 고기(🥩)' },
  { id: 'h6', a: 'fish', b: 'veg', c: 'rice', em: '🍱', nm: '모듬초밥도시락', hidden: true, hint: '핵심 재료: 생선(🐟) + 야채(🥬) + 밥(🍚)' },
  { id: 'h7', a: 'noodle', b: 'meat', c: 'chili', em: '🍜', nm: '차돌우삼겹짬뽕', hidden: true, hint: '핵심 재료: 면(🍜) + 고기(🥩) + 고추(🌶️)' },
  { id: 'h8', a: 'rice', b: 'fish', c: 'chz', em: '🍣', nm: '치즈연어롤', hidden: true, hint: '핵심 재료: 밥(🍚) + 생선(🐟) + 치즈(🧀)' },
  { id: 'h9', a: 'bread', b: 'veg', c: 'meat', em: '🥪', nm: '수제클럽샌드위치', hidden: true, hint: '핵심 재료: 빵(🍞) + 야채(🥬) + 고기(🥩)' },
  { id: 'h10', a: 'potato', b: 'egg', c: 'veg', em: '🥗', nm: '고급에그감자샐러드', hidden: true, hint: '핵심 재료: 감자(🥔) + 계란(🥚) + 야채(🥬)' },
];

export const ULTRA_RECIPES: Recipe[] = [
  { id: 'u1', a: 'bread', b: 'meat', c: 'chz', d: 'veg', em: '🍔', nm: '궁극의 마스터 버거', img: handmadeBurgerImg, hidden: true, ultra: true, hint: '4가지: 빵(🍞) + 고기(🥩) + 치즈(🧀) + 야채(🥬)' },
  { id: 'u2', a: 'rice', b: 'meat', c: 'chili', d: 'egg', em: '🍲', nm: '전설의 특대 비빔밥', hidden: true, ultra: true, hint: '4가지: 밥(🍚) + 고기(🥩) + 고추(🌶️) + 계란(🥚)' },
  { id: 'u3', a: 'noodle', b: 'chili', c: 'meat', d: 'egg', em: '🍜', nm: '황제 특제 우삼겹 라면', img: spicyRamenImg, hidden: true, ultra: true, hint: '4가지: 면(🍜) + 고추(🌶️) + 고기(🥩) + 계란(🥚)' },
  { id: 'u4', a: 'bread', b: 'egg', c: 'chz', d: 'potato', em: '🥐', nm: '대왕 몬스터 브런치', hidden: true, ultra: true, hint: '4가지: 빵(🍞) + 계란(🥚) + 치즈(🧀) + 감자(🥔)' },
  { id: 'u5', a: 'rice', b: 'fish', c: 'chz', d: 'chili', em: '🍣', nm: '황금 스페셜 초밥 롤', hidden: true, ultra: true, hint: '4가지: 밥(🍚) + 생선(🐟) + 치즈(🧀) + 고추(🌶️)' },
];

export function getRecipeKey(items: string[]): string {
  return [...items].sort().join('|');
}

export const ALL_RECIPES_MAP: Record<string, Recipe> = {};

[...STANDARD_RECIPES, ...HIDDEN_RECIPES, ...ULTRA_RECIPES].forEach((recipe) => {
  const parts = [recipe.a, recipe.b];
  if (recipe.c) parts.push(recipe.c);
  if (recipe.d) parts.push(recipe.d);
  ALL_RECIPES_MAP[getRecipeKey(parts)] = recipe;
});
