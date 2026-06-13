function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 18) return 'Good afternoon';
    return 'Good evening';
}

export function DashboardHeader({ name }) {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
    const greeting = getGreeting();
    const firstName = name ? name.split(' ')[0] : null;

    return (
        <header className="relative flex items-end justify-between gap-4 pb-4 mb-8">
            {/* Gradient rule: lime → border → transparent */}
            <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{
                    background:
                        'linear-gradient(90deg, var(--deploy-accent-lime) 0%, var(--border) 40%, transparent 100%)',
                }}
            />
            {/* Accent pip */}
            <div
                className="absolute bottom-[-3px] left-0 w-2 h-2 rounded-full"
                style={{
                    background: 'var(--deploy-accent-lime)',
                    boxShadow: '0 0 8px var(--deploy-accent-lime)',
                }}
            />

            <div className="flex flex-col gap-0.5 pb-4">
                <span className="inline-flex items-center gap-1.5">
                    <span className="text-sm font-semibold tracking-[0.18em] uppercase font-mono">
                        {greeting}, {firstName}
                    </span>
                </span>
            </div>

            <div className="flex flex-col gap-1 text-right shrink-0 pb-0.5">
                <span className="text-sm font-medium tracking-[0.12em] uppercase font-mono text-muted-foreground">
                    Today
                </span>
                <span className="text-sm font-medium tracking-[-0.01em] text-foreground">
                    {formattedDate}
                </span>
            </div>
        </header>
    );
}
