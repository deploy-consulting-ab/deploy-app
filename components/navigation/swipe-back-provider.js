'use client';

import { useState, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSwipeBack } from '@/hooks/use-swipe-back';
import { useIsMobile } from '@/hooks/use-mobile';

export function SwipeBackProvider({ children }) {
    const [swipeOffset, setSwipeOffset] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const isMobile = useIsMobile();
    const pathname = usePathname();

    // Reset state when pathname changes
    useEffect(() => {
        setSwipeOffset(0);
        setIsAnimating(false);
    }, [pathname]);

    const handleSwipeStart = useCallback(() => {
        setIsAnimating(false);
    }, []);

    const handleSwipeMove = useCallback((deltaX) => {
        // Apply some resistance to make it feel more natural
        const resistance = 0.8;
        const maxOffset = window.innerWidth * 0.5;
        const offset = Math.min(deltaX * resistance, maxOffset);
        setSwipeOffset(offset);
    }, []);

    const handleSwipeEnd = useCallback((willNavigate) => {
        setIsAnimating(true);
        if (willNavigate) {
            // Animate off-screen before navigation
            setSwipeOffset(window.innerWidth);
        } else {
            // Animate back to origin
            setSwipeOffset(0);
        }
    }, []);

    const handleSwipeCancel = useCallback(() => {
        setIsAnimating(true);
        setSwipeOffset(0);
    }, []);

    useSwipeBack({
        enabled: isMobile,
        onSwipeStart: handleSwipeStart,
        onSwipeMove: handleSwipeMove,
        onSwipeEnd: handleSwipeEnd,
        onSwipeCancel: handleSwipeCancel,
    });

    const containerStyle = {
        transform: swipeOffset > 0 ? `translateX(${swipeOffset}px)` : undefined,
        transition: isAnimating ? 'transform 0.3s ease-out' : 'none',
    };

    const overlayOpacity = Math.min(swipeOffset / 200, 0.3);

    return (
        <div className="relative h-full w-full overflow-hidden">
            {/* Shadow overlay that appears during swipe */}
            {swipeOffset > 0 && (
                <div
                    className="absolute inset-0 bg-black pointer-events-none z-40"
                    style={{
                        opacity: overlayOpacity,
                        transition: isAnimating ? 'opacity 0.3s ease-out' : 'none',
                    }}
                />
            )}
            {/* Edge indicator that shows swipe is possible */}
            {swipeOffset > 0 && (
                <div
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary/30 z-50"
                    style={{
                        transform: `scaleX(${Math.min(swipeOffset / 50, 3)})`,
                        transformOrigin: 'left',
                    }}
                />
            )}
            <div
                className="h-full w-full"
                style={containerStyle}
                onTransitionEnd={() => setIsAnimating(false)}
            >
                {children}
            </div>
        </div>
    );
}
