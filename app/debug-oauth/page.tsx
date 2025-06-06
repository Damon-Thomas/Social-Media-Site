"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Loading from "../loading";

function DebugOAuthInner() {
  const params = useSearchParams();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">OAuth Debug Page</h1>
      <div className="space-y-2">
        <p>
          <strong>Current URL:</strong> {window.location.href}
        </p>
        <p>
          <strong>Provider:</strong> {params.get("provider") || "None"}
        </p>
        <p>
          <strong>Code:</strong> {params.get("code") || "None"}
        </p>
        <p>
          <strong>Error:</strong> {params.get("error") || "None"}
        </p>
        <p>
          <strong>State:</strong> {params.get("state") || "None"}
        </p>
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-semibold">All Query Parameters:</h2>
        <pre className="bg-gray-100 p-2 mt-2 rounded">
          {JSON.stringify(Object.fromEntries(params.entries()), null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default function DebugOAuth() {
  return (
    <Suspense fallback={<Loading />}>
      <DebugOAuthInner />
    </Suspense>
  );
}
