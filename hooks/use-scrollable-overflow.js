import { useCallback, useRef, useState } from 'react';

export function useScrollableOverflow() {
    const [isScrollable, setIsScrollable] = useState(false);
    const observerRef = useRef(null);

    const contentRef = useCallback((node) => {
        observerRef.current?.disconnect();
        observerRef.current = null;

        if (!node) {
            setIsScrollable(false);
            return;
        }

        const updateScrollable = () => {
            setIsScrollable(node.scrollHeight > node.clientHeight);
        };

        updateScrollable();

        const observer = new ResizeObserver(updateScrollable);
        observer.observe(node);
        observerRef.current = observer;
    }, []);

    return { contentRef, isScrollable };
}
