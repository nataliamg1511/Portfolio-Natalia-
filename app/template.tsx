"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Transição de fade entre rotas públicas — token `motion-page` (220ms,
 * opacity only, sem slide). `template.tsx` remonta a cada navegação, então
 * o fade acontece na entrada de cada página.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: [0.2, 0, 0, 1] }}
    >
      {children}
    </motion.div>
  );
}
