"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

interface CrossfadeImageProps {
  src: string;
  hoverSrc?: string | null;
  alt: string;
  hoverAlt?: string | null;
  sizes?: string;
  priority?: boolean;
}

/**
 * Card de projeto — crossfade puro de opacity (350ms) entre imagem de capa
 * e imagem de hover (token `motion-card-hover`, sem scale/translate no
 * crossfade em si). O card inteiro (referência bitagoli.com) ganha um leve
 * zoom de destaque no hover/focus (scale 1.03, 350ms, mesmo easing) — o
 * container `overflow-hidden` garante que o zoom fique contido na imagem.
 * Em touch (sem hover) permanece na capa, estática.
 */
export function CrossfadeImage({ src, hoverSrc, alt, hoverAlt, sizes, priority }: CrossfadeImageProps) {
  const shouldReduceMotion = useReducedMotion();
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-secondary transition-transform ease-[cubic-bezier(0.4,0,0.2,1)] motion-safe:duration-[350ms] motion-safe:group-hover:scale-[1.03] motion-safe:group-focus-visible:scale-[1.03]"
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? "(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"}
        className="object-cover"
        onLoad={() => setLoaded(true)}
      />
      {hoverSrc && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0 }}
          whileHover={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: [0.4, 0, 0.2, 1] }}
        >
          <Image
            src={hoverSrc}
            alt={hoverAlt ?? alt}
            fill
            sizes={sizes ?? "(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"}
            className="object-cover"
          />
        </motion.div>
      )}
    </div>
  );
}
