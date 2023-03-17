

async function deleteReviewById(reviewId: string): Promise<void> {
    await reviewRepository
      .createQueryBuilder('review')
      .delete()
      .from(Review)
      .where("reviewId = :reviewId", { reviewId })
      .execute();
}


export { addReview, getReviewById, getAllReviews }