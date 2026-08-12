import type { Metadata } from "next";
import { FallbackBanner } from "@/components/admin/fallback-banner";
import { MessagesList } from "@/app/admin/(dashboard)/mensagens/messages-list";
import { getMessages } from "@/lib/data/messages";

export const metadata: Metadata = {
  title: "Mensagens · Admin",
  robots: { index: false, follow: false },
};

export default async function AdminMensagensPage() {
  const { messages, usingFallback } = await getMessages();

  return (
    <div>
      {usingFallback && <FallbackBanner />}
      <h1 className="mb-8 text-2xl font-semibold text-foreground">Mensagens</h1>

      {messages.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma mensagem recebida ainda.</p>
      ) : (
        <MessagesList messages={messages} />
      )}
    </div>
  );
}
