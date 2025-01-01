const formatContentLength = (contentLength: string) => {
  const lengthInBytes = parseFloat(contentLength);
  if (isNaN(lengthInBytes) || lengthInBytes < 0) {
    return 'Invalid content length';
  }
  if (lengthInBytes < 1024) {
    return `${lengthInBytes} Bytes`;
  } else if (lengthInBytes < 1024 * 1024) {
    return `${(lengthInBytes / 1024).toFixed(2)} KB`;
  } else if (lengthInBytes < 1024 * 1024 * 1024) {
    return `${(lengthInBytes / (1024 * 1024)).toFixed(2)} MB`;
  } else {
    return `${(lengthInBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
};

export {formatContentLength}