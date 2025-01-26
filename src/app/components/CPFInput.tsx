'use client';
import { Input } from "@/app/components/ui/input";
import { validateCPF } from "@/app/lib/utils/cpfValidator";

interface CPFInputProps {
    value: string;
    onChange: (value: string, isValid: boolean) => void;
    required?: boolean;
    autoFocus?: boolean;
}

export default function CPFInput({ value, onChange, required, autoFocus }: CPFInputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.replace(/\D/g, '');
        const formattedValue = newValue
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
            .slice(0, 14);

        const isValid = validateCPF(newValue);
        onChange(formattedValue, isValid);
    };

    return (
        <Input
            type="text"
            placeholder="000.000.000-00"
            value={value}
            onChange={handleChange}
            maxLength={14}
            required={required}
            autoFocus={autoFocus}
        />
    );
} 