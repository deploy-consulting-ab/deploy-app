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
import { Separator } from '@/components/ui/separator';

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

    const handleOpenChange = (open) => {
        if (!open) {
            setSelectedProjectId(null);
        }
    };

    const AbsenceComponent = getAbsenceComponentForProject(selectedProjectId);

    return (
        <Dialog onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline">Request Absence</Button>
            </DialogTrigger>
            <DialogContent className="w-full max-h-[90vh] overflow-y-auto sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Request Absence</DialogTitle>
                    <DialogDescription>Select a project to request an absence.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 pb-4">
                        <AbsenceSelectorComponent
                            projects={projects}
                            handleProjectSelected={handleProjectSelected}
                        />
                    </div>
                    {selectedProjectId && (
                        <>
                            <Separator />
                            <div className="flex flex-col gap-2 py-6">
                                <AbsenceComponent />
                            </div>
                        </>
                    )}
                    <DialogFooter className="border-t pt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
