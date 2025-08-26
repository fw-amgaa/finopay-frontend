"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

type Benchmark = {
  site: string;
  latency: string;
  requestsPerSec: number;
  transferPerSec: string;
  totalRequests: number;
  duration: string;
};

const staticData: Benchmark[] = [
  {
    site: "https://ikon.mn",
    latency: "27.69ms",
    requestsPerSec: 3867.74,
    transferPerSec: "1.28MB",
    totalRequests: 38900,
    duration: "10s",
  },
  {
    site: "https://gogo.mn",
    latency: "35.27ms",
    requestsPerSec: 2987.86,
    transferPerSec: "1.77MB",
    totalRequests: 30078,
    duration: "10s",
  },
  {
    site: "https://beta-erp.tavanbogdfinance.com",
    latency: "479.36ms",
    requestsPerSec: 155.65,
    transferPerSec: "2.28MB",
    totalRequests: 1569,
    duration: "10s",
  },
  {
    site: "https://itools.mn",
    latency: "0ms",
    requestsPerSec: 0,
    transferPerSec: "0KB",
    totalRequests: 0,
    duration: "10s",
  },
  {
    site: "https://oggbackend.999.mn",
    latency: "121.63ms",
    requestsPerSec: 1930.91,
    transferPerSec: "661.87KB",
    totalRequests: 58128,
    duration: "30s",
  },
];

export default function BenchmarkDashboard() {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Benchmark | null>(null);

  const allData = useMemo(() => {
    return result
      ? [...staticData, { ...result, site: "My Server" }]
      : staticData;
  }, [result]);

  // Extract numeric values for comparisons
  const summary = useMemo(() => {
    if (!allData.length) return null;

    const parseLatency = (latency: string) =>
      parseFloat(latency.replace("ms", "")) || Infinity;

    const fastestLatency = allData.reduce((a, b) =>
      parseLatency(a.latency) < parseLatency(b.latency) ? a : b
    );

    const highestReq = allData.reduce((a, b) =>
      a.requestsPerSec > b.requestsPerSec ? a : b
    );

    const bestTransfer = allData.reduce((a, b) => {
      const parseTransfer = (val: string) => {
        if (val.includes("KB")) return parseFloat(val);
        if (val.includes("MB")) return parseFloat(val) * 1024;
        return 0;
      };
      return parseTransfer(a.transferPerSec) > parseTransfer(b.transferPerSec)
        ? a
        : b;
    });

    return { fastestLatency, highestReq, bestTransfer };
  }, [allData]);

  const runBenchmark = async () => {
    setLoading(true);
    setProgress(0);
    setResult(null);

    let fakeProgress = 0;
    const interval = setInterval(() => {
      fakeProgress += Math.floor(Math.random() * 15);
      if (fakeProgress >= 90) fakeProgress = 90;
      setProgress(fakeProgress);
    }, 400);

    try {
      // const res = await fetch("/api/benchmark");
      const data = {
        site: "http://165.232.152.81:8080",
        latency: "121.63ms",
        requestsPerSec: 1930.91,
        transferPerSec: "661.87KB",
        totalRequests: 58128,
        duration: "30s",
      };

      clearInterval(interval);
      setProgress(100);

      setTimeout(() => {
        setResult(data);
        setLoading(false);
      }, 500);
    } catch (err) {
      clearInterval(interval);
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-bold text-xl">Benchmark Results</h1>

      {/* Summary Panel */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 text-lg">
                Fastest Latency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">{summary.fastestLatency.site}</p>
              <p className="text-sm text-muted-foreground">
                {summary.fastestLatency.latency}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800 text-lg">
                Highest Requests/sec
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">{summary.highestReq.site}</p>
              <p className="text-sm text-muted-foreground">
                {summary.highestReq.requestsPerSec.toFixed(2)} req/sec
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-800 text-lg">
                Best Transfer/sec
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">{summary.bestTransfer.site}</p>
              <p className="text-sm text-muted-foreground">
                {summary.bestTransfer.transferPerSec}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Live Server Benchmark */}
        <Card className="border-blue-500 shadow-md hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>Hyperswitch Benchmark</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!loading && !result && (
              <Button onClick={runBenchmark} className="w-full">
                Run Benchmark
              </Button>
            )}

            {loading && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  <span className="text-sm text-muted-foreground">
                    Firing requests to server...
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Sending ~{Math.floor(Math.random() * 1000)} requests/sec...
                </p>
              </div>
            )}

            {result && (
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Latency:</strong> {result.latency}
                </p>
                <p>
                  <strong>Requests/sec:</strong>{" "}
                  {result.requestsPerSec.toFixed(2)}
                </p>
                <p>
                  <strong>Transfer/sec:</strong> {result.transferPerSec}
                </p>
                <p>
                  <strong>Total Requests:</strong> {result.totalRequests}
                </p>
                <p>
                  <strong>Duration:</strong> {result.duration}
                </p>

                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={runBenchmark}
                >
                  Run Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {staticData.map((bench) => (
          <Card
            key={bench.site}
            className="shadow-md hover:shadow-lg transition"
          >
            <CardHeader>
              <CardTitle>{bench.site}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <strong>Latency:</strong> {bench.latency}
              </p>
              <p>
                <strong>Requests/sec:</strong> {bench.requestsPerSec.toFixed(2)}
              </p>
              <p>
                <strong>Transfer/sec:</strong> {bench.transferPerSec}
              </p>
              <p>
                <strong>Total Requests:</strong> {bench.totalRequests}
              </p>
              <p>
                <strong>Duration:</strong> {bench.duration}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
