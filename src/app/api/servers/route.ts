import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://publicapi.battlebit.cloud/Servers/GetServerList', {
      next: { revalidate: 30 }, // Revalidar a cada 30 segundos
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Falha na resposta da API');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao buscar servidores:', error);
    return NextResponse.json({ error: 'Falha ao buscar dados dos servidores' }, { status: 500 });
  }
} 