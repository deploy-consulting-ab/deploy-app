'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const EDGE_THRESHOLD = 30; // pixels from left edge to start swipe
const SWIPE_THRESHOLD = 100; // minimum distance to trigger navigation
const VELOCITY_THRESHOLD = 0.5; // minimum velocity to trigger navigation

export function useSwipeBack({
    enabled = true,
    onSwipeStart,
    onSwipeMove,
    onSwipeEnd,
    onSwipeCancel,
} = {}) {
    const router = useRouter();
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);
    const touchCurrentX = useRef(0);
    const isSwipeActive = useRef(false);
    const startTime = useRef(0);

    const handleTouchStart = useCallback(
        (e) => {
            if (!enabled) return;

            const touch = e.touches[0];
            // Only start swipe if touch begins near the left edge
            if (touch.clientX <= EDGE_THRESHOLD) {
                touchStartX.current = touch.clientX;
                touchStartY.current = touch.clientY;
                touchCurrentX.current = touch.clientX;
                startTime.current = Date.now();
                isSwipeActive.current = true;
                onSwipeStart?.();
            }
        },
        [enabled, onSwipeStart]
    );

    const handleTouchMove = useCallback(
        (e) => {
            if (!isSwipeActive.current) return;

            const touch = e.touches[0];
            const deltaX = touch.clientX - touchStartX.current;
            const deltaY = touch.clientY - touchStartY.current;

            // Cancel if vertical movement is greater than horizontal
            if (Math.abs(deltaY) > Math.abs(deltaX) && deltaX < 50) {
                isSwipeActive.current = false;
                onSwipeCancel?.();
                return;
            }

            // Only allow swiping right (positive deltaX)
            if (deltaX > 0) {
                touchCurrentX.current = touch.clientX;
                // Prevent default to avoid scrolling while swiping
                e.preventDefault();
                onSwipeMove?.(deltaX);
            }
        },
        [onSwipeMove, onSwipeCancel]
    );

    const handleTouchEnd = useCallback(() => {
        if (!isSwipeActive.current) return;

        const deltaX = touchCurrentX.current - touchStartX.current;
        const duration = Date.now() - startTime.current;
        const velocity = deltaX / duration;

        isSwipeActive.current = false;

        // Navigate back if swipe distance or velocity exceeds threshold
        if (deltaX >= SWIPE_THRESHOLD || velocity >= VELOCITY_THRESHOLD) {
            onSwipeEnd?.(true);
            router.back();
        } else {
            onSwipeEnd?.(false);
            onSwipeCancel?.();
        }
    }, [router, onSwipeEnd, onSwipeCancel]);

    useEffect(() => {
        if (!enabled) return;

        const options = { passive: false };
        document.addEventListener('touchstart', handleTouchStart, options);
        document.addEventListener('touchmove', handleTouchMove, options);
        document.addEventListener('touchend', handleTouchEnd);

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

    return {
        isSwipeActive: isSwipeActive.current,
    };
}
