import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/employees")({
  component: EmployeesRoute,
});

function EmployeesRoute() {
  return <div>Hello "/employees"!</div>;
}
