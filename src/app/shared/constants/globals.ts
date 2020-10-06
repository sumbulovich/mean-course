export const PATHS = {
  HOME: '',
  AUTH: {
    SIGN_IN: 'signin',
    SIGN_UP: 'signup',
  },
  ACCOUNT: {
    ROOT: 'account',
    PROFILE: 'profile',
    CHANGE_PASSWORD: 'change-password',
    CLOSE_ACCOUNT: 'close-account'
  },
  POSTS: {
    ROOT: 'posts',
    LIST: '',
    CREATE: 'create',
    EDIT: 'edit'
  }
};

export const PASSWORD_PATTERN = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$';

export const TIMINGS = {
  TOKEN_EXPIRATION: {
    DEFAULT: '2h',
    REMEMBER: '1y',
    REFRESH: '15m',
    DIALOG_BEFORE: '1m',
    REFRESH_BEFORE: '5m'
  }
};

export enum AnimationState { in = 'in', out = 'out' }


