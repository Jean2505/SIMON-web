/**
 * Modelo de dados para o monitor.
 * @interface Tutor
 * @property {number} aprovacao - Status de aprovação do monitor (0: em análise, 1: aprovado, 2: reprovado).
 * @property {string} cargaHoraria - Carga horária do monitor.
 * @property {string} disciplina - Disciplina monitorada.
 * @property {string} disciplinaId - ID da disciplina do monitor.
 * @property {string} foto - URL da foto do monitor.
 * @property {string} horarioDisponivel - Horário disponível do monitor.
 * @property {string} local - Local onde o monitor está aplicando a monitoria.
 * @property {string} mensagem - Mensagem de justificativa do aluno.
 * @property {string} nome - Nome do monitor.
 * @property {string} ra - RA (Registro Acadêmico) do monitor.
 * @property {boolean} remuneracao - Remuneração do monitor.
 * @property {string} sala - Sala onde o monitor está aplicando a monitoria.
 * @property {boolean} status - Status do monitor.
 * @property {string} uid - UID (ID único) do monitor.
 */
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