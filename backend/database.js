const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite');

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

  insertStmt.run('217244', 'Estrutura e Recuperação de Dados I', 'Escola Politécnica', 'Engenharia de Software', 'Lucia Filomena de Almeida Guimarães', 2);
  insertStmt.run('217252', 'Engenharia e Elicitação de Requisitos', 'Escola Politécnica', 'Engenharia de Software', 'Eliane Ferraz Young de Azevedo', 2);
  insertStmt.run('11124',  'Vida Universitária e Desenvolvimento Integral', 'Escola de Economia e Negócios', 'Ciências Econômicas', 'Adauto Roberto Ribeiro', 1);
  insertStmt.run('12907P', 'Química, Materiais e Tecnologia', 'Escola Politécnica', 'Engenharia Mecânica', 'Maria Fernanda Oliveira', 1);
  insertStmt.run('14593',  'Fonética e Fonologia da Língua Portuguesa', 'Escola de Linguagem e Comunicação', 'Letras', 'Cassia dos Santos', 1);

  insertStmt.finalize();
});

module.exports = db;
