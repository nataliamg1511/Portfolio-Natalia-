"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImagePositionPickerProps {
  imageUrl: string;
  /** Proporção da moldura de preview — mesma usada na exibição real (ex.: 4/3, 4/5). */
  aspectRatio: number;
  /** Posição no formato CSS `object-position` ("X% Y%"). */
  value: string;
  onChange: (value: string) => void;
  /** Some com o texto de instrução — usar em listas compactas (ex.: blocos de imagem). */
  compact?: boolean;
  className?: string;
}

function clamp(n: number) {
  return Math.min(100, Math.max(0, n));
}

function parsePosition(value: string): { x: number; y: number } {
  const match = value.trim().match(/^(-?\d+(?:\.\d+)?)%\s+(-?\d+(?:\.\d+)?)%$/);
  if (!match) return { x: 50, y: 50 };
  return { x: clamp(Number(match[1])), y: clamp(Number(match[2])) };
}

/**
 * Seletor de enquadramento (`object-position`) por manipulação direta: a
 * usuária "segura" a própria foto e desliza ela dentro da moldura — arrastar
 * pra direita move o conteúdo pra direita, como arrastar uma foto física.
 * O deslocamento em pixels é convertido pra % usando a sobra real de crop
 * (dimensões naturais da imagem vs moldura), então o movimento acompanha o
 * cursor 1:1. Setas do teclado ajustam sem mouse; "Centralizar" reseta.
 * Funciona em touch via Pointer Events (`touch-none` evita o scroll da
 * página durante o arraste).
 */
export function ImagePositionPicker({
  imageUrl,
  aspectRatio,
  value,
  onChange,
  compact = false,
  className,
}: ImagePositionPickerProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointerX: number; pointerY: number; x: number; y: number } | null>(null);
  const naturalRef = useRef<{ w: number; h: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const { x, y } = parsePosition(value);

  /** Sobra de crop (px) em cada eixo, com a imagem em `object-cover`. */
  function overflow(): { x: number; y: number } {
    const el = frameRef.current;
    const natural = naturalRef.current;
    if (!el) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    if (!natural || rect.width === 0 || rect.height === 0) {
      // Antes de saber o tamanho natural, usa a moldura como sensibilidade.
      return { x: rect.width, y: rect.height };
    }
    const scale = Math.max(rect.width / natural.w, rect.height / natural.h);
    return {
      x: Math.max(0, natural.w * scale - rect.width),
      y: Math.max(0, natural.h * scale - rect.height),
    };
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { pointerX: e.clientX, pointerY: e.clientY, x, y };
    setDragging(true);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const start = dragRef.current;
    if (!start) return;
    const over = overflow();
    const dx = e.clientX - start.pointerX;
    const dy = e.clientY - start.pointerY;

    // Arrastar a foto pra direita (dx > 0) mostra conteúdo mais à esquerda,
    // ou seja, diminui o X% do object-position — daí o sinal negativo.
    const nextX = over.x > 0 ? clamp(start.x - (dx / over.x) * 100) : start.x;
    const nextY = over.y > 0 ? clamp(start.y - (dy / over.y) * 100) : start.y;

    if (dx !== 0 || dy !== 0) setHasDragged(true);
    onChange(`${Math.round(nextX)}% ${Math.round(nextY)}%`);
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    dragRef.current = null;
    setDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const step = e.shiftKey ? 10 : 5;
    let nextX = x;
    let nextY = y;
    // Setas movem a FOTO na direção da seta (mesma lógica do arraste).
    switch (e.key) {
      case "ArrowLeft":
        nextX = clamp(x + step);
        break;
      case "ArrowRight":
        nextX = clamp(x - step);
        break;
      case "ArrowUp":
        nextY = clamp(y + step);
        break;
      case "ArrowDown":
        nextY = clamp(y - step);
        break;
      default:
        return;
    }
    e.preventDefault();
    onChange(`${Math.round(nextX)}% ${Math.round(nextY)}%`);
  }

  const centered = x === 50 && y === 50;

  return (
    <div className={cn("space-y-2", className)}>
      <div
        ref={frameRef}
        tabIndex={0}
        aria-label="Arraste a imagem para enquadrá-la. Use as setas do teclado para ajustar."
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        className={cn(
          "group relative w-full touch-none overflow-hidden rounded border border-border bg-secondary outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          dragging ? "cursor-grabbing" : "cursor-grab"
        )}
        style={{ aspectRatio: String(aspectRatio) }}
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="480px"
            draggable={false}
            className="object-cover"
            style={{ objectPosition: value }}
            onLoad={(e) => {
              const img = e.currentTarget;
              naturalRef.current = { w: img.naturalWidth, h: img.naturalHeight };
            }}
          />
        )}
        {!hasDragged && !dragging && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-180 group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white">
              <Move className="size-3.5" /> Arraste a imagem
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        {!compact ? (
          <p className="text-xs text-muted-foreground">
            Arraste a própria imagem pra escolher o enquadramento.
          </p>
        ) : (
          <span />
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange("50% 50%")}
          disabled={centered}
        >
          Centralizar
        </Button>
      </div>
    </div>
  );
}
