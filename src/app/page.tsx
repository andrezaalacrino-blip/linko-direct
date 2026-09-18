export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300">
          LINKO DIRECT
        </span>

        <h1 className="max-w-3xl text-5xl font-bold tracking-tight md:text-7xl">
          Atendimento inteligente para o seu Instagram
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-zinc-400">
          Conecte seu Instagram, automatize respostas com inteligência
          artificial e acompanhe todas as conversas em um só lugar.
        </p>

        <div className="mt-10 flex gap-4">
          <button className="rounded-xl bg-white px-6 py-3 font-medium text-black transition hover:bg-zinc-200">
            Entrar no sistema
          </button>

          <button className="rounded-xl border border-zinc-700 px-6 py-3 font-medium text-white transition hover:bg-zinc-900">
            Conectar Instagram
          </button>
        </div>

        <div className="mt-16 grid w-full max-w-4xl gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-left">
            <p className="text-sm text-zinc-400">Conversas</p>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-left">
            <p className="text-sm text-zinc-400">Leads</p>
            <p className="mt-2 text-3xl font-bold">0</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-left">
            <p className="text-sm text-zinc-400">IA</p>
            <p className="mt-2 text-3xl font-bold">Ativa</p>
          </div>
        </div>
      </div>
    </main>
  );
}