export interface Login {
    cpf: string;        // ID único do usuário
    nome: string;
    email: string;
    password: string;   // Será armazenado encriptado
    createdAt?: Date;
    updatedAt?: Date;
} 