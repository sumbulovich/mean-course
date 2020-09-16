export const PATHS = {
  HOME: '/',
  AUTH: {
    SIGN_IN: '/signin',
    SIGN_UP: '/signup',
    TOKEN: '/token',
    TOKEN_REJECT: '/token/reject',
  },
  CREATE: '/create',
  EDIT: '/edit'
};

export const API = {
  ROOT: 'http://localhost:3000',
  POSTS: '/api/posts',
  USERS: '/api/users',
};

export const TIMINGS = {
  TOKEN_EXPIRATION: {
    DEFAULT: '2h',
    REMEMBER: '1y',
    REFRESH: '15m',
    DIALOG_BEFORE: '1m',
    REFRESH_BEFORE: '5m'
  }
};

