import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound, 
  ArrowRight, 
  RefreshCw, 
  ShieldCheck,
  Eye,
  EyeOff,
  Smile,
  SmilePlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'register' }: AuthModalProps) {
  const { login, register, verifyEmailCode, resendVerificationCode } = useAuth();
  const { language } = useLanguage();

  const [mode, setMode] = useState<'login' | 'register' | 'verify' | 'success'>(initialMode);
  
  // Registration Form State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Verification Step State
  const [verificationCode, setVerificationCode] = useState('');
  const [lastSentCode, setLastSentCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Shake & Smile animation triggers when user tries to click locked buttons
  const [loginAttemptShake, setLoginAttemptShake] = useState(false);
  const [registerAttemptShake, setRegisterAttemptShake] = useState(false);
  const [verifyAttemptShake, setVerifyAttemptShake] = useState(false);

  // Hover states to show smile only on mouse hover when incomplete
  const [isLoginHovered, setIsLoginHovered] = useState(false);
  const [isRegisterHovered, setIsRegisterHovered] = useState(false);
  const [isVerifyHovered, setIsVerifyHovered] = useState(false);

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Strict Validation Rules
  const isLoginValid = Boolean(email.trim().length > 0 && password.trim().length > 0);

  const isRegisterValid = Boolean(
    fullName.trim().length > 0 &&
    phoneNumber.trim().length > 0 &&
    email.trim().length > 0 &&
    email.includes('@') &&
    password.length >= 6 &&
    confirmPassword.length >= 6 &&
    password === confirmPassword
  );

  const isVerifyValid = verificationCode.trim().length === 6;

  const triggerLoginBlockedHint = () => {
    setLoginAttemptShake(true);
    setTimeout(() => setLoginAttemptShake(false), 800);
  };

  const triggerRegisterBlockedHint = () => {
    setRegisterAttemptShake(true);
    setTimeout(() => setRegisterAttemptShake(false), 800);
  };

  const triggerVerifyBlockedHint = () => {
    setVerifyAttemptShake(true);
    setTimeout(() => setVerifyAttemptShake(false), 800);
  };

  // Dynamic Smile status message for Register when hovered while incomplete
  const getRegisterSmileStatus = () => {
    if (!fullName.trim() && !phoneNumber.trim() && !email.trim() && !password) {
      return language === 'ru' 
        ? "Сначала заполните все поля! 😜" 
        : language === 'en' 
        ? "Fill all fields first! 😜" 
        : "Avval barcha joylarni to'ldiring! 😜";
    }
    if (!fullName.trim()) {
      return language === 'ru' ? "Укажите имя и фамилию! 😜" : language === 'en' ? "Enter full name! 😜" : "Ism va familiyangizni kiriting! 😜";
    }
    if (!phoneNumber.trim()) {
      return language === 'ru' ? "Укажите номер телефона! 😜" : language === 'en' ? "Enter phone number! 😜" : "Telefon raqamingizni kiriting! 😜";
    }
    if (!email.trim() || !email.includes('@')) {
      return language === 'ru' ? "Введите email (@)! 😜" : language === 'en' ? "Enter valid email (@)! 😜" : "Email manzilni to'g'ri kiriting! 😜";
    }
    if (password.length < 6) {
      return language === 'ru' ? "Пароль минимум 6 символов! 😜" : language === 'en' ? "Password min 6 chars! 😜" : "Parol kamida 6 ta belgi bo'lsin! 😜";
    }
    if (password !== confirmPassword) {
      return language === 'ru' ? "Пароли не совпадают! 😜" : language === 'en' ? "Passwords don't match! 😜" : "Parollar mos kelmadi! 😜";
    }
    return language === 'ru' ? "Заполните обязательные поля! 😜" : language === 'en' ? "Fill required fields! 😜" : "Kerakli joylarni to'ldiring! 😜";
  };

  // Dynamic Smile status message for Login when hovered while incomplete
  const getLoginSmileStatus = () => {
    if (!email.trim() && !password) {
      return language === 'ru'
        ? "Сначала введите логин и пароль! 🙃"
        : language === 'en'
        ? "Enter login & password first! 🙃"
        : "Avval login va parolni yozing! 🙃";
    }
    if (!email.trim()) {
      return language === 'ru'
        ? "Введите email или логин! 🙃"
        : language === 'en'
        ? "Enter email or login! 🙃"
        : "Email yoki loginni kiriting! 🙃";
    }
    if (!password) {
      return language === 'ru'
        ? "Введите пароль! 🙃"
        : language === 'en'
        ? "Enter password! 🙃"
        : "Parolni kiriting! 🙃";
    }
    return language === 'ru'
      ? "Введите логин и пароль! 🙃"
      : language === 'en'
      ? "Enter login & password! 🙃"
      : "Login va parolni to'ldiring! 🙃";
  };

  if (!isOpen) return null;

  const resetForm = () => {
    setFullName('');
    setPhoneNumber('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setVerificationCode('');
    setLastSentCode('');
    setErrorMessage('');
    setSuccessMessage('');
    setIsRegisterHovered(false);
    setIsLoginHovered(false);
    setIsVerifyHovered(false);
  };

  const handleSwitchToLogin = () => {
    setMode('login');
    setErrorMessage('');
    setSuccessMessage('');
    setIsRegisterHovered(false);
    setIsLoginHovered(false);
    setIsVerifyHovered(false);
  };

  const handleSwitchToRegister = () => {
    setMode('register');
    setErrorMessage('');
    setSuccessMessage('');
    setIsRegisterHovered(false);
    setIsLoginHovered(false);
    setIsVerifyHovered(false);
  };

  // Handle User Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isRegisterValid) {
      triggerRegisterBlockedHint();
      return;
    }

    setIsLoading(true);
    try {
      const res = await register(fullName, email, phoneNumber, password);
      setLastSentCode(res.code);
      setMode('verify');
      setResendCooldown(60);
      
      // Start cooldown timer
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setErrorMessage("Ushbu email manzil bilan avval ro'yxatdan o'tilgan. Iltimos, 'Kirish' bo'limidan kiring.");
      } else if (err.code === 'auth/invalid-email') {
        setErrorMessage("Noto'g'ri email formati kiritildi.");
      } else {
        setErrorMessage(err.message || "Ro'yxatdan o'tishda xatolik yuz berdi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Verification Code Submit
  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isVerifyValid) {
      triggerVerifyBlockedHint();
      return;
    }

    setIsLoading(true);
    try {
      await verifyEmailCode(email, verificationCode.trim());
      setMode('success');
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2500);
    } catch (err: any) {
      setErrorMessage(err.message || "Tasdiqlashda xatolik yuz berdi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Resending Code
  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    setIsLoading(true);
    setErrorMessage('');
    try {
      const newCode = await resendVerificationCode(email);
      setLastSentCode(newCode);
      setSuccessMessage("Yangi tasdiqlash kodi emailingizga jo'natildi!");
      setResendCooldown(60);

      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setErrorMessage("Kodni qayta jo'natishda xatolik yuz berdi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle User Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isLoginValid) {
      triggerLoginBlockedHint();
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      onClose();
      resetForm();
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMessage("Email yoki parol noto'g'ri kiritildi.");
      } else {
        setErrorMessage(err.message || "Tizimga kirishda xatolik yuz berdi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-2xl bg-slate-900 shadow-2xl p-6 text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gradient Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-400" />

        {/* Header with Close */}
        <div className="flex items-center justify-between pb-4 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
              <img 
                src="/assets/gis_logo_3d.png" 
                alt="3D GIS Logo" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(16,185,129,0.7)]" 
              />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {mode === 'register' && "Yangi Akkaunt Ochish"}
                {mode === 'verify' && "Emailni Tasdiqlash"}
                {mode === 'login' && "Tizimga Kirish"}
                {mode === 'success' && "Akkaunt Tasdiqlandi!"}
              </h2>
              <p className="text-xs text-slate-400">
                {mode === 'register' && "Ism, telefon va email orqali ro'yxatdan o'tish"}
                {mode === 'verify' && "Emailga borgan 6 xonali kodni kiriting"}
                {mode === 'login' && "Mavjud akkauntingizga kirish"}
                {mode === 'success' && "Xush kelibsiz! Tizimga muvaffaqiyatli kirdingiz"}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error / Success Messages */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in shadow-xs">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 flex items-start gap-2.5 text-xs text-emerald-300 animate-in fade-in shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 1. REGISTRATION FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="mt-5 space-y-4">
            {/* Ism va Familiya */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ism va Familiyangiz *</span>
              </label>
              <input
                type="text"
                required
                placeholder="Masalan: Hayitali G'ulomov"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-950 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition shadow-inner"
              />
            </div>

            {/* Telefon Raqam */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Telefon Raqamingiz *</span>
              </label>
              <input
                type="tel"
                required
                placeholder="+998 90 123 45 67"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-slate-950 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition shadow-inner"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Email Manzilingiz * (Tasdiqlash kodi boradi)</span>
              </label>
              <input
                type="email"
                required
                placeholder="namuna@domain.uz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition shadow-inner"
              />
            </div>

            {/* Parol */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Parol *</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Kamida 6 belgi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition pr-8 shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Tasdiqlash *</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Parolni qaytaring"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-950 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition shadow-inner"
                />
              </div>
            </div>

            {/* Submit Button: Normal by default, turns into playful Smile on Hover if incomplete */}
            <div 
              className="mt-5 relative"
              onMouseEnter={() => setIsRegisterHovered(true)}
              onMouseLeave={() => setIsRegisterHovered(false)}
              onClick={!isRegisterValid ? (e) => {
                e.preventDefault();
                triggerRegisterBlockedHint();
              } : undefined}
            >
              <button
                type={isRegisterValid ? "submit" : "button"}
                disabled={!isRegisterValid || isLoading}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 select-none ${
                  !isRegisterValid
                    ? isRegisterHovered
                      ? `bg-amber-500/20 text-amber-300 border-2 border-amber-400 cursor-not-allowed shadow-lg shadow-amber-500/20 ${
                          registerAttemptShake ? 'animate-wobble-smile ring-2 ring-amber-400' : ''
                        }`
                      : `bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md ${
                          registerAttemptShake ? 'animate-wobble-smile' : ''
                        }`
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0'
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>
                      {language === 'ru' ? 'Создание аккаунта...' : language === 'en' ? 'Creating account...' : 'Akkaunt yaratilmoqda...'}
                    </span>
                  </>
                ) : !isRegisterValid && isRegisterHovered ? (
                  <>
                    <span className="text-xl animate-bounce select-none">😜</span>
                    <Smile className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span className="truncate">{getRegisterSmileStatus()}</span>
                  </>
                ) : (
                  <>
                    <span>
                      {language === 'ru' ? 'Продолжить и получить код' : language === 'en' ? 'Continue and Get Code' : 'Davom etish va Kodni Olish'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {!isRegisterValid && (isRegisterHovered || registerAttemptShake) && (
                <div className="mt-1.5 flex items-center justify-center gap-1.5 text-[11px] text-amber-400/90 font-medium select-none animate-in fade-in duration-200">
                  <span className="text-xs">😜</span>
                  <span>
                    {language === 'ru'
                      ? 'Сначала заполните обязательные поля, чтобы нажать кнопку!'
                      : language === 'en'
                      ? 'Fill required fields to unlock and click this button!'
                      : 'Kerakli maydonlar to\'ldirilmaguncha kodni olish tugmasi bosilmaydi!'}
                  </span>
                </div>
              )}
            </div>

            {/* Switch to Login */}
            <div className="pt-2 text-center text-xs text-slate-400">
              Akkauntingiz bormi?{' '}
              <button
                type="button"
                onClick={handleSwitchToLogin}
                className="text-emerald-400 font-semibold hover:underline ml-1"
              >
                Kirish
              </button>
            </div>
          </form>
        )}

        {/* 2. EMAIL VERIFICATION STEP */}
        {mode === 'verify' && (
          <form onSubmit={handleVerifySubmit} className="mt-5 space-y-4">
            <div className="bg-slate-950 rounded-xl p-3.5 text-xs text-slate-300 leading-relaxed shadow-md">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
                <Mail className="w-4 h-4" />
                <span>Emailingizga tasdiqlash kodi jo'natildi!</span>
              </div>
              <p>
                Tasdiqlash kodi <strong className="text-white font-mono">{email}</strong> manziliga yuborildi. 
                Akkauntni faollashtirish uchun pastdagi maydonga 6 xonali kodni kiriting.
              </p>
            </div>

            {/* Live Instant Code Notification Box (for rapid developer/user testing) */}
            {lastSentCode && (
              <div className="bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 rounded-xl p-3 flex items-center justify-between shadow-xs">
                <div>
                  <span className="block text-[11px] text-slate-400">📧 Email xabari simulyatsiyasi:</span>
                  <span className="text-xs text-white">Tasdiqlash kodi: </span>
                  <strong className="text-sm font-mono text-emerald-400 tracking-wider font-bold">
                    {lastSentCode}
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => setVerificationCode(lastSentCode)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-[11px] font-semibold text-emerald-300"
                >
                  Kodni joylash
                </button>
              </div>
            )}

            {/* Verification Code Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-center">
                6 xonali tasdiqlash kodini kiriting:
              </label>
              <div className="flex justify-center">
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  className="w-48 text-center tracking-[0.4em] font-mono text-xl py-2.5 bg-slate-950 rounded-xl text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition shadow-inner"
                />
              </div>
            </div>

            {/* Verify Button: Normal by default, turns into Smile on Hover if incomplete */}
            <div 
              className="relative"
              onMouseEnter={() => setIsVerifyHovered(true)}
              onMouseLeave={() => setIsVerifyHovered(false)}
              onClick={!isVerifyValid ? (e) => {
                e.preventDefault();
                triggerVerifyBlockedHint();
              } : undefined}
            >
              <button
                type={isVerifyValid ? "submit" : "button"}
                disabled={!isVerifyValid || isLoading}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 select-none ${
                  !isVerifyValid
                    ? isVerifyHovered
                      ? `bg-amber-500/20 text-amber-300 border-2 border-amber-400 cursor-not-allowed shadow-lg shadow-amber-500/20 ${
                          verifyAttemptShake ? 'animate-wobble-smile ring-2 ring-amber-400' : ''
                        }`
                      : `bg-emerald-500 text-slate-950 shadow-md ${
                          verifyAttemptShake ? 'animate-wobble-smile' : ''
                        }`
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0'
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>
                      {language === 'ru' ? 'Подтверждение...' : language === 'en' ? 'Verifying...' : 'Tasdiqlanmoqda...'}
                    </span>
                  </>
                ) : !isVerifyValid && isVerifyHovered ? (
                  <>
                    <span className="text-xl animate-bounce select-none">🙃</span>
                    <Smile className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>
                      {language === 'ru'
                        ? 'Сначала введите 6-значный код! 🙃'
                        : language === 'en'
                        ? 'Enter 6-digit code first! 🙃'
                        : 'Avval 6 xonali kodni to\'liq yozing! 🙃'}
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {language === 'ru'
                        ? 'Подтвердить и активировать аккаунт'
                        : language === 'en'
                        ? 'Verify and Activate Account'
                        : 'Akkauntni Tasdiqlash va Faollashtirish'}
                    </span>
                  </>
                )}
              </button>

              {!isVerifyValid && (isVerifyHovered || verifyAttemptShake) && (
                <div className="mt-1.5 flex items-center justify-center gap-1.5 text-[11px] text-amber-400/90 font-medium select-none animate-in fade-in duration-200">
                  <span className="text-xs">😉</span>
                  <span>
                    {language === 'ru'
                      ? 'Введите 6 цифр кода, чтобы нажать кнопку!'
                      : language === 'en'
                      ? 'Enter 6 digits code to unlock button!'
                      : 'Kodni to\'liq kiritmaguningizcha tugma bosilmaydi!'}
                  </span>
                </div>
              )}
            </div>

            {/* Resend Code Button */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 shadow-xs">
              <span>Kod kelmadimi?</span>
              <button
                type="button"
                disabled={resendCooldown > 0 || isLoading}
                onClick={handleResendCode}
                className="text-cyan-400 hover:underline font-semibold disabled:text-slate-600 disabled:no-underline"
              >
                {resendCooldown > 0 ? `Qayta yuborish (${resendCooldown}s)` : "Kodni qayta yuborish"}
              </button>
            </div>
          </form>
        )}

        {/* 3. LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>Email Manzil</span>
              </label>
              <input
                type="email"
                required
                placeholder="Emailingizni kiriting"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Parol</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Parolingiz"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition pr-10 shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Submit Button: Normal by default, turns into playful Smile on Hover if incomplete */}
            <div 
              className="mt-4 relative"
              onMouseEnter={() => setIsLoginHovered(true)}
              onMouseLeave={() => setIsLoginHovered(false)}
              onClick={!isLoginValid ? (e) => {
                e.preventDefault();
                triggerLoginBlockedHint();
              } : undefined}
            >
              <button
                type={isLoginValid ? "submit" : "button"}
                disabled={!isLoginValid || isLoading}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 select-none ${
                  !isLoginValid
                    ? isLoginHovered
                      ? `bg-amber-500/20 text-amber-300 border-2 border-amber-400 cursor-not-allowed shadow-lg shadow-amber-500/20 ${
                          loginAttemptShake ? 'animate-wobble-smile ring-2 ring-amber-400' : ''
                        }`
                      : `bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md ${
                          loginAttemptShake ? 'animate-wobble-smile' : ''
                        }`
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0'
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>
                      {language === 'ru' ? 'Проверка...' : language === 'en' ? 'Checking...' : 'Tekshirilmoqda...'}
                    </span>
                  </>
                ) : !isLoginValid && isLoginHovered ? (
                  <>
                    <span className="text-xl animate-bounce select-none">🙃</span>
                    <Smile className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span className="truncate">{getLoginSmileStatus()}</span>
                  </>
                ) : (
                  <>
                    <span>
                      {language === 'ru' ? 'Войти в систему' : language === 'en' ? 'Sign In' : 'Tizimga Kirish'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {!isLoginValid && (isLoginHovered || loginAttemptShake) && (
                <div className="mt-1.5 flex items-center justify-center gap-1.5 text-[11px] text-amber-400/90 font-medium select-none animate-in fade-in duration-200">
                  <span className="text-xs">😉</span>
                  <span>
                    {language === 'ru'
                      ? 'Сначала введите логин и пароль, чтобы нажать кнопку!'
                      : language === 'en'
                      ? 'Enter login & password first to unlock and click!'
                      : 'Login va parol yozilmaguncha kirish tugmasi bosilmaydi!'}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2 text-center text-xs text-slate-400">
              Hali akkauntingiz yo'qmi?{' '}
              <button
                type="button"
                onClick={handleSwitchToRegister}
                className="text-emerald-400 font-semibold hover:underline ml-1"
              >
                Ro'yxatdan o'tish
              </button>
            </div>
          </form>
        )}

        {/* 4. SUCCESS SCREEN */}
        {mode === 'success' && (
          <div className="py-8 text-center space-y-3 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 mx-auto flex items-center justify-center text-emerald-400 shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-white">Akkauntingiz Muvaffaqiyatli Faollashtirildi!</h3>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              Emailingiz tasdiqlandi va profilingiz to'liq saqlandi. Xush kelibsiz!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
