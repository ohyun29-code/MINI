import React from 'react';
import { Recipe } from '../types';
import { INGREDIENTS } from '../data/recipes';
import { X, Sparkles, BookOpen } from 'lucide-react';

interface DishDetailModalProps {
  recipe: Recipe | null;
  discovered: boolean;
  onClose: () => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({
  recipe,
  discovered,
  onClose,
}) => {
  if (!recipe) return null;

  const getIngredientEmoji = (id?: string) => {
    if (!id) return '';
    const ing = INGREDIENTS.find((i) => i.id === id);
    return ing ? `${ing.em} ${ing.nm}` : id;
  };

  const ingredientList = [recipe.a, recipe.b, recipe.c, recipe.d]
    .filter(Boolean)
    .map((id) => getIngredientEmoji(id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border-4 border-amber-200 overflow-hidden text-stone-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors z-10"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Dish Image or Big Emoji */}
          <div className="relative w-44 h-44 my-2 rounded-2xl overflow-hidden bg-amber-50 border-3 border-amber-300 shadow-inner flex items-center justify-center">
            {recipe.img && discovered ? (
              <img
                src={recipe.img}
                alt={recipe.nm}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className={`text-7xl select-none ${!discovered ? 'grayscale opacity-40' : ''}`}>
                {recipe.em}
              </span>
            )}

            {recipe.ultra && (
              <span className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full shadow-md">
                👑 전설
              </span>
            )}
            {recipe.hidden && !recipe.ultra && (
              <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-black px-2 py-0.5 rounded-full shadow-md">
                🌟 히든
              </span>
            )}
            {recipe.img && discovered && (
              <span className="absolute bottom-2 right-2 bg-black/70 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> 실사 사진
              </span>
            )}
          </div>

          <h3 className="text-2xl font-black mt-2 text-stone-800 flex items-center gap-2">
            {discovered ? recipe.nm : '??? (미발견 요리)'}
          </h3>

          <p className="text-sm font-semibold text-stone-500 mt-1 min-h-[40px] px-2 flex items-center justify-center">
            {discovered
              ? recipe.desc || '맛있게 조리된 완성 요리입니다!'
              : recipe.hint || '재료들을 조합하여 새로운 요리를 도감에 추가해보세요!'}
          </p>

          {/* Recipe Combination Badge */}
          <div className="w-full bg-amber-50/80 rounded-2xl p-3.5 mt-3 border-2 border-amber-100">
            <div className="text-xs font-bold text-amber-800 mb-2 flex items-center justify-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              조합 레시피
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {ingredientList.map((item, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="text-amber-400 font-black">+</span>}
                  <span className="bg-white text-stone-700 font-extrabold text-xs px-2.5 py-1 rounded-xl shadow-xs border border-amber-200">
                    {discovered ? item : '???'}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md active:translate-y-0.5 transition-transform"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
