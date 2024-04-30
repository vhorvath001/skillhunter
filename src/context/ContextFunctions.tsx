import { ReactElement } from 'react'

export type ChildrenType = { children?: ReactElement | ReactElement[] }

const handleError = (err: any, setErrorMessage: (errorMessage: string) => void): void => {
    if (err instanceof Error)
        setErrorMessage(err.message)
    if (typeof err === 'string')
        setErrorMessage(err)
    console.error(err)
}

export { handleError }