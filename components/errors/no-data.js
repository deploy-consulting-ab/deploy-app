import { Card, CardContent } from '@/components/ui/card';

export function NoDataComponent({ text }) {
    return (
        <Card variant="flat" className="w-full h-full flex items-center justify-center">
            <CardContent className="flex items-center justify-center">
                <p className="text-sm text-muted-foreground">{text}</p>
            </CardContent>
        </Card>
    );
}
