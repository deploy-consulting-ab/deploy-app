'use client';

import { Sparkles } from 'lucide-react';

export function PremiumButton() {
    return (
        <button className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-[#4c6ef5] to-[#5f3dc4] text-white text-sm font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300">
            <Sparkles className="h-4 w-4" />
            Premium
        </button>
    );
}
