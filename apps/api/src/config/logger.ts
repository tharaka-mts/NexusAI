import winston from 'winston';
import { env } from './env';

const formats = [
    winston.format.timestamp(),
    winston.format.json(),
];

if (env.NODE_ENV === 'development') {
    formats.push(winston.format.prettyPrint());
    formats.push(winston.format.colorize({ all: true }));
    formats.push(winston.format.simple());
}

export const logger = winston.createLogger({
    level: env.NODE_ENV === 'development' ? 'debug' : 'info',
    format: winston.format.combine(...formats),
    transports: [
        new winston.transports.Console(),
    ],
});
