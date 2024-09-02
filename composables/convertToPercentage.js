export default function convertToPercentage(averageRating) {
  return Math.round((averageRating * 100) / 5 * 100) / 100;
}