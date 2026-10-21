import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LINES = [
  "把日子过成散文诗",
  "风会记得一朵花的香",
  "慢慢来，比较快",
  "心有山海，静而不争",
  "一半烟火，一半清欢",
];

export default function LyricBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % LINES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white/40 backdrop-blur-md border border-white/40 shadow-xl rounded-3xl transition duration-500 hover:scale-[1.01] px-6 py-3.5 text-center text-sm text-slate-600 font-medium overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
        >
          {LINES[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
