import argon2 from 'argon2';
import { addUser, getUserByEmail, getUserById, incrementProfileViews } from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';
async function registerUser(req, res) {
    const { email, password } = req.body;
    // IMPORTANT: Hash the password
    const passwordHash = await argon2.hash(password);
    try {
        // IMPORTANT: Store the `passwordHash` and NOT the plaintext password
        const newUser = await addUser(email, passwordHash);
        console.log(newUser);
        res.sendStatus(201);
    }
    catch (err) {
        console.error(err);
        const databaseErrorMessage = parseDatabaseError(err);
        res.status(500).json(databaseErrorMessage);
    }
}
async function logIn(req, res) {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    // Check if the user account exists for that email
    if (!user) {
        res.sendStatus(404); // 404 Not Found (403 Forbidden would also make a lot of sense here)
        return;
    }
    // The account exists so now we can check their password
    const { passwordHash } = user;
    // If the password does not match
    if (!(await argon2.verify(passwordHash, password))) {
        res.sendStatus(404); // 404 Not Found (403 Forbidden would also make a lot of sense here)
        return;
    }
    // The user has successfully logged in
    // NOTES: We will update this once we implement session management
    res.sendStatus(200); // 200 OK
}
async function getUserProfileData(req, res) {
    const { userId } = req.params;
    // Get the user account
    let user = await getUserById(userId);
    if (!user) {
        res.sendStatus(404); // 404 Not Found
        return;
    }
    // Now update their profile views
    user = await incrementProfileViews(user);
    res.json(user); // Send back the user's data
}
async function updateUserEmail(req, res) {
    // TODO: Implement me!
}
export { registerUser, logIn, getUserProfileData, updateUserEmail };
//# sourceMappingURL=UserController.js.map