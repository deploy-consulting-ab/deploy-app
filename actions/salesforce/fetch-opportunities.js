'use server';
export const fetchOpportunities = async () => {
    const opportunities = [
        {
            id: 1,
            name: 'Conquering the world',
            stage: 'Negotation',
            amount: 1000,
            currency: 'SEK',
        },
        {
            id: 2,
            name: 'Write a script',
            stage: 'In Progress',
            amount: 1500,
            currency: 'SEK',
        },
        {
            id: 3,
            name: 'Create a start-up',
            stage: 'Done',
            amount: 3600,
            currency: 'SEK',
        },
        {
            id: 4,
            name: 'Grow to 100 people',
            stage: 'Not started',
            amount: 7000,
            currency: 'SEK',
        },
    ];

    const totalAmount = opportunities.map(opportunity => opportunity.amount).reduce((totalAmount, amount) => totalAmount + amount);
    return {
        opportunities, totalAmount
    };
};