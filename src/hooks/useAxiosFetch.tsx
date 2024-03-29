import { useState, useEffect } from 'react';
import axios, { AxiosResponse, CancelTokenSource } from 'axios';
import { client } from '../api/client';


const useAxiosFetch = (fetchUrl: string) => {
    const [data, setData] = useState<any[]>([]);
    const [fetchError, setFetchError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        let isMounted: boolean = true;
        const sourceCancelToken: CancelTokenSource = axios.CancelToken.source();

        const fetchData = async (url: string): Promise<void> => {
            setIsLoading(true);
            try {
                const resp: AxiosResponse = await axios.get(client.defaults.baseURL + url, {
                    cancelToken: sourceCancelToken.token
                });
                if (isMounted) {
                    setData(resp.data);
                    setFetchError('');
                }
            } catch(err) {
                if (isMounted) {
                    setData([]);
                    if (err instanceof Error)
                        setFetchError(err.message)
                    if (typeof err === 'string')
                        setFetchError(err)
                    console.error(err);
                }
            } finally {
                isMounted && setIsLoading(false);
            }
        }

        fetchData(fetchUrl);

        const cleanUp = (): void => {
            isMounted = false;
            sourceCancelToken.cancel();
        }

        return cleanUp;
    }, [fetchUrl]);

    return { data, isLoading, fetchError };
}

export default useAxiosFetch;