export interface Tutor {
    /**
     * Status de aprovação do monitor.
     * @type {number}
     * @description 0: em análise, 1: aprovado, 2: reprovado
     */
    aprovacao: number;
    /**
     * Carga horária do monitor.
     * @type {string}
     */
    cargaHoraria: string;
    /**
     * Disciplina monitorada.
     * @type {string}
     */
    disciplina: string;
    /**
     * ID da disciplina do monitor.
     * @type {string}
     */
    disciplinaId: string;
    /**
     * URL da foto do monitor.
     * @type {string}
     */
    foto: string;
    /**
     * Horário disponível do monitor.
     * @type {string}
     */
    horarioDisponivel: string;
    /**
     * Local onde o monitor está aplicando a monitoria.
     * @type {string}
     */
    local: string;
    /**
     * Mensagem de justificativa do aluno.
     * @type {string}
     */
    mensagem: string;
    /**
     * Nome do monitor.
     * @type {string}
     */
    nome: string;
    /**
     * RA (Registro Acadêmico) do monitor.
     * @type {string}
     */
    ra: string;
    /**
     * Remuneração do monitor.
     * @type {boolean}
     */
    remuneracao: boolean;
    /**
     * Sala onde o monitor está aplicando a monitoria.
     * @type {string}
     */
    sala: string;
    /**
     * Status do monitor.
     * @type {boolean}
     */
    status: boolean;
    /**
     * UID (ID único) do monitor.
     * @type {string}
     */
    uid: string;
}