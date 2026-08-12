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
  /** `object-position` CSS ("X% Y%") escolhido no admin — default centro. */
  position?: string;
  hoverPosition?: string;
}

/**
 * Card de projeto — crossfade puro de opacity (350ms) entre imagem de capa
 * e imagem de hover (token `motion-card-hover`, sem scale/translate).
 * Em touch (sem hover) permanece na capa, estática.
 */
export function CrossfadeImage({
  src,
  hoverSrc,
  alt,
  hoverAlt,
  sizes,
  priority,
  position = "50% 50%",
  hoverPosition = "50% 50%",
}: CrossfadeImageProps) {
  const shouldReduceMotion = useReducedMotion();
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative h-full w-full overflow-hidden bg-secondary">
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? "(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"}
        className="object-cover"
        style={{ objectPosition: position }}
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
            style={{ objectPosition: hoverPosition }}
          />
        </motion.div>
      )}
    </div>
  );
}
