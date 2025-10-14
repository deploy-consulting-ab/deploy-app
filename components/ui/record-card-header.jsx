import * as React from 'react';
import { Card, CardHeader, CardAction, CardTitle, CardDescription } from '@/components/ui/card';

export function RecordCardHeaderComponent({ title, description, children }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
                <CardAction className="self-center">{children}</CardAction>
            </CardHeader>
        </Card>
    );
}
