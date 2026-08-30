import React, { useState, useEffect } from 'react';
import { LeaderboardEntry, getTierBadgeStyle, ChefTier } from '../types';
import { subscribeToWeeklyLeaderboard } from '../services/leaderboardService';
import { getCurrent7DayCycle, formatTimeRemaining } from '../utils/cycle';
import {
  Trophy,
  Medal,
  Flame,
  Clock,
  RotateCcw,
  Sparkles,
  Users,
  ChevronRight,
  Award,
} from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: string;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  currentUserId,
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRemainingText, setTimeRemainingText] = useState('');
  const cycle = getCurrent7DayCycle();

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    const unsubscribe = subscribeToWeeklyLeaderboard((data) => {
      setEntries(data);
      setLoading(false);
    });

    const updateTimer = () => {
      const c = getCurrent7DayCycle();
      setTimeRemainingText(formatTimeRemaining(c.remainingMs));
    };
    updateTimer();
    const interval = setInterval(updateTimer, 60000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const myRankIdx = entries.findIndex((e) => e.userId === currentUserId);
  const myEntry = myRankIdx >= 0 ? entries[myRankIdx] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-4 sm:p-6 shadow-2xl border-4 border-amber-300 overflow-hidden text-stone-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-white shadow-sm">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-stone-800 flex items-center gap-1.5">
                주간 급식 셰프 티어표
              </h3>
              <p className="text-xs font-bold text-amber-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{cycle.formattedRange} ({cycle.cycleId})</span>
                <span className="text-stone-400">•</span>
                <span className="text-orange-600 font-black">{timeRemainingText}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 font-bold flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 7-Day Cycle Explanation Banner */}
        <div className="my-2.5 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs font-bold text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-orange-500 shrink-0" />
            <span>
              매주 <b>7일 주기</b>로 기록이 리셋되며, 발견한 <b>요리 개수</b>에 따라 셰프 티어가 결정됩니다!
            </span>
          </div>
        </div>

        {/* Tier Info Legend */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto py-1 mb-2 text-[10px] sm:text-xs font-extrabold scrollbar-none">
          <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200 whitespace-nowrap">
            🌱 초보 (&lt;10)
          </span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
            🍳 급식 (10+)
          </span>
          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
            🌟 수석 (25+)
          </span>
          <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 whitespace-nowrap">
            💎 마스터 (40+)
          </span>
          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap">
            👑 총주방장 (50)
          </span>
        </div>

        {/* Leaderboard Table */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2">
          {loading ? (
            <div className="py-12 text-center text-sm font-bold text-stone-400 flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
              실시간 티어표 불러오는 중...
            </div>
          ) : entries.length === 0 ? (
            <div className="py-12 text-center text-sm font-bold text-stone-400 flex flex-col items-center gap-2">
              <Award className="w-10 h-10 text-stone-300" />
              이번 주 첫 번째 요리사의 주인공이 되어보세요!
            </div>
          ) : (
            entries.map((entry, idx) => {
              const isMe = entry.userId === currentUserId;
              const badgeStyle = getTierBadgeStyle(entry.tier);
              const rank = idx + 1;

              return (
                <div
                  key={entry.id || entry.userId}
                  className={`flex items-center justify-between p-3 rounded-2xl border-2 transition-all ${
                    isMe
                      ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-300/60 shadow-sm'
                      : rank === 1
                      ? 'bg-gradient-to-r from-amber-50/70 to-orange-50/70 border-amber-300'
                      : 'bg-white border-stone-200 hover:border-amber-200'
                  }`}
                >
                  {/* Rank & User Info */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 text-center font-black text-sm sm:text-base">
                      {rank === 1 ? (
                        <span className="text-xl">🥇</span>
                      ) : rank === 2 ? (
                        <span className="text-xl">🥈</span>
                      ) : rank === 3 ? (
                        <span className="text-xl">🥉</span>
                      ) : (
                        <span className="text-stone-400">#{rank}</span>
                      )}
                    </div>

                    {/* User Avatar */}
                    <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden shrink-0 border border-amber-200 font-black text-amber-800 text-xs">
                      {entry.userPhoto ? (
                        <img
                          src={entry.userPhoto}
                          alt={entry.userName}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        entry.userName.slice(0, 1)
                      )}
                    </div>

                    {/* Name & Tier */}
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-stone-800 truncate">
                          {entry.userName}
                        </span>
                        {isMe && (
                          <span className="text-[10px] font-black bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded-md">
                            나
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`text-[10px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${badgeStyle.bg}`}
                        >
                          <span>{badgeStyle.icon}</span>
                          <span>{entry.tier}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats (Dishes count & Score) */}
                  <div className="flex items-center gap-3 shrink-0 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-sm sm:text-base font-black text-orange-600">
                        {entry.dishesCount}개 완성
                      </span>
                      <span className="text-[11px] font-bold text-stone-400">
                        {entry.totalScore.toLocaleString()}점
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer (My Current Rank) */}
        {myEntry && (
          <div className="mt-3 pt-3 border-t border-amber-100 flex items-center justify-between bg-amber-100/50 p-2.5 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-900">
                내 이번 주 랭킹:
              </span>
              <span className="text-sm font-black text-orange-600">
                #{myRankIdx + 1}위 ({myEntry.dishesCount}개 발견)
              </span>
            </div>
            <span
              className={`text-xs font-black px-2 py-0.5 rounded-full ${
                getTierBadgeStyle(myEntry.tier).bg
              }`}
            >
              {myEntry.tier}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
