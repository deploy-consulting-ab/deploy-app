export function LoadingSkeleton() {
    return (
        <div className="flex min-h-[calc(100vh-5rem)] flex-col gap-4">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3 flex-none">
                <div className="bg-muted/50 aspect-video rounded-xl" />
                <div className="bg-muted/50 aspect-video rounded-xl" />
                <div className="bg-muted/50 aspect-video rounded-xl" />
            </div>

            <div className="bg-muted/50 flex-1 rounded-xl" />
        </div>
    );
}
