export const PATHS = {
  HOME: '',
  NOT_FOUND: '404',
  AUTH: {
    ROOT: 'auth',
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

export const ACCOUNT_LINKS = [
  { content: 'Profile', url: PATHS.ACCOUNT.ROOT + '/' + PATHS.ACCOUNT.PROFILE },
  { content: 'Change Password', url: PATHS.ACCOUNT.ROOT + '/' + PATHS.ACCOUNT.CHANGE_PASSWORD },
  { content: 'Close Account', url: PATHS.ACCOUNT.ROOT + '/' + PATHS.ACCOUNT.CLOSE_ACCOUNT },
];


