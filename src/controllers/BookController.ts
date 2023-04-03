import { Request, Response } from 'express';
import { addBook, getBookById, getBooks } from '../models/BookModel';

async function insertBook(req: Request, res: Response): Promise<void> {
  const { isLoggedIn } = req.session;
  if (!isLoggedIn) {
    res.sendStatus(401);
    return;
  }
  const { title, publicationYear } = req.body as NewBookRequest;

  const book = await addBook(title, publicationYear);
  console.log(book);

  res.status(201).json(book);
}

async function getBook(req: Request, res: Response): Promise<void> {
  const { bookId } = req.params as { bookId: string };

  const book = await getBookById(bookId);

  if (!book) {
    res.sendStatus(404);
    return;
  }

  console.log(book);

  res.status(200).json(book);
}

async function getAllBooks(req: Request, res: Response): Promise<void> {
  res.status(200).json(await getBooks());
}

export { insertBook, getBook, getAllBooks };