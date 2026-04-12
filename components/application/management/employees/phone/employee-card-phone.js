'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';

export function EmployeeCardPhoneComponent({ employee, onClick }) {
    return (
        <Card
            className="w-full mb-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onClick?.(employee.id)}
        >
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold">{employee.name}</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                        <p className="text-sm text-gray-500">Employee ID</p>
                        <p className="font-medium">{employee.employeeId ?? '-'}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
