import { ICON_MAP } from '@/components/application/search/constants';

export function HomeSearchResults({ totalRecords, slicedRecords, handleSelect, openSearchResults }) {
    return (
        <div className="space-y-1">
            {slicedRecords.map((record) => {
                const SearchIcon = ICON_MAP[record.type];
                return (
                    <div
                        key={record.id}
                        className="p-1.5 sm:p-2 hover:bg-accent rounded-md cursor-pointer"
                        onClick={() => handleSelect(record.type, record)}
                    >
                        <div className="text-xs sm:text-base font-medium truncate">
                            {record.name}
                        </div>
                        <div className="flex items-center gap-2">
                            {SearchIcon && <SearchIcon className="h-4 w-4 shrink-0" />}
                            <div className="text-[10px] sm:text-xs text-muted-foreground truncate">
                                {record.type} - {record.subType}
                            </div>
                        </div>
                    </div>
                );
            })}

            {totalRecords?.length > 5 && (
                <button
                    onClick={openSearchResults}
                    className="w-full text-sm text-muted-foreground hover:text-foreground mt-4 p-2 hover:bg-accent rounded-md text-center"
                >
                    View More
                </button>
            )}
        </div>
    );
}
