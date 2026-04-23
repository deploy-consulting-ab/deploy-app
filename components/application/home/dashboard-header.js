export function DashboardHeader ({ label }) {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

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

            <div className="flex flex-col gap-1 pb-4">
                <span className="inline-flex items-center gap-1.5 text-[0.6rem] font-semibold tracking-[0.18em] uppercase font-mono text-deploy-accent-lime">
                    <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                    <span className="text-sm">{label}</span>
                </span>
            </div>

            <div className="flex flex-col gap-1 text-right shrink-0 pb-0.5">
                <span className="text-[0.6rem] font-medium tracking-[0.12em] uppercase font-mono text-muted-foreground">
                    Today
                </span>
                <span className="text-[0.8125rem] font-medium tracking-[-0.01em] text-foreground">
                    {formattedDate}
                </span>
            </div>
        </header>
    );
}
