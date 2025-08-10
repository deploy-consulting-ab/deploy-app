'use client';

import * as React from 'react';

const CALENDAR_BREAKPOINT = 1200;

export function useLayoutSize(calendarBreakpoint = CALENDAR_BREAKPOINT) {
    const [isSingleColumn, setIsSingleColumn] = React.useState(undefined);

    React.useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${calendarBreakpoint - 1}px)`);
        const onChange = () => {
            setIsSingleColumn(window.innerWidth < calendarBreakpoint);
        };
        mql.addEventListener('change', onChange);
        setIsSingleColumn(window.innerWidth < calendarBreakpoint);
        return () => mql.removeEventListener('change', onChange);
    }, []);

    return !!isSingleColumn;
}
