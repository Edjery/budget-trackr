export const getCurrentDateValues = () => {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1, // Months are 0-indexed in JS
    day: now.getDate()
  };
};

export const toLocalDateString = (year: number, month: number, day: number): string => {
  const date = new Date(year, month - 1, day);
  return date.toISOString().split('T')[0];
};
