'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const SWIPE_THRESHOLD = 100; // minimum distance to trigger navigation
const VELOCITY_THRESHOLD = 0.5; // minimum velocity to trigger navigation
const DIRECTION_LOCK_THRESHOLD = 10; // pixels to move before locking direction

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
    const isDirectionLocked = useRef(false);
    const isHorizontalSwipe = useRef(false);
    const startTime = useRef(0);
    const hasCalledSwipeStart = useRef(false);

    const handleTouchStart = useCallback(
        (e) => {
            if (!enabled) return;

            const touch = e.touches[0];
            touchStartX.current = touch.clientX;
            touchStartY.current = touch.clientY;
            touchCurrentX.current = touch.clientX;
            startTime.current = Date.now();
            isSwipeActive.current = true;
            isDirectionLocked.current = false;
            isHorizontalSwipe.current = false;
            hasCalledSwipeStart.current = false;
        },
        [enabled]
    );

    const handleTouchMove = useCallback(
        (e) => {
            if (!isSwipeActive.current) return;

            const touch = e.touches[0];
            const deltaX = touch.clientX - touchStartX.current;
            const deltaY = touch.clientY - touchStartY.current;

            // Lock direction after moving past threshold
            if (!isDirectionLocked.current) {
                if (Math.abs(deltaX) > DIRECTION_LOCK_THRESHOLD || Math.abs(deltaY) > DIRECTION_LOCK_THRESHOLD) {
                    isDirectionLocked.current = true;
                    // It's a horizontal right swipe if deltaX is positive and greater than deltaY
                    isHorizontalSwipe.current = deltaX > 0 && Math.abs(deltaX) > Math.abs(deltaY);

                    if (!isHorizontalSwipe.current) {
                        // Not a right swipe, cancel
                        isSwipeActive.current = false;
                        return;
                    }
                } else {
                    // Not enough movement yet to determine direction
                    return;
                }
            }

            // Only continue if it's a horizontal right swipe
            if (!isHorizontalSwipe.current) {
                return;
            }

            // Call onSwipeStart only once when we confirm it's a valid swipe
            if (!hasCalledSwipeStart.current) {
                hasCalledSwipeStart.current = true;
                onSwipeStart?.();
            }

            // Only allow swiping right (positive deltaX)
            if (deltaX > 0) {
                touchCurrentX.current = touch.clientX;
                // Prevent default to avoid scrolling while swiping
                e.preventDefault();
                onSwipeMove?.(deltaX);
            }
        },
        [onSwipeMove, onSwipeStart]
    );

    const handleTouchEnd = useCallback(() => {
        if (!isSwipeActive.current) return;

        const deltaX = touchCurrentX.current - touchStartX.current;
        const duration = Date.now() - startTime.current;
        const velocity = deltaX / duration;

        isSwipeActive.current = false;

        // Only process if we actually started a swipe gesture
        if (!hasCalledSwipeStart.current) {
            return;
        }

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
