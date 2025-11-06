import { BasicInfo } from "@/types";

const deptMap: Record<string, string> = {
  Engineering: "ENG",
  Operations: "OPS",
  Lending: "LEN",
  Funding: "FND",
};

export const generateEmployeeId = async (deptName: string): Promise<string> => {
  const prefix = deptMap[deptName] || 'UNK'
  try {
    const res = await fetch('http://localhost:4001/basicInfo')
    const data: BasicInfo[] = await res.json()
    const count = data.filter(d => d.employeeId?.startsWith(prefix)).length
    const seq = (count + 1).toString().padStart(3, '0')
    return `${prefix}-${seq}`
  } catch {
    // Fallback for offline/dev
    return `${prefix}-001`
  }
};
