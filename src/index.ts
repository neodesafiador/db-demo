import './config';
import 'express-async-errors';
import express, { Express } from 'express';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import { registerUser, logIn, getUserProfileData } from './controllers/UserController';
// import { getAllUnverifiedUsers, getUsersByViews } from './models/UserModel';

const app: Express = express();
const { PORT, COOKIE_SECRET } = process.env;

const SQLiteStore = connectSqlite3(session);

app.use(
  session({
    store: new SQLiteStore({ db: 'sessions.sqlite', }),
    secret: COOKIE_SECRET,
    cookie: { maxAge: 8 * 60 * 60 * 1000 }, // 8 hours 
    name: 'session',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());

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
