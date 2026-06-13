import { useState, useEffect, useImperativeHandle, useCallback } from 'react';
import { countSwedishBusinessDaysLocalInclusive, formatLocalDateKey } from '@/lib/utils';

/**
 * Format a local Date object to a friendly display format (e.g., "23 Jan 2026")
 */
export function formatDisplayDate(date) {
    if (!date) return '';
    const day = date.getDate();
    const month = date.toLocaleDateString('en-GB', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

export function useAbsenceRequestForm(ref, onValidityChange) {
    const [startDate, setStartDate] = useState(() => new Date());
    const [endDate, setEndDate] = useState(null);
    const [hours, setHours] = useState(8);
    const [startDateOpen, setStartDateOpen] = useState(false);
    const [endDateOpen, setEndDateOpen] = useState(false);

    const isSameDay =
        startDate && endDate && formatLocalDateKey(startDate) === formatLocalDateKey(endDate);

    const isFormValid = startDate !== null && endDate !== null && hours > 0;

    useEffect(() => {
        onValidityChange?.(isFormValid);
    }, [isFormValid, onValidityChange]);

    const calculateDays = useCallback(() => {
        if (!startDate || !endDate) return 0;
        return countSwedishBusinessDaysLocalInclusive(startDate, endDate);
    }, [startDate, endDate]);

    useImperativeHandle(
        ref,
        () => ({
            getFormData: () => ({
                startDate: startDate ? formatLocalDateKey(startDate) : null,
                endDate: endDate ? formatLocalDateKey(endDate) : null,
                hours: isSameDay ? hours : 8,
                isSameDay,
                numberOfDays: calculateDays(),
            }),
            isValid: () => isFormValid,
            reset: () => {
                setStartDate(new Date());
                setEndDate(null);
                setHours(8);
            },
        }),
        [startDate, endDate, hours, isSameDay, isFormValid, calculateDays]
    );

    const handleStartDateSelect = (date) => {
        setStartDate(date);
        setStartDateOpen(false);

        if (endDate && date && formatLocalDateKey(date) > formatLocalDateKey(endDate)) {
            setEndDate(date);
        }
    };

    const handleEndDateSelect = (date) => {
        setEndDate(date);
        setEndDateOpen(false);
    };

    const handleHoursChange = (e) => {
        let value = parseFloat(e.target.value);

        if (isNaN(value) || value < 0) {
            setHours('');
            return;
        }

        if (value > 8) {
            value = 8;
        }

        setHours(value);
    };

    useEffect(() => {
        if (!isSameDay && startDate && endDate) {
            setHours(8);
        }
    }, [isSameDay, startDate, endDate]);

    return {
        startDate,
        endDate,
        hours,
        isSameDay,
        startDateOpen,
        setStartDateOpen,
        endDateOpen,
        setEndDateOpen,
        handleStartDateSelect,
        handleEndDateSelect,
        handleHoursChange,
        numberOfDays: calculateDays(),
    };
}
