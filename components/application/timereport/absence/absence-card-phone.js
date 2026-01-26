'use client';

import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
    SheetClose,
} from '@/components/ui/sheet';
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
import { CalendarOff } from 'lucide-react';

/**
 * Mobile-optimized absence card component using a bottom sheet.
 * Provides a touch-friendly interface for requesting absences on phone screens.
 *
 * @param {Object} props
 * @param {string} props.employmentNumber - The employee's employment number
 */
export function AbsenceCardPhoneComponent({ employmentNumber }) {
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
                // Close sheet on success
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
        <Sheet open={isOpen} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <CalendarOff className="h-4 w-4" />
                    <span>Request Absence</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] overflow-y-auto rounded-t-xl">
                <SheetHeader>
                    <SheetTitle>Request Absence</SheetTitle>
                    <SheetDescription>Select a type to request an absence.</SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-4 px-4 pb-4">
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
                            <Tabs
                                defaultValue="new-request"
                                value={activeTab}
                                onValueChange={setActiveTab}
                                className="w-full"
                            >
                                <TabsList className="w-full">
                                    <TabsTrigger value="new-request" className="flex-1">
                                        New Request
                                    </TabsTrigger>
                                    <TabsTrigger value="requested" className="flex-1">
                                        Requested
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="new-request" className="py-4">
                                    <AbsenceComponent
                                        ref={formRef}
                                        onValidityChange={setIsFormValid}
                                    />
                                </TabsContent>
                                <TabsContent value="requested" className="py-4">
                                    {AbsenceRequestedListComponent && (
                                        <AbsenceRequestedListComponent
                                            employmentNumber={employmentNumber}
                                        />
                                    )}
                                </TabsContent>
                            </Tabs>
                        </>
                    )}
                </div>

                <SheetFooter className="border-t">
                    <div className="flex w-full gap-3">
                        <SheetClose asChild>
                            <Button
                                type="button"
                                variant="secondary"
                                disabled={isSubmitting}
                                className="flex-1"
                            >
                                Close
                            </Button>
                        </SheetClose>
                        {activeTab === 'new-request' && selectedAbsenceApplicationType && (
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting || !isFormValid}
                                className="flex-1"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                            </Button>
                        )}
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
