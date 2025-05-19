declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;
    PORT: number;
    WEB_BASE_URL: string;
    API_BASE_URL: string;
    DATABASE_NAME: string;
    DATABASE_HOST: string;
    DATABASE_PORT: string;
    DATABASE_USERNAME: string;
    DATABASE_PASSWORD: string;
    JWT_SIGN_UP_SECRET: string;
    JWT_SECRET: string;
    JWT_EXPIRE_IN: string;
  }
}
