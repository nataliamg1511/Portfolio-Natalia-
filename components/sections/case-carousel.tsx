"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getVideoEmbedUrl, isVideoFileUrl } from "@/lib/video";
import type { CarouselItem } from "@/lib/types";

/**
 * Carrossel de mídia do case: imagens e vídeos lado a lado numa faixa
 * horizontal com scroll-snap — arrasta no touch/trackpad, setas no desktop
 * (aparecem só quando há overflow). Todos os itens compartilham a mesma
 * altura; a largura de cada um segue a proporção (imagem natural, vídeo
 * 16:9 ou 9:16).
 */
export function CaseCarousel({ items, label }: { items: CarouselItem[]; label?: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });

  function updateArrows() {
    const el = trackRef.current;
    if (!el) return;
    setCanScroll({
      left: el.scrollLeft > 8,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 8,
    });
  }

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateArrows);
    observer.observe(el);
    return () => observer.disconnect();
  }, [items.length]);

  function scrollByStep(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.7, behavior: "smooth" });
  }

  if (items.length === 0) return null;

  return (
    <div className="group/carousel relative">
      <div
        ref={trackRef}
        onScroll={updateArrows}
        role="region"
        aria-label={label || "Carrossel de mídia do projeto"}
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 outline-none focus-visible:ring-2 focus-visible:ring-ring [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => (
          <CarouselSlide key={index} item={item} index={index} />
        ))}
      </div>

      {canScroll.left && (
        <ArrowButton direction="left" onClick={() => scrollByStep(-1)} />
      )}
      {canScroll.right && (
        <ArrowButton direction="right" onClick={() => scrollByStep(1)} />
      )}
    </div>
  );
}

const SLIDE_HEIGHT = "h-72 md:h-[26rem]";

function CarouselSlide({ item, index }: { item: CarouselItem; index: number }) {
  if (item.type === "video") {
    const vertical = item.aspect === "9:16";
    const frame = cn(
      "relative shrink-0 snap-start overflow-hidden bg-secondary",
      SLIDE_HEIGHT,
      vertical ? "aspect-[9/16]" : "aspect-video"
    );

    if (isVideoFileUrl(item.url)) {
      return (
        <div className={frame}>
          <video
            src={item.url}
            controls
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
        </div>
      );
    }

    const embedUrl = getVideoEmbedUrl(item.url);
    if (!embedUrl) return null;
    return (
      <div className={frame}>
        <iframe
          src={embedUrl}
          title={`Vídeo ${index + 1} do carrossel`}
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className={cn("relative shrink-0 snap-start overflow-hidden bg-secondary", SLIDE_HEIGHT)}>
      {/* width:auto + h-full mantém a proporção natural da imagem na faixa */}
      <Image
        src={item.url}
        alt={item.alt}
        width={1200}
        height={900}
        sizes="(min-width: 768px) 40vw, 80vw"
        className="h-full w-auto object-contain"
      />
    </div>
  );
}

function ArrowButton({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Item anterior" : "Próximo item"}
      className={cn(
        "absolute top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md ring-1 ring-border transition-opacity hover:bg-background md:flex",
        direction === "left" ? "left-3" : "right-3"
      )}
    >
      <Icon className="size-5" aria-hidden />
    </button>
  );
}
