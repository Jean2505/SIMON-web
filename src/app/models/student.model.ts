/**
 * Modelo de dados para o aluno
 * @interface Student
 * @description Este modelo representa um aluno no sistema.
 * @property {string} [celular] - Telefone do aluno (opcional)
 * @property {string} [curso] - ID do curso do aluno (opcional)
 * @property {string} [email] - E-mail do aluno (opcional)
 * @property {string} [foto] - URL da foto do aluno (opcional)
 * @property {string} [horario] - Horário disponível do aluno (opcional)
 * @property {string} nome - Nome do aluno
 * @property {string} [predio] - Prédio onde o aluno estuda (opcional)
 * @property {string} [sala] - Sala onde o aluno estuda (opcional)
 * @property {string} [monitorando] - ID da matéria que o monitor está monitorando, vazio quando nulo (opcional)
 * @property {string} uid - ID único do aluno (Firebase)
 * @property {string} ra - Registro Acadêmico do aluno
 * @property {number} term - semestre do aluno
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
   * ID da matéria que o monitor está monitorando, vazio quando nulo
   * @optional
   * @type {string}
   */
  monitorando?: string;
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
   * ID único do aluno (Firebase)
   * @type {string}
   */
  uid: string;
  /**
   * Registro Acadêmico do aluno
   * @type {string}
   */
  ra: string;
  /**
   * semestre do aluno
   * @type {number}
   */
  term: number;
}
