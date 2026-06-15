import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for data fetching with loading, error, and refetch support.
 * @param {Function} fetchFn - Service function that returns an axios response (res.data)
 * @param {Object} options
 * @param {boolean} options.immediate - Auto-fetch on mount (default: true)
 * @param {*} options.initialData - Initial data value (default: [])
 * @param {Function} options.transform - Optional transform applied to res.data before storing
 */
const useFetch = (fetchFn, options = {}) => {
    const { immediate = true, initialData = [], transform } = options;
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(immediate);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(async (...args) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetchFn(...args);
            const result = transform ? transform(res.data) : res.data;
            setData(result);
            setLoaded(true);
            return res;
        } catch (err) {
            setError(err);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [fetchFn, transform]);

    useEffect(() => {
        if (immediate) execute();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return { data, setData, loading, loaded, error, refetch: execute };
};

export default useFetch;
