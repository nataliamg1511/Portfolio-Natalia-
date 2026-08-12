"use client";

// Adaptado de um snippet de registry de componentes (21st.dev) — ver
// scratchpad/marquee-along-svg-path-snippet.tsx para o original e o
// checklist de adaptações obrigatórias aplicadas aqui:
// 1. "motion/react" → "framer-motion" (já instalado no projeto).
// 2. Hooks (useTransform/useMotionValue/useEffect) que estavam dentro do
//    `items.map()` do componente original violam react-hooks/rules-of-hooks
//    — extraídos para o subcomponente <MarqueeItem/> abaixo, que os chama
//    no topo do próprio componente.
// 3. `Math.random()` no id do path (causa mismatch de hidratação) →
//    `React.useId()`.
// 4. Itens (imagens) são sempre dados locais — nenhuma imagem externa.
// 5. `cssVariableInterpolation` foi removido do primitivo: no snippet
//    original ele também chamava `useTransform` dentro de um `.map()`
//    (mesmo bug do item 3), e não é usado no marquee de capas da Home —
//    removê-lo evita reintroduzir hooks condicionais sem adicionar valor.

import React, { RefObject, useCallback, useEffect, useId, useRef } from "react";
import {
  motion,
  type SpringOptions,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";

import { cn } from "@/lib/utils";

// Custom wrap function
const wrap = (min: number, max: number, value: number): number => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

type PreserveAspectRatioAlign =
  | "none"
  | "xMinYMin"
  | "xMidYMin"
  | "xMaxYMin"
  | "xMinYMid"
  | "xMidYMid"
  | "xMaxYMid"
  | "xMinYMax"
  | "xMidYMax"
  | "xMaxYMax";

type PreserveAspectRatioMeetOrSlice = "meet" | "slice";

type PreserveAspectRatio =
  | PreserveAspectRatioAlign
  | `${Exclude<PreserveAspectRatioAlign, "none">} ${PreserveAspectRatioMeetOrSlice}`;

interface MarqueeAlongSvgPathProps {
  children: React.ReactNode;
  className?: string;

  // Path properties
  path: string;
  pathId?: string;
  preserveAspectRatio?: PreserveAspectRatio;
  showPath?: boolean;

  // SVG properties
  width?: string | number;
  height?: string | number;
  viewBox?: string;

  // Marquee properties
  baseVelocity?: number;
  direction?: "normal" | "reverse";
  easing?: (value: number) => number;
  slowdownOnHover?: boolean;
  slowDownFactor?: number;
  slowDownSpringConfig?: SpringOptions;

  // Scroll properties
  useScrollVelocity?: boolean;
  scrollAwareDirection?: boolean;
  scrollSpringConfig?: SpringOptions;
  scrollContainer?: RefObject<HTMLElement | null> | HTMLElement | null;

  // Item repetition
  repeat?: number;

  // Drag properties
  draggable?: boolean;
  dragSensitivity?: number;
  dragVelocityDecay?: number;
  dragAwareDirection?: boolean;
  grabCursor?: boolean;

  // Z-index properties
  enableRollingZIndex?: boolean;
  zIndexBase?: number;
  zIndexRange?: number;

  // Responsive properties
  responsive?: boolean;
}

interface MarqueeItemProps {
  path: string;
  baseOffset: MotionValue<number>;
  itemIndex: number;
  itemCount: number;
  easing?: (value: number) => number;
  enableRollingZIndex: boolean;
  calculateZIndex: (offsetDistance: number) => number | undefined;
  draggable: boolean;
  grabCursor: boolean;
  isHiddenRepeat: boolean;
  onHoverChange: (hovered: boolean) => void;
  children: React.ReactNode;
}

/**
 * Item individual do marquee — extraído do map original para respeitar
 * react-hooks/rules-of-hooks (todos os hooks chamados incondicionalmente
 * no topo do componente, uma vez por item renderizado).
 */
function MarqueeItem({
  path,
  baseOffset,
  itemIndex,
  itemCount,
  easing,
  enableRollingZIndex,
  calculateZIndex,
  draggable,
  grabCursor,
  isHiddenRepeat,
  onHoverChange,
  children,
}: MarqueeItemProps) {
  // Create a unique offset transform for this item
  const itemOffset = useTransform(baseOffset, (v) => {
    const position = (itemIndex * 100) / itemCount;
    const wrappedValue = wrap(0, 100, v + position);
    return `${easing ? easing(wrappedValue / 100) * 100 : wrappedValue}%`;
  });

  // Motion value for the current offset distance (parsed from itemOffset)
  const currentOffsetDistance = useMotionValue(0);

  const zIndex = useTransform(currentOffsetDistance, (value) => calculateZIndex(value));

  useEffect(() => {
    const unsubscribe = itemOffset.on("change", (value: string) => {
      const match = value.match(/^([\d.]+)%$/);
      if (match && match[1]) {
        currentOffsetDistance.set(parseFloat(match[1]));
      }
    });
    return unsubscribe;
  }, [itemOffset, currentOffsetDistance]);

  return (
    <motion.div
      className={cn("absolute top-0 left-0", draggable && grabCursor && "cursor-grab")}
      style={{
        offsetPath: `path('${path}')`,
        offsetDistance: itemOffset,
        zIndex: enableRollingZIndex ? zIndex : undefined,
        willChange: "offset-distance",
        backfaceVisibility: "hidden",
      }}
      aria-hidden={isHiddenRepeat}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      {children}
    </motion.div>
  );
}

const MarqueeAlongSvgPath = ({
  children,
  className,

  // Path defaults
  path,
  pathId,
  preserveAspectRatio = "xMidYMid meet",
  showPath = false,

  // SVG defaults
  width = "100%",
  height = "100%",
  viewBox = "0 0 100 100",

  // Marquee defaults
  baseVelocity = 5,
  direction = "normal",
  easing,
  slowdownOnHover = false,
  slowDownFactor = 0.3,
  slowDownSpringConfig = { damping: 50, stiffness: 400 },

  // Scroll defaults
  useScrollVelocity = false,
  scrollAwareDirection = false,
  scrollSpringConfig = { damping: 50, stiffness: 400 },
  scrollContainer,

  // Items repetition
  repeat = 3,

  // Drag defaults
  draggable = false,
  dragSensitivity = 0.2,
  dragVelocityDecay = 0.96,
  dragAwareDirection = false,
  grabCursor = false,

  // Z-index defaults
  enableRollingZIndex = true,
  zIndexBase = 1,
  zIndexRange = 10,

  // Responsive defaults
  responsive = false,
}: MarqueeAlongSvgPathProps) => {
  const container = useRef<HTMLDivElement>(null);
  const marqueeContainerRef = useRef<HTMLDivElement>(null);
  const baseOffset = useMotionValue(0);

  const pathRef = useRef<SVGPathElement>(null);

  // Responsive scaling using direct DOM manipulation (no re-renders)
  useEffect(() => {
    if (!responsive) return;

    const [, , vbWidth, vbHeight] = viewBox.split(" ").map(Number);
    const originalWidth = vbWidth || 100;
    const originalHeight = vbHeight || 100;

    const updateScale = () => {
      const wrapper = container.current;
      const marqueeContainer = marqueeContainerRef.current;
      if (!wrapper || !marqueeContainer) return;

      const wrapperWidth = wrapper.clientWidth;
      const wrapperHeight = wrapper.clientHeight;

      const scaleX = wrapperWidth / originalWidth;
      const scaleY = wrapperHeight / originalHeight;
      const scale = Math.min(scaleX, scaleY);

      const scaledWidth = originalWidth * scale;
      const scaledHeight = originalHeight * scale;

      const offsetX = (wrapperWidth - scaledWidth) / 2;
      const offsetY = (wrapperHeight - scaledHeight) / 2;

      marqueeContainer.style.width = `${originalWidth}px`;
      marqueeContainer.style.height = `${originalHeight}px`;

      marqueeContainer.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
      marqueeContainer.style.transformOrigin = "top left";
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [responsive, viewBox]);

  // Create an array of items outside of the render function
  const items = React.useMemo(() => {
    const childrenArray = React.Children.toArray(children);

    return childrenArray.flatMap((child, childIndex) =>
      Array.from({ length: repeat }, (_, repeatIndex) => {
        const itemIndex = repeatIndex * childrenArray.length + childIndex;
        const key = `${childIndex}-${repeatIndex}`;
        return {
          child,
          repeatIndex,
          itemIndex,
          key,
        };
      })
    );
  }, [children, repeat]);

  const calculateZIndex = useCallback(
    (offsetDistance: number) => {
      if (!enableRollingZIndex) return undefined;
      const normalizedDistance = offsetDistance / 100;
      return Math.floor(zIndexBase + normalizedDistance * zIndexRange);
    },
    [enableRollingZIndex, zIndexBase, zIndexRange]
  );

  // ID estável entre servidor e cliente (evita mismatch de hidratação que
  // `Math.random()` causaria no snippet original).
  const reactId = useId();
  const id = pathId || `marquee-path-${reactId.replace(/[^a-zA-Z0-9]/g, "")}`;

  // Scroll tracking
  const { scrollY } = useScroll({
    container: (scrollContainer as RefObject<HTMLDivElement | null>) || container,
  });

  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, scrollSpringConfig);

  // Hover and drag state tracking
  const isHovered = useRef(false);
  const isDragging = useRef(false);
  const dragVelocity = useRef(0);

  const directionFactor = useRef(direction === "normal" ? 1 : -1);

  const hoverFactorValue = useMotionValue(1);
  const defaultVelocity = useMotionValue(1);
  const smoothHoverFactor = useSpring(hoverFactorValue, slowDownSpringConfig);

  const velocityFactor = useTransform(
    useScrollVelocity ? smoothVelocity : defaultVelocity,
    [0, 1000],
    [0, 5],
    { clamp: false }
  );

  useAnimationFrame((_, delta) => {
    if (isDragging.current && draggable) {
      baseOffset.set(baseOffset.get() + dragVelocity.current);
      dragVelocity.current *= 0.9;
      if (Math.abs(dragVelocity.current) < 0.01) {
        dragVelocity.current = 0;
      }
      return;
    }

    if (isHovered.current) {
      hoverFactorValue.set(slowdownOnHover ? slowDownFactor : 1);
    } else {
      hoverFactorValue.set(1);
    }

    let moveBy = directionFactor.current * baseVelocity * (delta / 1000) * smoothHoverFactor.get();

    if (scrollAwareDirection && !isDragging.current) {
      if (velocityFactor.get() < 0) {
        directionFactor.current = -1;
      } else if (velocityFactor.get() > 0) {
        directionFactor.current = 1;
      }
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    if (draggable) {
      moveBy += dragVelocity.current;

      if (dragAwareDirection && Math.abs(dragVelocity.current) > 0.1) {
        directionFactor.current = Math.sign(dragVelocity.current);
      }

      if (!isDragging.current && Math.abs(dragVelocity.current) > 0.01) {
        dragVelocity.current *= dragVelocityDecay;
      } else if (!isDragging.current) {
        dragVelocity.current = 0;
      }
    }

    baseOffset.set(baseOffset.get() + moveBy);
  });

  const lastPointerPosition = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!draggable) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    if (grabCursor) (e.currentTarget as HTMLElement).style.cursor = "grabbing";
    isDragging.current = true;
    lastPointerPosition.current = { x: e.clientX, y: e.clientY };
    dragVelocity.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggable || !isDragging.current) return;
    const currentPosition = { x: e.clientX, y: e.clientY };
    const deltaX = currentPosition.x - lastPointerPosition.current.x;
    const deltaY = currentPosition.y - lastPointerPosition.current.y;
    const delta = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const projectedDelta = deltaX > 0 ? delta : -delta;
    dragVelocity.current = projectedDelta * dragSensitivity;
    lastPointerPosition.current = currentPosition;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggable) return;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    isDragging.current = false;
    if (grabCursor) (e.currentTarget as HTMLElement).style.cursor = "grab";
  };

  return (
    <div
      ref={container}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={cn("relative", className)}
    >
      <div ref={marqueeContainerRef} className="relative" style={{ contain: "layout style" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width}
          height={height}
          viewBox={viewBox}
          preserveAspectRatio={preserveAspectRatio}
          className="h-full w-full"
        >
          <path id={id} d={path} stroke={showPath ? "currentColor" : "none"} fill="none" ref={pathRef} />
        </svg>

        {items.map(({ child, repeatIndex, itemIndex, key }) => (
          <MarqueeItem
            key={key}
            path={path}
            baseOffset={baseOffset}
            itemIndex={itemIndex}
            itemCount={items.length}
            easing={easing}
            enableRollingZIndex={enableRollingZIndex}
            calculateZIndex={calculateZIndex}
            draggable={draggable}
            grabCursor={grabCursor}
            isHiddenRepeat={repeatIndex > 0}
            onHoverChange={(hovered) => {
              isHovered.current = hovered;
            }}
          >
            {child}
          </MarqueeItem>
        ))}
      </div>
    </div>
  );
};

export default MarqueeAlongSvgPath;
