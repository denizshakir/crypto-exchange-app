export const formatDateFromMillis = (ms: string | number) => {
  const date = new Date(ms);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const formatDateFromMillisToFull = (ms: number) => {
  const date = new Date(ms);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const timeZone =
    Intl.DateTimeFormat(undefined, { timeZoneName: 'short' })
      .formatToParts(date)
      .find((part) => part.type === 'timeZoneName')?.value || '';

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${timeZone}`;
};

export const millisecondsToSeconds = (ms: number) => {
  return Math.floor(ms / 1000);
};
