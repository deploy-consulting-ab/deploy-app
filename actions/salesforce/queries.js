const getAssignmentsByEmployeeNumberQuery = (employeeNumber) => {
    return `SELECT Id, Name, StartDate__c, EndDate__c, ProjectStatus__c, Project__r.Name FROM Assignment__c 
            WHERE Resource__r.EmployeeId__c = '${employeeNumber}' 
            AND ProjectStatus__c != 'Draft'
            AND ProjectStatus__c != 'Cancelled'
            AND ProjectType__c = 'External Project'
            ORDER BY StartDate__c DESC`;
};

const getAssignmentsByEmployeeNumberAndProjectNameQuery = (employeeNumber, projectName) => {
    return `SELECT Id, Name, StartDate__c, EndDate__c, ProjectStatus__c, Project__r.Name, Project__r.Account__r.Name FROM Assignment__c 
            WHERE Resource__r.EmployeeId__c = '${employeeNumber}' 
            AND Project__r.Name LIKE '%${projectName}%'
            AND ProjectStatus__c != 'Draft'
            AND ProjectStatus__c != 'Cancelled'
            AND ProjectType__c = 'External Project'
            ORDER BY StartDate__c DESC`;
};

const getAssignmentByIdQuery = (assignmentId) => {
    return `SELECT Id, Name, StartDate__c, EndDate__c, ProjectStatus__c, Project__r.Name, ProjectedHours__c, ActualHours__c FROM Assignment__c WHERE Id = '${assignmentId}' LIMIT 1`;
};

const getAssignmentTimecardsQuery = (assignmentId) => {
    return `SELECT Id, StartDate__c, EndDate__c,MondayHours__c, TuesdayHours__c, WednesdayHours__c, ThursdayHours__c, FridayHours__c, SaturdayHours__c, SundayHours__c FROM Timecard__c WHERE Assignment__c = '${assignmentId}' ORDER BY StartDate__c DESC`;
};

const getOpportunitiesQuery = () => {
    return `SELECT Id, Name, StageName, CloseDate, Amount, Account.Name, CurrencyIsoCode FROM Opportunity ORDER BY CloseDate DESC`;
};

const getOpportunitiesByNameQuery = (name) => {
    return `SELECT Id, Name, StageName, CloseDate, Amount, Account.Name, CurrencyIsoCode FROM Opportunity WHERE Name LIKE '%${name}%' ORDER BY CloseDate DESC`;
};

const getOpportunityByIdQuery = (opportunityId) => {
    return `SELECT Id, Name, StageName, CloseDate, Amount, Account.Name, CurrencyIsoCode FROM Opportunity WHERE Id = '${opportunityId}' LIMIT 1`;
};

const getRecentOccupancyRateQuery = (employeeNumber, today, endDate) => {
    return `SELECT Id, OccupancyRate__c, Date__c, Month__c FROM HistoricalHour__c 
            WHERE Resource__r.EmployeeId__c = '${employeeNumber}' AND Date__c <= ${today}
            ORDER BY Date__c DESC LIMIT 4`;
};

const getOccupancyRateFromLastFiscalYearQuery = (employeeNumber, today, lastFiscalYear) => {
    return `SELECT Id, OccupancyRate__c, Date__c, Year__c, Month__c FROM HistoricalHour__c 
            WHERE Resource__r.EmployeeId__c = '${employeeNumber}' AND Date__c <= ${today} AND Date__c >= ${lastFiscalYear}
            ORDER BY Date__c ASC`;
};

export {
    getAssignmentsByEmployeeNumberQuery,
    getAssignmentByIdQuery,
    getAssignmentTimecardsQuery,
    getOpportunitiesQuery,
    getRecentOccupancyRateQuery,
    getOccupancyRateFromLastFiscalYearQuery,
    getOpportunitiesByNameQuery,
    getOpportunityByIdQuery,
    getAssignmentsByEmployeeNumberAndProjectNameQuery
};
