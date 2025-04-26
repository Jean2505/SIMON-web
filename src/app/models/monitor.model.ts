export interface Monitor {  // Interface para o monitor
    approved: string;       // Status de aprovação
    availability: string;   // Horário de atendimento
    discipline: string;     // Nome da disciplina
    disciplineId: string;   // ID da disciplina
    local: string;          // Local de atendimento
    name: string;           // Nome do monitor
    photo: string;          // URL da foto do monitor
    room: string;           // Sala de atendimento
    status: boolean;        // Status (ativo/inativo)
    ra: string;             // Registro Acadêmico do monitor
    workload: number;       // Carga horária do monitor
}