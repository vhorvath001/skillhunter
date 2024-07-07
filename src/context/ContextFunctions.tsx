import { AxiosError } from 'axios'

export const handleError = (err: any, setErrorMessage: (errorMessage: string) => void): void => {
    if (err instanceof AxiosError)
        setErrorMessage(err.response?.data?.message ? err.response?.data?.message : err.message ? err.message : JSON.stringify(err))
    else if (err instanceof Error)
        setErrorMessage(err.message ? err.message : JSON.stringify(err))
    else if (typeof err === 'string')
        setErrorMessage(err)
    console.error(err)
}
