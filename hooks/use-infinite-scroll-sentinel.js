import { useCallback, useRef } from 'react';

export function useInfiniteScrollSentinel(hasMore, onLoadMore) {
    const hasMoreRef = useRef(hasMore);
    hasMoreRef.current = hasMore;

    const onLoadMoreRef = useRef(onLoadMore);
    onLoadMoreRef.current = onLoadMore;

    const observerRef = useRef(null);

    const sentinelRef = useCallback((node) => {
        if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
        }

        if (!node) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMoreRef.current) {
                    onLoadMoreRef.current();
                }
            },
            { threshold: 0.1 }
        );

        observerRef.current.observe(node);
    }, []);

    return sentinelRef;
}
