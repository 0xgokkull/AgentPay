import { AgentConsole } from "@/components/dashboard/agent-console";

export default function AgentConsolePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Agent Integration
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Frontend integration for running payment, registration, and treasury
          agents one by one.
        </p>
      </div>

      <AgentConsole />
    </div>
  );
}
