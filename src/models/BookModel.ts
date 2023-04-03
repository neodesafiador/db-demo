import { AppDataSource } from '../dataSource';
import { Book } from '../entities/Book';

const bookRepository = AppDataSource.getRepository(Book);

async function addBook(title: string, publicationYear: number | undefined): Promise<Book> {
  // Create the new Book object
  let newBook = new Book();
  newBook.title = title;
  newBook.publishedYear = publicationYear;

  newBook = await bookRepository.save(newBook);

  return newBook;
}

async function getBookById(bookId: string): Promise<Book | null> {
  return await bookRepository
    .createQueryBuilder('book')
    .leftJoinAndSelect('book.reviews', 'reviews')
    .where('bookId = :bookId', { bookId })
    .getOne();
}

async function getBooks(): Promise<Book[]> {
  return await bookRepository.find();
}

export { addBook, getBookById, getBooks };