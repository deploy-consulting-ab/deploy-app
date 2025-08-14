const getAssignmentsByEmployeeNumberQuery = (employeeNumber) => {
    return `SELECT Id, Name, StartDate__c, EndDate__c, ProjectStatus__c, Project__r.Name FROM Assignment__c 
            WHERE Resource__r.EmployeeId__c = '${employeeNumber}' 
            AND ProjectStatus__c != 'Draft'
            AND ProjectStatus__c != 'Cancelled'
            AND ProjectType__c = 'External Project'
            ORDER BY StartDate__c DESC`;
};

const getAssignmentByIdQuery = (assignmentId) => {
    return `SELECT Id, Name, StartDate__c, EndDate__c, ProjectStatus__c, Project__r.Name, ProjectedHours__c, ActualHours__c FROM Assignment__c WHERE Id = '${assignmentId}' LIMIT 1`;
};

const getOpportunitiesQuery = () => {
    return `SELECT Id, Name, StageName, CloseDate, Amount, Account.Name, CurrencyIsoCode FROM Opportunity ORDER BY CloseDate DESC`;
};

export { getAssignmentsByEmployeeNumberQuery, getAssignmentByIdQuery, getOpportunitiesQuery };
