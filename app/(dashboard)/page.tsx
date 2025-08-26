import LiveBenchmark from "@/components/live-benchmarks";
import UptimeGraph from "@/components/uptime-graph";

export default async function Page() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-6 space-y-6">
        <UptimeGraph />

        <LiveBenchmark />
      </div>
    </div>
  );
}
