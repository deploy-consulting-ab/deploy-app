import { useEffect, useRef, useState } from 'react';

export function useScrollableOverflow() {
    const contentRef = useRef(null);
    const [isScrollable, setIsScrollable] = useState(false);

    useEffect(() => {
        const element = contentRef.current;
        if (!element) return;

        const checkScrollable = () => {
            setIsScrollable(element.scrollHeight > element.clientHeight);
        };

        checkScrollable();

        const resizeObserver = new ResizeObserver(checkScrollable);
        resizeObserver.observe(element);

        return () => resizeObserver.disconnect();
    }, []);

    return { contentRef, isScrollable };
}
