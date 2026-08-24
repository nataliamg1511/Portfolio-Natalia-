"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Parallax sutil pra capa do case: enquanto a página rola, a imagem se move
 * um pouco mais devagar que o resto (deslocamento vertical leve + zoom
 * mínimo pra nunca aparecer borda). Com prefers-reduced-motion vira um
 * contêiner estático — mesmo comportamento dos outros wrappers de
 * components/motion/.
 */
export function ParallaxCover({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // A imagem "atrasa" ~6% da própria altura ao longo do scroll; o scale
  // compensa o deslocamento pra moldura nunca mostrar fundo. Com
  // prefers-reduced-motion o range vira 0 (sem parallax) — mesma árvore nos
  // dois casos, senão o SSR (que não conhece a preferência) diverge do
  // cliente e o React acusa hydration mismatch.
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? ["0%", "0%"] : ["-6%", "6%"]
  );

  return (
    <div ref={ref} className={className} style={{ overflow: "hidden" }}>
      <motion.div
        style={{ y, scale: shouldReduceMotion ? 1 : 1.12 }}
        className="relative h-full w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
