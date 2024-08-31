export default function getTheLastMonday(date) {
  if (date.getDay() === 1) return date;
  if (date.getDay() === 2) return new Date(date.setDate(date.getDate() - 1));
  if (date.getDay() === 3) return new Date(date.setDate(date.getDate() - 2));
  if (date.getDay() === 4) return new Date(date.setDate(date.getDate() - 3));
  if (date.getDay() === 5) return new Date(date.setDate(date.getDate() - 4));
  if (date.getDay() === 6) return new Date(date.setDate(date.getDate() - 5));
  if (date.getDay() === 0) return new Date(date.setDate(date.getDate() - 6));
}
