"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EditableListProps {
  name: string;
  label: string;
  initialItems: string[];
  placeholder?: string;
}

/** Lista editável (adicionar/remover item) — usada em Clientes e Ferramentas/IAs. */
export function EditableList({ name, label, initialItems, placeholder }: EditableListProps) {
  const [items, setItems] = useState(initialItems);
  const [draft, setDraft] = useState("");

  function addItem() {
    const value = draft.trim();
    if (!value) return;
    setItems((prev) => [...prev, value]);
    setDraft("");
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <Badge key={`${item}-${index}`} variant="secondary" className="gap-1.5 rounded-sm px-3 py-1.5">
            {item}
            <button
              type="button"
              onClick={() => setItems((prev) => prev.filter((_, i) => i !== index))}
              aria-label={`Remover ${item}`}
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={addItem}>
          Adicionar
        </Button>
      </div>
      <input type="hidden" name={name} value={JSON.stringify(items)} />
    </div>
  );
}
