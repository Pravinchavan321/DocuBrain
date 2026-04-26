export const extractError = (err) => {
  if (err?.response?.data) {
    return err.response.data.message || err.response.data.error || 'An unexpected server error occurred.';
  }
  return err?.message || 'A network error occurred. Please try again.';
};
