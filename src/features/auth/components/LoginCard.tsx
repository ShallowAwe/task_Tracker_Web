import React, { useState, type FormEvent } from "react";
import { Eye, EyeOff, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { useLogin } from "../hooks/useLogin";

const LoginCard: React.FC = () => {
  const [workEmail, setWorkEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const loginMutation = useLogin();
  const isLoading = loginMutation.isPending;
  const error = loginMutation.error as any;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    loginMutation.mutate({ email: workEmail, password });
  };

  const toggleShowPassword = (): void => setShowPassword((prev) => !prev);

  return (
    <div className="login-card-outer">
      <div className="login-card">
        <div className="login-card-body">
          {/* Header */}
          <div className="login-card-header">
            <div className="login-card-icon-wrap">
              <ShieldCheck className="text-indigo-600 w-9 h-9" />
            </div>
            <h1 className="login-card-title">Sign In</h1>
            <p className="login-card-subtitle">
              Access the multi-tenant project management portal
            </p>
          </div>

          {/* Error Message */}
          {loginMutation.isError && (
            <div className="login-error-box">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <div className="login-error-text">
                {error?.response?.data?.message ||
                  error?.message ||
                  "Login failed. Please check your credentials."}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form" noValidate>
            {/* Email */}
            <div className="login-field">
              <label htmlFor="workEmail" className="login-label">
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
                  className="login-input"
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-field">
              <div className="login-label-row">
                <label htmlFor="password" className="login-label">
                  Password
                </label>
                <a href="#" className="login-forgot-link">
                  Forgot password?
                </a>
              </div>
              <div className="login-password-wrap">
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
                  className="login-password-input"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  onClick={toggleShowPassword}
                  disabled={isLoading}
                  className="login-password-toggle"
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
              className="login-submit-btn"
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
          <div className="login-card-footer">
            <p className="login-card-footer-text">
              Don't have an account?{" "}
              <a href="#" className="login-support-link">
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