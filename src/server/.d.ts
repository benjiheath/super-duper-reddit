declare module 'nodejs-nodemailer-outlook';

declare module 'express-session' {
  interface SessionData {
    userID?: string;
    username?: string;
  }
}
