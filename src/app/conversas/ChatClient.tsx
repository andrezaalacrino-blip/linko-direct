"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Message = {
  id: string;
  sender_type: string;
  content: string | null;
  created_at: string;
  instagram_message_id: string | null;
};

type Contact = {
  id: string;
  instagram_id: string;
  username: string | null;
  name: string | null;
};

type Chat = {
  id: string;
  status: string;
  ai_enabled: boolean;
  human_takeover: boolean;
  updated_at: string;
  contact: Contact | null;
  messages: Message[];
};

export default function ChatClient({
  initialChats,
}: {
  initialChats: Chat[];
}) {
  const router = useRouter();

  const [selectedId, setSelectedId] = useState(
    initialChats[0]?.id ?? ""
  );

  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const selectedChat = useMemo(
    () =>
      initialChats.find(
        (chat) => chat.id === selectedId
      ),
    [initialChats, selectedId]
  );

  async function sendMessage(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!selectedChat || !message.trim()) {
      return;
    }

    setSending(true);
    setError("");

    try {
      const response = await fetch(
        "/api/messages/send",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            conversationId: selectedChat.id,
            message: message.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.instagram?.error?.message ||
            data?.error ||
            "Erro ao enviar mensagem"
        );
      }

      setMessage("");

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao enviar mensagem"
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="h-screen overflow-hidden bg-zinc-950 text-white">
      <div className="flex h-full">

        {/* MENU LATERAL */}
        <aside className="flex w-64 flex-col border-r border-zinc-800 bg-zinc-950 p-5">
          <div className="mb-8">
            <p className="text-xl font-bold">
              LINKO DIRECT
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              Atendimento inteligente
            </p>
          </div>

          <nav className="space-y-2 text-sm">
            <a
              href="/dashboard"
              className="block rounded-xl px-4 py-3 text-zinc-400 hover:bg-zinc-900"
            >
              Dashboard
            </a>

            <a
              href="/conversas"
              className="block rounded-xl bg-zinc-800 px-4 py-3 font-medium"
            >
              Conversas
            </a>

            <div className="rounded-xl px-4 py-3 text-zinc-500">
              Leads
            </div>

            <div className="rounded-xl px-4 py-3 text-zinc-500">
              Base da IA
            </div>

            <div className="rounded-xl px-4 py-3 text-zinc-500">
              Instagram
            </div>
          </nav>

          <div className="mt-auto rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-xs text-zinc-500">
              Instagram conectado
            </p>

            <p className="mt-1 text-sm font-medium">
              @centrouniversitarioibra
            </p>

            <div className="mt-3 flex items-center gap-2 text-xs text-green-400">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Online
            </div>
          </div>
        </aside>

        {/* LISTA DE CONVERSAS */}
        <section className="w-80 border-r border-zinc-800 bg-zinc-950">
          <div className="border-b border-zinc-800 p-5">
            <h1 className="text-xl font-semibold">
              Conversas
            </h1>

            <p className="mt-1 text-xs text-zinc-500">
              {initialChats.length} atendimento(s)
            </p>
          </div>

          <div className="h-[calc(100vh-85px)] overflow-y-auto">
            {initialChats.length === 0 && (
              <div className="p-6 text-sm text-zinc-500">
                Nenhuma conversa recebida.
              </div>
            )}

            {initialChats.map((chat) => {
              const lastMessage =
                chat.messages[
                  chat.messages.length - 1
                ];

              const selected =
                selectedId === chat.id;

              return (
                <button
                  key={chat.id}
                  onClick={() =>
                    setSelectedId(chat.id)
                  }
                  className={`w-full border-b border-zinc-900 p-4 text-left transition ${
                    selected
                      ? "bg-zinc-800"
                      : "hover:bg-zinc-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 font-bold">
                      {(
                        chat.contact?.username ||
                        chat.contact?.name ||
                        "I"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {chat.contact?.username
                          ? `@${chat.contact.username}`
                          : chat.contact?.name ||
                            `Instagram ${chat.contact?.instagram_id}`}
                      </p>

                      <p className="mt-1 truncate text-xs text-zinc-500">
                        {lastMessage?.content ||
                          "Nova conversa"}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* CHAT */}
        <section className="flex flex-1 flex-col">
          {!selectedChat ? (
            <div className="flex flex-1 items-center justify-center text-zinc-500">
              Selecione uma conversa
            </div>
          ) : (
            <>
              {/* CABEÇALHO */}
              <header className="flex h-[85px] items-center justify-between border-b border-zinc-800 px-6">
                <div>
                  <p className="font-semibold">
                    {selectedChat.contact?.username
                      ? `@${selectedChat.contact.username}`
                      : selectedChat.contact?.name ||
                        "Usuário do Instagram"}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Instagram ID:{" "}
                    {
                      selectedChat.contact
                        ?.instagram_id
                    }
                  </p>
                </div>

                <div className="rounded-full border border-green-900 bg-green-950 px-3 py-1 text-xs text-green-400">
                  Atendimento aberto
                </div>
              </header>

              {/* MENSAGENS */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="mx-auto flex max-w-3xl flex-col gap-3">
                  {selectedChat.messages.map(
                    (item) => {
                      const fromCustomer =
                        item.sender_type ===
                        "customer";

                      return (
                        <div
                          key={item.id}
                          className={`flex ${
                            fromCustomer
                              ? "justify-start"
                              : "justify-end"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
                              fromCustomer
                                ? "rounded-bl-md bg-zinc-800"
                                : "rounded-br-md bg-white text-black"
                            }`}
                          >
                            <p>{item.content}</p>

                            <p
                              className={`mt-2 text-[10px] ${
                                fromCustomer
                                  ? "text-zinc-500"
                                  : "text-zinc-500"
                              }`}
                            >
                              {new Date(
                                item.created_at
                              ).toLocaleTimeString(
                                "pt-BR",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* ERRO */}
              {error && (
                <div className="mx-6 mb-2 rounded-xl border border-red-900 bg-red-950 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* CAMPO DE RESPOSTA */}
              <form
                onSubmit={sendMessage}
                className="border-t border-zinc-800 p-4"
              >
                <div className="mx-auto flex max-w-3xl gap-3">
                  <input
                    value={message}
                    onChange={(event) =>
                      setMessage(
                        event.target.value
                      )
                    }
                    placeholder="Digite uma mensagem..."
                    className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-zinc-600"
                  />

                  <button
                    type="submit"
                    disabled={
                      sending ||
                      !message.trim()
                    }
                    className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {sending
                      ? "Enviando..."
                      : "Enviar"}
                  </button>
                </div>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  );
}