const TOKEN_KEY = 'task-assessment-token';
export const AUTH_EVENT_NAME = 'auth-token-change';

const notifyAuthChange = () => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(AUTH_EVENT_NAME));
};

export const setToken = (token: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  notifyAuthChange();
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const clearToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  notifyAuthChange();
};
