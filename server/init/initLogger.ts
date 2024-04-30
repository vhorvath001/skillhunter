import * as winston from 'winston'

const logger: winston.Logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        //winston.format.colorize({ all: true }),
        winston.format.timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        winston.format.align(),
        winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [
        new winston.transports.Console({
            // level: process.env.LOG_LEVEL || 'debug',
            level: 'debug',
            format: winston.format.combine(winston.format.colorize())
        }),
        new winston.transports.File({ 
            level: 'debug',
            filename: 'skillhunter.log' 
        })
    ]
})

export default logger