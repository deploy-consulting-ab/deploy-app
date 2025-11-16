'use client';

import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { OpportunityCardPhoneComponent } from '@/components/application/opportunities/phone/opportunity-card-phone';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { OPPORTUNITIES_ROUTE } from '@/menus/routes';
import { ErrorDisplayComponent } from '@/components/errors/error-display';

export function OpportunitiesListPhoneComponent({ opportunities, error, opportunityViews }) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [view, setView] = useState('all');
    const [displayCount, setDisplayCount] = useState(2);
    const observerTarget = useRef(null);

    const handleFilterOpportunities = (value) => {
        setView(value);
        setDisplayCount(10);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setDisplayCount(10);
    };

    const handleOpportunityClick = (id) => {
        router.push(`${OPPORTUNITIES_ROUTE}/${id}`);
    };

    const filteredOpportunities = () => {
        return (
            opportunities
                ?.filter((opp) => view === 'all' || opp.stage === view)
                ?.filter(
                    (opp) =>
                        searchQuery === '' ||
                        opp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        opp.accountName.toLowerCase().includes(searchQuery.toLowerCase())
                ) || []
        );
    };

    const filtered = filteredOpportunities();
    const displayedOpportunities = filtered.slice(0, displayCount);
    const hasMore = displayCount < filtered.length;

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setDisplayCount((prev) => prev + 10);
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;

        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasMore]);

    if (error) {
        return <ErrorDisplayComponent error={error} />;
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Input
                    placeholder="Search opportunities..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full text-sm"
                />
                <Select
                    value={view}
                    onValueChange={handleFilterOpportunities}
                    key="view-by-opportunities"
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by stage" />
                    </SelectTrigger>
                    <SelectContent>
                        {opportunityViews.map((view) => (
                            <SelectItem key={view.value} value={view.value}>
                                {view.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-4">
                {displayedOpportunities.map((opportunity) => (
                    <OpportunityCardPhoneComponent
                        key={opportunity.id}
                        opportunity={opportunity}
                        onClick={handleOpportunityClick}
                    />
                ))}
                {filtered.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No opportunities found</div>
                )}
            </div>
            {hasMore && (
                <div ref={observerTarget} className="flex justify-center py-4">
                    <div className="text-sm text-gray-500">Loading more...</div>
                </div>
            )}
            {!hasMore && filtered.length > 0 && (
                <div className="text-center py-4 text-sm text-gray-500">
                    All opportunities loaded
                </div>
            )}
        </div>
    );
}
