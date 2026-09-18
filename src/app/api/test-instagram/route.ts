import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: "INSTAGRAM_ACCESS_TOKEN não configurado" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${token}`,
      {
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          instagram: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      instagram: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao consultar o Instagram",
      },
      { status: 500 }
    );
  }
}