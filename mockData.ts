
import { AuditPlan, AuditStatus, NCAR, NCARStatus, Role, ActionPlan } from './types';

export const USERS = [
  { name: 'John Doe', role: 'LEAD_AUDITOR' as Role, dept: 'Quality' },
  { name: 'Alice Smith', role: 'AUDITOR' as Role, dept: 'InfoSec' },
  { name: 'Bob Johnson', role: 'AUDITEE' as Role, dept: 'Finance' },
  { name: 'Charlie Davis', role: 'AUDITEE' as Role, dept: 'Operations' },
];

export const INITIAL_AUDIT_PLANS: AuditPlan[] = [
  {
    id: 'AP_000001_202310',
    startDate: '2023-10-01',
    endDate: '2023-10-05',
    auditors: ['John Doe'],
    auditees: ['Bob Johnson'],
    attachmentName: 'financial_audit_scope_v1.pdf',
    status: AuditStatus.PLANNED,
    isLocked: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'AP_000002_202309',
    startDate: '2023-09-15',
    endDate: '2023-09-20',
    auditors: ['Alice Smith'],
    auditees: ['Charlie Davis'],
    attachmentName: 'isms_certification_checklist.docx',
    status: AuditStatus.ACTUAL,
    isLocked: true,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_NCARS: NCAR[] = [
  {
    id: 'NCAR_000001_202309',
    auditPlanId: 'AP_000002_202309',
    statement: 'Passwords were found written on sticky notes in the open workspace.',
    requirement: 'ISO 27001 Clause A.9.4',
    evidence: 'Physical observation at desk #42',
    findingType: 'Major',
    standardClause: '8.1',
    area: 'Operations',
    auditor: 'Alice Smith',
    auditee: 'Charlie Davis',
    createdAt: '2023-09-16T10:00:00Z',
    status: NCARStatus.OPEN,
    deadline: '2023-09-23T10:00:00Z'
  },
  {
    id: 'NCAR_000002_202310',
    auditPlanId: 'AP_000001_202310',
    statement: 'Travel expense reports were approved without supporting receipts.',
    requirement: 'Financial Policy Section 4.2',
    evidence: 'Sample of 5 reports in July cycle',
    findingType: 'Minor',
    standardClause: '4.2',
    area: 'Finance',
    auditor: 'John Doe',
    auditee: 'Bob Johnson',
    createdAt: '2023-10-02T14:30:00Z',
    status: NCARStatus.ACTION_PLAN_SUBMITTED,
    deadline: '2023-10-09T14:30:00Z'
  }
];

export const INITIAL_ACTION_PLANS: ActionPlan[] = [
  {
    id: 'ACT_000001_202310',
    ncarId: 'NCAR_000002_202310',
    immediateCorrection: 'All 5 flagged reports have been recalled and receipts provided.',
    responsiblePerson: 'Bob Johnson',
    rootCause: 'Lack of automated validation in the expense portal allowing submission without attachments.',
    correctiveAction: 'Implement mandatory attachment validation in the ERP expense module and conduct refresher training.',
    dueDate: '2023-11-15',
    submittedAt: '2023-10-04T09:00:00Z'
  }
];
