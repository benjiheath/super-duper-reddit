declare module 'nodejs-nodemailer-outlook';

declare module 'express-session' {
  interface SessionData {
    userId: string;
    username: string;
  }
}
