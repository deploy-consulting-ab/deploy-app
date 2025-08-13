'use server';

export const fetchAssignments = async () => {
    const assignments = [
        {
            id: 1,
            name: 'Assignment 1',
            status: 'In Progress',
            startDate: '2021-01-01',
            endDate: '2022-01-02',
            assignee: 'Álvaro',
        },
        {
            id: 2,
            name: 'Assignment 2',
            status: 'Done',
            startDate: '2021-01-01',
            endDate: '2022-01-02',
            assignee: 'Álvaro',
        },
        {
            id: 3,
            name: 'Assignment 3',
            status: 'Not Started',
            startDate: '2025-08-14',
            endDate: '2025-08-15',
            assignee: 'Álvaro',
        },
        {
            id: 4,
            name: 'Assignment 4',
            status: 'Done',
            startDate: '2024-01-01',
            endDate: '2024-09-02',
            assignee: 'Álvaro',
        },
    ];

    return assignments;
};
