import React, { useState } from 'react';
import {
  signInWithPopup,
  signInAnonymously,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { AppUser } from '../types';
import { ChefHat, Sparkles, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserLogin: (user: AppUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onUserLogin,
}) => {
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user: AppUser = {
        uid: res.user.uid,
        displayName: res.user.displayName || '구글 셰프',
        photoURL: res.user.photoURL || undefined,
        email: res.user.email || undefined,
        isGuest: false,
      };
      localStorage.setItem('bangok_chef_user', JSON.stringify(user));
      onUserLogin(user);
      onClose();
    } catch (err: any) {
      console.warn('Google Sign-In note:', err);
      if (err.code === 'auth/popup-blocked') {
        setErrorMsg('팝업이 차단되었습니다. 상단 새 탭에서 열기를 이용하시거나 닉네임으로 입장해주세요!');
      } else {
        setErrorMsg('구글 로그인에 실패했습니다. 닉네임으로 바로 입장하실 수 있습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nickname.trim();
    if (!trimmed) {
      setErrorMsg('셰프 닉네임을 입력해주세요!');
      return;
    }
    setLoading(true);
    setErrorMsg('');

    let guestUid = '';

    // 1. Try Firebase anonymous authentication
    try {
      const cred = await signInAnonymously(auth);
      if (cred.user) {
        await updateProfile(cred.user, { displayName: trimmed });
        guestUid = cred.user.uid;
      }
    } catch (err) {
      console.info('Firebase anonymous login fallback to local guest session:', err);
    }

    // 2. Fallback if anonymous auth is not enabled in Firebase Console
    if (!guestUid) {
      const existing = localStorage.getItem('bangok_chef_user');
      if (existing) {
        try {
          const parsed = JSON.parse(existing);
          if (parsed.uid && parsed.uid.startsWith('guest_')) {
            guestUid = parsed.uid;
          }
        } catch {
          // ignore
        }
      }
      if (!guestUid) {
        guestUid = `guest_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
      }
    }

    const appUser: AppUser = {
      uid: guestUid,
      displayName: trimmed,
      isGuest: true,
    };

    localStorage.setItem('bangok_chef_user', JSON.stringify(appUser));
    onUserLogin(appUser);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border-4 border-amber-300 overflow-hidden text-stone-800 text-center">
        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-tr from-amber-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-md">
          <ChefHat className="w-9 h-9 text-white" />
        </div>

        <h3 className="text-xl font-black text-stone-800">
          급식실 셰프 입장하기 🍳
        </h3>
        <p className="text-xs font-bold text-stone-500 mt-1 mb-5">
          닉네임을 입력하거나 구글로 로그인하여 7일 주기 실시간 티어표에 기록을 남겨보세요!
        </p>

        {errorMsg && (
          <div className="mb-4 text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200 flex items-center gap-1.5 text-left">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Quick Nickname Guest Form (Primary & Instant) */}
        <form onSubmit={handleGuestSignIn} className="space-y-3">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="셰프 닉네임 입력 (예: 방곡 급식왕)"
            maxLength={12}
            autoFocus
            className="w-full px-3.5 py-3 rounded-xl border-2 border-amber-300 focus:border-amber-500 focus:outline-none text-sm font-black text-stone-800 placeholder-stone-400 bg-amber-50/50 shadow-inner"
          />
          <button
            type="submit"
            disabled={loading || !nickname.trim()}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-40 text-white font-black text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? '입장 중...' : '셰프 닉네임으로 바로 시작 🚀'}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-stone-400 font-bold">또는</span>
          </div>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl border-2 border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Google 계정으로 로그인
        </button>
      </div>
    </div>
  );
};
