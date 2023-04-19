import { AppDataSource } from '../dataSource';
import { Book } from '../entities/Book';
const bookRepository = AppDataSource.getRepository(Book);
async function addBook(title, publicationYear, inPublicDomain) {
    // Create the new Book object
    let newBook = new Book();
    newBook.title = title;
    newBook.publicationYear = publicationYear;
    newBook.inPublicDomain = inPublicDomain;
    newBook = await bookRepository.save(newBook);
    return newBook;
}
async function getBookById(bookId) {
    return await bookRepository
        .createQueryBuilder('book')
        .leftJoinAndSelect('book.reviews', 'reviews')
        .leftJoinAndSelect('reviews.user', 'user')
        .select(['book', 'reviews', 'user.userId', 'user.email'])
        .where('bookId = :bookId', { bookId })
        .getOne();
}
async function getBooks() {
    return await bookRepository.find();
}
export { addBook, getBookById, getBooks };
//# sourceMappingURL=BookModel.js.map