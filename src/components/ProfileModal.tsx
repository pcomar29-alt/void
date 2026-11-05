import React, { useState } from 'react';
import { X, User, Check, Camera, Sparkles, Dumbbell, Trophy } from 'lucide-react';
import { StudentProfile } from '../types';
import { EGYPTIAN_MEME_AVATARS } from '../data/motivationAndRewards';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  onSaveProfile: (profile: StudentProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [name, setName] = useState(profile.name);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...profile,
      name: name.trim() || 'بطل تانية ثانوي',
      avatarUrl,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="relative w-full max-w-xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-7 flex flex-col shadow-2xl text-right overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>الملف الشخصي وصورة البروفايل</span>
              </h2>
              <p className="text-xs text-slate-400">
                اختر شخصيتك من أشهر ميمات الثانوية المصرية أو ارفع صورتك
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 overflow-y-auto pr-1 pl-1 custom-scrollbar">
          {/* Active Avatar Preview */}
          <div className="flex items-center gap-4 p-4 bg-slate-800/60 rounded-2xl border border-slate-700/60">
            <div className="relative shrink-0">
              <img
                src={avatarUrl}
                alt={name}
                className="w-18 h-18 rounded-2xl object-cover bg-slate-950 border-2 border-indigo-500 shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/bottts/svg?seed=gayarLegend';
                }}
              />
              <label 
                className="absolute -bottom-1 -right-1 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl cursor-pointer shadow-md transition-transform hover:scale-105"
                title="رفع صورة من جهازك"
              >
                <Camera className="w-3.5 h-3.5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex-1">
              <label className="text-xs text-slate-400 block mb-1">اسم البطل / الطالب</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="اكتب اسمك هنا..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Dedicated Gym Visits Milestone Card */}
          <div className="p-3.5 bg-gradient-to-r from-emerald-950/60 via-slate-800/80 to-emerald-950/60 border border-emerald-500/40 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">سجل الذهاب للجيم</div>
                <div className="text-sm font-black text-white">
                  أنت روحت الجيم <span className="text-emerald-400 font-mono text-base">{profile.gymVisitsCount || 0}</span> مرات حتى الآن! 🏋️‍♂️
                </div>
              </div>
            </div>
            <span className="text-xs text-emerald-300 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              فورمة وعقل سليم
            </span>
          </div>

          {/* Egyptian Meme Avatars Grid */}
          <div>
            <label className="text-xs font-bold text-amber-300 block mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>ميمات الثانوية والسينما المصرية الشهيرة (اضغط للاختيار):</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {EGYPTIAN_MEME_AVATARS.map((meme) => {
                const isSelected = avatarUrl === meme.avatarUrl;
                return (
                  <button
                    type="button"
                    key={meme.id}
                    onClick={() => setAvatarUrl(meme.avatarUrl)}
                    className={`p-2.5 rounded-2xl border text-right transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/20 shadow-md shadow-amber-500/10 scale-102'
                        : 'border-slate-800 bg-slate-900/90 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <img
                        src={meme.avatarUrl}
                        alt={meme.character}
                        className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          {meme.character}
                        </div>
                        <div className="text-[10px] text-amber-400 truncate">
                          {meme.title.split(' ')[0]}
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                      "{meme.tagline}"
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-center">
            <div className="p-2 bg-slate-800/40 rounded-xl border border-slate-700/40">
              <div className="text-[10px] text-slate-400">النقاط</div>
              <div className="text-sm font-black text-amber-400">🪙 {profile.points}</div>
            </div>
            <div className="p-2 bg-slate-800/40 rounded-xl border border-slate-700/40">
              <div className="text-[10px] text-slate-400">مرات الجيم</div>
              <div className="text-sm font-black text-emerald-400">🏋️ {profile.gymVisitsCount || 0}</div>
            </div>
            <div className="p-2 bg-slate-800/40 rounded-xl border border-slate-700/40">
              <div className="text-[10px] text-slate-400">إنجاز الشاطر</div>
              <div className="text-sm font-black text-indigo-400">⚡ {profile.shaterBonusCount || 0}</div>
            </div>
            <div className="p-2 bg-slate-800/40 rounded-xl border border-slate-700/40">
              <div className="text-[10px] text-slate-400">المكتسب كلياً</div>
              <div className="text-sm font-black text-white">🌟 {profile.totalPointsEarned || 0}</div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>حفظ التعديلات</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
