import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export function AbsenceSelectorComponent({
    absenceApplicationTypes,
    handleAbsenceApplicationTypeSelected,
}) {
    return (
        <Select onValueChange={handleAbsenceApplicationTypeSelected}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an absence type" />
            </SelectTrigger>
            <SelectContent>
                {Object.entries(absenceApplicationTypes).map(([id, name]) => (
                    <SelectItem key={id} value={id}>
                        {name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
