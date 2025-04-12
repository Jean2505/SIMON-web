const express = require('express');
const cors = require('cors');
const db = require('./database');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

/**
 * GET /schools
 * Retorna a lista de escolas (distintas) baseadas na coluna "escola_Disciplina" da tabela DISCIPLINA.
 * Cada escola é retornada com os campos "escolaId" e "name".
 */
app.get('/schools', (req, res) => {
  db.all(
    "SELECT DISTINCT escola_Disciplina as escolaId, escola_Disciplina as name FROM DISCIPLINA",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

/**
 * GET /courses
 * Retorna a lista de cursos (distintos) para uma escola específica.
 * Aceita o parâmetro "school" (o identificador/nome da escola) e retorna:
 *  - cursoId: definido como o próprio curso (curso_Disciplina);
 *  - name: o nome do curso;
 *  - escolaId: o identificador da escola (para consistência).
 */
app.get('/courses', (req, res) => {
  const { school } = req.query;
  if (!school) {
    return res.status(400).json({ error: "Parâmetro 'school' é obrigatório." });
  }
  db.all(
    "SELECT DISTINCT curso_Disciplina as cursoId, curso_Disciplina as name, escola_Disciplina as escolaId FROM DISCIPLINA WHERE escola_Disciplina = ?",
    [school],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

/**
 * GET /loadCourses
 * Sincroniza os dados de disciplinas (selecionadas por escola e curso) do SQLite para o Firebase
 * via uma função externa.
 * Espera os query parameters "school" e "major" (neste caso, os nomes da escola e do curso, respectivamente).
 */
app.get('/loadCourses', (req, res) => {
  const { school, major } = req.query;
  
  db.all(
    `
    SELECT * FROM DISCIPLINA
    WHERE escola_Disciplina = ?
    AND curso_Disciplina = ?
    `,
    [school, major],
    async (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      const payload = { courses: rows };
      /*
      try {
        const response = await axios.post('https://createcourses-bz6uecg2pq-rj.a.run.app', payload);
        console.log('Resposta da função externa:', response.payload);
        res.json({ enviado: true, retorno: response.data });
      } catch (postError) {
        console.error('Erro ao enviar para a função externa:', postError.message);
        res.status(500).json({ error: 'Erro ao enviar para função externa', detalhe: postError.message });
      }
        */
    }
  );
});

app.post('/getExternalCourses', async (req, res) => {
  try {
    // Obtém o nome do curso do body enviado pelo Angular
    const { course } = req.body;

    // Monta o payload esperado pela função externa
    const payload = { course };

    // Chama a Cloud Function usando axios
    const response = await axios.post('https://getcourses-bz6uecg2pq-rj.a.run.app', payload);

    // Retorna a resposta da função externa ao front-end
    res.json(response.data);
  } catch (error) {
    console.error('Erro ao chamar função externa:', error.message);
    res.status(500).json({ error: 'Erro ao obter as disciplinas externamente' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
