export interface Student {      // Interface para o aluno
    phone?: string;             // Telefone
    email?: string;             // E-mail
    photo?: string;             // URL da foto
    availableTime?: string;     // Horário disponível
    name: string;               // Nome
    building?: string;          // Prédio
    ra: string;                 // Registro Acadêmico
    classroom?: string;         // Sala
    status?: boolean;           // Status (ativo/inativo)
    uid: string;                // ID do usuário (Firebase)
}