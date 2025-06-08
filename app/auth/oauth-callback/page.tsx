"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/app/loading";

function OAuthCallbackInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const code = params.get("code");
    const provider = params.get("provider");

    if (!code || !provider) {
      setError("Missing authentication parameters");
      setIsProcessing(false);
      return;
    }

    const processOAuth = async () => {
      try {
        const formData = new FormData();
        formData.append("oauthProvider", provider);
        formData.append("oauthCode", code);

        console.log("Processing OAuth authentication...");

        // Let the browser handle redirects naturally
        const res = await fetch("/api/auth/oauth", {
          method: "POST",
          body: formData,
          // Allow normal redirect behavior
          redirect: "follow",
        });

        // If we get here, it means we didn't redirect
        // So we either have an error or non-redirect success
        if (res.ok) {
          const data = await res.json();
          console.log("OAuth response:", data);

          if (data.success) {
            // Handle non-redirect success case
            router.push("/dashboard");
          } else {
            // Handle explicit error case
            if (data.errors?.login?.includes("no email found")) {
              setError(
                "We couldn't get your email. Please make sure your account has a verified email address."
              );
            } else {
              setError(data.error || "Authentication failed");
            }
          }
        } else {
          // Handle HTTP error responses
          try {
            const errorData = await res.json();
            setError(errorData.error || `Authentication error (${res.status})`);
          } catch (e) {
            console.error("Error parsing error response:", e);
            setError(`Authentication error: ${res.statusText || res.status}`);
          }
        }
      } catch (e) {
        // This catch only runs for network errors
        console.error("OAuth network error:", e);
        setError("Connection error. Please check your internet and try again.");
      } finally {
        setIsProcessing(false);
      }
    };

    processOAuth();
  }, [params, router]);

  if (isProcessing) {
    return <Loading message="Signing you in..." />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-md">
          <h2 className="text-red-800 text-lg font-medium mb-2">
            Authentication Error
          </h2>
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => router.push("/auth")}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return <Loading message="Finalizing authentication..." />;
}

export default function OAuthCallback() {
  return <OAuthCallbackInner />;
}
