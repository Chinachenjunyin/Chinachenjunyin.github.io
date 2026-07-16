import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  const title = "记录思考";
  const subtitle = "探索技术与设计的无限可能";

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-surface">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 20% 50%, rgba(255, 107, 53, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 217, 255, 0.1) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Floating geometric shapes */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-64 h-64 border border-primary/20 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-1/3 left-1/5 w-40 h-40 border border-secondary/20 rounded-lg"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-1/3 left-1/3 w-20 h-20 bg-primary/5 rounded-full blur-xl"
        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="font-display text-6xl sm:text-8xl md:text-9xl text-text tracking-wider mb-6">
            {title.split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.08,
                  ease: [0.215, 0.61, 0.355, 1],
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg sm:text-xl text-text-muted mb-10"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex items-center justify-center gap-4"
        >
          <a
            href="#articles"
            className="px-8 py-3 bg-primary text-white rounded font-medium hover:shadow-[0_0_20px_rgba(255,107,53,0.4)] active:scale-[0.97] transition-all"
          >
            浏览文章
          </a>
          <Link
            to="/about"
            className="px-8 py-3 border border-border text-text rounded font-medium hover:border-primary hover:text-primary transition-all"
          >
            了解更多
          </Link>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <a href="#articles" className="text-text-muted hover:text-primary transition-colors">
          <ChevronDown className="w-6 h-6" />
        </a>
      </motion.div>
    </section>
  );
}
