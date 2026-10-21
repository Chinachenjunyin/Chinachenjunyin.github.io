import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  const title = "记录思考";
  const subtitle = "探索技术与设计的无限可能";

  return (
    <section className="relative flex items-center justify-center px-4 sm:px-6 pt-6 pb-16">
      <div className="w-full max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="glass relative overflow-hidden rounded-[2.5rem] px-6 py-16 sm:px-12 sm:py-20 text-center"
        >
          {/* Soft decorative blobs inside the panel */}
          <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-indigo-300/30 blur-[70px]" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-pink-300/25 blur-[80px]" />

          <div className="relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-xs sm:text-sm font-medium tracking-[0.35em] text-primary mb-8"
              style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
            >
              PERSONAL BLOG · 个人博客
            </motion.p>

            <h1 className="font-display font-black text-6xl sm:text-8xl md:text-9xl text-slate-900 tracking-wide mb-8">
              {title.split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.25 + i * 0.08,
                    ease: [0.215, 0.61, 0.355, 1],
                  }}
                  className={`inline-block ${
                    i >= 2
                      ? "underline decoration-secondary decoration-[6px] underline-offset-[14px]"
                      : ""
                  }`}
                >
                  {char}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-lg sm:text-xl text-slate-500 mb-12"
            >
              {subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.95 }}
              className="flex items-center justify-center gap-4 flex-wrap"
            >
              <a
                href="#articles"
                className="px-8 py-3 bg-primary text-white rounded-full font-medium shadow-lg shadow-primary/40 hover:shadow-primary/60 hover:-translate-y-0.5 active:scale-[0.97] transition-all"
              >
                浏览文章
              </a>
              <Link
                to="/about"
                className="px-8 py-3 bg-white/50 backdrop-blur border border-white/60 text-text rounded-full font-medium shadow-md hover:border-primary/40 hover:text-primary transition-all"
              >
                了解更多
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="mt-10 flex justify-center"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <a href="#articles" className="text-slate-400 hover:text-primary transition-colors">
            <ChevronDown className="w-6 h-6" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
