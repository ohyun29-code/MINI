import React, { useState } from 'react';
import { Recipe } from '../types';
import { Sparkles, Camera, Search, CheckCircle2 } from 'lucide-react';

interface BookProps {
  recipes: Recipe[];
  found: Record<string, boolean>;
  onSelectRecipe: (recipe: Recipe) => void;
}

export const Book: React.FC<BookProps> = ({ recipes, found, onSelectRecipe }) => {
  const [filter, setFilter] = useState<'all' | 'photo' | 'discovered'>('all');

  const filteredRecipes = recipes.filter((r) => {
    const isDiscovered = !!found[r.nm];
    if (filter === 'photo') return !!r.img;
    if (filter === 'discovered') return isDiscovered;
    return true;
  });

  const totalDiscovered = recipes.filter((r) => !!found[r.nm]).length;

  return (
    <div className="bg-white/90 rounded-2xl p-3 sm:p-4 border-3 border-amber-200 shadow-sm flex flex-col gap-3">
      {/* Header with Title and Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm sm:text-base font-black text-amber-900 flex items-center gap-1.5">
            <span>📖</span> 요리 도감
          </h2>
          <span className="text-xs font-black text-white bg-amber-500 px-2 py-0.5 rounded-full shadow-xs">
            {totalDiscovered} / {recipes.length}
          </span>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 bg-amber-50 p-1 rounded-xl border border-amber-200 text-xs font-bold">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-800 hover:bg-amber-100'
            }`}
          >
            전체 ({recipes.length})
          </button>
          <button
            onClick={() => setFilter('photo')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${
              filter === 'photo'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Camera className="w-3 h-3 text-amber-300" />
            실사 요리
          </button>
          <button
            onClick={() => setFilter('discovered')}
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${
              filter === 'discovered'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-800 hover:bg-amber-100'
            }`}
          >
            <CheckCircle2 className="w-3 h-3 text-green-300" />
            완성됨 ({totalDiscovered})
          </button>
        </div>
      </div>

      {/* Grid of Dishes */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-[320px] overflow-y-auto pr-1">
        {filteredRecipes.map((r) => {
          const isDiscovered = !!found[r.nm];
          const hasPhoto = !!r.img;

          return (
            <button
              key={r.id}
              onClick={() => onSelectRecipe(r)}
              className={`relative flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all hover:scale-105 active:scale-95 group ${
                isDiscovered
                  ? r.ultra
                    ? 'bg-gradient-to-b from-orange-50 to-red-50 border-red-400 shadow-xs'
                    : r.hidden
                    ? 'bg-gradient-to-b from-amber-50 to-yellow-50 border-amber-400 shadow-xs'
                    : 'bg-white border-green-300 shadow-xs'
                  : 'bg-stone-50 border-stone-200 opacity-60'
              }`}
            >
              {/* Photo Indicator Dot */}
              {hasPhoto && isDiscovered && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
              )}

              {/* Dish Visual: If discovered and has photo, show thumbnail or emoji */}
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg overflow-hidden flex items-center justify-center bg-amber-50/50 mb-1">
                {isDiscovered && r.img ? (
                  <img
                    src={r.img}
                    alt={r.nm}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className={`text-2xl sm:text-3xl ${!isDiscovered ? 'grayscale opacity-30' : ''}`}>
                    {r.em}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] sm:text-[11px] font-black truncate w-full text-center ${
                  isDiscovered
                    ? r.ultra
                      ? 'text-red-700'
                      : r.hidden
                      ? 'text-amber-700'
                      : 'text-stone-800'
                    : 'text-stone-400'
                }`}
              >
                {isDiscovered ? r.nm : r.ultra ? '👑 힌트' : r.hidden ? '🌟 힌트' : '???'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
