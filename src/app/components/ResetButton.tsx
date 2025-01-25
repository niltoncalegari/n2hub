'use client';

export default function ResetButton() {
    const handleReset = async () => {
        try {
            const response = await fetch('/api/scores/reset', {
                method: 'DELETE'
            });
            if (response.ok) {
                // Sucesso - atualize a UI conforme necessário
            }
        } catch (error) {
            console.error('Erro ao resetar scores:', error);
        }
    };

    return (
        <button 
            onClick={handleReset}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
            Resetar Scores
        </button>
    );
} 