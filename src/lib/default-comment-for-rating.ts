export const defaultCommentForRating = (rating: number) => {
  if (rating >= 5) return 'Absolutely loved it! ⭐⭐⭐⭐⭐'
  if (rating === 4) return 'Pretty good overall.'
  if (rating === 3) return "It's okay, could be better."
  if (rating === 2) return 'Not very satisfied.'
  if (rating === 1) return 'Really disappointed.'
  return ''
}