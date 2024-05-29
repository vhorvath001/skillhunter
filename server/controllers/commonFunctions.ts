import { ForeignKeyConstraintError } from 'sequelize'
import logger from '../init/initLogger'

export const getErrorMessage = (err: unknown) => {
    return err instanceof ForeignKeyConstraintError ? 'The skill is still used, it cannot be deleted.' : 'DB error, please check the server log.'
}
export const logError = (err: unknown, errorMessage: string) => {
    if (err instanceof Error) 
        logger.error(`${errorMessage} :: ${JSON.stringify(err)} - ${err.stack}`)
    else
        logger.error(`${errorMessage} - ${JSON.stringify(err)}`)
}