import process from 'node:process';
import * as dotenv from 'dotenv';

dotenv.config();

interface IConfig {
    PORT: number;
}

export const config: IConfig = {
    PORT: requiredEnv<number>('PORT'),
};

function requiredEnv<T>(name: string): T {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Environment variable ${name} is required`);
    }
    return value as T;
}