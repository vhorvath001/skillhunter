import { AxiosError } from 'axios'

export const handleError = (err: any, setErrorMessage: (errorMessage: string) => void, prefix: string = ''): void => {
    let errorMessage = prefix
    if (err instanceof AxiosError)
        errorMessage += err.response?.data?.message ? err.response?.data?.message : err.message ? err.message : JSON.stringify(err)
    else if (err instanceof Error)
        errorMessage += err.message ? err.message : JSON.stringify(err)
    else if (typeof err === 'string')
        errorMessage += err
    else
        errorMessage += JSON.stringify(err)
    setErrorMessage(errorMessage)
    console.error(prefix, err)
}
