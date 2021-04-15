import dotenv from 'dotenv';
dotenv.config();

export const SECRET_KEY: string = process.env["SECRET_KEY"] as string;