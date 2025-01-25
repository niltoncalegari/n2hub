import { NextResponse } from 'next/server';
import { ScoreService } from '@/app/lib/services/ScoreService';

export async function DELETE() {
    try {
        const scoreService = new ScoreService();
        await scoreService.deleteAllScores();
        
        return new NextResponse(JSON.stringify({ message: 'Todos os scores foram removidos com sucesso' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE'
            }
        });
    } catch {
        return new NextResponse(JSON.stringify({ error: 'Erro ao remover scores' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
} 