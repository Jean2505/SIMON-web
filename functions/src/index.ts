/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

const app = admin.initializeApp();
const db = app.firestore();

interface CallableResponse{
    status: string,
    message: string,
    payload: string
  }

interface Course {
    name: string;
    professor: string;
    term: string;
    id: number;
    school: string;
    course: string;
    monitors: number;
}

// export const helloWorld = onRequest((req, res) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const getCourses = onRequest({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.body)

    let courses: Course[] = [];
    try {
        (await db.collection("Courses").get()).forEach((doc) => {
            if(doc.data().course == req.body.course){
                courses.push(doc.data() as Course);
            }
        });
        result = {
            status: "OK",
            message: "Courses retrieved successfully",
            payload: JSON.stringify(courses)
        };
        res.status(200).send(result);
    } catch (error) {
        logger.error(error)
        result = {
            status: "ERROR",
            message: "Error retrieving courses",
            payload: (error as Error).message
        };
        res.status(500).send(result);
    }
});

export const createMonitor = onRequest({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;

    try {
        await db.collection("Monitores").add(req.body);

        result = {
            status: "OK",
            message: "Monitor created successfully",
            payload: "Monitor created successfully"
        };
        res.status(200).send(result);
    } catch (error) {
        logger.error(error)
        result = {
            status: "ERROR",
            message: "Error creating monitor",
            payload: (error as Error).message
        };
        res.status(500).send(result);
    }

});

export const createCourses = onRequest({region: "southamerica-east1"}, (req, res) => {
    let result: CallableResponse;
    
    logger.debug(req.body)

    try {
        req.body.courses.forEach(async (course: any) => {
            logger.debug(course)
            let coursefb: Course = {
                name: course.nome_Disciplina,
                professor: course.professor_Disciplina,
                term: course.periodo_Disciplina,
                id: course.id_Disciplina,
                school: course.escola_Disciplina,
                course: course.curso_Disciplina,
                monitors: 0
            }
            await db.collection("Courses").add(coursefb);
        })
        result = {
            status: "OK",
            message: "Courses created successfully",
            payload: "Courses created successfully"
        };
        res.status(200).send(result);
    } catch (error) {
        logger.error(error)
        result = {
            status: "ERROR",
            message: "Error creating courses",
            payload: (error as Error).message
        };
        res.status(500).send(result);
    }
});

export const updateCourse = onRequest({region: "southamerica-east1" }, async (req, res) => {
    const snapshot = await db.collection("Courses").where("id", "==", req.body.id).get();

    if (snapshot.empty) {
        logger.debug("No matching documents.");
        res.status(404).send("No matching documents.");
        return;
    }

    await db.collection("Courses").doc(snapshot.docs[0].id).set({monitors: req.body.qtdMonitors}, {merge: true});

    // await db.collection("Courses").doc(snapshot.docs[0].id).update({
    //     ["monitors"]: req.body.qtdMonitors
    //   });

    res.status(200).send('Documento atualizado com sucesso!');
});

export const findUser = onRequest({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;

    const snapshot = await db.collection("Alunos").where("uid", "==", req.body.uid).get();

    if (snapshot.empty) {
        logger.debug("No matching documents.");
        result = {
            status: "ERROR",
            message: "No matching documents.",
            payload: "No matching documents."
        };
        res.status(404).send(result);
        return;
    }

    result = {
        status: "OK",
        message: "User found",
        payload: JSON.stringify(snapshot.docs[0].data())
    };
    res.status(200).send(result);
});

export const findMonitor = onRequest({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;

    const snapshot = await db.collection("Monitores").where("uid", "==", req.body.uid).get();

    if (snapshot.empty) {
        logger.debug("No matching documents.");
        result = {
            status: "ERROR",
            message: "No matching documents.",
            payload: "No matching documents."
        };
        res.status(404).send(result);
        return;
    }

    result = {
        status: "OK",
        message: "Monitor found",
        payload: JSON.stringify(snapshot.docs[0].data())
    };
    res.status(200).send(result);
});

export const getCourseMonitors = onRequest({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;

    const snapshot = await db.collection("Monitores").where("disciplinaId", "==", req.body.courseId).get();

    if (snapshot.empty) {
        logger.debug("No matching documents.");
        result = {
            status: "ERROR",
            message: "No matching documents.",
            payload: "No matching documents."
        };
        res.status(404).send(result);
        return;
    }

    result = {
        status: "OK",
        message: "Monitors found",
        payload: JSON.stringify(snapshot.docs.map((doc) => doc.data()))
    };
    res.status(200).send(result);
});

export const helloWorld = onRequest({region: "southamerica-east1"}, (req, res) => {
    logger.info("Hello logs!", {structuredData: true});
    res.send("Hello from Firebase!");
});

export const createMuralPost = onRequest({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.body)

    try {
        await db.collection("MuralPosts").add(req.body);

        result = {
            status: "OK",
            message: "Post created successfully",
            payload: "Post created successfully"
        };
        res.status(200).send(result);
    } catch (error) {
        logger.error(error)
        result = {
            status: "ERROR",
            message: "Error creating post",
            payload: (error as Error).message
        };
        res.status(500).send(result);
    }

});

export const getMuralPosts = onRequest({region: "southamerica-east1"}, async (req, res) => {

    let result: CallableResponse;
    logger.debug(req.body)

    const snapshot = await db.collection("MuralPosts").where("disciplinaId", "==", req.body.disciplinaId).get();

    if (snapshot.empty) {
        logger.debug("No matching documents.");
        result = {
            status: "ERROR",
            message: "No matching documents.",
            payload: "No matching documents."
        };
        res.status(404).send(result);
        return;
    }

    result = {
        status: "OK",
        message: "Posts found",
        payload: JSON.stringify(snapshot.docs.map((doc) => doc.data()))
    };
    res.status(200).send(result);
});

export const createStudent = onRequest({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.body)

    try {
        await db.collection("Alunos").add(req.body);

        result = {
            status: "OK",
            message: "Student created successfully",
            payload: "Student created successfully"
        };
        res.status(200).send(result);
    } catch (error) {
        logger.error(error)
        result = {
            status: "ERROR",
            message: "Error creating student",
            payload: (error as Error).message
        };
        res.status(500).send(result);
    }

});