import React, { useState } from 'react';
import { Ingredient } from '../types';
import { INGREDIENTS } from '../data/recipes';
import { Sparkles, Trash2, Flame } from 'lucide-react';

interface KitchenProps {
  pot: string[];
  maxSlots: number;
  isCooking: boolean;
  selectedIdx: number;
  hint: string;
  onAddIngredient: (id: string) => void;
  onClearPot: () => void;
  onSelectIngredient: (idx: number) => void;
}

export const Kitchen: React.FC<KitchenProps> = ({
  pot,
  maxSlots,
  isCooking,
  selectedIdx,
  hint,
  onAddIngredient,
  onClearPot,
  onSelectIngredient,
}) => {
  const [dragOverStove, setDragOverStove] = useState(false);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverStove(false);
    const id = e.dataTransfer.getData('text/plain');
    if (id) {
      onAddIngredient(id);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 w-full">
      {/* Ingredients Shelf */}
      <div className="md:col-span-7 bg-white/90 rounded-2xl p-3 sm:p-4 border-3 border-amber-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm sm:text-base font-black text-amber-900 flex items-center gap-1.5">
              <span>🧺</span> 재료 칸
            </h2>
            <span className="text-xs font-bold text-amber-700/80">
              클릭 또는 냄비로 드래그!
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {INGREDIENTS.map((ing, idx) => {
              const isSelected = selectedIdx === idx;
              const isTaken = pot.includes(ing.id);

              return (
                <button
                  key={ing.id}
                  type="button"
                  draggable={!isTaken && !isCooking}
                  onDragStart={(e) => handleDragStart(e, ing.id)}
                  onClick={() => {
                    onSelectIngredient(idx);
                    onAddIngredient(ing.id);
                  }}
                  disabled={isCooking}
                  className={`relative flex flex-col items-center justify-center p-1.5 sm:p-2.5 rounded-xl border-2 transition-all select-none active:scale-95 ${
                    isTaken
                      ? 'opacity-35 grayscale bg-stone-100 border-stone-200 cursor-not-allowed'
                      : isSelected
                      ? 'bg-amber-100 border-amber-500 shadow-md ring-2 ring-amber-300'
                      : 'bg-gradient-to-b from-white to-amber-50 border-amber-200 hover:border-amber-400 hover:shadow-sm'
                  }`}
                >
                  <span className="text-2xl sm:text-3xl filter drop-shadow-xs">{ing.em}</span>
                  <span className="text-[10px] sm:text-xs font-extrabold text-stone-700 mt-0.5">
                    {ing.nm}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cooking Pot & Stove */}
      <div className="md:col-span-5 bg-white/90 rounded-2xl p-3 sm:p-4 border-3 border-amber-200 shadow-sm flex flex-col items-center justify-between">
        <div className="w-full flex items-center justify-between mb-1">
          <h2 className="text-sm sm:text-base font-black text-amber-900 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            요리 냄비
          </h2>
          <span className="text-xs font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
            재료 {maxSlots}개 필요
          </span>
        </div>

        {/* Pot Drop Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverStove(true);
          }}
          onDragLeave={() => setDragOverStove(false)}
          onDrop={handleDrop}
          className={`w-full max-w-[260px] my-1 p-3 rounded-2xl border-3 border-dashed transition-all flex flex-col items-center justify-center ${
            dragOverStove
              ? 'bg-amber-100 border-orange-500 scale-102 shadow-lg'
              : 'bg-gradient-to-b from-amber-50 to-amber-100/70 border-amber-300'
          }`}
        >
          <div
            className={`text-5xl sm:text-6xl my-1 select-none transition-transform filter drop-shadow-md ${
              isCooking ? 'animate-bounce' : ''
            }`}
          >
            🍲
          </div>

          {/* Slots */}
          <div className="flex items-center justify-center gap-2 mt-2">
            {Array.from({ length: maxSlots }).map((_, i) => {
              const ingId = pot[i];
              const ing = ingId ? INGREDIENTS.find((it) => it.id === ingId) : null;

              return (
                <div
                  key={i}
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl border-2 flex items-center justify-center text-xl sm:text-2xl transition-all shadow-inner ${
                    ing
                      ? 'bg-green-50 border-green-500 text-green-800 scale-105 animate-pulse'
                      : 'bg-white/80 border-amber-200 text-stone-300 border-dashed'
                  }`}
                >
                  {ing ? ing.em : ''}
                </div>
              );
            })}
          </div>
        </div>

        {/* Hint text & Clear button */}
        <div className="w-full flex items-center justify-between gap-2 mt-1">
          <p className="text-xs font-bold text-amber-800 flex-1 truncate text-center bg-amber-50/70 py-1.5 px-2 rounded-lg border border-amber-200">
            {hint}
          </p>

          <button
            type="button"
            onClick={onClearPot}
            disabled={pot.length === 0 || isCooking}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 disabled:opacity-30 disabled:cursor-not-allowed border border-stone-300 font-bold text-xs flex items-center gap-1 transition-all"
            title="냄비 비우기"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">비우기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
