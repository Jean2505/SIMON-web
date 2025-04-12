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
