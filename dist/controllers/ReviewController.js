import { getBookById } from '../models/BookModel';
import { getUserById } from '../models/UserModel';
import { addReview, getReviewById, userHasReviewForBook, getReviewsByUserId, reviewBelongsToUser, deleteReviewById, } from '../models/ReviewModel';
async function getReview(req, res) {
    const { reviewId } = req.params;
    const review = await getReviewById(reviewId);
    if (!review) {
        res.sendStatus(404);
        return;
    }
    res.status(200).json(review);
}
async function makeReview(req, res) {
    const { bookId } = req.params;
    const { authenticatedUser, isLoggedIn } = req.session;
    if (!isLoggedIn) {
        // res.sendStatus(401);
        res.redirect('/login');
        return;
    }
    const { reviewText, rating } = req.body;
    const book = await getBookById(bookId);
    const user = await getUserById(authenticatedUser.userId);
    if (!book || !user) {
        res.sendStatus(404);
        return;
    }
    const reviewExists = await userHasReviewForBook(authenticatedUser.userId, bookId);
    if (reviewExists) {
        res.sendStatus(409); // 409 Conflict
        return;
    }
    const review = await addReview(rating, reviewText, book, user);
    review.user = undefined;
    res.redirect(`/books/${bookId}`);
}
async function getUserReviews(req, res) {
    const { targetUserId } = req.params;
    const { minRatingStr, maxRatingStr } = req.query;
    const minRating = minRatingStr ? parseInt(minRatingStr, 10) : 1;
    const maxRating = maxRatingStr ? parseInt(maxRatingStr, 10) : 5;
    const reviews = await getReviewsByUserId(targetUserId, minRating, maxRating);
    res.json(reviews);
}
async function deleteUserReview(req, res) {
    const { isLoggedIn, authenticatedUser } = req.session;
    if (!isLoggedIn) {
        res.sendStatus(401); // 401 Unauthorized
        return;
    }
    const { reviewId } = req.params;
    const reviewExists = await reviewBelongsToUser(reviewId, authenticatedUser.userId);
    if (!reviewExists) {
        res.sendStatus(403); // 403 Forbidden
        return;
    }
    await deleteReviewById(reviewId);
    res.sendStatus(204); // 204 No Content
}
async function renderReviewPage(req, res) {
    const { bookId } = req.params;
    const book = await getBookById(bookId);
    res.render('reviewPage', { book });
}
export { makeReview, getReview, getUserReviews, deleteUserReview, renderReviewPage };
//# sourceMappingURL=ReviewController.js.map