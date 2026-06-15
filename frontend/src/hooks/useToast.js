import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for toast notification state with auto-dismiss.
 * @param {number} duration - Auto-dismiss delay in ms (default: 3500)
 * @returns {{ toast: {type: string, message: string}|null, showToast: Function, hideToast: Function }}
 */
const useToast = (duration = 3500) => {
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(null), duration);
        return () => clearTimeout(timer);
    }, [toast, duration]);

    const showToast = useCallback((type, message) => {
        setToast({ type, message });
    }, []);

    const hideToast = useCallback(() => {
        setToast(null);
    }, []);

    return { toast, showToast, hideToast };
};

export default useToast;
