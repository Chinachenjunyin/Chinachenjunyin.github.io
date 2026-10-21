import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useAppStore } from "@/context/AppContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const settings = useAppStore((s) => s.settings);
  const login = useAppStore((s) => s.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === settings.adminPassword) {
      login();
      navigate("/xiaoyu/dashboard");
    } else {
      setError("密码错误");
    }
  };

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
              请输入密码进入 CMS 后台
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="w-full px-4 py-2.5 bg-background border border-border rounded text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors pr-10"
                  placeholder="请输入密码"
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
              className="w-full py-2.5 bg-primary text-white rounded font-medium hover:shadow-[0_0_20px_rgba(255,107,53,0.4)] active:scale-[0.97] transition-all"
            >
              登录
            </button>
          </form>

          <p className="text-center text-xs text-text-muted mt-6">
            默认密码: 123456
          </p>
        </div>
      </motion.div>
    </div>
  );
}
