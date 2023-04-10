import { Request, Response } from 'express';
import { addBook, getBookById, getBooks } from '../models/BookModel';

async function insertBook(req: Request, res: Response): Promise<void> {
  const { isLoggedIn } = req.session;
  if (!isLoggedIn) {
    // res.sendStatus(401);
    res.redirect('/login');
    return;
  }
  const { title, publicationYear, inPublicDomain } = req.body as NewBookRequest;
  console.log(`inPublicDomain: ${inPublicDomain}`);
  console.log(`inPublicDomain after converting: ${!!inPublicDomain}`);


  const book = await addBook(title, publicationYear, !!inPublicDomain);
  // console.log(book);

  res.status(201).json(book);
}

async function getBook(req: Request, res: Response): Promise<void> {
  const { bookId } = req.params as { bookId: string };

  const book = await getBookById(bookId);

  if (!book) {
    res.sendStatus(404);
    return;
  }

  // res.status(200).json(book);
  res.render('bookPage', { book });
}

async function getAllBooks(req: Request, res: Response): Promise<void> {
  // Don't send back the raw data. Instead render it with EJS
  // res.status(200).json(await getBooks());

  const books = await getBooks();

  res.render('libraryPage', { books });
}

export { insertBook, getBook, getAllBooks };