import { NextRequest, NextResponse } from "next/server";

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

    return NextResponse.json({
      received: true,
    });
  } catch {
    return NextResponse.json(
      {
        error: "Erro ao processar webhook",
      },
      {
        status: 500,
      }
    );
  }
}