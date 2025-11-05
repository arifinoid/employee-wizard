import { z } from 'zod'

export const roleSearchSchema = z.object({
  role: z.enum(['admin', 'ops']).catch('ops').default('ops'),
})

export const basicInfoSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Full name must be less than 100 characters"),
  email: z
    .email("Invalid email address"),
  department: z
    .string()
    .min(1, "Department is required"),
  role: z
    .enum(["admin", "ops", "engineer", "finance"]),
  employeeId: z
    .string()
    .min(1, "Employee ID is required")
    .regex(/^[A-Za-z0-9_-]+$/, "Employee ID must be alphanumeric"),
});

export const detailsSchema = z.object({
  photo: z
    .url("Photo must be a valid URL")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  employmentType: z
    .enum(["full-time", "part-time", "contract", "intern"])
    .default("full-time"),
  officeLocation: z
    .string()
    .min(1, "Office location is required"),
  notes: z
    .string()
    .max(500, "Notes must be under 500 characters")
    .optional()
    .default(""),
});

export const employeeSchema = basicInfoSchema.merge(detailsSchema);
export const departmentSchema = z.object({
  id: z.number().int().nonnegative("Department ID must be a positive integer"),
  name: z.string().min(1, "Department name is required"),
});
export const locationSchema = z.object({
  id: z.number().int().nonnegative("Location ID must be a positive integer"),
  name: z.string().min(1, "Location name is required"),
});

export type BasicInfo = z.infer<typeof basicInfoSchema>;
export type Role = z.infer<typeof roleSearchSchema>['role']
export type Details = z.infer<typeof detailsSchema>
export type Employee = z.infer<typeof employeeSchema>
export type Department = z.infer<typeof departmentSchema>;
export type Location = z.infer<typeof locationSchema>;

