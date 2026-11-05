import React, { useEffect, useState } from 'react';
import { Sparkles, Trophy, Dumbbell, PartyPopper, Check, X } from 'lucide-react';
import { EGYPTIAN_JOY_MEMES } from '../data/motivationAndRewards';
import { RewardItem } from '../types';

interface RewardMemeCelebrationModalProps {
  isOpen: boolean;
  reward: RewardItem | null;
  gymVisitsCount: number;
  remainingPoints: number;
  onClose: () => void;
}

export const RewardMemeCelebrationModal: React.FC<RewardMemeCelebrationModalProps> = ({
  isOpen,
  reward,
  gymVisitsCount,
  remainingPoints,
  onClose,
}) => {
  const [activeMeme, setActiveMeme] = useState(EGYPTIAN_JOY_MEMES[0]);

  useEffect(() => {
    if (isOpen) {
      const randomIdx = Math.floor(Math.random() * EGYPTIAN_JOY_MEMES.length);
      setActiveMeme(EGYPTIAN_JOY_MEMES[randomIdx]);
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

  if (!isOpen || !reward) return null;

  const isGym = reward.isGym || reward.id.includes('gym');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 text-center shadow-2xl shadow-amber-500/20 transform transition-all overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Meme Header Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-3">
          <PartyPopper className="w-3.5 h-3.5 text-amber-400" />
          <span>{activeMeme.badge}</span>
        </div>

        {/* Character Icon / Trophy Display */}
        <div className="relative mx-auto mb-4 w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-1 flex items-center justify-center shadow-lg shadow-amber-500/30">
          <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center text-4xl">
            {isGym ? '🏋️‍♂️' : activeMeme.icon}
          </div>
        </div>

        {/* Character Catchphrase */}
        <h3 className="text-sm font-bold text-amber-400 mb-1">
          {activeMeme.character} بيهنيك بالفرحة:
        </h3>
        <h2 className="text-xl sm:text-2xl font-black text-white leading-tight mb-3">
          «{activeMeme.title}»
        </h2>

        {/* Comic Speech Quote */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 text-right mb-4 shadow-inner relative">
          <p className="text-slate-100 text-sm sm:text-base leading-relaxed font-bold">
            "{activeMeme.quote}"
          </p>
          <div className="mt-2 text-xs text-amber-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>مكافأة حلال من عرق مذاكرتك بعد ما حليت وخلصت!</span>
          </div>
        </div>

        {/* Gym Counter Banner if Gym */}
        {isGym ? (
          <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border-2 border-emerald-500/50 rounded-2xl p-3.5 mb-5 shadow-lg flex items-center justify-between text-right">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Dumbbell className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="text-xs text-slate-300 font-medium">سجل الفورمة والحديد:</div>
                <div className="text-emerald-300 font-black text-sm sm:text-base">
                  دي المرة رقم <span className="text-white text-lg font-mono">#{gymVisitsCount}</span> اللي تروح فيها الجيم! 💪
                </div>
              </div>
            </div>
            <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
              عاش يا بطل!
            </div>
          </div>
        ) : (
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-3 mb-5 flex items-center justify-between text-xs">
            <span className="text-slate-300">المكافأة المستبدلة: <strong className="text-white">{reward.title}</strong></span>
            <span className="text-amber-400 font-bold font-mono">-{reward.cost} نقطة</span>
          </div>
        )}

        {/* Points Balance Footer */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-5 px-2">
          <span>النقاط المتبقية في رصيدك:</span>
          <span className="text-amber-300 font-black text-sm">🪙 {remainingPoints} نقطة</span>
        </div>

        {/* Confirm Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 px-6 rounded-xl font-black text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all transform active:scale-98"
        >
          <Check className="w-5 h-5" />
          <span>استمتع بوقتك يا برنس (متابعة)</span>
        </button>
      </div>
    </div>
  );
};
