import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export function AbsenceSelectorComponent({ projects, handleProjectSelected}) {
    return (
        <Select onValueChange={handleProjectSelected}>
            <SelectTrigger>
                <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
                {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                        {project.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
