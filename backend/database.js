const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db.sqlite");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS DISCIPLINA (
      id_Disciplina TEXT PRIMARY KEY,
      nome_Disciplina TEXT,
      escola_Disciplina TEXT,
      curso_Disciplina TEXT,
      professor_Disciplina TEXT,
      periodo_Disciplina INTEGER
    );
  `);

  // Inserção de dados iniciais (verifica se já existem antes)
  const insertStmt = db.prepare(`
    INSERT OR IGNORE INTO DISCIPLINA (
      id_Disciplina, nome_Disciplina, escola_Disciplina,
      curso_Disciplina, professor_Disciplina, periodo_Disciplina
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertStmt.run(
    "217244",
    "Estrutura e Recuperação de Dados I",
    "Escola Politécnica",
    "Engenharia de Software",
    "Lucia Filomena de Almeida Guimarães",
    2
  );
  insertStmt.run(
    "217252",
    "Engenharia e Elicitação de Requisitos",
    "Escola Politécnica",
    "Engenharia de Software",
    "Eliane Ferraz Young de Azevedo",
    2
  );
  insertStmt.run(
    "11124",
    "Vida Universitária e Desenvolvimento Integral",
    "Escola de Economia e Negócios",
    "Ciências Econômicas",
    "Adauto Roberto Ribeiro",
    1
  );
  insertStmt.run(
    "12907P",
    "Química, Materiais e Tecnologia",
    "Escola Politécnica",
    "Engenharia Mecânica",
    "Maria Fernanda Oliveira",
    1
  );
  insertStmt.run(
    "14593",
    "Fonética e Fonologia da Língua Portuguesa",
    "Escola de Linguagem e Comunicação",
    "Letras",
    "Cassia dos Santos",
    1
  );
  insertStmt.run(
    "ES101",
    "Vida Universitária e Desenvolvimento Integral",
    "Escola Politécnica",
    "Engenharia de Software",
    "Andre Luis dos Reis Gomes de Carvalho",
    1
  );
  insertStmt.run(
    "ES102",
    "Teologia e Fenômeno Humano",
    "Escola Politécnica",
    "Engenharia de Software",
    "Antonio Douglas de Moraes",
    1
  );
  insertStmt.run(
    "ES201",
    "Algoritmos e Linguagem de Programação",
    "Escola Politécnica",
    "Engenharia de Software",
    "Sergio Luiz Moral Marques",
    2
  );
  insertStmt.run(
    "ES202",
    "Estrutura e Recuperação de Dados I",
    "Escola Politécnica",
    "Engenharia de Software",
    "Lucia Filomena de Almeida Guimaraes",
    2
  );
  insertStmt.run(
    "ES301",
    "Ética e Antropologia Teológica",
    "Escola Politécnica",
    "Engenharia de Software",
    "Alexandre Boratti Favretto",
    3
  );
  insertStmt.run(
    "ES302",
    "Tecnologia e Programação para Dispositivos Móveis",
    "Escola Politécnica",
    "Engenharia de Software",
    "Fernando Ernesto Kintscher",
    3
  );
  insertStmt.run(
    "ES401",
    "Prática de Formação I",
    "Escola Politécnica",
    "Engenharia de Software",
    "Eliane Ferraz Young de Azevedo",
    4
  );
  insertStmt.run(
    "ES402",
    "Estudos de Banco de Dados II",
    "Escola Politécnica",
    "Engenharia de Software",
    "Carlos Augusto Amaral Moreira",
    4
  );
  insertStmt.run(
    "ES501",
    "Teoria das Organizações",
    "Escola Politécnica",
    "Engenharia de Software",
    "Cecilia Sosa Arias Peixoto",
    5
  );
  insertStmt.run(
    "ES502",
    "Estudos Avançados de Banco de Dados",
    "Escola Politécnica",
    "Engenharia de Software",
    "Fernando Henrique Carvalho Silva",
    5
  );
  insertStmt.run(
    "ES601",
    "Prática de Formação II",
    "Escola Politécnica",
    "Engenharia de Software",
    "Joice Ariane Marin",
    6
  );
  insertStmt.run(
    "ES602",
    "Normas e Qualidade de Software",
    "Escola Politécnica",
    "Engenharia de Software",
    "Cesar da Silva Peixoto",
    6
  );
  insertStmt.run(
    "ES701",
    "Teologia e Sociedade",
    "Escola Politécnica",
    "Engenharia de Software",
    "Anderson Frezzato",
    7
  );
  insertStmt.run(
    "ES702",
    "Prática de Formação III",
    "Escola Politécnica",
    "Engenharia de Software",
    "Dimas Augusto Mendes Lemes",
    7
  );
  insertStmt.run(
    "ES801",
    "Educação em Direitos Humanos: História, Cultura e Meio ambiente",
    "Escola Politécnica",
    "Engenharia de Software",
    "Maria das Gracas dos Santos Abreu",
    8
  );
  insertStmt.run(
    "ES802",
    "Tecnologias Emergentes de TI",
    "Escola Politécnica",
    "Engenharia de Software",
    "Mateus Pereira Dias",
    8
  );

  insertStmt.finalize();
});

module.exports = db;
