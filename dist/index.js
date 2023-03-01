import './config';
import 'express-async-errors';
import express from 'express';
import { registerUser, logIn } from './controllers/UserController';
const app = express();
app.use(express.json());
const { PORT } = process.env;
app.post('/api/users', registerUser); // Create an account
app.post('/api/login', logIn); // Log in to an account
app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map