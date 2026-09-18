import { supabaseAdmin } from "../../lib/supabase-admin";
import ChatClient from "./ChatClient";

export const dynamic = "force-dynamic";

export default async function ConversasPage() {
  const { data: conversations, error } = await supabaseAdmin
    .from("conversations")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-zinc-950 p-8 text-white">
        <p>Erro ao carregar conversas.</p>
      </main>
    );
  }

  const chats = await Promise.all(
    (conversations ?? []).map(async (conversation) => {
      const { data: contact } = await supabaseAdmin
        .from("contacts")
        .select("id, instagram_id, username, name")
        .eq("id", conversation.contact_id)
        .single();

      const { data: messages } = await supabaseAdmin
        .from("messages")
        .select(
          "id, sender_type, content, created_at, instagram_message_id"
        )
        .eq("conversation_id", conversation.id)
        .order("created_at", { ascending: true });

      return {
        ...conversation,
        contact,
        messages: messages ?? [],
      };
    })
  );

  return <ChatClient initialChats={chats} />;
}