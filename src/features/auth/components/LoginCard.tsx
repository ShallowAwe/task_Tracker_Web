import React, { useState, type FormEvent } from "react";
import { Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";
import { useLogin } from "../hooks/useLogin";

const LoginCard: React.FC = () => {
  const [workEmail, setWorkEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const loginMutation = useLogin();
  const isLoading = loginMutation.isPending;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    loginMutation.mutate({ email: workEmail, password });
  };

  const toggleShowPassword = (): void => setShowPassword((prev) => !prev);

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-105 rounded-3xl border border-slate-200/60 bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] text-slate-900 overflow-hidden">
        <div className="p-8 sm:p-10">
          {/* Header */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 border border-indigo-100/80 shadow-sm shadow-indigo-100/50">
              <ShieldCheck className="text-indigo-600 w-9 h-9" />
            </div>
            <h1 className="text-3xl font-extrabold text-center tracking-tight text-slate-900">Sign In</h1>
            <p className="text-sm text-slate-500 mt-3 text-center max-w-[280px] leading-relaxed">
              Access the multi-tenant project management portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Email */}
            <div className="space-y-2.5">
              <label htmlFor="workEmail" className="block text-sm font-semibold text-slate-700 ml-0.5">
                Work Email
              </label>
              <div className="relative">
                <input
                  id="workEmail"
                  name="workEmail"
                  type="email"
                  value={workEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setWorkEmail(e.target.value)
                  }
                  placeholder="name@company.com"
                  autoComplete="email"
                  disabled={isLoading}
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50/50 border border-slate-200 text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center ml-0.5">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 ml-0.5">
                  Password
                </label>
                <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isLoading}
                  required
                  className="w-full px-4 py-3 pr-12 rounded-2xl bg-slate-50/50 border border-slate-200 text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  onClick={toggleShowPassword}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 py-3.5 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 hover:from-indigo-500 hover:to-blue-600 active:scale-[0.98] font-bold text-base text-white transition-all duration-300 shadow-xl shadow-indigo-200/50 disabled:opacity-70 disabled:grayscale disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2.5 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <a href="#" className="font-bold text-indigo-600 hover:text-indigo-700">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;