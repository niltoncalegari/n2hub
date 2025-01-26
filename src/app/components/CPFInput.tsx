'use client';
import { useState, useEffect } from 'react';
import { validateCPF } from '@/app/lib/utils/cpfValidator';

interface CPFInputProps {
    value: string;
    onChange: (value: string, isValid: boolean) => void;
    required?: boolean;
    autoFocus?: boolean;
}

export default function CPFInput({ value, onChange, required = false, autoFocus = false }: CPFInputProps) {
    const [isValid, setIsValid] = useState(false);

    const formatCPF = (cpf: string) => {
        // Remove tudo que não é número
        const numbers = cpf.replace(/\D/g, '');
        
        // Aplica a máscara
        return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const formattedValue = formatCPF(rawValue);
        
        // Limita a 14 caracteres (incluindo pontos e traço)
        if (rawValue.length <= 14) {
            const numbersOnly = rawValue.replace(/\D/g, '');
            const valid = validateCPF(numbersOnly);
            setIsValid(valid);
            onChange(formattedValue, valid);
        }
    };

    useEffect(() => {
        // Valida o CPF inicial se houver
        if (value) {
            const numbersOnly = value.replace(/\D/g, '');
            setIsValid(validateCPF(numbersOnly));
        }
    }, [value]);

    return (
        <div className="cpf-input-container">
            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder="000.000.000-00"
                maxLength={14}
                required={required}
                autoFocus={autoFocus}
                className={`cpf-input ${value && !isValid ? 'invalid' : ''}`}
            />
            {value && !isValid && (
                <span className="cpf-error">CPF inválido</span>
            )}
        </div>
    );
} 