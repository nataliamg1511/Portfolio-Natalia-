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
 *
 * Também é arrastável: segurar e puxar (mouse ou dedo) move a faixa
 * manualmente, com uma inércia curta ao soltar; a animação automática pausa
 * durante o arrasto e retoma sozinha. No touch, só o gesto horizontal é
 * capturado (`touch-pan-y`), então o scroll vertical da página segue livre.
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
  const drag = useRef<{ pointer: number; time: number } | null>(null);
  /** Velocidade do gesto ao soltar (px/s), decai até zero na animação. */
  const flick = useRef(0);

  /** Mantém o offset dentro de [-contentSize, 0] para o loop ser invisível. */
  function wrap(value: number, contentSize: number) {
    let v = value;
    while (v <= -contentSize) v += contentSize;
    while (v > 0) v -= contentSize;
    return v;
  }

  function contentSize() {
    const size = direction === "horizontal" ? width : height;
    return size ? (size + gap) / 2 : 0;
  }

  useAnimationFrame((_, delta) => {
    const half = contentSize();
    if (!half) return;
    if (drag.current) return; // arrasto manual em curso — quem move é o ponteiro

    const targetDuration =
      isHovered.current && durationOnHover ? durationOnHover : duration;
    // Suaviza a transição de velocidade ao entrar/sair do hover.
    const targetFactor = duration / targetDuration;
    speedFactor.current += (targetFactor - speedFactor.current) * Math.min(1, delta / 200);

    const velocity = (half / duration) * speedFactor.current;
    const dir = reverse ? 1 : -1;

    // Inércia do flick decai em ~0,4s e se soma ao andamento automático.
    flick.current *= Math.exp(-delta / 400);
    if (Math.abs(flick.current) < 1) flick.current = 0;

    const next =
      translation.get() + (dir * velocity + flick.current) * (delta / 1000);
    translation.set(wrap(next, half));
  });

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      pointer: direction === "horizontal" ? e.clientX : e.clientY,
      time: e.timeStamp,
    };
    flick.current = 0;
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const start = drag.current;
    const half = contentSize();
    if (!start || !half) return;
    const pointer = direction === "horizontal" ? e.clientX : e.clientY;
    const dx = pointer - start.pointer;
    const dt = e.timeStamp - start.time;
    if (dt > 0) flick.current = (dx / dt) * 1000;
    drag.current = { pointer, time: e.timeStamp };
    translation.set(wrap(translation.get() + dx, half));
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    drag.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }

  return (
    <div
      className={cn(
        "cursor-grab overflow-hidden select-none active:cursor-grabbing",
        direction === "horizontal" ? "touch-pan-y" : "touch-pan-x",
        className
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDragStart={(e) => e.preventDefault()}
    >
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
