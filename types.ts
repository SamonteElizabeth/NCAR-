
export type Role = 'LEAD_AUDITOR' | 'AUDITOR' | 'AUDITEE';

export enum AuditStatus {
  PLANNED = 'Planned',
  ACTUAL = 'Actual Audit',
  COMPLETED = 'Completed'
}

export enum NCARStatus {
  OPEN = 'Open',
  ACTION_PLAN_SUBMITTED = 'Action Plan Submitted',
  REJECTED = 'Rejected',
  VALIDATED = 'Validated',
  CLOSED = 'Closed',
  REOPENED = 'Reopened'
}

export interface AuditPlan {
  id: string;
  startDate: string;
  endDate: string;
  auditors: string[];
  auditees: string[];
  attachmentName?: string;
  status: AuditStatus;
  isLocked: boolean;
  createdAt: string;
}

export interface NCAR {
  id: string;
  auditPlanId: string;
  statement: string;
  requirement: string;
  evidence: string;
  findingType: 'Major' | 'Minor' | 'OFI';
  standardClause: string;
  area: string;
  auditor: string;
  auditee: string;
  createdAt: string;
  status: NCARStatus;
  deadline: string; // 5 working days from creation
}

export interface ActionPlan {
  id: string;
  ncarId: string;
  immediateCorrection: string;
  responsiblePerson: string;
  rootCause: string;
  correctiveAction: string;
  dueDate: string;
  submittedAt: string;
  remarks?: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  timestamp: string;
}
