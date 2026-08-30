import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Recipe, LeaderboardEntry, calculateChefTier, getTierBadgeStyle, AppUser } from './types';
import {
  STANDARD_RECIPES,
  HIDDEN_RECIPES,
  ULTRA_RECIPES,
  ALL_RECIPES_MAP,
  getRecipeKey,
  INGREDIENTS,
} from './data/recipes';
import { Kitchen } from './components/Kitchen';
import { Book } from './components/Book';
import { DishDetailModal } from './components/DishDetailModal';
import { AuthModal } from './components/AuthModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import {
  soundDrop,
  soundGood,
  soundNew,
  soundBad,
  soundEnd,
} from './utils/audio';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  saveUserProgressToFirebase,
  getUserCurrentCycleProgress,
} from './services/leaderboardService';
import { getCurrent7DayCycle, formatTimeRemaining } from './utils/cycle';
import {
  Trophy,
  Timer,
  BookOpen,
  Sparkles,
  RotateCcw,
  Flame,
  Award,
  LogIn,
  LogOut,
  User as UserIcon,
  Crown,
  ChefHat,
} from 'lucide-react';

const ROUND_TIME = 300; // 5 minutes
const STORAGE_KEY = 'bangok_cooking_game_best';

interface BestRecord {
  score: number;
  book: number;
}

export default function App() {
  // Auth state
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    try {
      const stored = localStorage.getItem('bangok_chef_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [authChecking, setAuthChecking] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  // Game Play State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameCleared, setIsGameCleared] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [pot, setPot] = useState<string[]>([]);
  const [foundDishes, setFoundDishes] = useState<Record<string, boolean>>({});
  const [madeCount, setMadeCount] = useState(0);
  const [hiddenUnlocked, setHiddenUnlocked] = useState(false);
  const [ultraUnlocked, setUltraUnlocked] = useState(false);

  const [selectedIngredientIdx, setSelectedIngredientIdx] = useState(0);
  const [hint, setHint] = useState('재료를 냄비로 끌어다 놓아 봐!');
  const [isCooking, setIsCooking] = useState(false);

  // Detail Modal & Toast state
  const [inspectRecipe, setInspectRecipe] = useState<Recipe | null>(null);
  const [toast, setToast] = useState<{
    show: boolean;
    em?: string;
    img?: string;
    title: string;
    sub?: string;
    isError?: boolean;
  } | null>(null);

  // Sparkles
  const [sparks, setSparks] = useState<
    Array<{ id: number; char: string; left: number; top: number }>
  >([]);

  // Best Record
  const [bestRecord, setBestRecord] = useState<BestRecord | null>(() => {
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  });

  const timerRef = useRef<number | null>(null);
  const currentCycle = getCurrent7DayCycle();

  // Listen to Firebase Auth state & sync progress
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const appUser: AppUser = {
          uid: user.uid,
          displayName: user.displayName || '구글 셰프',
          photoURL: user.photoURL || undefined,
          email: user.email || undefined,
          isGuest: user.isAnonymous,
        };
        setCurrentUser(appUser);
        localStorage.setItem('bangok_chef_user', JSON.stringify(appUser));
      }
      setAuthChecking(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch user weekly progress when currentUser changes
  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      const progress = await getUserCurrentCycleProgress(currentUser.uid);
      if (progress && progress.discoveredDishes && progress.discoveredDishes.length > 0) {
        const loadedFound: Record<string, boolean> = {};
        progress.discoveredDishes.forEach((name) => {
          loadedFound[name] = true;
        });
        setFoundDishes((prev) => ({ ...prev, ...loadedFound }));
      }
    })();
  }, [currentUser?.uid]);

  const handleUserLogin = (user: AppUser) => {
    setCurrentUser(user);
    // Sync current progress immediately
    saveUserProgressToFirebase(
      {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL,
      },
      {
        foundDishes,
        score,
        madeCount,
      }
    );
  };

  const handleLogout = async () => {
    localStorage.removeItem('bangok_chef_user');
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    setCurrentUser(null);
  };

  // Determine active total recipes list
  const activeRecipes = [
    ...STANDARD_RECIPES,
    ...(hiddenUnlocked ? HIDDEN_RECIPES : []),
    ...(ultraUnlocked ? ULTRA_RECIPES : []),
  ];

  const maxSlots = ultraUnlocked ? 4 : hiddenUnlocked ? 3 : 2;
  const totalFoundCount = Object.keys(foundDishes).length;
  const maxTotalRecipes =
    STANDARD_RECIPES.length +
    (hiddenUnlocked ? HIDDEN_RECIPES.length : 0) +
    (ultraUnlocked ? ULTRA_RECIPES.length : 0);

  const currentTier = calculateChefTier(totalFoundCount);
  const tierStyle = getTierBadgeStyle(currentTier);

  // Show Toast
  const triggerToast = useCallback(
    (
      title: string,
      options?: { em?: string; img?: string; sub?: string; isError?: boolean }
    ) => {
      setToast({
        show: true,
        title,
        em: options?.em,
        img: options?.img,
        sub: options?.sub,
        isError: options?.isError,
      });

      setTimeout(() => {
        setToast((prev) => (prev ? { ...prev, show: false } : null));
      }, 2500);
    },
    []
  );

  // Trigger Sparkle animation
  const triggerSparkles = useCallback((count = 12) => {
    const chars = ['✨', '⭐', '💛', '🌟', '💫', '🍳'];
    const newSparks = Array.from({ length: count }).map((_, i) => ({
      id: Date.now() + i,
      char: chars[i % chars.length],
      left: Math.random() * 80 + 10,
      top: Math.random() * 60 + 20,
    }));
    setSparks((prev) => [...prev, ...newSparks]);
    setTimeout(() => {
      setSparks((prev) => prev.filter((s) => !newSparks.includes(s)));
    }, 1000);
  }, []);

  // End Game handler
  const handleEndGame = useCallback(
    (cleared = false) => {
      setIsPlaying(false);
      setIsGameOver(true);
      setIsGameCleared(cleared);
      soundEnd();

      const finalScore = cleared ? score + Math.round(timeLeft) * 5 : score;
      if (cleared) {
        setScore(finalScore);
      }

      // Sync to Firebase if logged in
      if (currentUser) {
        saveUserProgressToFirebase(
          {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          {
            foundDishes,
            score: finalScore,
            madeCount,
          }
        );
      }

      setBestRecord((prev) => {
        const newBest = {
          score: Math.max(prev?.score || 0, finalScore),
          book: Math.max(prev?.book || 0, totalFoundCount),
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newBest));
        } catch {
          // ignore
        }
        return newBest;
      });
    },
    [score, timeLeft, totalFoundCount, currentUser, foundDishes, madeCount]
  );

  // Cooking execution logic
  const handleCook = useCallback(
    (ingredientsToCook: string[]) => {
      setIsCooking(true);
      setHint('보글보글 맛있는 요리 끓이는 중... 🔥');

      setTimeout(() => {
        const key = getRecipeKey(ingredientsToCook);
        const recipe = ALL_RECIPES_MAP[key];

        if (recipe) {
          const updatedMadeCount = madeCount + 1;
          setMadeCount(updatedMadeCount);
          const isNew = !foundDishes[recipe.nm];

          let updatedFound = foundDishes;
          let updatedScore = score;

          if (isNew) {
            updatedFound = { ...foundDishes, [recipe.nm]: true };
            setFoundDishes(updatedFound);
            const pts = recipe.ultra ? 100 : recipe.hidden ? 50 : 30;
            updatedScore = score + pts;
            setScore(updatedScore);

            soundNew();
            triggerSparkles(recipe.ultra ? 24 : 14);
            triggerToast(`${recipe.nm} 발견! (+${pts}점)`, {
              em: recipe.em,
              img: recipe.img,
              sub: recipe.img
                ? '📸 실사 사진 요리를 도감에 등록했습니다!'
                : '신규 요리가 도감에 기록되었습니다!',
            });
            setHint(`✨ 신메뉴 [${recipe.nm}] 완성! 도감에 기록됐어!`);
          } else {
            updatedScore = score + 10;
            setScore(updatedScore);
            soundGood();
            triggerSparkles(6);
            triggerToast(`${recipe.nm} 완성! (+10점)`, {
              em: recipe.em,
              img: recipe.img,
            });
            setHint(`맛있는 [${recipe.nm}] 완성! 다른 조합도 도전해봐!`);
          }

          // Auto-save to Firebase periodically during session
          if (currentUser) {
            saveUserProgressToFirebase(
              {
                uid: currentUser.uid,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
              },
              {
                foundDishes: updatedFound,
                score: updatedScore,
                madeCount: updatedMadeCount,
              }
            );
          }

          // Check for Tier Unlocks
          const currentDiscovered = Object.keys(updatedFound).length;

          // Tier 1 -> Tier 2: Hidden Unlock (3 ingredients)
          if (!hiddenUnlocked && currentDiscovered >= STANDARD_RECIPES.length) {
            setHiddenUnlocked(true);
            setTimeLeft((prev) => prev + 120); // +2 min
            setTimeout(() => {
              triggerToast('🌟 히든 요리 해금!', {
                em: '🌟',
                sub: '재료 3개 조합 오픈 & 시간 +2분 보너스!',
              });
            }, 1200);
          }

          // Tier 2 -> Tier 3: Ultra Unlock (4 ingredients)
          if (
            hiddenUnlocked &&
            !ultraUnlocked &&
            currentDiscovered >= STANDARD_RECIPES.length + HIDDEN_RECIPES.length
          ) {
            setUltraUnlocked(true);
            setTimeLeft((prev) => prev + 120); // +2 min
            setTimeout(() => {
              triggerToast('👑 전설의 4재료 조합 해금!', {
                em: '👑',
                sub: '궁극의 마스터 요리 오픈 & 시간 +2분 보너스!',
              });
            }, 1200);
          }

          // Total Clear check
          if (
            currentDiscovered >=
            STANDARD_RECIPES.length + HIDDEN_RECIPES.length + ULTRA_RECIPES.length
          ) {
            setTimeout(() => {
              handleEndGame(true);
            }, 1500);
          }
        } else {
          soundBad();
          triggerToast('앗! 조합 실패...', {
            em: '💨',
            sub: '이 재료들로는 요리가 되지 않았어요.',
            isError: true,
          });
          setHint('조합에 실패했어 🥲 다른 재료로 다시 넣어봐!');
        }

        setPot([]);
        setIsCooking(false);
      }, 750);
    },
    [
      foundDishes,
      score,
      madeCount,
      hiddenUnlocked,
      ultraUnlocked,
      currentUser,
      triggerSparkles,
      triggerToast,
      handleEndGame,
    ]
  );

  // Add ingredient to pot
  const handleAddIngredient = useCallback(
    (id: string) => {
      if (!isPlaying || isCooking) return;

      if (pot.includes(id)) {
        setHint('같은 재료는 한 번만 넣을 수 있어!');
        return;
      }

      if (pot.length >= maxSlots) {
        setHint('냄비가 꽉 찼어! 비우기를 눌러봐.');
        return;
      }

      soundDrop();
      const nextPot = [...pot, id];
      setPot(nextPot);

      if (nextPot.length < maxSlots) {
        setHint(`재료 ${maxSlots - nextPot.length}개 더 넣어줘! 🙌`);
      } else {
        handleCook(nextPot);
      }
    },
    [isPlaying, isCooking, pot, maxSlots, handleCook]
  );

  // Clear Pot
  const handleClearPot = useCallback(() => {
    if (isCooking) return;
    setPot([]);
    setHint('냄비를 깨끗하게 비웠어! ✨');
  }, [isCooking]);

  // Start / Restart Game
  const handleStartGame = () => {
    // If not logged in, prompt user first or allow instant play
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsPlaying(true);
    setIsGameOver(false);
    setIsGameCleared(false);
    setScore(0);
    setTimeLeft(ROUND_TIME);
    setPot([]);
    setMadeCount(0);
    setHint('재료를 냄비로 끌어다 놓아 봐!');
    soundGood();
  };

  // Timer Tick
  useEffect(() => {
    if (!isPlaying) return;

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleEndGame(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, handleEndGame]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (!isPlaying) {
        if (e.key === 'Enter' || e.key === ' ') {
          if (!isGameOver && !isAuthModalOpen && !isLeaderboardOpen) {
            handleStartGame();
          }
        }
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIngredientIdx((prev) => (prev + 1) % INGREDIENTS.length);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIngredientIdx(
          (prev) => (prev - 1 + INGREDIENTS.length) % INGREDIENTS.length
        );
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleAddIngredient(INGREDIENTS[selectedIngredientIdx].id);
      } else if (e.key === 'x' || e.key === 'X' || e.key === 'Escape') {
        e.preventDefault();
        handleClearPot();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isPlaying,
    isGameOver,
    isAuthModalOpen,
    isLeaderboardOpen,
    selectedIngredientIdx,
    handleAddIngredient,
    handleClearPot,
  ]);

  const timeRatio = Math.max(0, Math.min(1, timeLeft / ROUND_TIME));

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-amber-50/70 via-orange-50/50 to-amber-100/60 text-stone-800 p-2 sm:p-4 flex flex-col items-center select-none overflow-x-hidden font-sans">
      {/* Sparkles Overlay */}
      {sparks.map((s) => (
        <div
          key={s.id}
          className="fixed pointer-events-none z-50 text-2xl animate-ping"
          style={{ left: `${s.left}%`, top: `${s.top}%` }}
        >
          {s.char}
        </div>
      ))}

      {/* Floating Toast Notification */}
      {toast && toast.show && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-bounce flex items-center gap-3 bg-white/95 px-4 py-2.5 rounded-2xl shadow-xl border-3 border-amber-300 backdrop-blur-xs max-w-sm w-full mx-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-amber-50 flex items-center justify-center shrink-0 border border-amber-200">
            {toast.img ? (
              <img
                src={toast.img}
                alt={toast.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-3xl">{toast.em || '🍳'}</span>
            )}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <h4
              className={`text-sm font-black truncate ${
                toast.isError ? 'text-stone-600' : 'text-orange-600'
              }`}
            >
              {toast.title}
            </h4>
            {toast.sub && (
              <p className="text-[11px] font-bold text-stone-500 truncate">
                {toast.sub}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-4xl flex flex-col gap-3">
        {/* Top Navbar & Auth Banner */}
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍳</span>
            <span className="font-black text-sm sm:text-base text-amber-950">
              급식실 요리 조합
            </span>
          </div>

          {/* User Controls & Leaderboard Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLeaderboardOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>주간 티어표</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-1.5 bg-white/90 px-2.5 py-1 rounded-xl border border-amber-200 shadow-xs">
                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden font-black text-amber-800 text-[10px]">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="user"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    (currentUser.displayName || 'U').slice(0, 1)
                  )}
                </div>
                <span className="text-xs font-black text-stone-700 max-w-[80px] sm:max-w-[120px] truncate">
                  {currentUser.displayName || '셰프'}
                </span>
                <span
                  className={`text-[10px] font-black px-1.5 py-0.2 rounded-md ${tierStyle.bg}`}
                >
                  {tierStyle.icon}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-stone-400 hover:text-stone-600 ml-1 p-0.5"
                  title="로그아웃"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border-2 border-amber-300 text-amber-900 font-black text-xs shadow-xs flex items-center gap-1 transition-all active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-600" />
                <span>로그인</span>
              </button>
            )}
          </div>
        </div>

        {/* Top HUD */}
        <header className="bg-white/90 rounded-2xl p-2.5 sm:p-3 border-3 border-amber-200 shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            {/* Score */}
            <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
              <Trophy className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-stone-600">점수</span>
              <span className="text-base sm:text-lg font-black text-orange-600">
                {score}
              </span>
            </div>

            {/* Time */}
            <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-xl border border-green-200">
              <Timer className="w-4 h-4 text-green-600" />
              <span className="text-xs font-bold text-stone-600">남은 시간</span>
              <span
                className={`text-base sm:text-lg font-black ${
                  timeLeft <= 30 ? 'text-red-500 animate-pulse' : 'text-green-700'
                }`}
              >
                {timeLeft}초
              </span>
            </div>

            {/* Book Progress & Chef Tier */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-stone-600">도감</span>
                <span className="text-base sm:text-lg font-black text-blue-700">
                  {totalFoundCount} / {maxTotalRecipes}
                </span>
              </div>

              <div
                className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-black border ${tierStyle.bg} ${tierStyle.border}`}
              >
                <span>{tierStyle.icon}</span>
                <span>{currentTier}</span>
              </div>
            </div>

            {/* In-game reset button */}
            {isPlaying && (
              <button
                onClick={handleStartGame}
                className="p-1.5 text-xs font-extrabold text-stone-500 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg flex items-center gap-1 transition-colors ml-auto"
                title="다시 시작"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">처음부터</span>
              </button>
            )}
          </div>

          {/* Time Progress Bar */}
          <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden border border-amber-200">
            <div
              className="h-full bg-gradient-to-r from-green-500 via-amber-400 to-red-500 rounded-full transition-all duration-300"
              style={{ width: `${timeRatio * 100}%` }}
            />
          </div>
        </header>

        {/* Kitchen Area */}
        <Kitchen
          pot={pot}
          maxSlots={maxSlots}
          isCooking={isCooking}
          selectedIdx={selectedIngredientIdx}
          hint={hint}
          onAddIngredient={handleAddIngredient}
          onClearPot={handleClearPot}
          onSelectIngredient={setSelectedIngredientIdx}
        />

        {/* Recipe Book Grid */}
        <Book
          recipes={activeRecipes}
          found={foundDishes}
          onSelectRecipe={(r) => setInspectRecipe(r)}
        />
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onUserLogin={handleUserLogin}
      />

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        currentUserId={currentUser?.uid}
      />

      {/* Dish Detail Modal */}
      <DishDetailModal
        recipe={inspectRecipe}
        discovered={inspectRecipe ? !!foundDishes[inspectRecipe.nm] : false}
        onClose={() => setInspectRecipe(null)}
      />

      {/* Start Screen Overlay */}
      {!isPlaying && !isGameOver && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-gradient-to-br from-amber-200/90 via-orange-200/90 to-amber-300/90 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border-4 border-amber-300 text-center flex flex-col items-center">
            {/* Animated Food Emoji Row */}
            <div className="flex items-center gap-2 text-4xl my-2">
              <span className="animate-bounce" style={{ animationDelay: '0s' }}>
                🍳
              </span>
              <span className="animate-bounce" style={{ animationDelay: '0.15s' }}>
                🍚
              </span>
              <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>
                🍔
              </span>
              <span className="animate-bounce" style={{ animationDelay: '0.45s' }}>
                🍝
              </span>
              <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>
                🍜
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-amber-950 mt-1">
              급식실 요리 조합 🍳
            </h1>
            <p className="text-xs sm:text-sm font-bold text-amber-700 mt-1">
              재료를 냄비에 섞어 실사 요리와 도감을 완성하자!
            </p>

            {/* Current 7-Day Cycle Info */}
            <div className="w-full mt-3 px-3 py-2 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-between text-xs font-black text-orange-900">
              <span className="flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-600" />
                이번 주 7일 시즌 ({currentCycle.formattedRange})
              </span>
              <button
                onClick={() => setIsLeaderboardOpen(true)}
                className="text-amber-700 underline hover:text-amber-900"
              >
                티어표 보기
              </button>
            </div>

            {/* Rules */}
            <div className="w-full text-left bg-amber-50/80 rounded-2xl p-3.5 my-3 text-xs font-bold text-stone-700 space-y-1.5 border-2 border-amber-200 leading-relaxed">
              <div className="flex items-start gap-1.5">
                <span>🔐</span>
                <span>
                  <b>로그인</b> 후 요리하면 <b>7일 주기 실시간 티어표</b>에 내 기록이 자동 연동!
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <span>🍲</span>
                <span>
                  재료 <b>2개</b> (히든 해금 시 3~4개)가 모이면 요리 완성!
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <span>📸</span>
                <span>
                  <b>계란볶음밥, 수제버거, 치즈파스타, 매운라면</b> 등 <b>실사 사진</b> 수집!
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <span>👑</span>
                <span>
                  발견한 요리 개수에 따라 <b>초보 🌱 → 급식 🍳 → 수석 🌟 → 마스터 💎 → 전설 👑</b> 티어 상승!
                </span>
              </div>
            </div>

            <button
              onClick={handleStartGame}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-base sm:text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Flame className="w-5 h-5 fill-white" />
              {currentUser ? '요리 시작하기! 🔥' : '로그인하고 시작하기 🚀'}
            </button>

            {bestRecord && (
              <div className="text-xs font-extrabold text-amber-800 mt-3 flex items-center gap-1">
                <Award className="w-4 h-4 text-amber-600" />
                내 최고 기록: {bestRecord.score}점 · 도감 {bestRecord.book}개
              </div>
            )}
          </div>
        </div>
      )}

      {/* Game Over / Game Cleared Overlay */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border-4 border-amber-300 text-center flex flex-col items-center animate-fadeIn">
            <div className="text-5xl my-2">
              {isGameCleared ? '🏆' : '⏰'}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
              {isGameCleared ? '전설의 요리사 달성!' : '요리 시간 종료!'}
            </h2>
            <p className="text-xs sm:text-sm font-bold text-amber-700 mt-1">
              {isGameCleared
                ? '모든 요리 도감을 완벽하게 마스터했습니다!'
                : '오늘의 급식 조리가 모두 끝났습니다.'}
            </p>

            <div className="text-4xl sm:text-5xl font-black text-orange-600 my-3">
              {score}점
            </div>

            {/* Tier Achievement */}
            <div className="w-full my-2 p-3 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-between">
              <span className="text-xs font-black text-stone-600">이번 주 셰프 티어</span>
              <span
                className={`text-xs font-black px-2.5 py-1 rounded-full ${tierStyle.bg}`}
              >
                {tierStyle.icon} {currentTier}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full my-1">
              <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                <span className="text-xs font-bold text-stone-500 block">
                  도감 달성
                </span>
                <span className="text-lg font-black text-amber-900">
                  {totalFoundCount} / {maxTotalRecipes}
                </span>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                <span className="text-xs font-bold text-stone-500 block">
                  조리한 요리
                </span>
                <span className="text-lg font-black text-amber-900">
                  {madeCount}회
                </span>
              </div>
            </div>

            <div className="flex gap-2 w-full mt-4">
              <button
                onClick={() => setIsLeaderboardOpen(true)}
                className="flex-1 py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Trophy className="w-4 h-4 text-amber-600" />
                티어표 확인
              </button>

              <button
                onClick={handleStartGame}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                다시 도전
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
