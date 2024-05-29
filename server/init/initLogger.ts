import * as winston from 'winston'

const logger: winston.Logger = winston.createLogger({
    level: 'info',
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
            level: 'info',
            format: winston.format.combine(winston.format.colorize())
        }),
        new winston.transports.File({ 
            level: 'info',
            filename: 'skillhunter.log' 
        })
    ]
})

export default logger