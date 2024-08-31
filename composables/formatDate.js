export default function formatDate(date) {
  const d = new Date(date)

  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();

  const monthString = month < 10 ? `0${month}` : `${month}`;
  const dayString = day < 10 ? `0${day}` : `${day}`;

  return `${year}-${monthString}-${dayString}`;
}
