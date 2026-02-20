export const formatDate = (dateString: string): string => {
  const [day, month, year] = dateString.split("-");
  const date = new Date(`${year}-${month}-${day}`);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
};
