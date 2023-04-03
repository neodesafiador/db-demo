import { Request, Response } from 'express';
import { getBookById } from '../models/BookModel';
import { getUserById } from '../models/UserModel';
import {
  addReview,
  getReviewById,
  userHasReviewForBook,
  getReviewsByUserId,
  reviewBelongsToUser,
  deleteReviewById,
} from '../models/ReviewModel';

async function getReview(req: Request, res: Response): Promise<void> {
  const { reviewId } = req.params as { reviewId: string };

  const review = await getReviewById(reviewId);

  if (!review) {
    res.sendStatus(404);
    return;
  }

  res.status(200).json(review);
}

async function makeReview(req: Request, res: Response): Promise<void> {
  const { bookId } = req.params as { bookId: string };
  const { authenticatedUser, isLoggedIn } = req.session;
  if (!isLoggedIn) {
    res.sendStatus(401);
    return;
  }
  const { reviewText, rating } = req.body as { reviewText: string; rating: number };

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

  res.status(201).json(review);
}

async function getUserReviews(req: Request, res: Response): Promise<void> {
  const { targetUserId } = req.params as UserIdParam;
  const { minRatingStr, maxRatingStr } = req.query as RatingRangeQuery;

  const minRating = minRatingStr ? parseInt(minRatingStr, 10) : 1;
  const maxRating = maxRatingStr ? parseInt(maxRatingStr, 10) : 5;

  const reviews = await getReviewsByUserId(targetUserId, minRating, maxRating);

  res.json(reviews);
}

async function deleteUserReview(req: Request, res: Response): Promise<void> {
  const { isLoggedIn, authenticatedUser } = req.session;
  if (!isLoggedIn) {
    res.sendStatus(401); // 401 Unauthorized
    return;
  }

  const { reviewId } = req.params as ReviewIdParam;

  const reviewExists = await reviewBelongsToUser(reviewId, authenticatedUser.userId);
  if (!reviewExists) {
    res.sendStatus(403); // 403 Forbidden
    return;
  }

  await deleteReviewById(reviewId);

  res.sendStatus(204); // 204 No Content
}

export { makeReview, getReview, getUserReviews, deleteUserReview };
