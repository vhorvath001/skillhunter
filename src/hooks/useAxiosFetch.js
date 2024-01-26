import { useState, useEffect } from 'react';
import axios from 'axios';
import { client } from '../api/client';


const useAxiosFetch = (fetchUrl) => {
    const [data, setData] = useState([]);
    const [fetchError, setFetchError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const sourceCancelToken = axios.CancelToken.source();

        const fetchData = async (url) => {
            setIsLoading(true);
            try {
                const resp = await axios.get(client.defaults.baseURL + url, {
                    CancelToken: sourceCancelToken.token
                });
                if (isMounted) {
                    setData(resp.data);
                    setFetchError(null);
                }
            } catch(err) {
                if (isMounted) {
                    setData([]);
                    setFetchError(err.message);
                    console.error(err);
                }
            } finally {
                isMounted && setIsLoading(false);
            }
        }

        fetchData(fetchUrl);

        const cleanUp = () => {
            isMounted = false;
            sourceCancelToken.cancel();
        }

        return cleanUp;
    }, [fetchUrl]);

    return { data, isLoading, fetchError };
}

export default useAxiosFetch;