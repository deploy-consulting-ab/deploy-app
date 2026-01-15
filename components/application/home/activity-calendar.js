'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function ActivityCalendar({ activeDays = [], currentMonth = 'January' }) {
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);

    // Get current date
    const today = new Date();
    const currentDay = today.getDate();

    // Generate calendar days for the month
    const daysInMonth = 31; // You can make this dynamic
    const firstDay = 1; // Monday (0 = Sunday, 1 = Monday, etc.)

    const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

    const getDayStatus = (day) => {
        if (activeDays.includes(day)) return 'active';
        if (day === currentDay) return 'today';
        if (day < currentDay) return 'past';
        return 'future';
    };

    return (
        <Card className="p-6 bg-gradient-to-br from-[#4c6ef5] to-[#5f3dc4] border-0">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Your Active Days</h3>
                    <button className="flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors">
                        {selectedMonth}
                        <ChevronDown className="h-4 w-4" />
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((day) => (
                        <div key={day} className="text-center text-xs font-medium text-white/70">
                            {day}
                        </div>
                    ))}

                    {Array.from({ length: daysInMonth }).map((_, index) => {
                        const day = index + 1;
                        const status = getDayStatus(day);

                        return (
                            <div
                                key={day}
                                className={cn(
                                    'aspect-square rounded-full flex items-center justify-center text-sm font-medium transition-all cursor-pointer',
                                    status === 'active' &&
                                        'bg-white/95 text-[#4c6ef5] font-bold hover:bg-white',
                                    status === 'today' &&
                                        'bg-[#a9e34b] text-gray-900 font-bold ring-2 ring-white',
                                    status === 'past' && 'bg-white/10 text-white/50',
                                    status === 'future' && 'text-white/40 hover:bg-white/5'
                                )}
                            >
                                {day}
                            </div>
                        );
                    })}
                </div>

                <div className="pt-2 border-t border-white/10">
                    <p className="text-sm text-white/80">
                        You have <span className="font-bold text-white">{activeDays.length}</span>{' '}
                        active days this month
                    </p>
                </div>
            </div>
        </Card>
    );
}
