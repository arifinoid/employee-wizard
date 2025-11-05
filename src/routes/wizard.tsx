import { roleSearchSchema } from "@/types";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/wizard")({
  validateSearch: roleSearchSchema.parse,
  component: WizardRoute,
});

function WizardRoute() {
  const { role } = Route.useSearch()

  return <div>Hello "/wizard/{role}"!</div>;
}
