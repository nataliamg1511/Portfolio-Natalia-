"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/format";
import type { Message } from "@/lib/types";
import { markMessageAsReadAction } from "@/app/admin/(dashboard)/mensagens/actions";

export function MessagesList({ messages }: { messages: Message[] }) {
  const [selected, setSelected] = useState<Message | null>(null);
  const [, startTransition] = useTransition();

  function openMessage(message: Message) {
    setSelected(message);
    if (!message.is_read) {
      startTransition(() => {
        markMessageAsReadAction(message.id);
      });
    }
  }

  return (
    <>
      <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-background">
        {messages.map((message) => (
          <li key={message.id}>
            <button
              type="button"
              onClick={() => openMessage(message)}
              className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left hover:bg-secondary/50"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {!message.is_read && <span className="size-2 shrink-0 rounded-full bg-accent" aria-hidden />}
                  <p className={message.is_read ? "font-normal text-foreground" : "font-semibold text-foreground"}>
                    {message.name}
                  </p>
                  <span className="text-sm text-muted-foreground">{message.email}</span>
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">{message.message}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {!message.is_read && <Badge>Não lida</Badge>}
                <span className="text-xs text-muted-foreground">{formatDateTime(message.created_at)}</span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
            <DialogDescription>
              {selected?.email} · {selected && formatDateTime(selected.created_at)}
            </DialogDescription>
          </DialogHeader>
          <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">{selected?.message}</p>
        </DialogContent>
      </Dialog>
    </>
  );
}
