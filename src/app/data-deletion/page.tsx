export default function DataDeletion() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold">
          Solicitação de Exclusão de Dados
        </h1>

        <p className="mt-6 text-zinc-300">
          Usuários que tenham interagido com contas do Instagram conectadas ao
          LINKO Direct podem solicitar a exclusão dos dados relacionados às suas
          interações.
        </p>

        <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
          <h2 className="text-xl font-semibold">
            Como solicitar a exclusão
          </h2>

          <p className="mt-4 text-zinc-300">
            Envie um e-mail para:
          </p>

          <a
            href="mailto:diretoria.ti@4ths.com.br"
            className="mt-2 inline-block text-lg font-medium underline"
          >
            diretoria.ti@4ths.com.br
          </a>

          <p className="mt-6 text-zinc-300">
            No e-mail, informe o nome de usuário do Instagram utilizado no
            atendimento e solicite a exclusão dos dados associados à conversa.
          </p>

          <p className="mt-4 text-zinc-300">
            Após a validação da solicitação, os dados relacionados ao usuário
            serão localizados e removidos dos sistemas utilizados pelo LINKO
            Direct, observadas eventuais obrigações legais de retenção.
          </p>
        </div>
      </div>
    </main>
  );
}