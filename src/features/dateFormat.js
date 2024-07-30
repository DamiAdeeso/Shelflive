export const dateFormat = (date, time) => {
  const f = Intl.DateTimeFormat(
    "en-us",
    time
      ? {
          timeStyle: "short",
        }
      : {
          dateStyle: "long",
        }
  );

  return f.format(date);
};

export const dateFormatHistory = (date) => {
  const f = Intl.DateTimeFormat("en-us", {
    dateStyle: "full",
  });

  return f.format(date);
};
