import React, { useState } from 'react';
import { X, Sparkles, RefreshCw, Quote, Flame, Heart, Copy, Check } from 'lucide-react';
import { MOTIVATION_QUOTES } from '../data/motivationAndRewards';
import { MotivationQuote } from '../types';

interface MotivationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MotivationModal: React.FC<MotivationModalProps> = ({ isOpen, onClose }) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');

  if (!isOpen) return null;

  const featuredQuote = MOTIVATION_QUOTES[currentQuoteIndex];

  const categories = ['الكل', ...Array.from(new Set(MOTIVATION_QUOTES.map((q) => q.category)))];

  const filteredQuotes = selectedCategory === 'الكل'
    ? MOTIVATION_QUOTES
    : MOTIVATION_QUOTES.filter((q) => q.category === selectedCategory);

  const handleNextRandomQuote = () => {
    let nextIdx = Math.floor(Math.random() * MOTIVATION_QUOTES.length);
    if (nextIdx === currentQuoteIndex) {
      nextIdx = (nextIdx + 1) % MOTIVATION_QUOTES.length;
    }
    setCurrentQuoteIndex(nextIdx);
  };

  const handleCopyQuote = (q: MotivationQuote) => {
    navigator.clipboard.writeText(`"${q.text}" - ${q.author}`);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-7 flex flex-col shadow-2xl text-right overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Flame className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>جرعة تحفيز وتفوق</span>
                <span className="text-xs font-normal text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                  وقود العزيمة 🔥
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                كلمات حقيقية تشحن همتك وتذكرك لماذا بدأت وأين تريد أن تصل
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Featured Big Quote Card */}
        <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-amber-950/30 border border-indigo-500/40 relative overflow-hidden shadow-lg">
          <div className="absolute top-2 left-4 text-indigo-500/20">
            <Quote className="w-20 h-20 transform -scale-x-100" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>اقتباس اليوم المميز</span>
              </span>
              <button
                onClick={handleNextRandomQuote}
                className="text-xs text-indigo-300 hover:text-white flex items-center gap-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 px-3 py-1.5 rounded-xl transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>اقتباس عشوائي آخر</span>
              </button>
            </div>

            <p className="text-base sm:text-lg font-bold text-slate-100 leading-relaxed my-3">
              "{featuredQuote.text}"
            </p>

            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-slate-400 font-semibold">— {featuredQuote.author}</span>
              <button
                onClick={() => handleCopyQuote(featuredQuote)}
                className="text-slate-400 hover:text-amber-400 flex items-center gap-1"
                title="نسخ الاقتباس"
              >
                {copiedId === featuredQuote.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Quotes List */}
        <div className="flex-1 overflow-y-auto my-3 pr-1 pl-1 space-y-2.5 custom-scrollbar">
          {filteredQuotes.map((q) => (
            <div
              key={q.id}
              className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition-all flex items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  "{q.text}"
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="text-indigo-400 font-semibold">{q.author}</span>
                  <span>•</span>
                  <span className="bg-slate-700/50 px-2 py-0.5 rounded-md text-[10px] text-slate-300">
                    {q.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleCopyQuote(q)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg transition-colors flex-shrink-0"
                title="نسخ"
              >
                {copiedId === q.id ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>تذكر دائماً: تعبك اليوم يصنع فخرك ومستقبلك غداً!</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
