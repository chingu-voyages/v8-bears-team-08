const firebase = require("@firebase/testing")
const fs = require("fs");

const projectName = "kindnest-firestore-tests"
const coverageUrl = `http://localhost:8080/emulator/v1/projects/${projectName}:ruleCoverage.html`;
const rules = fs.readFileSync("firestore.rules", "utf8")

/**
 * Creates a new app with authentication data matching the input.
 *
 * @param {object} auth the object to use for authentication (typically {uid: some-uid})
 * @return {object} the app.
 */
function authedApp(auth) {
    return firebase
      .initializeTestApp({ projectId: projectName, auth })
      .firestore();
}

beforeAll(async () => {
    await firebase.loadFirestoreRules({
        projectId: projectName,
        rules: rules
    })
})

beforeEach(async () => {
    // Clear the database between tests
    await firebase.clearFirestoreData({
        projectId: projectName
    })
})

afterAll(async () => {
    await Promise.all(firebase.apps().map(app => app.delete()))
    console.log(`View rule coverage information at ${coverageUrl}\n`)
})


/*
 *
 *  Tests
 * 
 */

test("anonymous access is not allowed", async () => {
    const db = authedApp(null)
    await firebase.assertFails(db.collection("users").get())
    await firebase.assertFails(db.collection("users").doc("alice").set({ name: "alice" }))

    const helpRequests = db.collection("helpRequests")
    await firebase.assertFails(helpRequests.get())
    await firebase.assertFails(helpRequests.doc("request1").set({ title: "need help"}))
})

test("users can only access their own profile", async () => {
    const dbBob = authedApp({ uid: "bob" })
    dbBob.collection("users").doc("bob").set({ name: "bob" })

    const db = authedApp({ uid: "alice" })
    const profile = db.collection("users").doc("alice")
    const bobsProfile = db.collection("users").doc("bob")
    await firebase.assertSucceeds(profile.get())
    await firebase.assertSucceeds(profile.set({ name: "alice"}))
    await firebase.assertFails(bobsProfile.get())
    await firebase.assertFails(bobsProfile.set({ name: "bob" }))
})

test("authenticated users can read and create help requests", async () => {
    const db = authedApp({ uid: "alice" })
    const helpRequest = db.collection("helpRequests").doc("request1")
    await firebase.assertSucceeds(helpRequest.set({ title: "need help"}))
    await firebase.assertSucceeds(helpRequest.get())
})