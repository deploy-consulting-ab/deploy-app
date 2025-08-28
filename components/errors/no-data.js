export function NoDataComponent({ text }) {
    return (
        <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">{text}</p>
        </div>
    );
}
