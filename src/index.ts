import './config';
import 'express-async-errors';
import express, { Express } from 'express';

import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import {
  registerUser,
  logIn,
  getUserProfileData,
  getAllUserProfiles,
  resetProfileViews,
  updateUserEmail,
} from './controllers/UserController';
import {
  makeReview,
  getReview,
  getUserReviews,
  deleteUserReview,
} from './controllers/ReviewController';
import { insertBook, getAllBooks, getBook } from './controllers/BookController';

const app: Express = express();
app.set('view engine', 'ejs');
const { PORT, COOKIE_SECRET } = process.env;

const SQLiteStore = connectSqlite3(session);
const store = new SQLiteStore({ db: 'sessions.sqlite' });

app.use(express.static('public', { extensions: ['html'] }));

app.use(
  session({
    store,
    secret: COOKIE_SECRET,
    cookie: { maxAge: 8 * 60 * 60 * 1000 }, // 8 hours
    name: 'session',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/api/users', registerUser); // Create an account
app.post('/api/login', logIn); // Log in to an account
app.post('/api/users/profileViews/reset', resetProfileViews); // Log in to an account

app.get('/api/users', getAllUserProfiles);
app.get('/users/:targetUserId', getUserProfileData);
app.post('/api/users/:targetUserId/email', updateUserEmail);
app.get('/api/users/:targetUserId/reviews', getUserReviews);

// The line below is just a stub we will update it it soon
// app.get('/books/:bookId/writeReview', (req, res) => res.send('write a review')));
app.post('/api/books/:bookId/reviews', makeReview);
app.get('/api/reviews/:reviewId', getReview);
app.delete('/api/reviews/:reviewId', deleteUserReview);

app.get('/books/:bookId', getBook);
app.get('/books', getAllBooks);
app.post('/api/books', insertBook);

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});