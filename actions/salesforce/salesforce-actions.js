"use server";

import { queryData } from './salesforce-service';
import { getAssignmentsByEmployeeNumberQuery, getAssignmentByIdQuery, getOpportunitiesQuery } from './queries';

export async function getAssignmentsByEmployeeNumber(employeeNumber) {
    const result = await queryData(getAssignmentsByEmployeeNumberQuery(employeeNumber));
    return result.map((assignment) => ({
        id: assignment.Id,
        name: assignment.Name,
        startDate: assignment.StartDate__c,
        endDate: assignment.EndDate__c,
        projectStatus: assignment.ProjectStatus__c,
        projectName: assignment.Project__r.Name,
    }));
}

export async function getAssignmentById(assignmentId) {
    const results = await queryData(getAssignmentByIdQuery(assignmentId));
   
    const result = results[0];
    
    return {
        id: result.Id,
        name: result.Name,
        startDate: result.StartDate__c,
        endDate: result.EndDate__c,
        projectStatus: result.ProjectStatus__c,
        projectName: result.Project__r.Name,
    };
}

export async function getOpportunities() {
    const result = await queryData(getOpportunitiesQuery());
    return result.map((opportunity) => ({
        id: opportunity.Id,
        name: opportunity.Name,
        stage: opportunity.StageName,
        closeDate: opportunity.CloseDate,
        amount: opportunity.Amount,
        accountName: opportunity.Account.Name,
        currency: opportunity.CurrencyIsoCode,
    }));
}