import React from "react";
import dayjs from "dayjs";

export const DateFormatter = ({ date }) => {
  return (
    <span title={dayjs(date).toISOString()}>
      {dayjs(date).format("DD MM YYYY")}
    </span>
  );
};

/* import React from "react";

export const DateFormatter = ({ date }) => {
  const apiDateString = date;
  const dateObject = new Date(apiDateString);
  const readableDate = dateObject.toLocaleString();

  return <>{readableDate}</>;
};
 */