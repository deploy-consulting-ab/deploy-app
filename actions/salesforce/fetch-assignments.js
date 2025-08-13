'use server';

export const fetchAssignments = async () => {
    // In a real app, this would be an API call
    console.log('fetching assignments...');
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

    console.log('assignments...');

    return assignments;
};
/**
 * Fetch an assignment by its ID. Even though this executes a new callout, it makes sense for the following reasons:
 * 1. Resilience & Shareability: A user can refresh the /assignments/some-assignment-slug page or share the link with someone else. If the page relies on data being passed from the previous page, 
 * it will break in these scenarios. A page should be able to render itself with only the information in the URL.
 * 2. Data Freshness: It ensures that the user is always seeing the most up-to-date information for that specific assignment, as it's fetched at the time of the request.
 * @param {number} id - The ID of the assignment to fetch
 * @returns {Promise<Assignment>} The assignment with the given ID
 */
export const fetchAssignmentById = async (id) => {
    // This will use the cached result from fetchAssignments if it was already called
    const assignments = await fetchAssignments();
    return assignments.find((assignment) => assignment.id === parseInt(id));
};
