import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase-admin";

type InstagramMessageEvent = {
  sender?: {
    id?: string;
  };
  recipient?: {
    id?: string;
  };
  timestamp?: string | number;
  message?: {
    mid?: string;
    text?: string;
    is_echo?: boolean;
  };
};

function extractMessageEvents(body: any): InstagramMessageEvent[] {
  const events: InstagramMessageEvent[] = [];

  if (!Array.isArray(body?.entry)) {
    return events;
  }

  for (const entry of body.entry) {
    // Formato de webhook baseado em messaging
    if (Array.isArray(entry?.messaging)) {
      for (const event of entry.messaging) {
        events.push(event);
      }
    }

    // Formato apresentado pela Meta no teste de "messages"
    if (Array.isArray(entry?.changes)) {
      for (const change of entry.changes) {
        if (change?.field === "messages" && change?.value) {
          events.push(change.value);
        }
      }
    }
  }

  return events;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (
    mode === "subscribe" &&
    token === process.env.INSTAGRAM_VERIFY_TOKEN
  ) {
    return new NextResponse(challenge, {
      status: 200,
    });
  }

  return NextResponse.json(
    {
      error: "Falha na verificação do webhook",
    },
    {
      status: 403,
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log(
      "WEBHOOK INSTAGRAM:",
      JSON.stringify(body, null, 2)
    );

    const events = extractMessageEvents(body);

    for (const event of events) {
      const senderId = event.sender?.id;
      const recipientId = event.recipient?.id;

      const messageId = event.message?.mid;
      const messageText = event.message?.text;
      const isEcho = event.message?.is_echo;

      // Ignora mensagens enviadas pelo próprio sistema/Instagram
      if (isEcho) {
        continue;
      }

      // Por enquanto vamos trabalhar apenas com mensagens de texto
      if (!senderId || !recipientId || !messageText) {
        continue;
      }

      // Descobre para qual conta do Instagram a mensagem chegou
      const {
        data: instagramAccount,
        error: accountError,
      } = await supabaseAdmin
        .from("instagram_accounts")
        .select("id, organization_id, instagram_user_id")
        .eq("instagram_user_id", recipientId)
        .maybeSingle();

      if (accountError) {
        console.error(
          "Erro ao buscar conta do Instagram:",
          accountError
        );

        continue;
      }

      if (!instagramAccount) {
        console.log(
          "Conta do Instagram não cadastrada:",
          recipientId
        );

        continue;
      }

      // Cria ou encontra o contato
      const {
        data: contact,
        error: contactError,
      } = await supabaseAdmin
        .from("contacts")
        .upsert(
          {
            organization_id:
              instagramAccount.organization_id,

            instagram_id: senderId,
          },
          {
            onConflict: "organization_id,instagram_id",
          }
        )
        .select("id")
        .single();

      if (contactError || !contact) {
        console.error(
          "Erro ao criar/encontrar contato:",
          contactError
        );

        continue;
      }

      // Cria ou encontra a conversa
      const {
        data: conversation,
        error: conversationError,
      } = await supabaseAdmin
        .from("conversations")
        .upsert(
          {
            organization_id:
              instagramAccount.organization_id,

            instagram_account_id:
              instagramAccount.id,

            contact_id:
              contact.id,

            updated_at:
              new Date().toISOString(),
          },
          {
            onConflict:
              "instagram_account_id,contact_id",
          }
        )
        .select("id")
        .single();

      if (conversationError || !conversation) {
        console.error(
          "Erro ao criar/encontrar conversa:",
          conversationError
        );

        continue;
      }

      // Salva a mensagem
      const {
        error: messageError,
      } = await supabaseAdmin
        .from("messages")
        .upsert(
          {
            conversation_id:
              conversation.id,

            instagram_message_id:
              messageId ?? null,

            sender_type:
              "customer",

            content:
              messageText,
          },
          {
            onConflict:
              "instagram_message_id",

            ignoreDuplicates:
              true,
          }
        );

      if (messageError) {
        console.error(
          "Erro ao salvar mensagem:",
          messageError
        );

        continue;
      }

      console.log(
        "MENSAGEM SALVA:",
        {
          senderId,
          messageText,
          conversationId:
            conversation.id,
        }
      );
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error(
      "ERRO NO WEBHOOK:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Erro ao processar webhook",
      },
      {
        status: 500,
      }
    );
  }
}