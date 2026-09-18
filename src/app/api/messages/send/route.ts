import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const { conversationId, message } = await request.json();

    if (!conversationId || !message?.trim()) {
      return NextResponse.json(
        { error: "conversationId e message são obrigatórios" },
        { status: 400 }
      );
    }

    // Busca a conversa
    const { data: conversation, error: conversationError } =
      await supabaseAdmin
        .from("conversations")
        .select(
          "id, contact_id, instagram_account_id"
        )
        .eq("id", conversationId)
        .single();

    if (conversationError || !conversation) {
      return NextResponse.json(
        { error: "Conversa não encontrada" },
        { status: 404 }
      );
    }

    // Busca o contato
    const { data: contact, error: contactError } =
      await supabaseAdmin
        .from("contacts")
        .select("instagram_id")
        .eq("id", conversation.contact_id)
        .single();

    if (contactError || !contact) {
      return NextResponse.json(
        { error: "Contato não encontrado" },
        { status: 404 }
      );
    }

    // Busca a conta do Instagram
    const { data: instagramAccount, error: accountError } =
      await supabaseAdmin
        .from("instagram_accounts")
        .select("instagram_user_id")
        .eq("id", conversation.instagram_account_id)
        .single();

    if (accountError || !instagramAccount) {
      return NextResponse.json(
        { error: "Conta do Instagram não encontrada" },
        { status: 404 }
      );
    }

    const accessToken =
      process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Token do Instagram não configurado" },
        { status: 500 }
      );
    }

    const apiVersion =
      process.env.META_API_VERSION || "v26.0";

    const instagramResponse = await fetch(
      `https://graph.instagram.com/${apiVersion}/${instagramAccount.instagram_user_id}/messages`,
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          recipient: {
            id: contact.instagram_id,
          },

          message: {
            text: message.trim(),
          },
        }),
      }
    );

    const instagramData =
      await instagramResponse.json();

    if (!instagramResponse.ok) {
      console.error(
        "ERRO INSTAGRAM:",
        instagramData
      );

      return NextResponse.json(
        {
          error: "Erro ao enviar mensagem pelo Instagram",
          instagram: instagramData,
        },
        { status: instagramResponse.status }
      );
    }

    // Salva nossa resposta
    const { error: saveError } =
      await supabaseAdmin
        .from("messages")
        .insert({
          conversation_id: conversationId,
          instagram_message_id:
            instagramData.message_id ?? null,
          sender_type: "agent",
          content: message.trim(),
        });

    if (saveError) {
      console.error(
        "Erro ao salvar resposta:",
        saveError
      );
    }

    await supabaseAdmin
      .from("conversations")
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq("id", conversationId);

    return NextResponse.json({
      success: true,
      instagram: instagramData,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Erro interno ao enviar mensagem",
      },
      { status: 500 }
    );
  }
}