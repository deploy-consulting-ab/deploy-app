'use server';

export const fetchAssignments = async () => {
    const assignments = [
        {
            id: 1234,
            name: 'Assignment 1',
            stage: 'In Progress',
            startDate: '2021-01-01',
            endDate: '2022-01-02',
            assignee: 'Álvaro',
        },
        {
            id: 2231,
            name: 'Assignment 2',
            stage: 'Done',
            startDate: '2021-01-01',
            endDate: '2022-01-02',
            assignee: 'Álvaro',
        },
        {
            id: 8293,
            name: 'Assignment 3',
            stage: 'Not Started',
            startDate: '2025-08-14',
            endDate: '2025-08-15',
            assignee: 'Álvaro',
        },
        {
            id: 2399,
            name: 'Assignment 4',
            stage: 'Done',
            startDate: '2024-01-01',
            endDate: '2024-09-02',
            assignee: 'Álvaro',
        },
    ];

    return assignments;
};

export const fetchAssignmentById = async (id) => {
    const assignments = await fetchAssignments();
    return assignments.find(assignment => assignment.id === parseInt(id));
};