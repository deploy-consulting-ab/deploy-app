'use client';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AbsenceSelectorComponent } from '@/components/application/timereport/absence/absence-selector';
import { getAbsenceComponentForProject } from '@/components/application/timereport/absence/absence-component-selector';

export function AbsenceCardComponent() {
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const projects = [
        { id: 'project-1', name: 'Project 1' },
        { id: 'project-2', name: 'Project 2' },
        { id: 'project-3', name: 'Project 3' },
    ];

    const handleProjectSelected = (projectId) => {
        setSelectedProjectId(projectId);
    };

    const AbsenceLayoutComponent = getAbsenceComponentForProject(selectedProjectId);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Request Absence</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Absence Card</DialogTitle>
                    <DialogDescription>Select a project to request an absence.</DialogDescription>
                </DialogHeader>
                <AbsenceSelectorComponent
                    projects={projects}
                    handleProjectSelected={handleProjectSelected}
                />
                <AbsenceLayoutComponent />
                <DialogFooter className="border-t pt-4">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
