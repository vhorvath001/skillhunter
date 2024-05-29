import express, { Express } from 'express'
import extractionRouter from './routes/api/extractionRoute'
import initDB from './init/initDB'
import logger from './init/initLogger'
import progLangRouter from './routes/api/progLangRoute'
import cors from 'cors'
import repositoryRouter from './routes/api/repositoryRoute'
import skillRouter from './routes/api/skillRoute'
import developerRouter from './routes/api/developerRoute'

const app: Express = express()
const PORT: string = process.env.PORT || '3500'

app.use(cors())

// built-in middleware for JSON
app.use(express.json())

// routes
app.use('/extractions', extractionRouter)
app.use('/prog-langs', progLangRouter)
app.use('/repositories', repositoryRouter)
app.use('/skills', skillRouter)
app.use('/developers', developerRouter)

app.listen(PORT, async () => {
    await initDB()
    logger.info(`Server running on port ${PORT}`)
})