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
import {
    getAbsenceComponentForAbsenceApplicationType,
    getAbsenceRequestedListComponentForAbsenceApplicationType,
} from '@/components/application/timereport/absence/absence-component-selector';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { createAbsenceApplication } from '@/actions/flex/flex-actions';
import { toastRichSuccess, toastRichError } from '@/lib/toast-library';
import { ABSENCE_APPLICATION_TYPE_ID_HOLIDAY_ABSENCE_REQUEST } from '@/actions/flex/constants';

export function AbsenceCardComponent({ employmentNumber }) {
    const [selectedAbsenceApplicationType, setSelectedAbsenceApplicationType] = useState(null);
    const [isSubmitting, startTransition] = useTransition();
    const [isOpen, setIsOpen] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [activeTab, setActiveTab] = useState('new-request');
    const formRef = useRef(null);

    const absenceApplicationTypes = [
        {
            id: ABSENCE_APPLICATION_TYPE_ID_HOLIDAY_ABSENCE_REQUEST,
            name: 'Holiday Absence Request',
        },
    ];

    const handleAbsenceApplicationTypeSelected = (absenceApplicationTypeId) => {
        setSelectedAbsenceApplicationType(absenceApplicationTypeId);
    };

    const handleOpenChange = (open) => {
        setIsOpen(open);
        if (!open) {
            setSelectedAbsenceApplicationType(null);
            setIsFormValid(false);
            setActiveTab('new-request');
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
    const AbsenceRequestedListComponent = getAbsenceRequestedListComponentForAbsenceApplicationType(
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
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="w-full">
                                    <TabsTrigger value="new-request" className="flex-1">
                                        New Request
                                    </TabsTrigger>
                                    <TabsTrigger value="requested" className="flex-1">
                                        Requested
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="new-request" className="py-6">
                                    <AbsenceComponent
                                        ref={formRef}
                                        onValidityChange={setIsFormValid}
                                    />
                                </TabsContent>
                                <TabsContent value="requested" className="py-6">
                                    {AbsenceRequestedListComponent && (
                                        <AbsenceRequestedListComponent
                                            employmentNumber={employmentNumber}
                                        />
                                    )}
                                </TabsContent>
                            </Tabs>
                        </>
                    )}
                    <DialogFooter className="border-t pt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" disabled={isSubmitting}>
                                Close
                            </Button>
                        </DialogClose>
                        {activeTab === 'new-request' && selectedAbsenceApplicationType && (
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
