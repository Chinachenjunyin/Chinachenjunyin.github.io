import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useAppStore } from "@/context/AppContext";
import { cloudConfigured, cloudSignIn } from "@/utils/cloud";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const login = useAppStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloudConfigured()) {
      setError("云端还没配置好，先联系小雨");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await cloudSignIn(email.trim(), password);
      login();
      navigate("/xiaoyu/dashboard");
    } catch {
      setError("邮箱或密码不对，或网络不通，再试一次");
    } finally {
      setBusy(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 bg-background border border-border rounded text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-surface rounded-xl border border-border p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h1 className="font-display text-3xl text-text tracking-wider">
              后台管理
            </h1>
            <p className="text-sm text-text-muted mt-2">
              用管理员邮箱和密码登录
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-text-muted mb-1.5">
                邮箱
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className={inputClass}
                placeholder="管理员邮箱"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1.5">
                密码
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className={`${inputClass} pr-10`}
                  placeholder="请输入密码"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {error && <p className="text-primary text-xs mt-1.5">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={busy || !email.trim() || !password}
              className="w-full py-2.5 bg-primary text-white rounded font-medium hover:shadow-[0_0_20px_rgba(255,107,53,0.4)] active:scale-[0.97] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {busy ? "登录中…" : "登录"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
