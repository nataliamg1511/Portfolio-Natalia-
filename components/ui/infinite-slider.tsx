"use client";
import { cn } from "@/lib/utils";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { useRef } from "react";
import useMeasure from "react-use-measure";

type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  /** Segundos para percorrer um ciclo completo (metade da faixa duplicada). */
  duration?: number;
  /** Duração alternativa com o mouse em cima (maior = mais lento). */
  durationOnHover?: number;
  direction?: "horizontal" | "vertical";
  reverse?: boolean;
  className?: string;
};

/**
 * Slider infinito (estilo motion-primitives). O conteúdo é duplicado e a
 * faixa anda continuamente via useAnimationFrame, com wrap na metade —
 * compatível com framer-motion v13 (a versão original usava a assinatura
 * antiga de animate() com MotionValue, que não roda aqui).
 */
export function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  durationOnHover,
  direction = "horizontal",
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const [ref, { width, height }] = useMeasure();
  const translation = useMotionValue(0);
  const isHovered = useRef(false);
  const speedFactor = useRef(1);

  useAnimationFrame((_, delta) => {
    const size = direction === "horizontal" ? width : height;
    if (!size) return;
    const contentSize = (size + gap) / 2;

    const targetDuration =
      isHovered.current && durationOnHover ? durationOnHover : duration;
    // Suaviza a transição de velocidade ao entrar/sair do hover.
    const targetFactor = duration / targetDuration;
    speedFactor.current += (targetFactor - speedFactor.current) * Math.min(1, delta / 200);

    const velocity = (contentSize / duration) * speedFactor.current;
    const dir = reverse ? 1 : -1;

    let next = translation.get() + dir * velocity * (delta / 1000);
    // Mantém o offset dentro de [-contentSize, 0] para o loop ser invisível.
    if (next <= -contentSize) next += contentSize;
    if (next > 0) next -= contentSize;
    translation.set(next);
  });

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        className="flex w-max"
        style={{
          ...(direction === "horizontal"
            ? { x: translation }
            : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === "horizontal" ? "row" : "column",
        }}
        ref={ref}
        onHoverStart={() => (isHovered.current = true)}
        onHoverEnd={() => (isHovered.current = false)}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
