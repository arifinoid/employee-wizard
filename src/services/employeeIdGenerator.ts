const deptMap: Record<string, string> = {
  Engineering: "ENG",
  Operations: "OPS",
  Lending: "LEN",
  Funding: "FND",
};

export const generateEmployeeId = async (deptName: string): Promise<string> => {
  const prefix = deptMap[deptName] || "UNK";
  const res = await fetch("http://localhost:4001/basicInfo");
  const data: any[] = await res.json();
  const count = data.filter((d) => d.employeeId?.startsWith(prefix)).length;
  const seq = (count + 1).toString().padStart(3, "0");
  return `${prefix}-${seq}`;
};
