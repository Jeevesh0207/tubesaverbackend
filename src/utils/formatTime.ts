export const formatTime = (seconds: string): string => {
  const time = parseInt(seconds);
  const hrs = Math.floor(time / 3600);
  const mins = Math.floor((time % 3600) / 60);
  const secs = time % 60;
  return [
    hrs > 0 ? String(hrs).padStart(2, '0') : null, 
    String(mins).padStart(2, '0'),
    String(secs).padStart(2, '0'),
  ]
    .filter((part) => part !== null) 
    .join(':');
};
