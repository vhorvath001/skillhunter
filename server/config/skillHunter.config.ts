import dotenv from 'dotenv'

dotenv.config()

interface Config {
    encryptionKey: string,
    db: {
        host: string,
        user: string,
        password: string
    },
    appLoggingEveryXCommits: number
}

const config: Config = {
    encryptionKey: process.env.ENCRYPTION_KEY || '',
    db: {
        host: process.env.DB_HOST || '',
        user: process.env.DB_USER || '',
        password: process.env.DB_PASSWORD || ''
    },
    appLoggingEveryXCommits: Number(process.env.APP_LOGGING_EVERY_X_COMMITS) || 50
}

export default config