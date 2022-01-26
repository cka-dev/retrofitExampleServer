import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  const requestHeader = request.get("X-FireIDToken");
  if (requestHeader != undefined) {
    functions.logger.info("Header is not null " + requestHeader.toString());
  } else {
    functions.logger.info("Header is null");
  }
  if (requestHeader != undefined) {
    admin.auth()
        .verifyIdToken(requestHeader)
        .then(function(decodedToken) {
          const uid = decodedToken.uid;
          const userEmail = decodedToken.email;
          functions.logger.info("user id is: " + uid);
          functions.logger.info("user email is: " + userEmail);
        });
  }
  response.send(JSON.stringify({token: requestHeader?.toString()}));
});

export const createDbUser = functions.https.onRequest((request, response) => {
  functions.logger.info("User record Creation", {structuredData: true});
  const requestHeader = request.get("X-FireIDToken");
  if (requestHeader != undefined) {
    functions.logger.info("Header is not null " + requestHeader.toString());
  } else {
    functions.logger.info("Header is null");
    throw new functions.https.HttpsError("unauthenticated", "Unauthorized");
  }
  if (requestHeader != undefined) {
    admin.auth()
        .verifyIdToken(requestHeader)
        .then(function(decodedToken) {
          const uid = decodedToken.uid;
          const userEmail = decodedToken.email;
          functions.logger.info("user id is: " + uid);
          functions.logger.info("user email is: " + userEmail);
          const collectionRef = admin.firestore().collection("userdb").doc(uid);
          return collectionRef.set({email: userEmail});
        });
  }
  response.send(JSON.stringify({token: requestHeader?.toString()}));
});

export const UserDelete = functions.auth.user().onDelete((user) => {
  console.log("user deletion fucntion");
  const documentRef = admin.firestore().collection("userdb").doc(user.uid);
  return documentRef.delete();
});

// export const newUserSign = functions.auth.user().onCreate((user) => {
//   console.log("user created: ", user.email, user.uid);
//   //   return admin.firestore().collection("userdb").doc(user.uid).set({
//   //     email: user.email
//   //   });
//   const collectionRef = firestore().collection("userdb").doc(user.uid);
//   return collectionRef.set({email: user.email});
// });

export const getSubs = functions.https.onRequest((request, response) => {
  const data = admin.firestore().collection("userdb").listDocuments();
  response.send(data).toString();
});

export const createNewUser = functions.https.onCall((data, context) => {
  const text = data.text;
  functions.logger.info("data: " + JSON.stringify(text));
  // functions.logger.info("context" + JSON.stringify(context));
  // const userId = context.auth?.uid;
  if (!context.auth) {
    functions.logger.info("user is NOT authenticated.");
  } else {
    functions.logger.info("user is authenticated");
  }
  //   console.log("user id is " + userId);
  //   const collectionRef = firestore().collection("userdb").doc(userId);
  //   collectionRef.set({email: data.text});
});
