export default function Dashboard() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="flex min-h-screen">

        <aside className="w-64 border-r border-zinc-800 bg-zinc-950 p-6">
          <div className="mb-10">
            <h1 className="text-xl font-bold">LINKO DIRECT</h1>
            <p className="mt-1 text-xs text-zinc-500">
              Atendimento inteligente
            </p>
          </div>

          <nav className="space-y-2">

            <button className="w-full rounded-xl bg-zinc-800 px-4 py-3 text-left text-sm">
              Dashboard
            </button>

            <button className="w-full rounded-xl px-4 py-3 text-left text-sm text-zinc-400 hover:bg-zinc-900">
              Conversas
            </button>

            <button className="w-full rounded-xl px-4 py-3 text-left text-sm text-zinc-400 hover:bg-zinc-900">
              Leads
            </button>

            <button className="w-full rounded-xl px-4 py-3 text-left text-sm text-zinc-400 hover:bg-zinc-900">
              Base da IA
            </button>

            <button className="w-full rounded-xl px-4 py-3 text-left text-sm text-zinc-400 hover:bg-zinc-900">
              Automações
            </button>

            <button className="w-full rounded-xl px-4 py-3 text-left text-sm text-zinc-400 hover:bg-zinc-900">
              Instagram
            </button>

            <button className="w-full rounded-xl px-4 py-3 text-left text-sm text-zinc-400 hover:bg-zinc-900">
              Configurações
            </button>

          </nav>
        </aside>

        <section className="flex-1 p-8">

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">
                Dashboard
              </h2>

              <p className="mt-2 text-zinc-500">
                Acompanhe o atendimento do Instagram em tempo real.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
              <p className="text-xs text-zinc-500">
                Instagram
              </p>

              <p className="text-sm font-medium">
                Nenhuma conta conectada
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-4 gap-4">

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="text-sm text-zinc-500">
                Conversas
              </p>

              <p className="mt-3 text-3xl font-bold">
                0
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="text-sm text-zinc-500">
                Novos leads
              </p>

              <p className="mt-3 text-3xl font-bold">
                0
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="text-sm text-zinc-500">
                Respondidas pela IA
              </p>

              <p className="mt-3 text-3xl font-bold">
                0
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="text-sm text-zinc-500">
                Atendimento humano
              </p>

              <p className="mt-3 text-3xl font-bold">
                0
              </p>
            </div>

          </div>

          <div className="mt-6 grid grid-cols-3 gap-6">

            <div className="col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  Últimas conversas
                </h3>

                <button className="text-sm text-zinc-400">
                  Ver todas
                </button>
              </div>

              <div className="flex h-64 items-center justify-center">
                <p className="text-sm text-zinc-600">
                  Nenhuma conversa recebida ainda.
                </p>
              </div>

            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

              <h3 className="font-semibold">
                Inteligência Artificial
              </h3>

              <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-4">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm font-medium">
                      IA do atendimento
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      Respostas automáticas
                    </p>
                  </div>

                  <div className="rounded-full bg-green-950 px-3 py-1 text-xs text-green-400">
                    Ativa
                  </div>

                </div>
              </div>

              <button className="mt-4 w-full rounded-xl bg-white py-3 text-sm font-medium text-black">
                Configurar IA
              </button>

            </div>

          </div>

        </section>

      </div>
    </main>
  );
}