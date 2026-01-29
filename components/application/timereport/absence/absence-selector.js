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
                {absenceApplicationTypes.map((absenceApplicationType) => (
                    <SelectItem key={absenceApplicationType.id} value={absenceApplicationType.id}>
                        {absenceApplicationType.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
