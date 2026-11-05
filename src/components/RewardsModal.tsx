import React, { useState } from 'react';
import { X, Gift, Plus, Check, Award, AlertCircle, Dumbbell, History, Sparkles } from 'lucide-react';
import { RewardItem, StudentProfile } from '../types';

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  rewards: RewardItem[];
  onRedeemReward: (reward: RewardItem) => void;
  onAddReward: (reward: Omit<RewardItem, 'id' | 'timesRedeemed'>) => void;
  onDeleteReward: (rewardId: string) => void;
}

const EMOJI_OPTIONS = ['🏋️‍♂️', '🛍️', '🎮', '🍕', '🎬', '☕', '⚽', '🎁', '🏖️', '🍦', '🎧', '🚴‍♂️', '🍔', '🎳', '🍿', '🎸'];

export const RewardsModal: React.FC<RewardsModalProps> = ({
  isOpen,
  onClose,
  profile,
  rewards,
  onRedeemReward,
  onAddReward,
  onDeleteReward,
}) => {
  const [activeTab, setActiveTab] = useState<'store' | 'history'>('store');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCost, setNewCost] = useState(100);
  const [newIcon, setNewIcon] = useState('🎁');

  if (!isOpen) return null;

  const handleCreateReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddReward({
      title: newTitle.trim(),
      cost: Number(newCost) || 100,
      icon: newIcon,
      category: 'custom',
    });
    setNewTitle('');
    setNewCost(100);
    setShowAddForm(false);
  };

  const handleRedeem = (reward: RewardItem) => {
    if (profile.points < reward.cost) return;
    onRedeemReward(reward);
  };

  const gymVisits = profile.gymVisitsCount || 0;
  const history = profile.redeemHistory || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-7 flex flex-col shadow-2xl text-right overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>متجر المكافآت وسجل الجيم</span>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  نظام حقيقي ومكافآت مستحقة
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                النقاط صعبة ومستحقة: الدرس = +10 نقاط فقط · الجيم = 100 نقطة (10 دروس كاملة!)
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

        {/* Big Gym Visits Tracker & Points Bar */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Gym Visits Counter */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border-2 border-emerald-500/40 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-2xl">
                🏋️‍♂️
              </div>
              <div>
                <div className="text-xs text-slate-300 font-medium">أنا روحت الجيم كم مرة:</div>
                <div className="text-2xl font-black text-white">
                  <span className="text-emerald-400">{gymVisits}</span> <span className="text-xs text-slate-400 font-normal">مرات تمرين</span>
                </div>
              </div>
            </div>
            <div className="text-left text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-1 rounded-lg">
              فورمة ودماغ 🦾
            </div>
          </div>

          {/* Points Balance */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-500/30 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🪙</div>
              <div>
                <div className="text-xs text-slate-300 font-medium">رصيد نقاطك المتاح:</div>
                <div className="text-2xl font-black text-amber-300 font-mono">
                  {profile.points} <span className="text-xs text-slate-300 font-normal">نقطة</span>
                </div>
              </div>
            </div>
            <div className="text-left text-[11px] text-slate-400">
              المكتسب: <strong className="text-white">{profile.totalPointsEarned}</strong>
            </div>
          </div>
        </div>

        {/* View Switcher: Store vs History */}
        <div className="flex items-center gap-2 mt-4 pb-2 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('store')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'store'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>قائمة المكافآت ({rewards.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>سجل ما تم شراؤه والجيم ({history.length})</span>
          </button>

          {activeTab === 'store' && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="mr-auto text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 py-1.5 px-3 rounded-xl bg-amber-500/10 border border-amber-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddForm ? 'إلغاء' : 'إضافة مكافأة'}</span>
            </button>
          )}
        </div>

        {/* Tab 1: Store */}
        {activeTab === 'store' && (
          <div className="flex-1 overflow-y-auto my-3 pr-1 pl-1 space-y-3 custom-scrollbar">
            {/* Add Reward Subform */}
            {showAddForm && (
              <form onSubmit={handleCreateReward} className="p-4 bg-slate-800/80 border border-amber-500/30 rounded-2xl space-y-3 animate-fade-in">
                <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>إضافة مكافأة مخصصة ترغب في تحقيقها:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">اسم المكافأة</label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="مثال: الذهاب للسينما / شاورما"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">تكلفة النقاط المطلوبة</label>
                    <input
                      type="number"
                      min="10"
                      max="5000"
                      step="10"
                      value={newCost}
                      onChange={(e) => setNewCost(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">اختر أيقونة المكافأة</label>
                  <div className="flex flex-wrap gap-1.5">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        type="button"
                        key={emoji}
                        onClick={() => setNewIcon(emoji)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-base border transition-all ${
                          newIcon === emoji
                            ? 'bg-amber-500/30 border-amber-400 scale-110'
                            : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>حفظ المكافأة</span>
                  </button>
                </div>
              </form>
            )}

            {/* Grid of rewards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rewards.map((reward) => {
                const canAfford = profile.points >= reward.cost;
                const isGym = reward.isGym || reward.id.includes('gym');
                const neededLessons = Math.ceil(reward.cost / 10);

                return (
                  <div
                    key={reward.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                      isGym
                        ? 'bg-emerald-950/20 border-emerald-500/50 shadow-md'
                        : canAfford
                        ? 'bg-slate-800/70 border-slate-700 hover:border-amber-500/40'
                        : 'bg-slate-800/30 border-slate-800 opacity-70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl p-2 bg-slate-900/80 rounded-xl border border-slate-700/50">
                          {reward.icon}
                        </span>
                        <div>
                          <h3 className="text-xs font-bold text-white leading-snug">
                            {reward.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-extrabold text-amber-400">
                              🪙 {reward.cost} نقطة
                            </span>
                            <span className="text-[10px] text-slate-400">
                              ({neededLessons} دروس)
                            </span>
                          </div>
                        </div>
                      </div>
                      {reward.category === 'custom' && (
                        <button
                          onClick={() => onDeleteReward(reward.id)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                          title="حذف المكافأة المخصصة"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      {isGym && (
                        <div className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20 text-center font-semibold">
                          روحت الجيم {gymVisits} مرات حتى الآن!
                        </div>
                      )}

                      <button
                        onClick={() => handleRedeem(reward)}
                        disabled={!canAfford}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          canAfford
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 shadow-md shadow-amber-500/20 active:scale-98'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                        }`}
                      >
                        {canAfford ? (
                          <>
                            <Award className="w-3.5 h-3.5" />
                            <span>{isGym ? 'استبدال وتأكيد الذهاب للجيم 🏋️‍♂️' : 'استبدال المكافأة الآن'}</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>ناقصك {reward.cost - profile.points} نقطة ({Math.ceil((reward.cost - profile.points) / 10)} دروس)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: History Log */}
        {activeTab === 'history' && (
          <div className="flex-1 overflow-y-auto my-3 pr-1 pl-1 space-y-2 custom-scrollbar">
            {history.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Dumbbell className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-white">لم تستبدل أي مكافأة حتى الآن!</p>
                <p className="text-xs text-slate-500 mt-1">كل ما تخلص 10 دروس تقدر تروح الجيم وتفتح ميمات الفرحة المصرية!</p>
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-800/70 border border-slate-700 rounded-2xl flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl p-1.5 bg-slate-900 rounded-lg">{item.icon}</span>
                    <div>
                      <div className="font-bold text-white">{item.rewardTitle}</div>
                      <div className="text-[10px] text-slate-400">{item.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-amber-400 font-mono">-{item.cost} نقطة</span>
                    {item.isGym && (
                      <span className="block text-[10px] text-emerald-400 font-semibold">
                        تمرينة جيم مكتملة 💪
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>💡 الذهاب للجيم يتطلب إنجاز 10 دروس كاملة لتعيش متعة التمرين بدون تأنيب ضمير!</span>
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
