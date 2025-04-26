export interface Student {  // Interface para o aluno
    celular?: string;       // Telefone
    curso?: string;         // ID do curso
    email?: string;         // E-mail
    foto?: string;          // URL da foto
    horario?: string;       // Horário disponível
    nome: string;           // Nome
    predio?: string;        // Prédio
    sala?: string;          // Sala
    status?: boolean;       // Status (ativo/inativo)
    uid: string;            // ID do usuário (Firebase)
    ra: string;             // Registro Acadêmico
}