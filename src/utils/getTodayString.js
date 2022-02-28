function getTodayString() {
  const today = new Date();

  const todayString = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return todayString;
}

export default getTodayString;
