import React, { useEffect } from 'react';
import { Trophy, Sparkles, CheckCircle2, ArrowLeft, Star } from 'lucide-react';
import { MOTIVATION_QUOTES } from '../data/motivationAndRewards';

interface CelebrationModalProps {
  isOpen: boolean;
  lessonTitle: string;
  pointsAdded: number;
  totalPoints: number;
  onClose: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  lessonTitle,
  pointsAdded,
  totalPoints,
  onClose,
}) => {
  // Pick random quote whenever it opens
  const [quote, setQuote] = React.useState(MOTIVATION_QUOTES[0]);

  useEffect(() => {
    if (isOpen) {
      const randomIdx = Math.floor(Math.random() * MOTIVATION_QUOTES.length);
      setQuote(MOTIVATION_QUOTES[randomIdx]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 text-center shadow-2xl shadow-amber-500/20 transform transition-all animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Celebratory Badge / Icon with Stars */}
        <div className="relative mx-auto mb-5 w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 p-1 flex items-center justify-center shadow-lg shadow-amber-500/30">
          <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center relative overflow-hidden">
            <Trophy className="w-12 h-12 text-yellow-400 animate-bounce" />
            <Sparkles className="w-5 h-5 text-amber-300 absolute top-2 right-2 animate-pulse" />
            <Star className="w-4 h-4 text-yellow-300 absolute bottom-3 left-3 animate-ping" />
          </div>
        </div>

        {/* Title */}
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30 mb-2">
          إنجاز متميز! 🌟
        </span>
        <h2 className="text-2xl font-black text-white mb-2">
          عاش يا بطل! تم إنهاء الدرس
        </h2>
        <p className="text-sm font-medium text-slate-300 line-clamp-2 px-2 bg-slate-800/60 rounded-xl py-2 mb-4 border border-slate-700/50">
          📖 {lessonTitle}
        </p>

        {/* Reward points callout */}
        <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-400/40 rounded-2xl p-3.5 mb-5 shadow-inner">
          <span className="text-3xl">🪙</span>
          <div className="text-right">
            <div className="text-amber-300 font-extrabold text-lg">
              +{pointsAdded} نقطة في رصيدك!
            </div>
            <div className="text-xs text-slate-300">
              إجمالي رصيد نقاطك الآن: <span className="text-white font-bold">{totalPoints} نقطة</span>
            </div>
          </div>
        </div>

        {/* Motivational Card Quote */}
        <div className="relative bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 text-right mb-6">
          <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>رسالة تحفيزية لك:</span>
          </div>
          <p className="text-slate-100 text-sm leading-relaxed font-medium">
            "{quote.text}"
          </p>
          <div className="text-left mt-2">
            <span className="text-[11px] text-slate-400 bg-slate-700/50 px-2.5 py-0.5 rounded-full">
              — {quote.author}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:to-yellow-600 shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all transform active:scale-98"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>استمر في الإنجاز (متابعة)</span>
          <ArrowLeft className="w-4 h-4 mr-1" />
        </button>
      </div>
    </div>
  );
};
