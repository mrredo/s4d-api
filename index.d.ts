export {};
declare module 'express-session' {
    export interface SessionData {
      (user: any): {};
    }
  }