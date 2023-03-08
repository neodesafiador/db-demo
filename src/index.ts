import './config';
import 'express-async-errors';
import express, { Express } from 'express';
import { registerUser, logIn, getUserProfileData } from './controllers/UserController';
// import { getAllUnverifiedUsers, getUsersByViews } from './models/UserModel';

const app: Express = express();
app.use(express.json());

const { PORT } = process.env;

// app.get('/api/users', getAllUsers);

app.post('/api/users', registerUser); // Create an account
app.post('/api/login', logIn); // Log in to an account

app.get('/api/users/:userId', getUserProfileData);

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
  // console.log(getAllUnverifiedUsers());
  // const users = getUsersByViews(250);
  // console.log(users);
});
