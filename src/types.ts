export interface Ingredient {
  id: string;
  em: string;
  nm: string;
  color?: string;
}

export interface Recipe {
  id: string;
  a: string;
  b: string;
  c?: string;
  d?: string;
  em: string;
  nm: string;
  desc?: string;
  img?: string;
  hidden?: boolean;
  ultra?: boolean;
  hint?: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  customNickname?: string;
}

export interface AppUser {
  uid: string;
  displayName: string;
  photoURL?: string;
  email?: string;
  isGuest?: boolean;
}

export interface LeaderboardEntry {
  id?: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  cycleId: string; // e.g. "2026-W35" (7-day cycle)
  dishesCount: number; // 몇 개나 했는지 (도감 등록 개수)
  totalScore: number;
  cookAttempts: number; // 총 요리 횟수
  discoveredDishes: string[]; // 완성한 요리 이름 목록
  tier: ChefTier;
  updatedAt: number; // timestamp
}

export type ChefTier = '초보 요리사' | '급식 조리사' | '수석 셰프' | '마스터 셰프' | '전설의 총주방장';

export function calculateChefTier(dishesCount: number): ChefTier {
  if (dishesCount >= 50) return '전설의 총주방장';
  if (dishesCount >= 40) return '마스터 셰프';
  if (dishesCount >= 25) return '수석 셰프';
  if (dishesCount >= 10) return '급식 조리사';
  return '초보 요리사';
}

export function getTierBadgeStyle(tier: ChefTier): {
  bg: string;
  text: string;
  border: string;
  icon: string;
} {
  switch (tier) {
    case '전설의 총주방장':
      return {
        bg: 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-md',
        text: 'text-white',
        border: 'border-amber-400',
        icon: '👑',
      };
    case '마스터 셰프':
      return {
        bg: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm',
        text: 'text-white',
        border: 'border-purple-300',
        icon: '💎',
      };
    case '수석 셰프':
      return {
        bg: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-sm',
        text: 'text-white',
        border: 'border-blue-300',
        icon: '🌟',
      };
    case '급식 조리사':
      return {
        bg: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xs',
        text: 'text-white',
        border: 'border-emerald-300',
        icon: '🍳',
      };
    case '초보 요리사':
    default:
      return {
        bg: 'bg-stone-100 text-stone-700',
        text: 'text-stone-700',
        border: 'border-stone-200',
        icon: '🌱',
      };
  }
}
