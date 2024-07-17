export enum EErrorMessages {
  // User errors
  ACCOUNT_EXISTS = 'ACCOUNT_EXISTS',
  USER_NOT_EXISTS = 'USER_NOT_EXISTS',
  USER_NOT_VERIFIED = 'USER_NOT_VERIFIED',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  INVALID_EMAIL = 'INVALID_EMAIL',

  // OTP errors
  INVALID_OTP = 'INVALID_OTP',
  OTP_EXPIRED = 'OTP_EXPIRED',
  REUSE_OTP = 'REUSE_OTP',

  // Password errors
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  INVALID_OLD_PASSWORD = 'INVALID_OLD_PASSWORD',

  // Token errors
  INVALID_TOKEN = 'INVALID_TOKEN',
  UNNATHORIZED_USER = 'UNNATHORIZED_USER',
  UNATHORIZE_ACCESS = 'UNATHORIZE_ACCESS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',

  // System error
  SYSTEM_ERROR = 'SYSTEM_ERROR',
}
