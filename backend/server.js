// server.js
const express = require("express");
const cors = require("cors");
const db = require("./database");
const axios = require("axios");
const path = require("path");

// Importa a configuração do Firebase Admin
const admin = require("./functions/firebase-admin-config");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Exemplo de endpoint que utiliza o Firebase Admin para algo, como definir custom claims
app.get("/updateUser", async (req, res) => {
  res.sendFile(path.join(__dirname, "/screens/updateUser.html"));
});
app.post("/setUserRole", async (req, res) => {
  const { uid, role } = req.body;

  try {
    await admin.auth().setCustomUserClaims(uid, { role });
    //alert(`Custom claim para role '${role}' foi setada no usuário ${uid}`);
    //res.send(`Custom claim para role '${role}' foi setada no usuário ${uid}`);

    res.sendFile(path.join(__dirname, "/screens/updateUser.html"));
  } catch (error) {
    res.send("Erro ao setar custom claim:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /schools
 * Retorna a lista de escolas (distintas) baseadas na coluna "escola_Disciplina" da tabela DISCIPLINA.
 * Cada escola é retornada com os campos "escolaId" e "name".
 */
app.get("/schools", (req, res) => {
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
 * GET /discipline
 * Retorna a lista de disciplinas (distintas) para um curso específico.
 */
app.get("/discipline", (req, res) => {
  const { disciplineId } = req.query;
  console.log("Requisição: ", disciplineId);
  if (!disciplineId) {
    query = "SELECT * FROM DISCIPLINA";
  } else {
    query = "SELECT * FROM DISCIPLINA WHERE id_Disciplina = ?";
  }
  db.all(query, [disciplineId], (err, rows) => {
    console.log("Resposta: ", rows);
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

/**
 * GET /courses
 * Retorna a lista de cursos (distintos) para uma escola específica.
 * Aceita o parâmetro "school" (o identificador/nome da escola) e retorna:
 *  - cursoId: definido como o próprio curso (curso_Disciplina);
 *  - name: o nome do curso;
 *  - escolaId: o identificador da escola (para consistência).
 */
app.get("/courses", (req, res) => {
  const { school } = req.query;
  if (!school) {
    return res.status(400).json({ error: "Parâmetro 'school' é obrigatório." });
  }
  console.log("Requisição: ", school);
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
 * Sincroniza os dados de disciplinas (selecionadas por escola e curso) do SQLite para o Firebase via uma função externa.
 * Espera os query parameters "school" e "major" (neste caso, os nomes da escola e do curso, respectivamente).
 */
app.get("/loadCourses", (req, res) => {
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

      const course = { course: major };
      coursesToAdd = [];

      try {
        const response = await axios.post(
          "https://getcourses-bz6uecg2pq-rj.a.run.app",
          course
        );

        subjects = JSON.parse(response.data.payload);
        rows.forEach((row) => {
          subject = subjects.some((d) => d.id == row.id_Disciplina);
          if (!subject) {
            console.error(`Disciplina não encontrada: ${row.id_Disciplina}`);
            coursesToAdd.push(row);
          }
        });
        const courses = { courses: coursesToAdd };
        if (coursesToAdd.length > 0) {
          try {
            const response = await axios.post(
              "https://createcourses-bz6uecg2pq-rj.a.run.app",
              courses
            );
            res.json({ enviado: true, retorno: response.data });
          } catch (postError) {
            console.error(
              "Erro ao enviar para a função createcourses:",
              postError.message
            );
            res.status(500).json({
              error: "Erro ao enviar para função externa",
              detalhe: postError.message,
            });
          }
        }
      } catch (err) {
        console.error("Erro ao chamar função getcourses:", err.message);
        res
          .status(500)
          .json({ error: "Erro ao obter as disciplinas externamente" });
      }
    }
  );
});

app.post("/getSchoolCourses", async (req, res) => {
  try {
    const school = req.body;
    console.log("Requisição: ", school);
    const response = await axios.post(
      "https://getschoolcourses-bz6uecg2pq-rj.a.run.app",
      school
    );
    console.log("Resposta: ", response.data.payload);
    res.json(response.data.payload);
  } catch (error) {
    console.error("Erro ao obter cursos da escola:", error.message);
    res.status(500).json({ error: "Erro ao obter cursos da escola" });
  }
});

app.post("/insertCourses", async (req, res) => {
  try {
    const courses = { courses: req.body };
    console.log("Requisição: ", courses);
    const response = await axios.post(
      "https://createcourses-bz6uecg2pq-rj.a.run.app",
      courses
    );
    console.log("Resposta: ", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Erro ao chamar função createcourses:", error.message);
    res.status(500).json({ error: "Erro ao inserir cursos externamente" });
  }
});

app.post("/createStudent", async (req, res) => {
  try {
    const student = req.body;
    console.log("Requisição: ", student);
    const response = await axios.post(
      "https://createstudent-bz6uecg2pq-rj.a.run.app",
      student
    );
    console.log("Resposta: ", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Erro ao chamar função createUser:", error.message);
    res.status(500).json({ error: "Erro ao criar o aluno externamente" });
  }
});

app.post("/getStudent", async (req, res) => {
  try {
    const studentId = req.body;
    console.log("Requisição: ", studentId);
    const response = await axios.post(
      "https://finduser-bz6uecg2pq-rj.a.run.app",
      studentId
    );
    console.log("Resposta: ", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Erro ao chamar função findUser:", error.message);
    res
      .status(500)
      .json({ error: "Erro ao obter dados do aluno externamente" });
  }
});

app.post("/updateUser", async (req, res) => {
  try {
    const user = req.body;
    console.log("Requisição: ", user);
    const response = await axios.post(
      "https://updateuser-bz6uecg2pq-rj.a.run.app",
      user
    );
    console.log("Resposta: ", response.data.payload);
    res.json(response.data.payload);
  } catch (error) {
    console.error("Erro ao chamar função updateUser:", error.message);
    res.status(500).json({ error: "Erro ao atualizar o aluno externamente" });
  }
});

app.post("/getTutor", async (req, res) => {
  try {
    const tutorId = req.body;
    console.log("Requisição: ", tutorId);
    const response = await axios.post(
      "https://findmonitor-bz6uecg2pq-rj.a.run.app",
      tutorId
    );
    console.log("Resposta: ", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Erro ao chamar função findTutor:", error.message);
    res
      .status(500)
      .json({ error: "Erro ao obter dados do monitor externamente" });
  }
});

app.post("/updateTutor", async (req, res) => {
  try {
    const tutor = req.body;
    console.log("Requisição: ", tutor);
    const response = await axios.post(
      "https://updatemonitor-bz6uecg2pq-rj.a.run.app",
      tutor
    );
    console.log("Resposta: ", response.data.payload);
    res.json(response.data.payload);
  } catch (error) {
    console.error("Erro ao chamar função updateTutor:", error.message);
    res.status(500).json({ error: "Erro ao atualizar o monitor externamente" });
  }
});

app.post("/getCourseTutors", async (req, res) => {
  try {
    const courseId = req.body;
    console.log("Requisição: ", courseId);
    const response = await axios.post(
      "https://getcoursemonitors-bz6uecg2pq-rj.a.run.app",
      courseId
    );
    console.log("Resposta: ", JSON.parse(response.data.payload));
    res.json(response.data.payload);
  } catch (error) {
    console.error("Erro ao chamar função findTutor:", error.message);
    res
      .status(500)
      .json({ error: "Erro ao obter dados do monitor externamente" });
  }
});

app.post("/getProfessor", async (req, res) => {
  try {
    const professorId = req.body;
    console.log("Requisição: ", professorId);
    const response = await axios.post(
      "https://getprofessor-bz6uecg2pq-rj.a.run.app",
      professorId
    );
    console.log("Resposta: ", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Erro ao chamar função findProfessor:", error.message);
    res
      .status(500)
      .json({ error: "Erro ao obter dados do professor externamente" });
  }
});

app.get("/getRequisitions", async (req, res) => {
  try {
    const response = await axios.get(
      "https://getrequisitions-bz6uecg2pq-rj.a.run.app"
    );
    console.log("Resposta: ", JSON.parse(response.data.payload));
    res.json(response.data.payload);
  } catch (error) {
    console.error("Erro ao chamar função getRequisitions:", error.message);
    res
      .status(500)
      .json({ error: "Erro ao obter as requisições externamente" });
  }
});

app.post("/updateRequisition", async (req, res) => {
  try {
    const requisition = req.body;
    console.log("Requisição: ", requisition);
    const response = await axios.post(
      "https://updaterequisition-bz6uecg2pq-rj.a.run.app",
      requisition
    );
    console.log("Resposta: ", JSON.stringify(response.data.payload));
    res.json(response.data.payload);
  } catch (error) {
    console.error("Erro ao chamar função updateRequisition:", error.message);
    res
      .status(500)
      .json({ error: "Erro ao atualizar a requisição externamente" });
  }
});

app.post("/getExternalCourses", async (req, res) => {
  try {
    const { course } = req.body;
    const payload = { course };

    console.log("Requisição: ", payload);

    // Chama a Cloud Function usando axios
    const response = await axios.post(
      "https://getcourses-bz6uecg2pq-rj.a.run.app",
      payload
    );

    console.log("getExternalCourses: ", JSON.parse(response.data.payload));
    // Retorna a resposta da função externa ao front-end
    res.json(response.data.payload);
  } catch (error) {
    console.error("Erro ao chamar função externa:", error.message);
    res
      .status(500)
      .json({ error: "Erro ao obter as disciplinas externamente" });
  }
});

// Endpoint para obter as disciplinas de acordo com um array de IDs
app.post("/getCourseList", async (req, res) => {
  try {
    const payload = req.body;

    console.log("Requisição: ", payload);
    // Chama a Cloud Function usando axios
    const response = await axios.post(
      "https://getcourselist-bz6uecg2pq-rj.a.run.app",
      payload
    );
    console.log("getCourseList: ", JSON.parse(response.data.payload));
    // Retorna a resposta da função externa ao front-end
    res.json(response.data.payload);
  } catch (error) {
    console.error("Erro ao chamar função externa:", error.message);
    res
      .status(500)
      .json({ error: "Erro ao obter as disciplinas externamente" });
  }
});

app.post("/getProfessorDisciplines", async (req, res) => {
  try {
    const uid = req.body;
    console.log("Requisição: ", uid);

    const professorResponse = await axios.post(
      "https://getprofessor-bz6uecg2pq-rj.a.run.app",
      uid
    );

    const professor = JSON.parse(professorResponse.data.payload).nome;
    console.log("Professor: ", professor);

    const query = "SELECT * FROM DISCIPLINA";

    let disciplinesId = [];
    db.all(query, (err, rows) => {
      rows.forEach((row) => {
        if (row.professor_Disciplina == professor) {
          disciplinesId.push(row.id_Disciplina);
        }
      });
      console.log("Disciplinas do professor: ", disciplinesId);
      const payload = { courses: disciplinesId };
      console.log("Payload: ", payload);
      // Chama a Cloud Function usando axios
      axios
        .post("https://getcourselist-bz6uecg2pq-rj.a.run.app", payload)
        .then((response) => {
          console.log("getCourseList: ", JSON.parse(response.data.payload));
          // Retorna a resposta da função externa ao front-end
          res.json(response.data.payload);
        })
        .catch((error) => {
          console.error("Erro ao chamar função externa:", error.message);
          res
            .status(500)
            .json({ error: "Erro ao obter as disciplinas externamente" });
        });
    });
    // Chama a Cloud Function usando axios
  } catch (error) {
    console.error("Erro ao chamar função externa:", error.message);
    res
      .status(500)
      .json({ error: "Erro ao obter as disciplinas externamente" });
  }
});

// Endpoint para obter os cursos de um monitor específico
app.post("/getTutorCourses", async (req, res) => {
  try {
    const payload = req.body;

    console.log("Requisição: ", payload);

    // Chama a Cloud Function usando axios
    const response = await axios.post(
      "https://getmonitorcourses-bz6uecg2pq-rj.a.run.app",
      payload
    );

    console.log("getTutorCourses: ", JSON.parse(response.data.payload));
    // Retorna a resposta da função externa ao front-end
    res.json(response.data.payload);
  } catch (error) {
    console.error("Erro ao chamar função externa:", error.message);
    res
      .status(500)
      .json({ error: "Erro ao obter as disciplinas externamente" });
  }
});

app.post("/updateCourse", async (req, res) => {
  try {
    const update = {
      id: req.body.params.id,
      qtdMonitors: req.body.params.qtdMonitors,
    };

    // Chama a Cloud Function usando axios
    const response = await axios.post(
      "https://updatecourse-bz6uecg2pq-rj.a.run.app",
      update
    );

    // Retorna a resposta da função externa ao front-end
    res.json(response.data);
  } catch (error) {
    console.error("Erro ao chamar função updatecourse:", error.message);
    res
      .status(500)
      .json({ error: "Erro ao atualizar as disciplinas externamente" });
  }
});

app.post("/approveTutor", async (req, res) => {
  try {
    const payload = req.body;

    console.log("Requisição: ", payload);
    // Chama a Cloud Function usando axios
    const response = await axios.post(
      "https://approvemonitor-bz6uecg2pq-rj.a.run.app",
      payload
    );

    console.log("approveTutor: ", response);
    // Retorna a resposta da função externa ao front-end
    res.json(response.data);
  } catch (error) {
    console.error("Erro ao chamar função externa:", error.message);
    res.status(500).json({ error: "Erro ao aprovar o tutor externamente" });
  }
});

// Endpoint para se candidatar a uma vaga de monitoria
app.post("/enlist", async (req, res) => {
  try {
    // Chama a Cloud Function usando axios
    console.log("Requisição: ", req.body);
    const response = await axios.post(
      "https://createmonitor-bz6uecg2pq-rj.a.run.app",
      req.body
    );

    // console.log("enlist: ", JSON.parse(response.data.payload));

    // Retorna a resposta da função externa ao front-end
    res.json(response.data);
  } catch (error) {
    console.error("Erro ao chamar função createMemonitor:", error.message);
    res.status(500).json({ error: "Erro ao inscrever o aluno externamente" });
  }
});

// Endpoint para obter os posts do mural
app.post("/getMuralPosts", async (req, res) => {
  try {
    // Chama a Cloud Function usando axios
    console.log("getMuralPosts requisition: ", req.body);
    const response = await axios.post(
      "https://getmuralposts-bz6uecg2pq-rj.a.run.app",
      req.body
    );

    console.log("getMuralPosts response:", JSON.parse(response.data.payload));

    // Retorna a resposta da função externa ao front-end
    res.json(response.data);
  } catch (error) {
    const emptyResponse = {
      payload: {
        posts: [],
      },
    };
    console.log(
      "Erro ao chamar função getMuralPosts:",
      JSON.parse(emptyResponse)
    );
    res.json(emptyResponse);
  }
});

// Endpoint para criar um novo post no mural
app.post("/createMuralPost", async (req, res) => {
  const data = req.body;
  const createdAt = admin.firestore.Timestamp.now();

  // 2) Monte um novo objeto com tudo que veio no body + createdAt
  const payload = {
    ...data,
    createdAt,
  };
  try {
    // Chama a Cloud Function usando axios
    console.log("createMuralPost: ", req.body);
    const response = await axios.post(
      "https://createmuralpost-bz6uecg2pq-rj.a.run.app",
      payload
    );

    //console.log("createMuralPost: ", JSON.parse(response.data.payload));

    // Retorna a resposta da função externa ao front-end
    res.json(response.data);
  } catch (error) {
    console.error("Erro ao chamar função createPost:", error.message);
    res.status(500).json({ error: "Erro ao criar o post externamente" });
  }
});

// Endpoint para deletar um post do mural
app.post("/deleteMuralPost", async (req, res) => {
  const data = req.body;
  console.log("deleteMuralPost: ", data);

  try {
    // Chama a Cloud Function usando axios
    const response = await axios.post(
      "https://deletemuralpost-bz6uecg2pq-rj.a.run.app",
      data
    );

    console.log(response.data);

    // Retorna a resposta da função externa ao front-end
    res.json(response.data);
  } catch (error) {
    console.error("Erro ao chamar função deletePost:", error.message);
    res.status(500).json({ error: "Erro ao deletar o post externamente" });
  }
});

app.post("/getForumPosts", async (req, res) => {
  try {
    // Chama a Cloud Function usando axios
    console.log("getForumPosts requisition: ", req.body);
    const response = await axios.post(
      "https://getforumposts-bz6uecg2pq-rj.a.run.app",
      req.body
    );

    console.log("getForumPosts response:", JSON.parse(response.data.payload));

    // Retorna a resposta da função externa ao front-end
    res.json(response.data.payload);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter os posts externamente" });
  }
});

app.post("/createForumPost", async (req, res) => {
  const payload = req.body;

  try {
    // Chama a Cloud Function usando axios
    console.log("createForumPost: ", payload);
    const response = await axios.post(
      "https://createforumpost-bz6uecg2pq-rj.a.run.app",
      payload
    );

    console.log(response.data.payload);

    // Retorna a resposta da função externa ao front-end
    res.json(response.data.payload);
  } catch (error) {
    console.error("Erro ao chamar função createPost:", error.message);
    res.status(500).json({ error: "Erro ao criar o post externamente" });
  }
});

app.post("/deleteForumPost", async (req, res) => {
  const data = req.body;
  console.log("deleteForumPost: ", data);

  try {
    // Chama a Cloud Function usando axios
    const response = await axios.post(
      "https://deleteforumpost-bz6uecg2pq-rj.a.run.app",
      data
    );

    console.log(response.data.payload);

    // Retorna a resposta da função externa ao front-end
    res.json(response.data.payload);
  } catch (error) {
    console.error("Erro ao chamar função deletePost:", error.message);
    res.status(500).json({ error: "Erro ao deletar o post externamente" });
  }
});

app.post("/getComments", async (req, res) => {
  try {
    // Chama a Cloud Function usando axios
    console.log("getComments requisition: ", req.body);
    const response = await axios.post(
      "https://getcomments-bz6uecg2pq-rj.a.run.app",
      req.body
    );

    console.log("getComments response:", JSON.parse(response.data.payload));

    // Retorna a resposta da função externa ao front-end
    res.json(response.data.payload);
  } catch (error) {
    console.error("Erro ao chamar função getComments:", error.message);
    res
      .status(500)
      .json({ error: "Erro ao obter os comentários externamente" });
  }
});

app.post("/createComment", async (req, res) => {
  const payload = req.body;

  try {
    // Chama a Cloud Function usando axios
    console.log("createComment: ", payload);
    const response = await axios.post(
      "https://createcomment-bz6uecg2pq-rj.a.run.app",
      payload
    );

    console.log(response.data.payload);

    // Retorna a resposta da função externa ao front-end
    res.json(response.data.payload);
  } catch (error) {
    console.error("Erro ao chamar função createPost:", error.message);
    res.status(500).json({ error: "Erro ao criar o comentário externamente" });
  }
});

app.post("/deleteComment", async (req, res) => {
  const data = req.body;
  console.log("deleteComment: ", data);

  try {
    // Chama a Cloud Function usando axios
    const response = await axios.post(
      "https://deletecomment-bz6uecg2pq-rj.a.run.app",
      data
    );

    console.log(response.data.payload);

    // Retorna a resposta da função externa ao front-end
    res.json(response.data.payload);
  } catch (error) {
    console.error("Erro ao chamar função deletePost:", error.message);
    res
      .status(500)
      .json({ error: "Erro ao deletar o comentário externamente" });
  }
});

app.post("/likePost", async (req, res) => {
  try {
    const data = req.body;
    console.log("likePost: ", data);

    // Chama a Cloud Function usando axios
    const response = await axios.post(
      "https://likepost-bz6uecg2pq-rj.a.run.app",
      data
    );

    // const response = {
    //   data: {
    //     payload: {
    //       postId: data.postId,
    //       userId: data.userId,
    //       like: data.like,
    //     },
    //   },
    // };

    console.log(response.data.payload);

    // Retorna a resposta da função externa ao front-end
    res.json(response.data.payload);
  } catch (error) {
    console.error("Erro ao chamar função likePost:", error.message);
    res.status(500).json({ error: "Erro ao curtir o post externamente" });
  }
});

app.post("/sendMonitorRequest", async (req, res) => {
  try {
    const data = req.body;
    console.log("sendMonitorRequest: ", data);

    const response = await axios.post(
      "https://sendmonitorrequest-bz6uecg2pq-rj.a.run.app ",
      data
    );

    console.log(response.data.payload);

    res.json(response.data.payload);
  } catch (error) {
    console.error("Erro ao chamar a função sendMonitorRequest:", error.message);
    res.status(500).json({ error: "Erro ao enviar a requisição do monitor" });
  }
});

app.get("/getMonitorRequest", async (req, res) => {
  try {
    console.log("getMonitorRequest: ", req.body);
    const response = await axios.get(
      "https://getmonitorrequests-bz6uecg2pq-rj.a.run.app "
    );
    console.log("Resposta: ", JSON.parse(response.data.payload));
    res.json(response.data.payload);
  } catch (error) {
    console.error("Erro ao chamar função getMonitorRequest:", error.message);
    res.status(500).json({ error: "Erro ao obter as requisições externamente" });
  }
});

app.post("/updateMonitorRequisition", async (req, res) => {
  try {
    const data = req.body;
    console.log("updateMonitorRequisition: ", data);

    const response = await axios.post(
      "https://updatemonitorrequisition-bz6uecg2pq-rj.a.run.app",
      data
    );
    
    console.log(response.data.payload);

    res.json(response.data.payload);
  } catch (error){
    console.error("Erro ao chamar a função updateMonitorRequisition:", error.message);
    res.status(500).json({ error: "Erro ao aprovar/reprovar a requisição" });
  }
})

app.post("/getStudentsFromDiscipline", async (req, res) => {
  try {
    const data = req.body;
    console.log('Body:', data);
    const response = await axios.post(
      "https://getstudents-bz6uecg2pq-rj.a.run.app",
      data
    );
    console.log("Resposta: ", JSON.parse(response.data.payload));
    res.json(response.data.payload);
  } catch (error) {
    console.error("Erro ao chamar função getStudentsFromDiscipline:", error.message);
    res.status(500).json({ error: "Erro ao obter as requisições externamente" });
  }
});

// app.get("/getRequisitions", async (req, res) => {
//   try {
//     const response = await axios.get(
//       "https://getrequisitions-bz6uecg2pq-rj.a.run.app"
//     );
//     console.log("Resposta: ", JSON.parse(response.data.payload));
//     res.json(response.data.payload);
//   } catch (error) {
//     console.error("Erro ao chamar função getRequisitions:", error.message);
//     res
//       .status(500)
//       .json({ error: "Erro ao obter as requisições externamente" });
//   }
// });

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
