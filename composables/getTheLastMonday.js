export default function getTheLastMonday(date) {
  const newDate = new Date(date); // Create a copy of the date object

  switch (newDate.getDay()) {
    case 1: // Monday
      return newDate;
    case 2: // Tuesday
      return new Date(newDate.setDate(newDate.getDate() - 1));
    case 3: // Wednesday
      return new Date(newDate.setDate(newDate.getDate() - 2));
    case 4: // Thursday
      return new Date(newDate.setDate(newDate.getDate() - 3));
    case 5: // Friday
      return new Date(newDate.setDate(newDate.getDate() - 4));
    case 6: // Saturday
      return new Date(newDate.setDate(newDate.getDate() - 5));
    case 0: // Sunday
      return new Date(newDate.setDate(newDate.getDate() - 6));
  }
}
