import {
    PROJECT_TYPE_INTERNAL,
    PROJECT_TYPE_EXTERNAL,
    PROJECT_STATUS_DRAFT,
    PROJECT_STATUS_CANCELLED,
    OPPORTUNITY_STATUS_CLOSED_WON,
    OPPORTUNITY_STATUS_CLOSED_LOST,
} from '@/actions/salesforce/constants';

/**
 * Assignments query
 */
const getAssignmentsByEmployeeNumberQuery = (employeeNumber) => {
    return `SELECT Id, Name, StartDate__c, EndDate__c, ProjectStatus__c, Project__r.Name FROM Assignment__c 
            WHERE Resource__r.EmployeeId__c = '${employeeNumber}' 
            AND ProjectStatus__c != '${PROJECT_STATUS_DRAFT}'
            AND ProjectStatus__c != '${PROJECT_STATUS_CANCELLED}'
            AND ProjectType__c = '${PROJECT_TYPE_EXTERNAL}'
            ORDER BY StartDate__c DESC`;
};

const getAssignmentsByEmployeeNumberAndProjectNameQuery = (employeeNumber, projectName) => {
    return `SELECT Id, Name, StartDate__c, EndDate__c, ProjectStatus__c, Project__r.Name, Project__r.Account__r.Name FROM Assignment__c 
            WHERE Resource__r.EmployeeId__c = '${employeeNumber}' 
            AND Project__r.Name LIKE '%${projectName}%'
            AND ProjectStatus__c != '${PROJECT_STATUS_DRAFT}'
            AND ProjectStatus__c != '${PROJECT_STATUS_CANCELLED}'
            AND ProjectType__c = '${PROJECT_TYPE_EXTERNAL}'
            ORDER BY StartDate__c DESC`;
};

const getAssignmentByIdQuery = (assignmentId, employeeNumber) => {
    return `SELECT Id, Name, StartDate__c, EndDate__c, ProjectStatus__c, Project__r.Name, ProjectedHours__c, ActualHours__c 
            FROM Assignment__c 
            WHERE Id = '${assignmentId}' AND Resource__r.EmployeeId__c = '${employeeNumber}' LIMIT 1`;
};

const getAssignmentTimecardsQuery = (assignmentId, employeeNumber) => {
    return `SELECT Id, StartDate__c, EndDate__c,MondayHours__c, TuesdayHours__c, WednesdayHours__c, ThursdayHours__c, FridayHours__c, SaturdayHours__c, SundayHours__c 
            FROM Timecard__c 
            WHERE Assignment__c = '${assignmentId}' AND Assignment__r.Resource__r.EmployeeId__c = '${employeeNumber}'
            ORDER BY StartDate__c DESC`;
};

const getAssignmentsMetricsQuery = (employeeNumber) => {
    return `SELECT Project__r.Status__c, StartDate__c, COUNT(Id) assignmentsMetrics
            FROM Assignment__c
            WHERE Resource__r.EmployeeId__c = '${employeeNumber}'
            AND ProjectType__c = '${PROJECT_TYPE_EXTERNAL}'
            AND ProjectStatus__c != '${PROJECT_STATUS_DRAFT}'
            AND ProjectStatus__c != '${PROJECT_STATUS_CANCELLED}'
            GROUP BY Project__r.Status__c, StartDate__c
            ORDER BY StartDate__c DESC`;
};

const getCurrentAssignmentsByEmployeeNumberQuery = (employeeNumber, startDate, endDate) => {
    return `SELECT Id, StartDate__c, EndDate__c, ProjectType__c, Project__r.Name, Project__r.FlexId__c, Project__r.Account__r.Name 
            FROM Assignment__c 
            WHERE Resource__r.EmployeeId__c = '${employeeNumber}'
            AND Project__r.FlexId__c != NULL
            AND ProjectStatus__c != '${PROJECT_STATUS_DRAFT}'
            AND ProjectStatus__c != '${PROJECT_STATUS_CANCELLED}'
            AND (
                (StartDate__c <= ${startDate} AND EndDate__c >= ${endDate})
                OR
                ProjectType__c = '${PROJECT_TYPE_INTERNAL}'
            )
            ORDER BY ProjectType__c, EndDate__c DESC`;
};
/**
 * Opportunities queries
 */

const getOpportunitiesQuery = () => {
    return `SELECT Id, Name, StageName, CloseDate, Amount, Account.Name, CurrencyIsoCode 
            FROM Opportunity WHERE StageName != '${OPPORTUNITY_STATUS_CLOSED_LOST}' 
            AND StageName != '${OPPORTUNITY_STATUS_CLOSED_WON}' 
            ORDER BY CloseDate DESC`;
};

const getOpportunitiesByNameQuery = (name) => {
    return `SELECT Id, Name, StageName, CloseDate, Amount, Account.Name, CurrencyIsoCode 
            FROM Opportunity WHERE Name LIKE '%${name}%' 
            AND StageName != '${OPPORTUNITY_STATUS_CLOSED_LOST}' AND StageName != '${OPPORTUNITY_STATUS_CLOSED_WON}' ORDER BY CloseDate DESC`;
};

const getOpportunityByIdQuery = (opportunityId) => {
    return `SELECT Id, Name, StageName, CloseDate, Amount, Account.Name, CurrencyIsoCode 
            FROM Opportunity WHERE Id = '${opportunityId}' 
            AND StageName != '${OPPORTUNITY_STATUS_CLOSED_LOST}' AND StageName != '${OPPORTUNITY_STATUS_CLOSED_WON}' LIMIT 1`;
};

/**
 * Occupancy rate queries
 */
const getRecentOccupancyRateQuery = (employeeNumber, today) => {
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
    getCurrentAssignmentsByEmployeeNumberQuery,
    getAssignmentsByEmployeeNumberAndProjectNameQuery,
    getAssignmentsMetricsQuery,
    getOpportunitiesQuery,
    getOpportunitiesByNameQuery,
    getOpportunityByIdQuery,
    getRecentOccupancyRateQuery,
    getOccupancyRateFromLastFiscalYearQuery,
};
