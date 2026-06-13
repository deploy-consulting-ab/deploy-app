import { useEffect, useState } from 'react';

export function useSuccessVisibility(success) {
    const [trackedSuccess, setTrackedSuccess] = useState(success);
    const [isVisible, setIsVisible] = useState(false);

    if (success !== trackedSuccess) {
        setTrackedSuccess(success);
        setIsVisible(Boolean(success));
    }

    useEffect(() => {
        if (!isVisible) return;

        const timer = setTimeout(() => setIsVisible(false), 1000);
        return () => clearTimeout(timer);
    }, [isVisible, trackedSuccess]);

    return isVisible;
}
