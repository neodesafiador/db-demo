import 'express-session';

declare module 'express-session' {
  export interface Session {
    clearSession(): Promise<void>;

    // Our example app's custom session properties:
    authenticatedUser: {
      userId: string;
      email: string;
    };
    isLoggedIn: boolean;
    logInAttempts: number;
    logInTimeout: string;
  }
}