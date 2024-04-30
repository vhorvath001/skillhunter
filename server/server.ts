import express, { Express } from 'express'
import extractionRouter from './routes/api/extractionRoute'
import initDB from './config/initDB'
import logger from './config/initLogger'
import progLangRouter from './routes/api/progLangRoute'
import cors from 'cors'
import repositoryRouter from './routes/api/repositoryRoute'

const app: Express = express()
const PORT: string = process.env.PORT || '3500'

app.use(cors())

// built-in middleware for JSON
app.use(express.json())

// routes
app.use('/extraction', extractionRouter)
app.use('/prog-langs', progLangRouter)
app.use('/repositories', repositoryRouter)

app.listen(PORT, async () => {
    await initDB()
    logger.info(`Server running on port ${PORT}`)
})