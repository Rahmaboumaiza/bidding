import React from "react";
import dayjs from "dayjs";

export const DateFormatter = ({ date, format = "DD MM YYYY", fallback = "N/A" }) => {
  try {
    const dayjsDate = dayjs(date);
    if (!dayjsDate.isValid()) return <span>{fallback}</span>;
    
    return (
      <span title={dayjsDate.toISOString()}>
        {dayjsDate.format(format)}
      </span>
    );
  } catch (error) {
    console.error('Date formatting error:', error);
    return <span>{fallback}</span>;
  }
};

/* import React from "react";

export const DateFormatter = ({ date }) => {
  const apiDateString = date;
  const dateObject = new Date(apiDateString);
  const readableDate = dateObject.toLocaleString();

  return <>{readableDate}</>;
};
 */