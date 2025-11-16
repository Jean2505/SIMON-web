/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onCall, onRequest} from "firebase-functions/v2/https";
import {onDocumentCreated, onDocumentUpdated} from "firebase-functions/v2/firestore";
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
    currentMonitors: number;
}

// export const helloWorld = onRequest((req, res) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const getCourses = onRequest({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.body)

    if (req.body.term != undefined) {
        const snapshot = await db.collection("Courses").where("course", "==", req.body.course)
        .where("term", "==", req.body.term).get();

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
            message: "Courses retrieved successfully",
            payload: JSON.stringify(snapshot.docs.map((doc) => doc.data()))
        };
        res.status(200).send(result);
        return;
    }

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

export const getCoursesMobile = onCall({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.data)

    if (req.data.term != undefined) {
        const snapshot = await db.collection("Courses").where("course", "==", req.data.course)
        .where("term", "==", req.data.term).get();

        if (snapshot.empty) {
            logger.debug("No matching documents.");
            result = {
                status: "ERROR",
                message: "No matching documents.",
                payload: "No matching documents."
            };
            return result;
        }
        result = {
            status: "OK",
            message: "Courses retrieved successfully",
            payload: JSON.stringify(snapshot.docs.map((doc) => doc.data()))
        };
        return result;
    }

    let courses: Course[] = [];
    try {
        (await db.collection("Courses").get()).forEach((doc) => {
            if(doc.data().course == req.data.course){
                courses.push(doc.data() as Course);
            }
        });
        result = {
            status: "OK",
            message: "Courses retrieved successfully",
            payload: JSON.stringify(courses)
        };
        return result;
    } catch (error) {
        logger.error(error)
        result = {
            status: "ERROR",
            message: "Error retrieving courses",
            payload: (error as Error).message
        };
        return result;
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
                monitors: 0,
                currentMonitors: 0
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

export const approveMonitor = onRequest({region: "southamerica-east1" }, async (req, res) => {
    let result: CallableResponse;
    const snapshot = await db.collection("Courses").where("id", "==", req.body.id).get();

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

    await db.collection("Courses").doc(snapshot.docs[0].id).set({currentMonitors: snapshot.docs[0].data().currentMonitors + 1}, {merge: true});

    // await db.collection("Courses").doc(snapshot.docs[0].id).update({
    //     ["monitors"]: req.body.qtdMonitors
    //   });
    result = {
        status: "OK",
        message: "Monitor approved",
        payload: "Monitor approved"
    };
    res.status(200).send(result);
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

export const findUserMobile = onCall({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;

    const snapshot = await db.collection("Alunos").where("uid", "==", req.data.uid).get();

    if (snapshot.empty) {
        logger.debug("No matching documents.");
        result = {
            status: "ERROR",
            message: "No matching documents.",
            payload: "No matching documents."
        };
        return result;
    }

    result = {
        status: "OK",
        message: "User found",
        payload: JSON.stringify(snapshot.docs[0].data())
    };
    return result;
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

export const getCourseMonitorsMobile = onCall({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;

    const snapshot = await db.collection("Monitores").where("disciplinaId", "==", req.data.courseId).get();

    if (snapshot.empty) {
        logger.debug("No matching documents.");
        result = {
            status: "ERROR",
            message: "No matching documents.",
            payload: "No matching documents."
        };
        return result;
    }

    result = {
        status: "OK",
        message: "Monitors found",
        payload: JSON.stringify(snapshot.docs.map((doc) => doc.data()))
    };
    return result;
});

export const helloWorld = onRequest({region: "southamerica-east1"}, (req, res) => {
    logger.info("Hello logs!", {structuredData: true});
    res.send("Hello from Firebase!");
});

export const teste = onCall({region: "southamerica-east1"}, (req,res) => {
    logger.info("Hello logs!", {structuredData: true});
    return "Hello from Firebase!";
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

export const getMuralPostsMobile = onCall({region: "southamerica-east1"}, async (req, res) => {

    let result: CallableResponse;
    logger.debug(req.data)

    const snapshot = await db.collection("MuralPosts").where("disciplinaId", "==", req.data.disciplinaId).get();

    if (snapshot.empty) {
        logger.debug("No matching documents.");
        result = {
            status: "ERROR",
            message: "No matching documents.",
            payload: "No matching documents."
        };
        return result;
    }

    result = {
        status: "OK",
        message: "Posts found",
        payload: JSON.stringify(snapshot.docs.map((doc) => doc.data()))
    };
    return result;
});

export const deleteMuralPost = onRequest({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;

    const snapshot = await db.collection("MuralPosts").where("content", "==", req.body.content).get();

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

    snapshot.docs[0].ref.delete().then(() => {
        result = {
            status: "OK",
            message: "Post deleted successfully",
            payload: "Post deleted successfully"
        };
        res.status(200).send(result);
    });
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

export const getMonitorRequests = onRequest({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    const snapshot = await db.collection("MonitorRequisitions").where("status", "==", 2).get();

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
        message: "Requisitions found",
        payload: JSON.stringify(snapshot.docs.map((doc) => doc.data()))
    };
    res.status(200).send(result);
});

export const getRequisitions = onRequest({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    const snapshot = await db.collection("Monitores").where("aprovacao", "==", 0).get();

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
        message: "Requisitions found",
        payload: JSON.stringify(snapshot.docs.map((doc) => doc.data()))
    };
    res.status(200).send(result);
});

export const updateRequisition = onRequest({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.body)

    try {
        const snapshot = await db.collection("Monitores").where("uid", "==", req.body.uid)
        .where("disciplinaId", "==", req.body.disciplinaId)
        .get();

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
        
        await db.collection("Monitores").doc(snapshot.docs[0].id).set({aprovacao: req.body.aprovacao}, {merge: true});

        result = {
            status: "OK",
            message: "Requisition updated successfully",
            payload: "Requisition updated successfully"
        };
        res.status(200).send(result);
    } catch (error) {
        logger.error(error)
        result = {
            status: "ERROR",
            message: "Error approving requisition",
            payload: (error as Error).message
        };
        res.status(500).send(result);
    }
});

export const getMonitorCourses = onRequest({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.body)

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
        message: "Courses found",
        payload: JSON.stringify(snapshot.docs.map((doc) => doc.data()))
    };
    res.status(200).send(result);
});

export const getMonitorCoursesMobile = onCall({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.data)

    const snapshot = await db.collection("Monitores").where("uid", "==", req.data.uid)
    .where("aprovacao", "==", 1).get();

    if (snapshot.empty) {
        logger.debug("No matching documents.");
        result = {
            status: "ERROR",
            message: "No matching documents.",
            payload: "No matching documents."
        };
        return result;
    }

    result = {
        status: "OK",
        message: "Courses found",
        payload: JSON.stringify(snapshot.docs.map((doc) => doc.data()))
    };
    return result;
});

export const getCourseList = onRequest({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.body);

    const snapshot = await db.collection("Courses").where("id", "in", req.body.courses).get();
    logger.debug(snapshot.docs);

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
        message: "Courses found",
        payload: JSON.stringify(snapshot.docs.map((doc) => doc.data()))
    };
    res.status(200).send(result);
});

export const getProfessor = onRequest({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.body)

    const snapshot = await db.collection("Professores").where("uid", "==", req.body.uid).get();

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
        message: "Professor found",
        payload: JSON.stringify(snapshot.docs[0].data())
    };
    res.status(200).send(result);
});

export const getForumPosts = onRequest({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.body)

    const snapshot = await db.collection("ForumPosts").where("courseId", "==", req.body.courseId).get();

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
        payload: JSON.stringify(snapshot.docs.map((doc) => {
            return {
                docId: doc.id,
                data: doc.data()
            }
        }))
    };
    res.status(200).send(result);
});

export const getForumPostsMobile = onCall({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.data)

    const snapshot = await db.collection("ForumPosts").where("courseId", "==", req.data.courseId).get();

    if (snapshot.empty) {
        logger.debug("No matching documents.");
        result = {
            status: "ERROR",
            message: "No matching documents.",
            payload: "No matching documents."
        };
        return result;
    }

    result = {
        status: "OK",
        message: "Posts found",
        payload: JSON.stringify(snapshot.docs.map((doc) => {
            return {
                docId: doc.id,
                data: doc.data()
            }
        }))
    };
    return result;
});

export const createForumPost = onRequest({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.body)

    try {
        await db.collection("ForumPosts").add(req.body);

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

export const createForumPostMobile = onCall({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.data)

    req.data.comments = [];

    try {
        await db.collection("ForumPosts").add(req.data);

        result = {
            status: "OK",
            message: "Post created successfully",
            payload: "Post created successfully"
        };
        return result
    } catch (error) {
        logger.error(error)
        result = {
            status: "ERROR",
            message: "Error creating post",
            payload: (error as Error).message
        };
        return result
    }

});

export const createComment = onRequest({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.body)

    try {
        await db.collection("Comments").add(req.body);

        result = {
            status: "OK",
            message: "Comment created successfully",
            payload: "Comment created successfully"
        };
        res.status(200).send(result);
    } catch (error) {
        logger.error(error)
        result = {
            status: "ERROR",
            message: "Error creating comment",
            payload: (error as Error).message
        };
        res.status(500).send(result);
    }

});

export const createCommentMobile = onCall({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.data)

    try {
        await db.collection("Comments").add(req.data);

        result = {
            status: "OK",
            message: "Comment created successfully",
            payload: "Comment created successfully"
        };
        return result
    } catch (error) {
        logger.error(error)
        result = {
            status: "ERROR",
            message: "Error creating comment",
            payload: (error as Error).message
        };
        return result
    }

});

export const addComment = onDocumentCreated({document: "Comments/{commentId}", region: "southamerica-east1"}, async (event) => {
    const docId = event.params.commentId;
    const postId = event.data?.data().postId;
    const snapshot = await db.collection("ForumPosts").doc(postId).get();

    const comments = snapshot.data()?.comments;

    comments.push(docId);
    await db.collection("ForumPosts").doc(postId).set({comments: comments}, {merge: true});
});

export const getComments = onRequest({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.body)
    const snapshot = await db.collection("ForumPosts").doc(req.body.postId).get();

    if (!snapshot.exists) {
        logger.debug("No matching documents.");
        result = {
            status: "ERROR",
            message: "Post has no comments.",
            payload: "Post has no comments."
        };
        res.status(404).send(result);
        return;
    }

    const data = snapshot.data();

    const ids: admin.firestore.DocumentReference<admin.firestore.DocumentData, admin.firestore.DocumentData>[] = [];
    if (data?.comments.length != 0) {
        data?.comments.forEach((docId: string) => {
            ids.push(db.collection("Comments").doc(docId));
    });
        await db.getAll(...ids).then((comments) => {
            logger.debug(comments);
            logger.debug(comments.length);

            const documents: any[] = [];
            comments.forEach((doc) => {
                if (doc.exists) {
                    documents.push(doc.data())
                }
            });
            
            logger.debug(documents);    
        
            result = {
                status: "OK",
                message: "Comments found",
                payload: JSON.stringify(documents)
            };
            res.status(200).send(result);
            return;
        });
        // logger.debug(comments);
        // logger.debug(comments.length);

        // const documents: any[] = [];
        // comments.forEach((doc) => {
        //     if (doc.exists) {
        //         documents.push(doc.data())
        //     }
        // logger.debug(documents);    
        
        // result = {
        //     status: "OK",
        //     message: "Comments found",
        //     payload: JSON.stringify(documents)
        // };
        // res.status(200).send(result);
        // return;
    // });
    }
    result = {
            status: "OK",
            message: "Post has no comments.",
            payload: JSON.stringify([])
        };
    res.status(200).send(result);
});

export const getCommentsMobile = onCall({region: "southamerica-east1"}, async (req, res) => {
    logger.debug(req.data);
    const postId = req.data.postId;

    if (!postId) {
        logger.error("Missing postId in request data.");
        return {
            status: "ERROR",
            message: "Missing postId.",
            payload: null
        };
    }

    const snapshot = await db.collection("ForumPosts").doc(postId).get();

    if (!snapshot.exists) {
        logger.debug(`No matching document.`);
        return {
            status: "ERROR",
            message: "Post not found.",
            payload: null
        };
    }

    const data = snapshot.data();
    const commentIds: string[] = data?.comments || []; // Garante que comments é um array, mesmo que undefined

    if (commentIds.length === 0) {
        logger.debug(`Post ${postId} has no comments.`);
        return {
            status: "OK",
            message: "Post has no comments.",
            payload: JSON.stringify([])
        };
    }

    const commentRefs = commentIds.map((docId: string) => db.collection("Comments").doc(docId));

    try {
        const commentSnapshots = await db.getAll(...commentRefs); // Agora captura o resultado diretamente

        const documents: any[] = [];
        commentSnapshots.forEach((doc) => {
            if (doc.exists) {
                documents.push(doc.data());
            }
        });

        logger.debug(`Found ${documents.length} comments for post ${postId}.`);
        logger.debug(documents);

        return {
            status: "OK",
            message: "Comments found",
            payload: JSON.stringify(documents)
        };
    } catch (error) {
        logger.error(`Error fetching comments for post ${postId}:`, error);
        return {
            status: "ERROR",
            message: "Failed to retrieve comments.",
            payload: null
        };
    }
});


export const likePost = onRequest({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.body);

    const snapshot = await db.collection("ForumPosts").doc(req.body.postId).get();

    if (!snapshot.exists) {
        logger.debug("No matching documents.");
        result = {
            status: "ERROR",
            message: "Post doen't exist.",
            payload: "Post doesn't exist."
        };
        res.status(404).send(result);
        return;
    }

    const data = snapshot.data();
    
    let like = 0;
    if (req.body.like) {
        like = data?.likes + 1;
    } else {
        like = data?.likes - 1;
    }
    await db.collection("ForumPosts").doc(req.body.postId).set({likes: like}, {merge: true});

    result = {
        status: "OK",
        message: "Post liked",
        payload: "Post liked"
    };
    res.status(200).send(result);
});

export const updateMonitor = onRequest({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.body)

    const snapshot = await db.collection("Monitores").where("uid", "==", req.body.uid).get();

    logger.debug(snapshot.docs);
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

    snapshot.docs.forEach(async (doc) => {
        if (doc.data().disciplinaId == req.body.disciplinaId) {
            // await db.collection("Monitores").doc(doc.id).set(req.body.update, {merge: true});
            await db.collection("Monitores").doc(doc.id).update(req.body.updates).then(() => {
                logger.debug("Monitor updated successfully");
                result = {
                    status: "OK",
                    message: "Monitor updated successfully",
                    payload: "Monitor updated successfully"
                };
                res.status(200).send(result);
                return;
            });
        }
    });
});

export const updateUser = onRequest({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.body)

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

    let docId = snapshot.docs[0].id;

    await db.collection("Alunos").doc(docId).update(req.body.updates).then(() => {
        result = {
        status: "OK",
        message: "User updated successfully",
        payload: "User updated successfully"
    };
    res.status(200).send(result);
    });
});

export const getSchoolCourses = onRequest({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.body)

    const snapshot = await db.collection("Majors").where("school", "==", req.body.school).get();

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
        message: "Courses found",
        payload: JSON.stringify(snapshot.docs.map((doc) => doc.data()))
    };
    res.status(200).send(result);
});

export const sendMonitorRequest = onRequest({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.body)

    try {
        await db.collection("MonitorRequisitions").add(req.body);

        result = {
            status: "OK",
            message: "Monitor request sent successfully",
            payload: "Monitor request sent successfully"
        };
        res.status(200).send(result);
    } catch (error) {
        logger.error(error)
        result = {
            status: "ERROR",
            message: "Error sending monitor request",
            payload: (error as Error).message
        };
        res.status(500).send(result);
    }
});

export const updateMonitorRequisition = onRequest({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.body)

    const snapshot = await db.collection("MonitorRequisitions").where("id", "==", req.body.disciplinaId)
    .where("status", "==", 2).get();

    logger.debug(snapshot.docs);
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

    await db.collection("MonitorRequisitions").doc(snapshot.docs[0].id).set({status: req.body.aprovacao}, {merge: true});

    if(req.body.aprovacao == 1){
        const snapshotCourses = await db.collection("Courses").where("id", "==", req.body.disciplinaId).get();

        logger.debug(snapshot.docs);
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

        await db.collection("Courses").doc(snapshotCourses.docs[0].id).set({monitors: req.body.requestQuantity}, {merge: true});
    }

    result = {
        status: "OK",
        message: "Requisition updated successfully",
        payload: "Requisition updated successfully"
    };
    res.status(200).send(result);
});

export const getStudents = onRequest({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.body)
    const snapshot = await db.collection("Alunos").where("curso", "==", req.body.course)
    .where("periodo", ">", req.body.term).get();

    if (snapshot.empty) {
        logger.debug("No matching documents.");
        result = {
            status: "ERROR",
            message: "No matching students.",
            payload: "No matching students."
        };
        res.status(404).send(result);
        return;
    }

    result = {
        status: "OK",
        message: "Students found",
        payload: JSON.stringify(snapshot.docs.map((doc) => doc.data()))
    };
    res.status(200).send(result);
});

export const sendMonitorRecommendation = onRequest({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.body)

    try {
        await db.collection("MonitorRecommendations").add(req.body);

        result = {
            status: "OK",
            message: "Monitor recommendation sent successfully",
            payload: "Monitor recommendation sent successfully"
        };
        res.status(200).send(result);
    } catch (error) {
        logger.error(error)
        result = {
            status: "ERROR",
            message: "Error sending monitor recommendation",
            payload: (error as Error).message
        };
        res.status(500).send(result);
    }
});

export const getMonitorRecommendations = onRequest({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.body)
    const snapshot = await db.collection("MonitorRecommendations").where("studentUid", "==", req.body.studentUid).get();

    if (snapshot.empty) {
        logger.debug("No matching documents.");
        result = {
            status: "ERROR",
            message: "No matching recommendations.",
            payload: "No matching recommendations."
        };
        res.status(404).send(result);
        return
    }
    result = {
        status: "OK",
        message: "Recommendations found",
        payload: JSON.stringify(snapshot.docs.map((doc) => doc.data()))
    };
    res.status(200).send(result);
});

export const sendCourseTopics = onRequest({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.body)

    const snapshot = await db.collection("Courses").where("id", "==", req.body.id).get();

    if (snapshot.empty) {
        logger.debug("No matching documents.");
        result = {
            status: "ERROR",
            message: "No matching documents.",
            payload: "No matching documents."
        };
        res.status(404).send("No matching documents.");
        return;
    }

    
    try {
        await db.collection("Courses").doc(snapshot.docs[0].id).set({topics: req.body.topics}, {merge: true});

        result = {
            status: "OK",
            message: "Topics sent successfully",
            payload: "Topics sent successfully"
        };
        res.status(200).send(result);
    } catch (error) {
        logger.error(error)
        result = {
            status: "ERROR",
            message: "Error sending topics",
            payload: (error as Error).message
        };
        res.status(500).send(result);
    }
});

export const getCourseTopics = onRequest({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.body)
    const snapshot = await db.collection("Courses").where("id", "==", req.body.id).get();

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

    let topics = snapshot.docs[0].data().topics;
    if (topics == undefined) {
        topics = [];
    }

    result = {
        status: "OK",
        message: "Topics found",
        payload: JSON.stringify(topics)
    };
    res.status(200).send(result);
});

export const updateStatus = onRequest({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.body)

    const snapshot = await db.collection("Monitores").where("uid", "==", req.body.uid)
    .where("disciplinaId", "==", req.body.disciplinaId).get();

    if (!snapshot.empty) {
        if (snapshot.docs[0].data().status == true) {
            await db.collection("Monitores").doc(snapshot.docs[0].id).set({status: false}, {merge: true});
        } else {
            await db.collection("Monitores").doc(snapshot.docs[0].id).set({status: true}, {merge: true});
        }
        result = {
            status: "OK",
            message: "Status updated successfully",
            payload: "Status updated successfully"
        };
        res.status(200).send(result);
        return;
    }
    result = {
        status: "ERROR",
        message: "No matching documents.",
        payload: "No matching documents."
    };
    res.status(404).send(result);
});

export const updateStatusMobile = onCall({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.data)

    const snapshot = await db.collection("Monitores").where("uid", "==", req.data.uid)
    .where("disciplinaId", "==", req.data.disciplinaId).get();

    if (!snapshot.empty) {
        if (snapshot.docs[0].data().status == true) {
            await db.collection("Monitores").doc(snapshot.docs[0].id).set({status: false}, {merge: true});
        } else {
            await db.collection("Monitores").doc(snapshot.docs[0].id).set({status: true}, {merge: true});
        }
        result = {
            status: "OK",
            message: "Status updated successfully",
            payload: "Status updated successfully"
        };
        return result;
    }
    result = {
        status: "ERROR",
        message: "No matching documents.",
        payload: "No matching documents."
    };
    return result;
});

export const sendReport = onRequest({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.body)

    try {
        await db.collection("Reports").add(req.body);

        result = {
            status: "OK",
            message: "Report created successfully",
            payload: "Report created successfully"
        };
        res.status(200).send(result);
    } catch (error) {
        logger.error(error)
        result = {
            status: "ERROR",
            message: "Error creating report",
            payload: (error as Error).message
        };
        res.status(500).send(result);
    }
});

export const getReports = onRequest({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.body)

    const snapshot = await db.collection("Reports").where("courseId", "==", req.body.courseId).get();

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
        message: "Reports found",
        payload: JSON.stringify(snapshot.docs.map((doc) => doc.data()))
    };
    res.status(200).send(result);
});

export const updateMonitorMobile = onCall({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.data)

    const snapshot = await db.collection("Monitores").where("uid", "==", req.data.uid).get();

    logger.debug(snapshot.docs);
    if (snapshot.empty) {
        logger.debug("No matching documents.");
        result = {
            status: "ERROR",
            message: "No matching documents.",
            payload: "No matching documents."
        };
        return result;
    }

    if (req.data.updates.foto) {
        logger.debug("Updating Monitor's profile picture")
        const snap = await db.collection("Alunos").where("uid", "==", req.data.uid).get();
        await db.collection("Alunos").doc(snap.docs[0].id).update(req.data.updates)
    }

    snapshot.docs.forEach(async (doc) => {
            // await db.collection("Monitores").doc(doc.id).set(req.body.update, {merge: true});
        await db.collection("Monitores").doc(doc.id).update(req.data.updates).then(() => {
            logger.debug("Monitor updated successfully");
            result = {
                status: "OK",
                message: "Monitor updated successfully",
                payload: "Monitor updated successfully"
            };
            return result;
            });
    });

    return {
        status: "ERROR",
        message: "Error updating",
        payload: ""
    }
});

export const updateMonitorScheduleMobile = onCall({region: "southamerica-east1"}, async (req, res) => {
    let result: CallableResponse;
    logger.debug(req.data)

    const snapshot = await db.collection("Monitores").where("uid", "==", req.data.uid).get();

    logger.debug(snapshot.docs);
    if (snapshot.empty) {
        logger.debug("No matching documents.");
        result = {
            status: "ERROR",
            message: "No matching documents.",
            payload: "No matching documents."
        };
        return result;
    }
    
   
    const schedule = JSON.parse(req.data.schedule.horarioDisponivel)
    const update = {
        horarioDisponivel: schedule
    }
    snapshot.docs.forEach(async (doc) => {
        if (doc.data().disciplinaId == req.data.disciplinaId) {
            await db.collection("Monitores").doc(doc.id).update(update).then(() => {
                logger.debug("Monitor updated successfully");
                result = {
                    status: "OK",
                    message: "Monitor updated successfully",
                    payload: "Monitor updated successfully"
                };
                return result;
            });
        }
    });

    return {
        status: "ERROR",
        message: "Error updating",
        payload: ""
    }
});

export const trackMonitorStatus = onDocumentUpdated({document: 'Monitores/{monitorId}',region: "southamerica-east1"},
  async (event) => {
    const newData = event.data!.after.data();
    const oldData = event.data!.before.data();
    const monitorId = event.params.monitorId;

    // We only care if the 'status' field has actually changed.
    if (newData.status === oldData.status) {
      console.log(`Status for monitor ${monitorId} did not change. Exiting.`);
      return null;
    }

    const firestore = admin.firestore();
    const docRef = firestore.collection('Monitores').doc(monitorId);

    // If status changes to true, record the start time
    if (newData.status === true) {
      console.log(`Monitor ${monitorId} status changed to TRUE. Setting startAtendimento.`);
      return docRef.update({
        startAtendimento: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    // If status changes to false, calculate the duration
    else if (newData.status === false) {
      console.log(`Monitor ${monitorId} status changed to FALSE. Calculating session duration and accumulating hours.`);

      // We need the startAtendimento from *before* this status change (when it was true)
      const startAtendimento = oldData.startAtendimento as admin.firestore.Timestamp | undefined;

      if (!startAtendimento) {
        console.warn(`Monitor ${monitorId} status changed to FALSE, but 'startAtendimento' was not found in previous state. Cannot calculate duration.`);
        return null; // Cannot calculate duration without a start time
      }

      const currentTime = admin.firestore.Timestamp.now();
      const startTimeMillis = startAtendimento.toMillis();
      const endTimeMillis = currentTime.toMillis();

      // Calculate duration in milliseconds
      const durationMillis = endTimeMillis - startTimeMillis;
      // Convert duration to hours (1 hour = 3,600,000 milliseconds)
      const sessionDurationHours = durationMillis / (1000 * 60 * 60);

      // Get the current accumulated quantHoras (if it exists)
      const currentAccumulatedHours = (oldData.quantHoras as number) || 0;

      // Add the new session's duration to the accumulated total
      const newAccumulatedHours = currentAccumulatedHours + sessionDurationHours;

      // Update quantHoras with the new accumulated total
      return docRef.update({
        quantHoras: newAccumulatedHours,
      });
    }

    return null; // Should not reach here unless status changes to something else
  });
