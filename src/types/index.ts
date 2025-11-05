import { z } from 'zod'

export const roleSearchSchema = z.object({
  role: z.enum(['admin', 'ops']).catch('ops').default('ops'),
})
export type Role = z.infer<typeof roleSearchSchema>['role']

export interface BasicInfo {
  fullName: string;
  email: string;
  department: string;
  role: string;
  employeeId: string;
}

export interface Details {
  photo: string;
  employmentType: string;
  officeLocation: string;
  notes: string;
}

export interface Employee extends BasicInfo, Details { }

export interface Department {
  id: number;
  name: string;
}

export interface Location {
  id: number;
  name: string;
}
