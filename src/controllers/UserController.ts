import { Request, Response } from 'express';
import argon2 from 'argon2';
import { addMinutes, isBefore, parseISO, formatDistanceToNow } from 'date-fns';
import {
  addUser,
  getUserByEmail,
  getUserById,
  incrementProfileViews,
  allUserData,
  resetAllProfileViews,
  updateEmailAddress,
} from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';
import { sendEmail } from '../services/emailServices';

async function getAllUserProfiles(req: Request, res: Response): Promise<void> {
  res.json(await allUserData());
}

async function registerUser(req: Request, res: Response): Promise<void> {
  const { firstName, lastName, email, password } = req.body as AuthRequest;

  // Hash the password
  const passwordHash = await argon2.hash(password);

  try {
    // Store the `passwordHash` and NOT the plaintext password
    const newUser = await addUser(firstName, lastName, email, passwordHash);
    console.log(newUser);
    await sendEmail(email, 'Welcome!', `Thank you for joining my application!`);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function logIn(req: Request, res: Response): Promise<void> {
  console.log(req.session);

  const now = new Date();
  // We need to convert the date string back into a Date() object
  //        `parseISO()` does the conversion
  const logInTimeout = parseISO(req.session.logInTimeout);
  // If the client has a timeout set and it has not expired
  if (logInTimeout && isBefore(now, logInTimeout)) {
    // This will create a human friendly duration message
    const timeRemaining = formatDistanceToNow(logInTimeout);
    const message = `You have ${timeRemaining} remaining.`;
    // Reject their request
    res.status(429).send(message); // 429 Too Many Requests
    return;
  }

  const { email, password } = req.body as AuthRequest;

  const user = await getUserByEmail(email);
  if (!user) {
    res.sendStatus(404); // 404 Not Found - email doesn't exist
    return;
  }

  const { passwordHash } = user;
  if (!(await argon2.verify(passwordHash, password))) {
    // If they haven't attempted to log in yet
    if (!req.session.logInAttempts) {
      req.session.logInAttempts = 1; // Set their attempts to one
    } else {
      req.session.logInAttempts += 1; // Otherwise increment their attempts
    }

    // If the client has failed five times then we will add a 3 minute timeout
    if (req.session.logInAttempts >= 5) {
      const threeMinutesLater = addMinutes(now, 3).toISOString(); // Must convert to a string
      req.session.logInTimeout = threeMinutesLater;
      req.session.logInAttempts = 0; // Reset their attempts
    }

    res.sendStatus(404); // 404 Not Found - user with email/pass doesn't exist
    return;
  }

  // Remember to clear the session before setting their authenticated session data
  await req.session.clearSession();

  // Now we can add whatever data we want to the session
  req.session.authenticatedUser = {
    userId: user.userId,
    email: user.email,
  };
  req.session.isLoggedIn = true;

  res.sendStatus(200);
}

async function getUserProfileData(req: Request, res: Response): Promise<void> {
  const { targetUserId } = req.params as UserIdParam;

  // Get the user account
  let user = await getUserById(targetUserId);

  if (!user) {
    res.sendStatus(404); // 404 Not Found
    return;
  }

  // Now update their profile views
  user = await incrementProfileViews(user);

  res.json(user);
}

async function resetProfileViews(req: Request, res: Response): Promise<void> {
  await resetAllProfileViews();
  res.sendStatus(200);
}

async function updateUserEmail(req: Request, res: Response): Promise<void> {
  const { targetUserId } = req.params as UserIdParam;

  // Access the data from `req.session`
  const { isLoggedIn, authenticatedUser } = req.session;

  // We need to make sure that this client is logged in AND
  // they are try to modify their own user account
  if (!isLoggedIn || authenticatedUser.userId !== targetUserId) {
    res.sendStatus(403); // 403 Forbidden
    return;
  }

  const { email } = req.body as { email: string };
  // Get the user account
  const user = await getUserById(targetUserId);

  if (!user) {
    res.sendStatus(404); // 404 Not Found
    return;
  }

  // Now update their email address
  try {
    await updateEmailAddress(targetUserId, email);
  } catch (err) {
    // The email was taken so we need to send an error message
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
    return;
  }

  res.sendStatus(200);
}

export {
  registerUser,
  logIn,
  getUserProfileData,
  getAllUserProfiles,
  resetProfileViews,
  updateUserEmail,
};