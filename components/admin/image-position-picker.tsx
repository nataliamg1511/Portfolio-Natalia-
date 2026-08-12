"use client";

import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImagePositionPickerProps {
  imageUrl: string;
  /** Proporção da moldura de preview — mesma usada na exibição real (ex.: 4/3, 4/5). */
  aspectRatio: number;
  /** Posição no formato CSS `object-position` ("X% Y%"). */
  value: string;
  onChange: (value: string) => void;
  /** Some com o texto de instrução e reduz os atalhos — usar em listas compactas (ex.: galeria). */
  compact?: boolean;
  className?: string;
}

const PRESETS: Array<{ value: string; label: string }> = [
  { value: "0% 0%", label: "Topo esquerda" },
  { value: "50% 0%", label: "Topo centro" },
  { value: "100% 0%", label: "Topo direita" },
  { value: "0% 50%", label: "Meio esquerda" },
  { value: "50% 50%", label: "Centro" },
  { value: "100% 50%", label: "Meio direita" },
  { value: "0% 100%", label: "Base esquerda" },
  { value: "50% 100%", label: "Base centro" },
  { value: "100% 100%", label: "Base direita" },
];

function clamp(n: number) {
  return Math.min(100, Math.max(0, n));
}

function parsePosition(value: string): { x: number; y: number } {
  const match = value.trim().match(/^(-?\d+(?:\.\d+)?)%\s+(-?\d+(?:\.\d+)?)%$/);
  if (!match) return { x: 50, y: 50 };
  return { x: clamp(Number(match[1])), y: clamp(Number(match[2])) };
}

/**
 * Seletor de enquadramento (`object-position`) por arraste — pro admin
 * controlar qual parte de uma imagem aparece nos crops do site (cards 4:3,
 * foto de /sobre, galeria do case). Arrastar/clicar dentro da moldura
 * atualiza a posição em tempo real; os 9 atalhos e o "Centralizar" cobrem
 * o uso via teclado/toque sem depender do arraste. Funciona em touch via
 * Pointer Events (`touch-none` evita o scroll da página durante o arraste).
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
  const draggingRef = useRef(false);
  const { x, y } = parsePosition(value);

  function updateFromPointer(clientX: number, clientY: number) {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const nextX = clamp(((clientX - rect.left) / rect.width) * 100);
    const nextY = clamp(((clientY - rect.top) / rect.height) * 100);
    onChange(`${Math.round(nextX)}% ${Math.round(nextY)}%`);
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    draggingRef.current = true;
    updateFromPointer(e.clientX, e.clientY);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    updateFromPointer(e.clientX, e.clientY);
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    draggingRef.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const step = e.shiftKey ? 10 : 5;
    let nextX = x;
    let nextY = y;
    switch (e.key) {
      case "ArrowLeft":
        nextX = clamp(x - step);
        break;
      case "ArrowRight":
        nextX = clamp(x + step);
        break;
      case "ArrowUp":
        nextY = clamp(y - step);
        break;
      case "ArrowDown":
        nextY = clamp(y + step);
        break;
      default:
        return;
    }
    e.preventDefault();
    onChange(`${Math.round(nextX)}% ${Math.round(nextY)}%`);
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div
        ref={frameRef}
        tabIndex={0}
        aria-label="Arraste para posicionar o enquadramento da imagem. Use as setas do teclado para ajustar."
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        className="relative w-full touch-none cursor-move overflow-hidden rounded border border-border bg-secondary outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
          />
        )}
        <div
          aria-hidden
          className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white mix-blend-difference"
          style={{ left: `${x}%`, top: `${y}%` }}
        />
      </div>

      {!compact && (
        <p className="text-xs text-muted-foreground">Arraste para posicionar o enquadramento.</p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="grid grid-cols-3 gap-1" role="group" aria-label="Atalhos de posição">
          {PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => onChange(preset.value)}
              aria-label={preset.label}
              aria-pressed={value === preset.value}
              title={preset.label}
              className={cn(
                "size-6 rounded-sm border border-border transition-colors duration-180",
                value === preset.value ? "bg-accent" : "bg-background hover:bg-muted"
              )}
            />
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => onChange("50% 50%")}>
          Centralizar
        </Button>
      </div>
    </div>
  );
}
