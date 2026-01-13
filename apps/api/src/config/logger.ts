import winston from 'winston';
import { env } from './env';

const formats = [
    winston.format.timestamp(),
    env.NODE_ENV === 'production' ? winston.format.json() : winston.format.simple(),
];

if (env.NODE_ENV === 'development') {
    formats.push(winston.format.colorize({ all: true }));
    formats.push(winston.format.printf(({ level, message, timestamp, ...meta }) => {
        return `${timestamp} ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
    }));
}

export const logger = winston.createLogger({
    level: env.NODE_ENV === 'development' ? 'debug' : 'info',
    format: winston.format.combine(...formats),
    defaultMeta: { service: 'api' },
    transports: [
        new winston.transports.Console(),
    ],
});
