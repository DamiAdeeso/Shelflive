export const timeFormat = (num) => {
  const f = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  });
  const format =
    num < 7
      ? { f: "day", n: num }
      : num > 7 && num < 30
      ? { f: "week", n: Math.floor(num / 7) }
      : num > 30 && num < 365
      ? { f: "month", n: Math.floor(num / 30) }
      : { f: "year", n: Math.floor(num / 365) };
  return f.format(format.n, format.f);
};
