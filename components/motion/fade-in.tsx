"use client";

import { motion, useReducedMotion, type Transition } from "framer-motion";
import type { ReactNode } from "react";

const EASE_DEFAULT: Transition["ease"] = [0.2, 0, 0, 1];

// framer-motion não exporta o tipo `MarginType` publicamente; replicamos a
// forma esperada (valores em px/% combinados) para manter o prop tipado
// sem recorrer a `any`.
type MarginValue = `${number}${"px" | "%"}`;
type MarginType =
  | MarginValue
  | `${MarginValue} ${MarginValue}`
  | `${MarginValue} ${MarginValue} ${MarginValue}`
  | `${MarginValue} ${MarginValue} ${MarginValue} ${MarginValue}`;

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  /**
   * Margem do viewport usada como threshold de disparo (sintaxe CSS
   * rootMargin). Percentual é mais robusto que px fixo entre telas de
   * alturas muito diferentes (mobile vs. desktop). Blocos de texto usam o
   * default `-10%`; imagens grandes (full-bleed do case) podem passar um
   * valor menor/positivo para revelar mais cedo, já que muita área de tela
   * some por trás delas — ver MOTION_NOTES.md.
   */
  margin?: MarginType;
}

/**
 * Fade-in + translate sutil ao entrar em viewport — token `motion-default`
 * (280ms, tween). Respeita prefers-reduced-motion: vira opacity-only, sem
 * translate, instantâneo o suficiente para não parecer quebrado.
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  y = 16,
  once = true,
  margin = "-10% 0px",
}: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: margin as MarginType }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : 0.28,
        delay: shouldReduceMotion ? 0 : delay,
        ease: EASE_DEFAULT,
      }}
    >
      {children}
    </motion.div>
  );
}
