const TOKEN_KEY = 'docubrain_access_token';
const USER_KEY = 'docubrain_user';
const REFRESH_KEY = 'docubrain_refresh_token';

export const setAccessToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
};

export const getAccessToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeAccessToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const setUserData = (user) => {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUserData = () => {
  try {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr || userStr === 'undefined') return null;
    return JSON.parse(userStr);
  } catch (error) {
    return null;
  }
};

export const removeUserData = () => {
  localStorage.removeItem(USER_KEY);
};

export const setRefreshToken = (token) => {
  if (token) localStorage.setItem(REFRESH_KEY, token);
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_KEY);
};

export const removeRefreshToken = () => {
  localStorage.removeItem(REFRESH_KEY);
};

export const clearAuthStorage = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(REFRESH_KEY);
};
