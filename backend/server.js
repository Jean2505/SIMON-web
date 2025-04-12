const express = require('express');
const cors = require('cors');
const db = require('./database');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// GET /disciplinas - lista todas
app.get('/disciplinas', (req, res) => {
  db.all('SELECT * FROM DISCIPLINA', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET /disciplinas?escola=...&curso=... - filtro opcional
app.get('/disciplinas/filtro', (req, res) => {
  const { escola, curso } = req.query;

  db.all(`
    SELECT * FROM DISCIPLINA
    WHERE escola_Disciplina = ?
    AND curso_Disciplina = ?
  `, [escola, curso], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/loadCourses', (req, res) => {
    const { school, major } = req.query;
  
    db.all(`
      SELECT * FROM DISCIPLINA
      WHERE escola_Disciplina = ?
      AND curso_Disciplina = ?
    `, [school, major], async (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
  
      const payload = { courses: rows };
  
      try {
        const response = await axios.post('https://createcourses-bz6uecg2pq-rj.a.run.app', payload);
        console.log('Resposta da função externa:', response.data);
        res.json({ enviado: true, retorno: response.data });
      } catch (postError) {
        console.error('Erro ao enviar para a função externa:', postError.message);
        res.status(500).json({ error: 'Erro ao enviar para função externa', detalhe: postError.message });
      }
    });
  });

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});