export default function divide(a, b) {
  if (b === 0) {
    return 0;
  }
  return Math.round(a / b * 100) / 100;
}
