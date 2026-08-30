import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  limit,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { LeaderboardEntry, calculateChefTier } from '../types';
import { getCurrent7DayCycle } from '../utils/cycle';

export async function saveUserProgressToFirebase(
  user: { uid: string; displayName?: string | null; photoURL?: string | null },
  data: {
    foundDishes: Record<string, boolean>;
    score: number;
    madeCount: number;
  }
) {
  if (!user || !user.uid) return;

  const cycle = getCurrent7DayCycle();
  const docId = `${cycle.cycleId}_${user.uid}`;
  const docRef = doc(db, 'weekly_leaderboard', docId);

  const discoveredList = Object.keys(data.foundDishes).filter(
    (k) => data.foundDishes[k]
  );
  const dishesCount = discoveredList.length;
  const tier = calculateChefTier(dishesCount);

  const newEntry: LeaderboardEntry = {
    userId: user.uid,
    userName: user.displayName || '익명의 급식 요리사',
    userPhoto: user.photoURL || undefined,
    cycleId: cycle.cycleId,
    dishesCount,
    totalScore: data.score,
    cookAttempts: data.madeCount,
    discoveredDishes: discoveredList,
    tier,
    updatedAt: Date.now(),
  };

  try {
    // If existing document has higher score or higher count, merge smartly
    const existingSnap = await getDoc(docRef);
    if (existingSnap.exists()) {
      const prevData = existingSnap.data() as LeaderboardEntry;
      // Merge unique dishes
      const mergedDishes = Array.from(
        new Set([...(prevData.discoveredDishes || []), ...discoveredList])
      );
      const mergedCount = Math.max(prevData.dishesCount || 0, mergedDishes.length);
      const mergedScore = Math.max(prevData.totalScore || 0, data.score);
      const mergedAttempts = (prevData.cookAttempts || 0) + (data.madeCount || 0);

      newEntry.discoveredDishes = mergedDishes;
      newEntry.dishesCount = mergedCount;
      newEntry.totalScore = mergedScore;
      newEntry.cookAttempts = Math.max(prevData.cookAttempts || 0, mergedAttempts);
      newEntry.tier = calculateChefTier(mergedCount);
    }

    await setDoc(docRef, newEntry, { merge: true });
  } catch (error) {
    console.error('Error saving progress to Firebase:', error);
  }
}

export async function getUserCurrentCycleProgress(userId: string): Promise<LeaderboardEntry | null> {
  const cycle = getCurrent7DayCycle();
  const docId = `${cycle.cycleId}_${userId}`;
  try {
    const docRef = doc(db, 'weekly_leaderboard', docId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as LeaderboardEntry;
    }
  } catch (err) {
    console.error('Error loading user progress:', err);
  }
  return null;
}

export function subscribeToWeeklyLeaderboard(
  callback: (entries: LeaderboardEntry[]) => void
) {
  const cycle = getCurrent7DayCycle();
  const q = query(
    collection(db, 'weekly_leaderboard'),
    where('cycleId', '==', cycle.cycleId),
    orderBy('dishesCount', 'desc'),
    orderBy('totalScore', 'desc'),
    limit(50)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const list: LeaderboardEntry[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...(docSnap.data() as LeaderboardEntry) });
      });
      callback(list);
    },
    (err) => {
      console.warn('Firestore leaderboard subscription note:', err);
    }
  );
}
