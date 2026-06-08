import {
    PROJECT_TYPE_INTERNAL,
    PROJECT_TYPE_EXTERNAL,
    PROJECT_STATUS_DRAFT,
    PROJECT_STATUS_CANCELLED,
    OPPORTUNITY_STATUS_CLOSED_WON,
    OPPORTUNITY_STATUS_CLOSED_LOST,
    OPPORTUNITY_STATUS_CLOSED_DECLINED,
} from '@/actions/salesforce/constants';

/* ─── Shared query utilities ────────────────────────────────────────────── */

/**
 * Always-included Assignment fields that are never gated by field permissions.
 * These are required for core app functionality (routing, status display, etc.)
 */
const ASSIGNMENT_BASE_FIELDS = [
    'Id',
    'Name',
    'StartDate__c',
    'EndDate__c',
    'ProjectStatus__c',
    'Project__r.Name',
    'Project__r.FlexID__c',
    'ProjectedHours__c',
    'ActualHours__c',
    'CurrencyIsoCode',
];

/**
 * Always-included Opportunity fields that are never gated by field permissions.
 */
const OPPORTUNITY_BASE_FIELDS = [
    'Id',
    'Name',
    'StageName',
    'CloseDate',
    'Account.Name',
    'CurrencyIsoCode',
];

/**
 * Build a SOQL SELECT clause from base fields + permitted optional fields.
 * @param {string[]} baseFields - Always-included fields
 * @param {Set<string>|null} permittedFields - Optional fields permitted for this user (null = base fields only)
 * @returns {string} Comma-separated SELECT field list
 */
const buildSelectClause = (baseFields, permittedFields) => {
    if (!permittedFields) return baseFields.join(', ');
    return [...baseFields, ...permittedFields].join(', ');
};

/* ─── Assignment queries ────────────────────────────────────────────────── */

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

const getAssignmentByIdQuery = (assignmentId) => {
    return `SELECT Id, Project__r.FlexID__c, Name, StartDate__c, EndDate__c, ProjectStatus__c, Project__r.Name, ProjectedHours__c, ActualHours__c 
            FROM Assignment__c 
            WHERE Id = '${assignmentId}' LIMIT 1`;
};

const getAssignmentByIdAndEmployeeNumberQuery = (assignmentId, employeeNumber) => {
    return `SELECT Id, Project__r.FlexID__c, Name, StartDate__c, EndDate__c, ProjectStatus__c, Project__r.Name, ProjectedHours__c, ActualHours__c 
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
    return `SELECT Id, StartDate__c, EndDate__c, ProjectType__c, Project__r.ProjectCode__c, Project__r.Name, Project__r.FlexID__c, Project__r.Account__r.Name, Role__r.FlexID__c 
            FROM Assignment__c 
            WHERE Resource__r.EmployeeId__c = '${employeeNumber}'
            AND Project__r.FlexID__c != NULL
            AND ProjectStatus__c != '${PROJECT_STATUS_DRAFT}'
            AND ProjectStatus__c != '${PROJECT_STATUS_CANCELLED}'
            AND (
                (StartDate__c <= ${startDate} AND EndDate__c >= ${endDate})
                OR
                ProjectType__c = '${PROJECT_TYPE_INTERNAL}'
            )
            ORDER BY ProjectType__c, EndDate__c DESC`;
};

/* ─── Dynamic Assignment query builders (field-level permission aware) ──── */

/**
 * @param {string} employeeNumber
 * @param {Set<string>|null} permittedFields - null means base fields only
 */
const getAssignmentsByEmployeeNumberQueryDynamic = (employeeNumber, permittedFields) => {
    const select = buildSelectClause(ASSIGNMENT_BASE_FIELDS, permittedFields);
    return `SELECT ${select} FROM Assignment__c 
            WHERE Resource__r.EmployeeId__c = '${employeeNumber}' 
            AND ProjectStatus__c != '${PROJECT_STATUS_DRAFT}'
            AND ProjectStatus__c != '${PROJECT_STATUS_CANCELLED}'
            AND ProjectType__c = '${PROJECT_TYPE_EXTERNAL}'
            ORDER BY StartDate__c DESC`;
};

const getAssignmentByIdAndEmployeeNumberQueryDynamic = (
    assignmentId,
    employeeNumber,
    permittedFields
) => {
    const select = buildSelectClause(ASSIGNMENT_BASE_FIELDS, permittedFields);
    return `SELECT ${select} FROM Assignment__c 
            WHERE Id = '${assignmentId}' AND Resource__r.EmployeeId__c = '${employeeNumber}' LIMIT 1`;
};

const getAssignmentByIdQueryDynamic = (assignmentId, permittedFields) => {
    const select = buildSelectClause(ASSIGNMENT_BASE_FIELDS, permittedFields);
    return `SELECT ${select} FROM Assignment__c 
            WHERE Id = '${assignmentId}' LIMIT 1`;
};

/* ─── Opportunity queries ───────────────────────────────────────────────── */

const getOpportunitiesQuery = () => {
    return `SELECT Id, Name, StageName, CloseDate, Amount, Account.Name, CurrencyIsoCode, ProductType__c 
            FROM Opportunity 
            WHERE StageName != '${OPPORTUNITY_STATUS_CLOSED_LOST}'
            AND StageName != '${OPPORTUNITY_STATUS_CLOSED_DECLINED}'
            AND StageName != '${OPPORTUNITY_STATUS_CLOSED_WON}'
            ORDER BY CloseDate DESC`;
};

const getOpportunitiesByNameQuery = (name) => {
    return `SELECT Id, Name, StageName, CloseDate, Amount, Account.Name, CurrencyIsoCode, ProductType__c 
            FROM Opportunity WHERE Name LIKE '%${name}%' 
            AND StageName != '${OPPORTUNITY_STATUS_CLOSED_LOST}'
            AND StageName != '${OPPORTUNITY_STATUS_CLOSED_DECLINED}'
            AND StageName != '${OPPORTUNITY_STATUS_CLOSED_WON}'
            ORDER BY CloseDate DESC`;
};

const getOpportunityByIdQuery = (opportunityId) => {
    return `SELECT Id, Name, StageName, CloseDate, Amount, Account.Name, CurrencyIsoCode, ProductType__c 
            FROM Opportunity WHERE Id = '${opportunityId}'
            LIMIT 1`;
};

const getQuoteLinesQuery = (opportunityId) => {
    return `SELECT Id, ServiceDate, EndDate__c, Product2.Name
            FROM QuoteLineItem WHERE Quote.OpportunityId = '${opportunityId}' AND Quote.IsSyncing = true`;
};

/* ─── Dynamic Opportunity query builders (field-level permission aware) ─── */

/**
 * @param {Set<string>|null} permittedFields - null means base fields only
 */
const getOpportunitiesQueryDynamic = (permittedFields) => {
    const select = buildSelectClause(OPPORTUNITY_BASE_FIELDS, permittedFields);
    return `SELECT ${select} FROM Opportunity 
            WHERE StageName != '${OPPORTUNITY_STATUS_CLOSED_LOST}'
            AND StageName != '${OPPORTUNITY_STATUS_CLOSED_DECLINED}'
            AND StageName != '${OPPORTUNITY_STATUS_CLOSED_WON}'
            ORDER BY CloseDate DESC`;
};

const getOpportunityByIdQueryDynamic = (opportunityId, permittedFields) => {
    const select = buildSelectClause(OPPORTUNITY_BASE_FIELDS, permittedFields);
    return `SELECT ${select} FROM Opportunity WHERE Id = '${opportunityId}' LIMIT 1`;
};

/* ─── Occupancy rate queries ────────────────────────────────────────────── */

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

const getOccupancyHistoryQuery = (employeeNumber, today) => {
    return `SELECT Id, OccupancyRate__c, Date__c, Year__c, Month__c, 
            ExternalMonthHours__c, InternalMonthHours__c, TotalMonthlyHours__c, TotalHours__c
            FROM HistoricalHour__c 
            WHERE Resource__r.EmployeeId__c = '${employeeNumber}' AND Date__c <= ${today}
            ORDER BY Date__c DESC`;
};

const getOccupancyHistoryCountQuery = (employeeNumber, today) => {
    return `SELECT COUNT() FROM HistoricalHour__c 
            WHERE Resource__r.EmployeeId__c = '${employeeNumber}' AND Date__c <= ${today}`;
};

const getOccupancyByDateRangeQuery = (employeeNumber, startDate, endDate) => {
    return `SELECT Id, OccupancyRate__c, Date__c, Year__c, Month__c
            FROM HistoricalHour__c 
            WHERE Resource__r.EmployeeId__c = '${employeeNumber}'
            AND Date__c >= ${startDate}
            AND Date__c <= ${endDate}
            ORDER BY Date__c ASC`;
};

/* ─── Holiday queries ───────────────────────────────────────────────────── */

const getSalesforcePublicHolidaysQuery = () => {
    return `SELECT Id, Name, ActivityDate FROM Holiday`;
};

/* ─── Employee queries ──────────────────────────────────────────────────── */

const getEmployeesWithActiveAssignmentsQuery = (employeeNumbers, date) => {
    return `SELECT Id, EmployeeId__c
            FROM Employee__c 
            WHERE Id IN (
                SELECT Resource__c 
                FROM Assignment__c 
                WHERE StartDate__c <= ${date} 
                AND Resource__r.EmployeeId__c IN (${employeeNumbers})
                AND (EndDate__c >= ${date} OR EndDate__c = NULL)
                AND ProjectType__c = '${PROJECT_TYPE_EXTERNAL}'
                AND ProjectStatus__c != '${PROJECT_STATUS_DRAFT}'
                AND ProjectStatus__c != '${PROJECT_STATUS_CANCELLED}'
            )

            ORDER BY Name ASC`;
};

const getEmployeesQuery = () => {
    return `SELECT Id, Name, EmployeeId__c, IsActive__c, EmploymentType__c, EmploymentStartDate__c, EmploymentEndDate__c
            FROM Employee__c
            ORDER BY IsActive__c DESC, CreatedDate ASC, Name ASC`;
};

const getEmployeeByIdQuery = (employeeId) => {
    return `SELECT Id, Name, EmployeeId__c, IsActive__c, EmploymentType__c, EmploymentStartDate__c, EmploymentEndDate__c, FlexID__c
            FROM Employee__c WHERE Id = '${employeeId}' LIMIT 1`;
};

const getEmployeesByNameOrEmployeeIdQuery = (query) => {
    return `SELECT Id, Name, EmployeeId__c, IsActive__c, EmploymentType__c, EmploymentStartDate__c, EmploymentEndDate__c
            FROM Employee__c
            WHERE Name LIKE '%${query}%' OR EmployeeId__c LIKE '%${query}%'
            ORDER BY IsActive__c DESC, Name ASC`;
};

export {
    getAssignmentsByEmployeeNumberQuery,
    getAssignmentByIdQuery,
    getAssignmentByIdAndEmployeeNumberQuery,
    getAssignmentTimecardsQuery,
    getCurrentAssignmentsByEmployeeNumberQuery,
    getAssignmentsByEmployeeNumberAndProjectNameQuery,
    getAssignmentsMetricsQuery,
    getOpportunitiesQuery,
    getOpportunitiesByNameQuery,
    getOpportunityByIdQuery,
    getRecentOccupancyRateQuery,
    getOccupancyRateFromLastFiscalYearQuery,
    getOccupancyHistoryQuery,
    getOccupancyHistoryCountQuery,
    getOccupancyByDateRangeQuery,
    getSalesforcePublicHolidaysQuery,
    getEmployeesWithActiveAssignmentsQuery,
    getEmployeesQuery,
    getEmployeeByIdQuery,
    getEmployeesByNameOrEmployeeIdQuery,
    getQuoteLinesQuery,
    getAssignmentsByEmployeeNumberQueryDynamic,
    getAssignmentByIdAndEmployeeNumberQueryDynamic,
    getAssignmentByIdQueryDynamic,
    getOpportunitiesQueryDynamic,
    getOpportunityByIdQueryDynamic,
};
