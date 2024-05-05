import logger from '../init/initLogger'

export const getErrorMessage = (err: unknown) => {
    if (err instanceof Error) return err.message
    else return String(err)
}
export const logError = (err: unknown, errorMessage: string) => {
    if (err instanceof Error) 
        logger.error(`${errorMessage} - ${err.stack}`)
    else
        logger.error(`${errorMessage} - ${err}`)
}