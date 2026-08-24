"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { VideoAspect } from "@/lib/types";

interface VideoOrientationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Chamado com a orientação escolhida; o dialog se fecha em seguida. */
  onSelect: (aspect: Exclude<VideoAspect, "">) => void;
}

/**
 * Popup mostrado sempre que um vídeo vai ser adicionado (bloco de vídeo ou
 * item de carrossel): pergunta se o vídeo é horizontal (16:9) ou vertical
 * (9:16), com um mini-preview da proporção em cada opção.
 */
export function VideoOrientationDialog({ open, onOpenChange, onSelect }: VideoOrientationDialogProps) {
  function choose(aspect: "16:9" | "9:16") {
    onSelect(aspect);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>O vídeo é horizontal ou vertical?</DialogTitle>
          <DialogDescription>
            Isso define a moldura do player na página do case.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => choose("16:9")}
            className="group flex flex-col items-center gap-3 rounded-lg border border-border p-4 outline-none transition-colors hover:border-ring hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex h-20 w-full items-center justify-center">
              <span className="aspect-video w-20 rounded-sm border-2 border-muted-foreground/60 bg-secondary transition-colors group-hover:border-foreground" />
            </span>
            <span className="text-sm font-medium text-foreground">Horizontal</span>
            <span className="text-xs text-muted-foreground">16:9 · YouTube, Vimeo</span>
          </button>
          <button
            type="button"
            onClick={() => choose("9:16")}
            className="group flex flex-col items-center gap-3 rounded-lg border border-border p-4 outline-none transition-colors hover:border-ring hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex h-20 w-full items-center justify-center">
              <span className="aspect-[9/16] h-20 rounded-sm border-2 border-muted-foreground/60 bg-secondary transition-colors group-hover:border-foreground" />
            </span>
            <span className="text-sm font-medium text-foreground">Vertical</span>
            <span className="text-xs text-muted-foreground">9:16 · Reels, Shorts</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
