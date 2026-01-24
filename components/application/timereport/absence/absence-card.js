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
import { useState, useTransition, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { AbsenceSelectorComponent } from '@/components/application/timereport/absence/absence-selector';
import { getAbsenceComponentForAbsenceApplicationType } from '@/components/application/timereport/absence/absence-component-selector';
import { Separator } from '@/components/ui/separator';
import { createAbsenceApplication } from '@/actions/flex/flex-actions';
import { toastRichSuccess, toastRichError } from '@/lib/toast-library';

export function AbsenceCardComponent({ employmentNumber }) {
    const [selectedAbsenceApplicationType, setSelectedAbsenceApplicationType] = useState(null);
    const [isSubmitting, startTransition] = useTransition();
    const [isOpen, setIsOpen] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const formRef = useRef(null);

    const absenceApplicationTypes = [
        { id: 'holiday-absence-request', name: 'Holiday Absence Request' },
    ];

    const handleAbsenceApplicationTypeSelected = (absenceApplicationTypeId) => {
        setSelectedAbsenceApplicationType(absenceApplicationTypeId);
    };

    const handleOpenChange = (open) => {
        setIsOpen(open);
        if (!open) {
            setSelectedAbsenceApplicationType(null);
            setIsFormValid(false);
            formRef.current?.reset?.();
        }
    };

    const handleSubmit = () => {
        if (!formRef.current?.isValid?.()) {
            return;
        }

        const formData = formRef.current.getFormData();

        startTransition(async () => {
            try {
                const response = await createAbsenceApplication(
                    employmentNumber,
                    selectedAbsenceApplicationType,
                    formData
                );
                // Close dialog on success
                setIsOpen(false);
                setSelectedAbsenceApplicationType(null);
                toastRichSuccess({
                    message: 'Absence application created successfully',
                    duration: 2000,
                });
            } catch (error) {
                toastRichError({
                    message: 'Error creating absence application',
                    duration: 2000,
                });
                console.error('Error creating absence application:', error);
            }
        });
    };

    const AbsenceComponent = getAbsenceComponentForAbsenceApplicationType(
        selectedAbsenceApplicationType
    );

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
                            absenceApplicationTypes={absenceApplicationTypes}
                            handleAbsenceApplicationTypeSelected={
                                handleAbsenceApplicationTypeSelected
                            }
                        />
                    </div>
                    {selectedAbsenceApplicationType && (
                        <>
                            <Separator />
                            <div className="flex flex-col gap-2 py-6">
                                <AbsenceComponent ref={formRef} onValidityChange={setIsFormValid} />
                            </div>
                        </>
                    )}
                    <DialogFooter className="border-t pt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" disabled={isSubmitting}>
                                Close
                            </Button>
                        </DialogClose>
                        {selectedAbsenceApplicationType && (
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting || !isFormValid}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                            </Button>
                        )}
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
