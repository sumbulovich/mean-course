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
    TIME: '3m', // 180000ms
    DIALOG_BEFORE: '1m', // 60000ms
    REFRESH_BEFORE: '2m' // 120000ms
  }
};

