/**
 * Modelo de dados para o aluno
 * @optional celular: Telefone do aluno
 * @optional curso: ID do curso do aluno
 * @optional email: E-mail do aluno
 * @optional foto: URL da foto do aluno
 * @optional horario: Horário disponível do aluno
 * @property nome: Nome do aluno
 * @optional predio: Prédio onde o aluno estuda
 * @optional sala: Sala onde o aluno estuda
 * @optional status: Status do aluno (ativo/inativo)
 * @property uid: ID único do aluno (Firebase)
 * @property ra: Registro Acadêmico do aluno
 */
export interface Student {
    /**
     * Telefone do aluno
     * @optional
     * @type {string}
     */
    celular?: string;
    /**
     * ID do curso do aluno
     * @optional
     * @type {string}
     */
    curso?: string;
    /**
     * E-mail do aluno
     * @optional
     * @type {string}
     */
    email?: string;
    /**
     * URL da foto do aluno
     * @optional
     * @type {string}
     */
    foto?: string;
    /**
     * Horário disponível do aluno
     * @optional
     * @type {string}
     */
    horario?: string;
    /**
     * Nome do aluno
     * @type {string}
     */
    nome: string;
    /**
     * Prédio onde o aluno estuda
     * @optional
     * @type {string}
     */
    predio?: string;
    /**
     * Sala onde o aluno estuda
     * @optional
     * @type {string}
     */
    sala?: string;
    /**
     * Status do aluno (ativo/inativo)
     * @optional
     * @type {boolean}
     */
    status?: boolean;
    /**
     * ID único do aluno (Firebase)
     * @type {string}
     */
    uid: string;
    /**
     * Registro Acadêmico do aluno
     * @type {string}
     */
    ra: string;
}