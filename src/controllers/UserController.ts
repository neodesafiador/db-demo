import { Request, Response } from 'express';
import argon2 from 'argon2';
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
import { sendEmail } from '../services/emailService';

async function getAllUserProfiles(req: Request, res: Response): Promise<void> {
  res.json(await allUserData());
}

async function registerUser(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as AuthRequest;

  // IMPORTANT: Hash the password
  const passwordHash = await argon2.hash(password);

  try {
    // IMPORTANT: Store the `passwordHash` and NOT the plaintext password
    const newUser = await addUser(email, passwordHash);
    console.log(newUser);

    await sendEmail(email, 'Welcome!', `Thank you for joining my application!`);
    // res.sendStatus(201);
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.status(500).json(databaseErrorMessage);
  }
}

async function logIn(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as AuthRequest;

  const user = await getUserByEmail(email);
  if (!user) {
    // res.sendStatus(404); // 404 Not Found - email doesn't exist
    res.redirect('/login');
    return;
  }

  const { passwordHash } = user;
  if (!(await argon2.verify(passwordHash, password))) {
    // res.sendStatus(404); // 404 Not Found - user with email/pass doesn't exist
    res.redirect('/login');
    return;
  }

  // NOTES: Remember to clear the session before setting their authenticated session data
  await req.session.clearSession();

  // NOTES: Now we can add whatever data we want to the session
  req.session.authenticatedUser = {
    userId: user.userId,
    email: user.email,
  };
  req.session.isLoggedIn = true;

  // res.sendStatus(200);
  // res.redirect("/welcome");
  // res.render('profilePage', { email: user.email });
  res.redirect(`/users/${user.userId}`);
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

  // res.json(user);
  res.render('profilePage', { email: user.email, profileViews: user.profileViews });
}

async function resetProfileViews(req: Request, res: Response): Promise<void> {
  await resetAllProfileViews();
  res.sendStatus(200);
}

async function updateUserEmail(req: Request, res: Response): Promise<void> {
  const { targetUserId } = req.params as UserIdParam;

  // NOTES: Access the data from `req.session`
  const { isLoggedIn, authenticatedUser } = req.session;

  // NOTES: We need to make sure that this client is logged in AND
  //        they are try to modify their own user account
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