'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export function EmployeePageComponent({ detailsTab, occupancyTab, assignmentsTab }) {
    return (
        <div className="flex flex-col">
            <Tabs defaultValue="details" className="w-full">
                <TabsList className="w-full">
                    <TabsTrigger value="details" className="flex-1 hover:cursor-pointer">
                        Details
                    </TabsTrigger>
                    <TabsTrigger value="occupancy-rates" className="flex-1 hover:cursor-pointer">
                        Occupancy Rates
                    </TabsTrigger>
                    <TabsTrigger value="assignments" className="flex-1 hover:cursor-pointer">
                        Assignments
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="py-4">
                    {detailsTab}
                </TabsContent>
                <TabsContent value="occupancy-rates" className="py-4">
                    {occupancyTab}
                </TabsContent>
                <TabsContent value="assignments" className="py-4">
                    {assignmentsTab}
                </TabsContent>
            </Tabs>
        </div>
    );
}
