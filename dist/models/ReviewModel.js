import { AppDataSource } from '../dataSource';
import { Review } from '../entities/Review';
const reviewRepository = AppDataSource.getRepository(Review);
async function addReview(rating, reviewText, forBook, byUser) {
    // Create the new Review object
    let newReview = new Review();
    newReview.rating = rating;
    newReview.reviewText = reviewText;
    newReview.book = forBook;
    newReview.user = byUser;
    newReview = await reviewRepository.save(newReview);
    return newReview;
}
async function getReviewById(reviewId) {
    return await reviewRepository
        .createQueryBuilder('review')
        .where({ where: { reviewId } })
        .leftJoin('review.user', 'user')
        .select([
        'review.reviewId',
        'review.rating',
        'review.numHits',
        'review.lastAccessedOn',
        'user.isPro',
        'user.userId',
        'user.username',
        'user.isAdmin',
    ])
        .getOne();
}
async function userHasReviewForBook(userId, bookId) {
    const reviewExists = await reviewRepository
        .createQueryBuilder('review')
        .leftJoinAndSelect('review.user', 'user')
        .leftJoinAndSelect('review.book', 'book')
        .where('user.userId = :userId', { userId })
        .andWhere('book.bookId = :bookId', { bookId })
        .getExists();
    return reviewExists;
}
async function getReviewsByUserId(userId, minRating, maxRating) {
    const reviews = await reviewRepository
        .createQueryBuilder('review')
        .leftJoinAndSelect('review.user', 'user')
        .where('user.userId = :userId', { userId })
        .andWhere('review.rating >= :minRating and review.rating <= :maxRating', {
        minRating,
        maxRating,
    })
        .select(['review', 'user.userId', 'user.profileViews', 'book'])
        .getMany();
    return reviews;
}
async function reviewBelongsToUser(reviewId, userId) {
    const reviewExists = await reviewRepository
        .createQueryBuilder('review')
        .leftJoinAndSelect('review.user', 'user')
        .where('review.reviewId = :reviewId', { reviewId })
        .andWhere('user.userId = :userId', { userId })
        .getExists();
    return reviewExists;
}
async function deleteReviewById(reviewId) {
    await reviewRepository
        .createQueryBuilder('review')
        .delete()
        .where('reviewId = :reviewId', { reviewId })
        .execute();
}
export { addReview, deleteReviewById, getReviewById, userHasReviewForBook, getReviewsByUserId, reviewBelongsToUser, };
//# sourceMappingURL=ReviewModel.js.map