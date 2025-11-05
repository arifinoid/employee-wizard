export type Role = "admin" | "ops";

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

export interface Employee extends BasicInfo, Details {}

export interface Department {
  id: number;
  name: string;
}

export interface Location {
  id: number;
  name: string;
}
